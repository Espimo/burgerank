'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PointsHeaderProps {
  availablePoints: number
  totalPoints: number
  nextLevelPoints?: number
  currentLevelProgress?: number
  onInfoClick?: () => void
}

export const PointsHeader = memo(function PointsHeader({
  availablePoints,
  totalPoints,
  nextLevelPoints = 500,
  currentLevelProgress = 0,
  onInfoClick,
}: PointsHeaderProps) {
  const progressPercent = Math.min((currentLevelProgress / nextLevelPoints) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Available points card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/20 to-primary/5 p-6">
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Puntos Disponibles</p>
              <motion.div
                key={availablePoints}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="text-4xl font-bold text-primary"
              >
                {availablePoints.toLocaleString()}
              </motion.div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onInfoClick}
              className="h-10 w-10"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>

          {/* Total points info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total acumulado: </span>
            <span className="font-semibold text-foreground">{totalPoints.toLocaleString()}</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progreso al siguiente nivel</span>
              <span className="font-semibold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        Canjea tus puntos por increíbles premios
      </p>
    </motion.div>
  )
})
