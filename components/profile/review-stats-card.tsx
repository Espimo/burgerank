'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Flame, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewStatsCardProps {
  stat: 'avgRating' | 'totalReviews' | 'totalLikes' | 'monthWithMostReviews'
  label: string
  value: string | number
  icon: React.ReactNode
  color?: 'amber' | 'rose' | 'blue' | 'green' | 'purple'
}

const colorClasses = {
  amber: {
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    value: 'text-amber-900',
  },
  rose: {
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    icon: 'text-rose-600',
    value: 'text-rose-900',
  },
  blue: {
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    value: 'text-blue-900',
  },
  green: {
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    value: 'text-green-900',
  },
  purple: {
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    value: 'text-purple-900',
  },
}

const ReviewStatsCard = React.memo(function ReviewStatsCard({
  label,
  value,
  icon,
  color = 'amber',
}: ReviewStatsCardProps) {
  const colors = colorClasses[color]

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={cn(
        'group relative overflow-hidden rounded-lg border-2 p-4 transition-all',
        colors.border,
        `bg-gradient-to-br ${colors.bg}`
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <div className="relative space-y-2">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={cn('h-8 w-8', colors.icon)}
        >
          {icon}
        </motion.div>

        {/* Value */}
        <div>
          <p className={cn('text-3xl font-bold', colors.value)}>{value}</p>
          <p className="text-xs text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  )
})

export default ReviewStatsCard
