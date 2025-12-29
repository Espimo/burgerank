import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener burgers destacadas con información del restaurante
    const { data: featuredBurgers, error } = await supabase
      .from('burgers')
      .select(`
        id,
        name,
        image_url,
        ranking_score,
        average_rating,
        total_ratings,
        featured_order,
        restaurants(id, name, city_id)
      `)
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(3)

    if (error) {
      console.error('Error fetching featured burgers:', error)
      return NextResponse.json({ error: 'Error fetching featured burgers' }, { status: 500 })
    }

    // Obtener nombres de ciudades
    const cityIds = [...new Set((featuredBurgers || []).map((b: any) => b.restaurants?.city_id).filter(Boolean))];
    let cityMap = new Map<string, string>();
    
    if (cityIds.length > 0) {
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name')
        .in('id', cityIds);
      
      if (cities) {
        cityMap = new Map(cities.map(c => [c.id, c.name]));
      }
    }

    // Formatear la respuesta
    const formattedBurgers = (featuredBurgers || []).map((burger: any) => ({
      id: burger.id,
      name: burger.name,
      restaurant_name: burger.restaurants?.name || 'Restaurante',
      city: cityMap.get(burger.restaurants?.city_id) || '',
      imagen_principal: burger.image_url,
      ranking_score: burger.ranking_score,
      simple_average: burger.average_rating,
      total_ratings: burger.total_ratings,
      featured_order: burger.featured_order,
    }))

    return NextResponse.json(formattedBurgers)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
