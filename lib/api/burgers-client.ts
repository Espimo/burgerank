'use client'

import { Database } from '@/types/database.types'

type Burger = Database['public']['Tables']['burgers']['Row'] & {
  restaurant?: Database['public']['Tables']['restaurants']['Row']
}

export async function getRankingBurgers(
  filters?: {
    city?: string
    types?: string[]
    sortBy?: string
  },
  page = 0,
  limit = 20
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(filters?.city && { city: filters.city }),
    ...(filters?.sortBy && { sortBy: filters.sortBy }),
  })

  const response = await fetch(`/api/burgers?${params}`)
  if (!response.ok) throw new Error('Failed to fetch burgers')
  return response.json()
}

export async function getBurgerById(id: string) {
  const response = await fetch(`/api/burgers/${id}`)
  if (!response.ok) throw new Error('Failed to fetch burger')
  return response.json()
}

export async function getBurgersByRestaurant(restaurantId: string) {
  const response = await fetch(`/api/restaurants/${restaurantId}/burgers`)
  if (!response.ok) throw new Error('Failed to fetch burgers')
  return response.json()
}

export async function getSimilarBurgers(burgerId: string, limit = 5) {
  const response = await fetch(`/api/burgers/${burgerId}/similar?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch similar burgers')
  return response.json()
}

export async function getNewBurgers(limit = 10) {
  const response = await fetch(`/api/burgers/new?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch new burgers')
  return response.json()
}
