'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BurgerSearchResult } from './burger-search-result'
import { RestaurantSearchResult } from './restaurant-search-result'
import { type Burger, type Restaurant } from '@/lib/types'

interface SearchResultsProps {
  query: string
  burgers: Burger[]
  restaurants: Restaurant[]
  isLoading?: boolean
  onBurgerClick?: (burger: Burger) => void
  onRestaurantClick?: (restaurant: Restaurant) => void
}

export const SearchResults = memo(function SearchResults({
  query,
  burgers,
  restaurants,
  isLoading,
  onBurgerClick,
  onRestaurantClick,
}: SearchResultsProps) {
  const totalResults = burgers.length + restaurants.length

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-20 h-20 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-3 bg-muted rounded w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (totalResults === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <span className="text-4xl mb-3">🔍</span>
        <h3 className="font-semibold text-center">No se encontraron resultados</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Intenta buscar con otros términos
        </p>
      </motion.div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 px-4 py-4"
    >
      {/* Restaurants */}
      <AnimatePresence>
        {restaurants.length > 0 && (
          <motion.section variants={itemVariants} key="restaurants">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                RESTAURANTES ({restaurants.length})
              </h2>
            </div>
            <div className="space-y-2">
              {restaurants.map((restaurant) => (
                <motion.div key={restaurant.id} variants={itemVariants}>
                  <RestaurantSearchResult
                    {...restaurant}
                    query={query}
                    onClick={() => onRestaurantClick?.(restaurant)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Burgers */}
      <AnimatePresence>
        {burgers.length > 0 && (
          <motion.section variants={itemVariants} key="burgers">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                BURGERS ({burgers.length})
              </h2>
            </div>
            <div className="space-y-2">
              {burgers.map((burger) => (
                <motion.div key={burger.id} variants={itemVariants}>
                  <BurgerSearchResult
                    {...burger}
                    query={query}
                    onClick={() => onBurgerClick?.(burger)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  )
})
