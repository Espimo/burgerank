'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Share2, Trophy, Home } from 'lucide-react'

interface RatingSuccessProps {
  newPoints: number
  newLevel?: number
  unlockedBadges?: string[]
  unlockedRewards?: string[]
  onShareClick?: () => void
  onRateAnother?: () => void
  onBackToRanking?: () => void
}

export const RatingSuccess = memo(function RatingSuccess({
  newPoints,
  newLevel,
  unlockedBadges = [],
  unlockedRewards = [],
  onShareClick,
  onRateAnother,
  onBackToRanking,
}: RatingSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8"
    >
      {/* Checkmark animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <motion.svg
            className="w-16 h-16 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-center"
      >
        ¡Valoración Publicada!
      </motion.h1>

      {/* Points card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm p-6 rounded-2xl border-2 border-primary bg-primary/5"
      >
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Puntos ganados</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="flex items-baseline justify-center"
            >
              <span className="text-5xl font-bold text-primary">+{newPoints}</span>
              <span className="text-2xl text-yellow-500 ml-2">⭐</span>
            </motion.div>
          </div>

          {/* Level up indicator */}
          {newLevel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="pt-4 border-t border-primary/20"
            >
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
                <Trophy className="w-5 h-5" />
                ¡LEVEL UP!
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Alcanzaste nivel {newLevel}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Unlocked rewards */}
      {unlockedRewards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full max-w-sm space-y-3"
        >
          <h3 className="text-sm font-semibold text-center">🎁 Premios Desbloqueados</h3>
          <div className="grid grid-cols-2 gap-2">
            {unlockedRewards.map((reward, index) => (
              <motion.div
                key={reward}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center text-sm font-medium"
              >
                {reward}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-sm space-y-3 pt-4"
      >
        <Button onClick={onShareClick} variant="outline" className="w-full gap-2">
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onRateAnother} variant="secondary" className="gap-2">
            Otra burger
          </Button>
          <Button onClick={onBackToRanking} variant="secondary" className="gap-2">
            <Home className="w-4 h-4" />
            Ranking
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
})
