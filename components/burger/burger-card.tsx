'use client'

import { memo, useCallback, useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface BurgerCardProps {
  id: string
  name: string
  image_url?: string
  restaurant_name: string
  restaurant_id: string
  average_rating: number
  review_count: number
  price?: number
  burger_type?: string
  is_trending?: boolean
  is_new?: boolean
  onViewDetails?: () => void
}

export const BurgerCard = memo(function BurgerCard({
  id,
  name,
  image_url,
  restaurant_name,
  restaurant_id,
  average_rating,
  review_count,
  price,
  burger_type,
  is_trending,
  is_new,
  onViewDetails,
}: BurgerCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsFavorited(!isFavorited)
    },
    [isFavorited]
  )

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false)
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link href={`/burger/${id}`}>
        <div className="relative aspect-square bg-muted overflow-hidden group cursor-pointer">
          {image_url ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
              )}
              <Image
                src={image_url}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onLoadingComplete={handleImageLoad}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
              <span className="text-4xl">🍔</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex gap-2 flex-wrap">
            {burger_type && (
              <span className="bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
                {burger_type}
              </span>
            )}
            {is_new && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Nuevo
              </span>
            )}
            {is_trending && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              }`}
            />
          </button>

          {/* Rating overlay */}
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-sm font-bold">{average_rating.toFixed(1)}</span>
            <span className="text-lg">⭐</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-bold text-sm truncate hover:text-primary transition-colors">
            <Link href={`/burger/${id}`}>{name}</Link>
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            <Link href={`/restaurant/${restaurant_id}`} className="hover:text-primary transition-colors">
              {restaurant_name}
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="w-3 h-3" />
            <span>{review_count} reseñas</span>
          </div>
          {price && <span className="font-semibold">${price}</span>}
        </div>

        <Button
          onClick={onViewDetails}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          Ver detalles
        </Button>
      </div>
    </motion.div>
  )
})

BurgerCard.displayName = 'BurgerCard'
