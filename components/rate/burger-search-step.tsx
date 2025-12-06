'use client'

import { memo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import Image from 'next/image'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { searchBurgersAndRestaurants } from '@/lib/api/search-advanced-client'
import { type Burger } from '@/lib/types'

interface BurgerSearchStepProps {
  onSelectBurger: (burger: Burger) => void
  onNewBurger: () => void
}

export const BurgerSearchStep = memo(function BurgerSearchStep({
  onSelectBurger,
  onNewBurger,
}: BurgerSearchStepProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Burger[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Perform search
  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const data = await searchBurgersAndRestaurants(debouncedQuery)
      setResults(data.burgers)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery])

  // Trigger search effect
  useState(() => {
    performSearch()
  })

  // Use effect for search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="¿Qué burger comiste?"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 text-lg h-12"
          autoFocus
        />
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {results.map((burger, index) => (
              <motion.button
                key={burger.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectBurger(burger)}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left flex gap-3"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {burger.image_url ? (
                    <Image
                      src={burger.image_url}
                      alt={burger.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-1">{burger.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {burger.restaurant?.name || 'Restaurante desconocido'}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm font-semibold">
                      {burger.average_rating?.toFixed(1) || '—'}
                    </span>
                    <span>⭐</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : searchQuery.trim() ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8"
          >
            <p className="text-muted-foreground mb-4">No encontramos esa burger</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* New burger button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={onNewBurger}
          variant="outline"
          className="w-full h-12 gap-2 border-dashed"
        >
          <Plus className="w-5 h-5" />
          No encuentro mi burger
        </Button>
      </motion.div>
    </motion.div>
  )
})
