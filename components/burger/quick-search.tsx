'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/lib/hooks/use-debounce'
import * as api from '@/lib/api/search-client'
import Image from 'next/image'

interface SearchSuggestion {
  id: string
  name: string
  image_url?: string
  city?: string
  type: 'burger' | 'restaurant'
}

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  const fetchSuggestions = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const results = await api.getSearchSuggestions(debouncedQuery, 10)
      const combined: SearchSuggestion[] = [
        ...results.burgers.map((b: any) => ({
          id: b.id,
          name: b.name,
          image_url: b.image_url,
          type: 'burger' as const,
        })),
        ...results.restaurants.map((r: any) => ({
          id: r.id,
          name: r.name,
          city: r.city,
          image_url: r.image_url,
          type: 'restaurant' as const,
        })),
      ]
      setSuggestions(combined)
      setIsOpen(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions()
    }
  }, [debouncedQuery, fetchSuggestions])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 px-4 h-10 bg-secondary rounded-full">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar hamburguesas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="flex-1 border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="p-0 h-auto hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && (query || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Buscando...</div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <a
                  key={`${suggestion.type}-${suggestion.id}`}
                  href={
                    suggestion.type === 'burger'
                      ? `/burger/${suggestion.id}`
                      : `/restaurant/${suggestion.id}`
                  }
                  className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                >
                  {suggestion.image_url && (
                    <Image
                      src={suggestion.image_url}
                      alt={suggestion.name}
                      width={40}
                      height={40}
                      className="rounded w-10 h-10 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{suggestion.name}</div>
                    {suggestion.city && (
                      <div className="text-xs text-muted-foreground">{suggestion.city}</div>
                    )}
                  </div>
                  <div className="text-xs bg-muted px-2 py-1 rounded">
                    {suggestion.type === 'burger' ? '🍔' : '🏪'}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  )
}
