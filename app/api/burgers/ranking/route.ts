import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type'); // classic, smash, gourmet, etc.
    const minReviews = searchParams.get('minReviews');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeNew = searchParams.get('includeNew') === 'true'; // Incluir burgers nuevas (no en ranking)

    const supabase = await createClient();

    // Query principal: burgers en el ranking oficial
    let query = supabase
      .from('burgers')
      .select(`
        id,
        name,
        description,
        type,
        tags,
        price,
        image_url,
        ranking_position,
        ranking_score,
        bayesian_score,
        wilson_score,
        average_rating,
        total_reviews,
        verified_reviews_count,
        positive_reviews_count,
        standard_deviation,
        last_review_date,
        is_in_ranking,
        created_at,
        restaurant:restaurants(
          id,
          name,
          address,
          city:cities(id, name)
        )
      `)
      .eq('status', 'approved')
      .eq('is_in_ranking', true)
      .order('ranking_position', { ascending: true });

    // Filtros opcionales
    if (city && city !== 'all') {
      query = query.eq('restaurant.city.id', city);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (minReviews) {
      query = query.gte('total_reviews', parseInt(minReviews));
    }

    query = query.range(offset, offset + limit - 1);

    const { data: rankedBurgers, error } = await query;

    if (error) throw error;

    // Si se solicitan, obtener también las burgers nuevas (aún no en ranking)
    let newBurgers: any[] = [];
    if (includeNew) {
      const { data: newData, error: newError } = await supabase
        .from('burgers')
        .select(`
          id,
          name,
          description,
          type,
          tags,
          price,
          image_url,
          average_rating,
          total_reviews,
          verified_reviews_count,
          created_at,
          restaurant:restaurants(
            id,
            name,
            address,
            city:cities(id, name)
          )
        `)
        .eq('status', 'approved')
        .eq('is_in_ranking', false)
        .gt('total_reviews', 0)
        .order('total_reviews', { ascending: false })
        .limit(10);

      if (!newError && newData) {
        newBurgers = newData;
      }
    }

    // Obtener estadísticas generales
    const { count: totalInRanking } = await supabase
      .from('burgers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('is_in_ranking', true);

    const { count: totalNew } = await supabase
      .from('burgers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('is_in_ranking', false)
      .gt('total_reviews', 0);

    // Obtener configuración del ranking
    const { data: config } = await supabase
      .from('ranking_config')
      .select('*')
      .single();

    // Formatear respuesta con porcentaje verificado
    const formattedBurgers = (rankedBurgers || []).map(burger => ({
      ...burger,
      verified_percentage: burger.total_reviews > 0 
        ? Math.round((burger.verified_reviews_count / burger.total_reviews) * 100)
        : 0,
    }));

    const formattedNewBurgers = newBurgers.map(burger => ({
      ...burger,
      reviews_needed: (config?.min_reviews_for_ranking || 15) - burger.total_reviews,
      verified_percentage: burger.total_reviews > 0 
        ? Math.round((burger.verified_reviews_count / burger.total_reviews) * 100)
        : 0,
    }));

    return NextResponse.json({
      burgers: formattedBurgers,
      newBurgers: formattedNewBurgers,
      stats: {
        totalInRanking: totalInRanking || 0,
        totalNew: totalNew || 0,
        minReviewsForRanking: config?.min_reviews_for_ranking || 15,
      },
      pagination: {
        limit,
        offset,
        hasMore: (rankedBurgers?.length || 0) === limit,
      },
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: 'Error al obtener ranking' },
      { status: 500 }
    );
  }
}

// POST: Forzar recálculo del ranking (solo admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar si es admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Ejecutar recálculo completo del ranking
    const { error: recalcError } = await supabase.rpc('update_all_ranking_positions');

    if (recalcError) {
      console.error('Error recalculando ranking:', recalcError);
      return NextResponse.json(
        { error: 'Error al recalcular ranking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ranking recalculado correctamente',
    });
  } catch (error) {
    console.error('Error in ranking recalculation:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
