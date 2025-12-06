'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Burger {
  id: string
  name: string
  image_url?: string
  average_rating: number
  restaurant_name: string
}

export interface Restaurant {
  id: string
  name: string
  image_url?: string
  city: string
  burger_count?: number
}

interface SearchState {
  searchQuery: string
  results: {
    burgers: Burger[]
    restaurants: Restaurant[]
  }
  isSearching: boolean
  searchHistory: string[]
  
  setSearchQuery: (query: string) => void
  setResults: (results: { burgers: Burger[]; restaurants: Restaurant[] }) => void
  setIsSearching: (isSearching: boolean) => void
  addToHistory: (query: string) => void
  removeFromHistory: (query: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      results: { burgers: [], restaurants: [] },
      isSearching: false,
      searchHistory: [],

      setSearchQuery: (query) => set({ searchQuery: query }),

      setResults: (results) => set({ results }),

      setIsSearching: (isSearching) => set({ isSearching }),

      addToHistory: (query) =>
        set((state) => {
          const cleaned = query.trim()
          if (!cleaned) return state

          const filtered = state.searchHistory.filter((q) => q !== cleaned)
          return {
            searchHistory: [cleaned, ...filtered].slice(0, 10),
          }
        }),

      removeFromHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        })),

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'search-store',
    }
  )
)
