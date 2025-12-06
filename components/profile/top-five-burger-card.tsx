'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Award, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Burger } from './top-five-section'

interface TopFiveBurgerCardProps {
  burger: Burger
  position: number
  isHighlighted?: boolean
}

const POSITION_COLORS = {
  1: {
    bg: 'from-yellow-400 to-amber-500',
    badge: 'bg-yellow-400 text-yellow-900',
    border: 'border-yellow-300',
    icon: '🥇',
  },
  2: {
    bg: 'from-gray-300 to-gray-400',
    badge: 'bg-gray-300 text-gray-900',
    border: 'border-gray-300',
    icon: '🥈',
  },
  3: {
    bg: 'from-orange-300 to-orange-400',
    badge: 'bg-orange-300 text-orange-900',
    border: 'border-orange-300',
    icon: '🥉',
  },
  4: {
    bg: 'from-blue-300 to-blue-400',
    badge: 'bg-blue-300 text-blue-900',
    border: 'border-blue-300',
    icon: '#️⃣',
  },
  5: {
    bg: 'from-purple-300 to-purple-400',
    badge: 'bg-purple-300 text-purple-900',
    border: 'border-purple-300',
    icon: '#️⃣',
  },
}

const POSITION_COLORS_MAPPED = POSITION_COLORS as Record<
  number,
  (typeof POSITION_COLORS)[keyof typeof POSITION_COLORS]
>

const TopFiveBurgerCard = React.memo(function TopFiveBurgerCard({
  burger,
  position,
  isHighlighted = false,
}: TopFiveBurgerCardProps) {
  const colors = POSITION_COLORS_MAPPED[Math.min(position, 5)]
  const isTopThree = position <= 3

  return (
    <motion.div
      whileHover={{ scale: isHighlighted ? 1.02 : 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative overflow-hidden rounded-lg border-2 transition-all',
        colors.border,
        isHighlighted ? 'shadow-lg' : 'shadow-md'
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r opacity-10 transition-opacity duration-300',
          `${colors.bg}`,
          'group-hover:opacity-15'
        )}
      />

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start gap-4">
          {/* Posición badge */}
          <motion.div
            className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-bold text-lg',
              colors.badge
            )}
            whileHover={{ scale: 1.1 }}
          >
            {isTopThree ? colors.icon : position}
          </motion.div>

          {/* Info de la burger */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{burger.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {burger.restaurant?.name || 'Restaurante desconocido'}
                </p>
              </div>

              {/* Award badge para top 1 */}
              {position === 1 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    delay: 0.3,
                  }}
                  className="flex-shrink-0"
                >
                  <Award className="h-5 w-5 text-yellow-500" />
                </motion.div>
              )}
            </div>

            {/* Detalles */}
            <div className="mt-2 flex items-center gap-4 text-sm">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.floor(burger.average_rating)
                          ? 'fill-amber-400 text-amber-400'
                          : i < burger.average_rating
                            ? 'fill-amber-200 text-amber-400'
                            : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-700">
                  {burger.average_rating.toFixed(1)}
                </span>
              </div>

              {/* Tipo de burger */}
              <div className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                {burger.type}
              </div>

              {/* Match score si existe */}
              {burger.match_score !== undefined && (
                <div className="ml-auto flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">{Math.round(burger.match_score)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decoración de esquina para destacado */}
        {isHighlighted && (
          <motion.div
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
})

export default TopFiveBurgerCard
