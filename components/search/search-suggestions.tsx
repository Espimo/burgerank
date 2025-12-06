'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { type Burger, type Restaurant } from '@/lib/types'

interface SearchSuggestionsProps {
  popularBurgers?: Burger[]
  newRestaurants?: Restaurant[]
  onBurgerClick?: (burger: Burger) => void
  onRestaurantClick?: (restaurant: Restaurant) => void
}

export const SearchSuggestions = memo(function SearchSuggestions({
  popularBurgers = [],
  newRestaurants = [],
  onBurgerClick,
  onRestaurantClick,
}: SearchSuggestionsProps) {
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
      {/* Popular near you */}
      {popularBurgers.length > 0 && (
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            🔥 POPULARES CERCA DE TI
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {popularBurgers.slice(0, 4).map((burger) => (
              <motion.button
                key={burger.id}
                onClick={() => onBurgerClick?.(burger)}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
                className="rounded-lg overflow-hidden bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="aspect-square relative">
                  {burger.image_url ? (
                    <Image
                      src={burger.image_url}
                      alt={burger.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍔</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold line-clamp-1">{burger.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-semibold">{burger.average_rating?.toFixed(1)}</span>
                    <span className="text-sm">⭐</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* New restaurants */}
      {newRestaurants.length > 0 && (
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            ✨ RESTAURANTES NUEVOS
          </h2>
          <div className="space-y-2">
            {newRestaurants.slice(0, 4).map((restaurant) => (
              <motion.button
                key={restaurant.id}
                onClick={() => onRestaurantClick?.(restaurant)}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                className="w-full p-3 rounded-lg hover:bg-muted transition-colors flex gap-3 text-left"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                  {restaurant.logo_url ? (
                    <Image
                      src={restaurant.logo_url}
                      alt={restaurant.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🏪</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{restaurant.city}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  )
})
