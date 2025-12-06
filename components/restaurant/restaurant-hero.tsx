'use client'

import { memo } from 'react'
import Image from 'next/image'
import { Star, MapPin, Clock, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

interface RestaurantHeroProps {
  restaurant: {
    id: string
    name: string
    city: string
    image_url?: string
    average_rating: number
    review_count?: number
    cuisine?: string
    open_time?: string
    close_time?: string
  }
}

export const RestaurantHero = memo(function RestaurantHero({
  restaurant,
}: RestaurantHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative -mx-4 -mt-4 mb-4"
    >
      {/* Background Image */}
      {restaurant.image_url && (
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative -mt-20 px-4 pb-4 space-y-4">
        {/* Name and Rating */}
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">
                  {i < Math.round(restaurant.average_rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="font-semibold">{restaurant.average_rating.toFixed(1)}</span>
            {restaurant.review_count && (
              <span className="text-sm text-muted-foreground">({restaurant.review_count})</span>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-muted/50 backdrop-blur rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{restaurant.city}</span>
            {restaurant.cuisine && <span className="text-muted-foreground">• {restaurant.cuisine}</span>}
          </div>

          {restaurant.open_time && restaurant.close_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {restaurant.open_time} - {restaurant.close_time}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>Rango de precios medio</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

RestaurantHero.displayName = 'RestaurantHero'
