'use client'

import { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { highlightTextSimple } from '@/lib/utils/text-highlight'

interface RestaurantSearchResultProps {
  id: string
  name: string
  image_url?: string
  city: string
  burger_count?: number
  query: string
  onClick?: () => void
}

export const RestaurantSearchResult = memo(function RestaurantSearchResult({
  id,
  name,
  image_url,
  city,
  burger_count,
  query,
  onClick,
}: RestaurantSearchResultProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex gap-3"
    >
      {/* Logo */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-1">
          {highlightTextSimple(name, query)}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{city}</p>

        {/* Burger count */}
        <div className="flex items-center gap-1 mt-2 text-xs">
          <span className="text-lg">🍔</span>
          <span className="font-semibold">{burger_count ?? 0} burgers</span>
        </div>
      </div>
    </motion.button>
  )
})
