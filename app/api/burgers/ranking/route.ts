import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Cache simple en memoria para reducir consultas repetidas
let burgersCache: { data: any; timestamp: number; params: string } | null = null;
const CACHE_TTL = 30000; // 30 segundos

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeAll = searchParams.get('includeAll') === 'true';
    const sortBy = searchParams.get('sortBy') || 'ranking'; // ranking, nuevas, tendencias
    const featured = searchParams.get('featured') === 'true'; // Solo destacadas

    // Crear clave de cache
    const cacheKey = JSON.stringify({ city, type, limit, offset, includeAll, sortBy, featured });

    // Verificar cache
    if (burgersCache && burgersCache.params === cacheKey && Date.now() - burgersCache.timestamp < CACHE_TTL) {
      return NextResponse.json(burgersCache.data);
    }

    const supabase = await createClient();

    // Query optimizada con todos los campos necesarios
    let query = supabase
      .from('burgers')
      .select(`
        id,
        name,
        description,
        image_url,
        ranking_position,
        ranking_score,
        average_rating,
        total_ratings,
        total_reviews,
        verified_reviews_count,
        is_in_ranking,
        is_featured,
        featured_order,
        tags,
        type,
        created_at,
        restaurant_id,
        restaurants!inner(id, name, city_id)
      `)
      .eq('status', 'approved');

    // Filtrar solo destacadas si se solicita
    if (featured) {
      query = query.eq('is_featured', true).order('featured_order', { ascending: true }).limit(3);
    } else {
      // En modo desarrollo, mostrar todas; en producción solo las que están en ranking
      if (!includeAll) {
        query = query.eq('is_in_ranking', true);
      }

      // Filtrar por ciudad
      if (city) {
        query = query.eq('restaurants.city_id', city);
      }

      // Ordenamiento según el criterio
      switch (sortBy) {
        case 'nuevas':
          query = query.order('created_at', { ascending: false });
          break;
        case 'tendencias':
          // Tendencias = más ratings recientes (usando total_ratings como proxy)
          query = query.order('total_ratings', { ascending: false });
          break;
        default:
          query = query.order('ranking_score', { ascending: false, nullsFirst: false });
      }

      query = query.range(offset, offset + limit - 1);
    }

    const { data: burgers, error } = await query;

    if (error) throw error;

    // Obtener ciudades en una query separada para mejor rendimiento
    const cityIds = [...new Set((burgers || []).map((b: any) => b.restaurants?.city_id).filter(Boolean))];
    const { data: cities } = await supabase
      .from('cities')
      .select('id, name')
      .in('id', cityIds);
    
    // Crear un mapa de ciudades para lookup rápido
    const cityMap = new Map((cities || []).map(c => [c.id, c]));

    // Formatear respuesta con campos adicionales
    const formattedBurgers = (burgers || []).map((burger: any, index: number) => {
      const city = cityMap.get(burger.restaurants?.city_id);
      return {
      id: burger.id,
      name: burger.name,
      description: burger.description || '',
      image_url: burger.image_url,
      ranking_position: burger.is_in_ranking ? burger.ranking_position : null,
      ranking_score: burger.ranking_score,
      average_rating: burger.average_rating,
      total_ratings: burger.total_ratings || 0,
      total_reviews: burger.total_reviews || burger.total_ratings || 0,
      verified_reviews_count: burger.verified_reviews_count || 0,
      is_in_ranking: burger.is_in_ranking,
      is_featured: burger.is_featured || false,
      tags: burger.tags || [],
      type: burger.type || 'clásica',
      created_at: burger.created_at,
      verified_percentage: (burger.total_reviews || burger.total_ratings) > 0 
        ? Math.round(((burger.verified_reviews_count || 0) / (burger.total_reviews || burger.total_ratings || 1)) * 100)
        : 0,
      restaurant: {
        id: burger.restaurants?.id,
        name: burger.restaurants?.name,
        city_id: burger.restaurants?.city_id,
        cities: city ? { id: city.id, name: city.name } : null
      }
    }});

    const responseData = {
      burgers: formattedBurgers,
      pagination: {
        limit,
        offset,
        hasMore: (burgers?.length || 0) === limit,
      },
    };

    // Guardar en cache
    burgersCache = { data: responseData, timestamp: Date.now(), params: cacheKey };

    return NextResponse.json(responseData);
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
