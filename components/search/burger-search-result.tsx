'use client'

import { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { highlightTextSimple } from '@/lib/utils/text-highlight'

interface BurgerSearchResultProps {
  id: string
  name: string
  image_url?: string
  restaurant_name: string
  average_rating: number
  query: string
  onClick?: () => void
}

export const BurgerSearchResult = memo(function BurgerSearchResult({
  id,
  name,
  image_url,
  restaurant_name,
  average_rating,
  query,
  onClick,
}: BurgerSearchResultProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex gap-3"
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-1">
          {highlightTextSimple(name, query)}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{restaurant_name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-sm font-semibold">{average_rating.toFixed(1)}</span>
          <span className="text-lg">⭐</span>
        </div>
      </div>
    </motion.button>
  )
})
