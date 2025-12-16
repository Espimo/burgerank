import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await createClient();

    let query = supabase
      .from('burgers')
      .select(`
        id,
        name,
        description,
        type,
        tags,
        average_rating,
        total_ratings,
        restaurant:restaurants(
          id,
          name,
          city:cities(name)
        ),
        city:cities(name)
      `)
      .order('average_rating', { ascending: false });

    if (city && city !== 'all') {
      query = query.eq('city_id', city);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: burgers, error } = await query;

    if (error) throw error;

    // Obtener estadísticas
    const { count, error: countError } = await supabase
      .from('burgers')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    return NextResponse.json({
      burgers: burgers || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: 'Error al obtener ranking' },
      { status: 500 }
    );
  }
}
