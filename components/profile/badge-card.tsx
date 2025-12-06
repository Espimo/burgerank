'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import type { UserBadge } from '@/lib/api/badges'

interface BadgeCardProps {
  badge: UserBadge
}

export const BadgeCard = React.memo(function BadgeCard({ badge }: BadgeCardProps) {
  const progressPercent = badge.target > 0 ? (badge.progress / badge.target) * 100 : 0

  return (
    <motion.div
      className={`relative rounded-lg p-4 text-center cursor-pointer group transition-all ${
        badge.unlocked
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:shadow-lg'
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Badge emoji/icon */}
      <motion.div
        className={`text-4xl mb-2 ${!badge.unlocked ? 'opacity-40' : ''}`}
        animate={badge.unlocked ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {badge.badge.icon_emoji}
      </motion.div>

      {/* Lock overlay para locked badges */}
      {!badge.unlocked && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Lock className="w-6 h-6 text-gray-400" />
        </motion.div>
      )}

      {/* Badge name */}
      <h4 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
        {badge.badge.name}
      </h4>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              badge.unlocked ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-600">
          {badge.progress}/{badge.target}
        </p>
      </div>

      {/* Unlocked badge */}
      {badge.unlocked && (
        <motion.div
          className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Hover tooltip */}
      <motion.div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        {badge.badge.how_to_unlock}
      </motion.div>
    </motion.div>
  )
})
