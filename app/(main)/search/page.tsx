'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { SearchInput } from '@/components/search/search-input'
import { SearchResults } from '@/components/search/search-results'
import { SearchHistory } from '@/components/search/search-history'
import { SearchSuggestions } from '@/components/search/search-suggestions'
import { useSearchStore } from '@/lib/stores/search-store'
import { searchBurgersAndRestaurants, getSearchSuggestions } from '@/lib/api/search-advanced-client'
import { type Burger, type Restaurant } from '@/lib/types'
import { useDebounce } from '@/lib/hooks/use-debounce'

export default function SearchPage() {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { searchQuery, setSearchQuery, setResults, setIsSearching, addToHistory, searchHistory, results } = useSearchStore()
  const [popularBurgers, setPopularBurgers] = useState<Burger[]>([])
  const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Load initial suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const suggestions = await getSearchSuggestions()
        setPopularBurgers(suggestions.topBurgers)
        setNewRestaurants(suggestions.newRestaurants)
      } catch (error) {
        console.error('Error loading suggestions:', error)
      }
    }

    loadSuggestions()
  }, [])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ burgers: [], restaurants: [] })
      setIsSearching(false)
      return
    }

    const performSearch = async () => {
      setIsSearching(true)
      try {
        const data = await searchBurgersAndRestaurants(debouncedQuery)
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults({ burgers: [], restaurants: [] })
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery, setResults, setIsSearching])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      addToHistory(query)
    }
  }, [setSearchQuery, addToHistory])

  const handleSelectHistory = useCallback((query: string) => {
    handleSearch(query)
    setSearchQuery(query)
  }, [handleSearch, setSearchQuery])

  const handleBurgerClick = useCallback((burger: Burger) => {
    router.push(`/app/burgers/${burger.id}`)
  }, [router])

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    router.push(`/app/restaurants/${restaurant.id}`)
  }, [router])

  const showEmpty = !searchQuery.trim()
  const showResults = searchQuery.trim() && (results.burgers.length > 0 || results.restaurants.length > 0)

  return (
    <MainLayout>
      <div className="flex flex-col h-screen bg-background">
        {/* Search Input */}
        <div className="sticky top-0 z-40 bg-background border-b">
          <div className="pt-3 pb-2 px-4">
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showEmpty && (
            <>
              <SearchHistory onSelectHistory={handleSelectHistory} />
              <SearchSuggestions
                popularBurgers={popularBurgers}
                newRestaurants={newRestaurants}
                onBurgerClick={handleBurgerClick}
                onRestaurantClick={handleRestaurantClick}
              />
            </>
          )}

          {showResults && (
            <SearchResults
              query={searchQuery}
              burgers={results.burgers}
              restaurants={results.restaurants}
              isLoading={isLoading}
              onBurgerClick={handleBurgerClick}
              onRestaurantClick={handleRestaurantClick}
            />
          )}

          {searchQuery.trim() && !isLoading && results.burgers.length === 0 && results.restaurants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <span className="text-4xl mb-3">🔍</span>
              <h3 className="font-semibold text-center">No se encontraron resultados</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Intenta buscar con otros términos
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
