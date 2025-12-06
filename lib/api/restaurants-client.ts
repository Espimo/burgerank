'use client'

export async function getRestaurantBySlug(slug: string) {
  const response = await fetch(`/api/restaurants/${slug}`)
  if (!response.ok) throw new Error('Failed to fetch restaurant')
  return response.json()
}

export async function getRestaurants(
  filters?: {
    city?: string
    cuisine?: string[]
    rating?: number
  },
  limit = 50
) {
  const params = new URLSearchParams({
    limit: String(limit),
    ...(filters?.city && { city: filters.city }),
    ...(filters?.rating && { rating: String(filters.rating) }),
  })

  const response = await fetch(`/api/restaurants?${params}`)
  if (!response.ok) throw new Error('Failed to fetch restaurants')
  return response.json()
}

export async function getRestaurantBurgers(
  restaurantId: string,
  sortBy: 'rating' | 'newest' | 'price' = 'rating'
) {
  const response = await fetch(`/api/restaurants/${restaurantId}/burgers?sortBy=${sortBy}`)
  if (!response.ok) throw new Error('Failed to fetch burgers')
  return response.json()
}

export async function getNearbyRestaurants(
  lat: number,
  lng: number,
  radiusKm = 5,
  limit = 20
) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radiusKm),
    limit: String(limit),
  })

  const response = await fetch(`/api/restaurants/nearby?${params}`)
  if (!response.ok) throw new Error('Failed to fetch restaurants')
  return response.json()
}
