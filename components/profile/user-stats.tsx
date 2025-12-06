'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { UserStats } from '@/lib/api/user-stats'

interface UserStatsComponentProps {
  stats: UserStats
}

export const UserStatsComponent = React.memo(function UserStatsComponent({ stats }: UserStatsComponentProps) {
  const statsData = [
    {
      label: 'Valoraciones',
      value: stats.totalReviews,
      emoji: '📝',
      color: 'from-orange-100 to-orange-50',
    },
    {
      label: 'Burger Favorita',
      value: stats.favoriteBurger || 'N/A',
      emoji: '🍔',
      color: 'from-red-100 to-red-50',
    },
    {
      label: 'Restaurante Favorito',
      value: stats.favoriteRestaurant || 'N/A',
      emoji: '🏪',
      color: 'from-yellow-100 to-yellow-50',
    },
    {
      label: 'Categoría Favorita',
      value: stats.favoriteCategory || 'N/A',
      emoji: '⭐',
      color: 'from-amber-100 to-amber-50',
    },
    {
      label: 'Rating Promedio',
      value: `${(stats.averageRating || 0).toFixed(1)} ⭐`,
      emoji: '📊',
      color: 'from-yellow-100 to-yellow-50',
    },
    {
      label: 'Badges Desbloqueados',
      value: stats.unlockedBadgesCount,
      emoji: '🏆',
      color: 'from-purple-100 to-purple-50',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  }

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Mis Estadísticas</h3>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsData.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.emoji}</span>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium uppercase">{stat.label}</p>
                <motion.p
                  className="text-lg font-bold text-gray-900 mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('es-ES') : stat.value}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
})
