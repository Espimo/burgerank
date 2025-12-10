'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { BurgerCard } from './burger-card'
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll'
import * as api from '@/lib/api/burgers-client'
import { useFilters } from '@/lib/hooks/use-filters'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BurgerListProps {
  onSelectBurger?: (burgerId: string) => void
}

interface Burger {
  id: string
  name: string
  image_url?: string
  average_rating: number
  price?: number
  created_at?: string
  burger_type?: string
  restaurant?: {
    id: string
    name: string
  }
}

export function BurgerList({ onSelectBurger }: BurgerListProps) {
  const [burgers, setBurgers] = useState<Burger[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
  const { filters } = useFilters()

  const sentinelRef = useInfiniteScroll({
    onLoadMore: useCallback(() => {
      if (!isLoading && hasMore) {
        loadMoreBurgers()
      }
    }, [isLoading, hasMore]),
    hasMore,
    isLoading,
  })

  const loadMoreBurgers = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await api.getRankingBurgers(
        {
          city: filters.city,
          types: filters.burgerTypes,
          sortBy: filters.sortBy as any,
        },
        page
      )

      if (page === 0 && result.data.length === 0) {
        setIsEmpty(true)
      } else {
        setIsEmpty(false)
      }

      setBurgers((prev) => (page === 0 ? result.data : [...prev, ...result.data]))
      setHasMore(result.hasMore)
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error('Error loading burgers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, filters])

  // Reset when filters change
  useEffect(() => {
    setBurgers([])
    setPage(0)
    setHasMore(true)
    setIsEmpty(false)
  }, [filters.sortBy, filters.burgerTypes, filters.city])

  // Initial load
  useEffect(() => {
    if (page === 0 && burgers.length === 0) {
      loadMoreBurgers()
    }
  }, [])

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-4xl mb-4">🔍</span>
        <p className="text-muted-foreground text-center">
          No encontramos hamburguesas con esos filtros
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {burgers.map((burger) => (
            <BurgerCard
              key={burger.id}
              id={burger.id}
              name={burger.name}
              image_url={burger.image_url}
              restaurant_name={burger.restaurant?.name || 'Restaurante'}
              restaurant_id={burger.restaurant?.id || ''}
              average_rating={burger.average_rating || 0}
              review_count={0}
              price={burger.price}
              burger_type={burger.burger_type}
              is_new={
                burger.created_at
                  ? new Date(burger.created_at) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  : false
              }
              onViewDetails={() => onSelectBurger?.(burger.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Infinite scroll sentinel */}
      <div
        ref={sentinelRef}
        className="flex justify-center items-center py-8"
      >
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-6 h-6 text-primary" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
