'use client'

import { useCallback, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export interface FilterState {
  general?: string
  city?: string
  burgerTypes: string[]
  diets: string[]
  priceRange?: '$' | '$$' | '$$$' | '$$$$'
  occasions: string[]
  distanceKm?: number
  sortBy: 'rating' | 'newest' | 'distance' | 'price'
}

const DEFAULT_FILTERS: FilterState = {
  burgerTypes: [],
  diets: [],
  occasions: [],
  sortBy: 'rating',
}

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => {
    // Load from localStorage or URL params
    try {
      const stored = localStorage.getItem('burger-filters')
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Error loading filters:', e)
    }
    return DEFAULT_FILTERS
  })

  const applyFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters }
      localStorage.setItem('burger-filters', JSON.stringify(updated))

      // Update URL params
      const params = new URLSearchParams()
      if (updated.general) params.set('general', updated.general)
      if (updated.city) params.set('city', updated.city)
      if (updated.burgerTypes.length > 0)
        params.set('types', updated.burgerTypes.join(','))
      if (updated.diets.length > 0) params.set('diets', updated.diets.join(','))
      if (updated.priceRange) params.set('price', updated.priceRange)
      if (updated.occasions.length > 0)
        params.set('occasions', updated.occasions.join(','))
      if (updated.sortBy) params.set('sort', updated.sortBy)

      router.push(`/ranking?${params.toString()}`)
      return updated
    })
  }, [router])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    localStorage.removeItem('burger-filters')
    router.push('/ranking')
  }, [router])

  const setFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      applyFilters({ [key]: value })
    },
    [applyFilters]
  )

  return {
    filters,
    applyFilters,
    clearFilters,
    setFilter,
  }
}
