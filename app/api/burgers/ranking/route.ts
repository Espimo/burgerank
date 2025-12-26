import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeAll = searchParams.get('includeAll') === 'true'; // Modo desarrollo: incluir todas las burgers

    const supabase = await createClient();

    // Query simplificada: solo columnas necesarias
    let query = supabase
      .from('burgers')
      .select(`
        id,
        name,
        image_url,
        ranking_position,
        ranking_score,
        average_rating,
        total_reviews,
        verified_reviews_count,
        is_in_ranking,
        restaurant_id,
        restaurants(id, name, city_id, cities(id, name))
      `)
      .eq('status', 'approved');

    // En modo desarrollo, mostrar todas; en producción solo las que están en ranking
    if (!includeAll) {
      query = query.eq('is_in_ranking', true);
    }

    query = query
      .order('ranking_score', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    const { data: burgers, error } = await query;

    if (error) throw error;

    // Formatear respuesta
    const formattedBurgers = (burgers || []).map((burger, index) => ({
      id: burger.id,
      name: burger.name,
      image_url: burger.image_url,
      ranking_position: burger.is_in_ranking ? burger.ranking_position : null,
      ranking_score: burger.ranking_score,
      average_rating: burger.average_rating,
      total_reviews: burger.total_reviews,
      verified_reviews_count: burger.verified_reviews_count,
      is_in_ranking: burger.is_in_ranking,
      verified_percentage: burger.total_reviews > 0 
        ? Math.round((burger.verified_reviews_count / burger.total_reviews) * 100)
        : 0,
      restaurant: burger.restaurants,
    }));

    return NextResponse.json({
      burgers: formattedBurgers,
      pagination: {
        limit,
        offset,
        hasMore: (burgers?.length || 0) === limit,
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
