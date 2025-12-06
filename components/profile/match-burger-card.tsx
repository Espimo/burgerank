'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MatchBurgerCardProps {
  burger: {
    id: string
    name: string
    type: string
    images?: string[]
    match_score?: number
  }
  restaurant?: {
    name: string
  }
  userRating?: number
  isWinner?: boolean
  isLoser?: boolean
  onSelect?: () => void
}

const MatchBurgerCard = React.memo(function MatchBurgerCard({
  burger,
  restaurant,
  userRating = 4,
  isWinner = false,
  isLoser = false,
  onSelect,
}: MatchBurgerCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect()
    }
  }

  return (
    <motion.div
      animate={
        isWinner
          ? { scale: 1.05, y: -10 }
          : isLoser
            ? { scale: 0.95, opacity: 0.3, y: 10 }
            : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
      onClick={handleClick}
      className={cn(
        'group relative w-full h-full rounded-2xl overflow-hidden cursor-pointer transition-all',
        'hover:shadow-2xl active:scale-95',
        isWinner ? 'ring-4 ring-green-400 shadow-lg' : 'shadow-lg hover:shadow-2xl'
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {burger.images?.[0] ? (
          <img
            src={burger.images[0]}
            alt={burger.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
        {/* Top - Winner checkmark */}
        {isWinner && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-green-400 flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">✓</span>
          </motion.div>
        )}

        {/* Bottom Content */}
        <div className="mt-auto">
          {/* Burger Type Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 inline-block"
          >
            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-gray-900">
              {burger.type}
            </div>
          </motion.div>

          {/* Burger Name */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2"
          >
            {burger.name}
          </motion.h3>

          {/* Restaurant */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-white/90 mb-3"
          >
            {restaurant?.name || 'Restaurante'}
          </motion.p>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4 md:w-5 md:h-5',
                    i < Math.floor(userRating)
                      ? 'fill-yellow-300 text-yellow-300'
                      : i < userRating
                        ? 'fill-yellow-200 text-yellow-300'
                        : 'text-white/50'
                  )}
                />
              ))}
            </div>
            <span className="text-sm md:text-base font-bold text-white ml-1">
              {userRating.toFixed(1)}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Tap indicator (mobile) */}
      {!isWinner && !isLoser && (
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden"
        >
          <div className="text-white/80 text-xs font-semibold">TAP</div>
        </motion.div>
      )}

      {/* Glow effect for winner */}
      {isWinner && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-400/20 pointer-events-none"
        />
      )}
    </motion.div>
  )
})

export default MatchBurgerCard
