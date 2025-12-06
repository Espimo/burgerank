'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { BadgeCard } from './badge-card'
import type { UserBadge } from '@/lib/api/badges'

interface BadgesSectionProps {
  badges: UserBadge[]
  onBadgeClick: (badge: UserBadge) => void
}

export const BadgesSection = React.memo(function BadgesSection({
  badges,
  onBadgeClick,
}: BadgesSectionProps) {
  const [filterType, setFilterType] = useState<'all' | 'unlocked' | 'locked'>('all')

  const unlockedBadges = badges.filter((b) => b.unlocked)
  const lockedBadges = badges.filter((b) => !b.unlocked)

  const filteredBadges = (() => {
    switch (filterType) {
      case 'unlocked':
        return unlockedBadges
      case 'locked':
        return lockedBadges
      default:
        return badges
    }
  })()

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  }

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Badges</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filterType === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({badges.length})
          </button>
          <button
            onClick={() => setFilterType('unlocked')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filterType === 'unlocked'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Desbloqueados ({unlockedBadges.length})
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filterType === 'locked'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bloqueados ({lockedBadges.length})
          </button>
        </div>
      </div>

      {filteredBadges.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Lock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {filterType === 'unlocked'
              ? 'Aún no has desbloqueado badges'
              : filterType === 'locked'
                ? 'No hay badges bloqueados'
                : 'No hay badges disponibles'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredBadges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              onClick={() => onBadgeClick(badge)}
              role="button"
              tabIndex={0}
            >
              <BadgeCard badge={badge} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats bar */}
      <motion.div
        className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">Progreso</p>
          <motion.p
            className="text-xl font-bold text-amber-600 mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            {Math.round((unlockedBadges.length / badges.length) * 100)}%
          </motion.p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Desbloqueados</p>
          <motion.p
            className="text-xl font-bold text-green-600 mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            {unlockedBadges.length}/{badges.length}
          </motion.p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Próximos</p>
          <motion.p
            className="text-xl font-bold text-purple-600 mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            {lockedBadges.length}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
})
