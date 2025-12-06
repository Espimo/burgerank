'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { UserBadge } from '@/lib/api/badges'

interface BadgeDetailModalProps {
  isOpen: boolean
  badge: UserBadge | null
  onClose: () => void
}

export const BadgeDetailModal = React.memo(function BadgeDetailModal({
  isOpen,
  badge,
  onClose,
}: BadgeDetailModalProps) {
  if (!badge) return null

  const progressPercent = badge.target > 0 ? (badge.progress / badge.target) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {badge.badge.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            {badge.badge.description}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Badge emoji grande */}
          <motion.div
            className="flex justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="text-6xl">{badge.badge.icon_emoji}</div>
          </motion.div>

          {/* Status */}
          <motion.div
            className={`p-4 rounded-lg text-center font-bold ${
              badge.unlocked
                ? 'bg-green-50 border border-green-200 text-green-700 flex items-center justify-center gap-2'
                : 'bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center gap-2'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {badge.unlocked ? (
              <>
                <Check className="w-5 h-5" />
                <span>¡Badge Desbloqueado!</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Badge Bloqueado</span>
              </>
            )}
          </motion.div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 font-medium mb-2">Cómo desbloquear:</p>
            <p className="text-sm text-gray-600">{badge.badge.how_to_unlock}</p>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progreso</span>
              <span className="text-sm font-bold text-amber-600">
                {badge.progress}/{badge.target}
              </span>
            </div>
            <motion.div
              className="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`h-full ${
                  badge.unlocked
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-amber-400 to-amber-600'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </motion.div>
            <p className="text-xs text-gray-500 text-center">
              {Math.round(progressPercent)}% completado
            </p>
          </div>

          {/* Reward info */}
          <motion.div
            className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-700 font-medium mb-2">🎁 Recompensa al desbloquear:</p>
            <p className="text-2xl font-bold text-amber-600 flex items-center gap-2">
              +{badge.badge.points_reward} <span className="text-lg">pts</span>
            </p>
          </motion.div>

          {/* Tips if locked */}
          {!badge.unlocked && (
            <motion.div
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-700 font-medium mb-2">💡 Consejo:</p>
              <p className="text-sm text-gray-600">
                Te quedan <span className="font-bold text-purple-600">{badge.target - badge.progress}</span> acciones para desbloquear este badge
              </p>
            </motion.div>
          )}

          {/* Unlocked date */}
          {badge.unlocked && badge.unlockedAt && (
            <motion.div
              className="text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Desbloqueado el {new Date(badge.unlockedAt).toLocaleDateString('es-ES')}
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
})
