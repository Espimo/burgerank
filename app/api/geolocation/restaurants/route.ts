import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RestaurantNearbyRequest {
  latitude: number
  longitude: number
  radius: number
}

export async function POST(request: NextRequest) {
  try {
    const body: RestaurantNearbyRequest = await request.json()
    const { latitude, longitude, radius } = body

    // Intentar usar PostGIS
    const { data: restaurants, error } = await supabase.rpc('get_nearby_restaurants', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radius,
    })

    if (error) {
      console.error('PostGIS error:', error)
      // Fallback a búsqueda manual
      const { data: allRestaurants } = await supabase
        .from('restaurants')
        .select('id, name, rating, latitude, longitude, address')
        .gte('rating', 0)

      if (!allRestaurants) {
        return NextResponse.json({ error: 'No restaurants found' }, { status: 404 })
      }

      // Calcular distancia en memoria
      const nearby = allRestaurants
        .map((restaurant: any) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            restaurant.latitude,
            restaurant.longitude
          )
          return {
            ...restaurant,
            distance,
          }
        })
        .filter((restaurant: any) => restaurant.distance <= radius)
        .sort((a: any, b: any) => a.distance - b.distance)

      return NextResponse.json(nearby)
    }

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Error in nearby restaurants API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
