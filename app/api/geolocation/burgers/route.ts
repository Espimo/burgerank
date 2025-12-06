import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface BurgerNearbyRequest {
  latitude: number
  longitude: number
  radius: number
  filters?: {
    minRating?: number
    maxPrice?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BurgerNearbyRequest = await request.json()
    const { latitude, longitude, radius, filters } = body

    // Usar PostGIS si está disponible, sino hacer cálculo en memoria
    const { data: burgers, error } = await supabase.rpc('get_nearby_burgers', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radius,
      min_rating: filters?.minRating || 0,
    })

    if (error) {
      console.error('PostGIS error:', error)
      // Fallback a búsqueda manual
      const { data: allBurgers } = await supabase
        .from('burgers')
        .select('id, name, restaurant:restaurants(id, name), rating, latitude, longitude')
        .gte('rating', filters?.minRating || 0)

      if (!allBurgers) {
        return NextResponse.json({ error: 'No burgers found' }, { status: 404 })
      }

      // Calcular distancia en memoria
      const nearby = allBurgers
        .map((burger: any) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            burger.latitude,
            burger.longitude
          )
          return {
            ...burger,
            distance,
          }
        })
        .filter((burger: any) => burger.distance <= radius)
        .sort((a: any, b: any) => a.distance - b.distance)

      return NextResponse.json(nearby)
    }

    return NextResponse.json(burgers)
  } catch (error) {
    console.error('Error in nearby burgers API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Haversine formula
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
