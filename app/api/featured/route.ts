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
        imagen_principal,
        ranking_score,
        average_rating,
        total_ratings,
        featured_order,
        restaurant:restaurants (
          name,
          city
        )
      `)
      .eq('is_featured', true)
      .eq('is_in_ranking', true)
      .order('featured_order', { ascending: true })
      .limit(3)

    if (error) {
      console.error('Error fetching featured burgers:', error)
      return NextResponse.json({ error: 'Error fetching featured burgers' }, { status: 500 })
    }

    // Formatear la respuesta
    const formattedBurgers = (featuredBurgers || []).map((burger: any) => ({
      id: burger.id,
      name: burger.name,
      restaurant_name: burger.restaurant?.name || 'Restaurante',
      city: burger.restaurant?.city || '',
      imagen_principal: burger.imagen_principal,
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
