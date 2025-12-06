'use client'

export async function searchBurgers(query: string, limit = 20) {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const response = await fetch(`/api/search/burgers?${params}`)
  if (!response.ok) return []
  return response.json()
}

export async function searchRestaurants(query: string, limit = 20) {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const response = await fetch(`/api/search/restaurants?${params}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSearchSuggestions(query: string, limit = 10) {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const response = await fetch(`/api/search/suggestions?${params}`)
  if (!response.ok) return { burgers: [], restaurants: [] }
  return response.json()
}

export async function getFeaturedBurgers() {
  const response = await fetch('/api/burgers/featured')
  if (!response.ok) return []
  return response.json()
}

export async function getTrendingBurgers(days = 7, limit = 20) {
  const params = new URLSearchParams({ days: String(days), limit: String(limit) })
  const response = await fetch(`/api/burgers/trending?${params}`)
  if (!response.ok) return []
  return response.json()
}
