'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

interface LevelDisplayProps {
  userLevel: number
  totalPoints: number
  pointsToNextLevel: number
  onInfoClick?: () => void
}

export const LevelDisplay = React.memo(function LevelDisplay({
  userLevel,
  totalPoints,
  pointsToNextLevel,
  onInfoClick,
}: LevelDisplayProps) {
  const progress = useMemo(() => {
    const pointsInCurrentLevel = totalPoints % 500 // 500 puntos por nivel
    return (pointsInCurrentLevel / 500) * 100
  }, [totalPoints])

  const LEVEL_COLORS = {
    1: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-600' },
    2: { bg: 'from-green-400 to-green-600', text: 'text-green-600' },
    3: { bg: 'from-blue-400 to-blue-600', text: 'text-blue-600' },
    4: { bg: 'from-purple-400 to-purple-600', text: 'text-purple-600' },
    5: { bg: 'from-amber-400 to-amber-600', text: 'text-amber-600' },
  }

  const getLevelColor = (level: number) => {
    if (level <= 5) return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS]
    return LEVEL_COLORS[5] // Max level color for 5+
  }

  const levelColor = getLevelColor(userLevel)

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Mi Nivel</h3>
        <motion.button
          onClick={onInfoClick}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info className="w-5 h-5 text-gray-500" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Nivel actual */}
        <motion.div className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${levelColor.bg} flex items-center justify-center text-white font-bold text-3xl shadow-lg`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {userLevel}
          </motion.div>
          <p className={`mt-3 font-bold text-lg ${levelColor.text}`}>
            {userLevel === 1 && 'Novato'}
            {userLevel === 2 && 'Explorador'}
            {userLevel === 3 && 'Experto'}
            {userLevel === 4 && 'Maestro'}
            {userLevel >= 5 && 'Leyenda'}
          </p>
        </motion.div>

        {/* Progreso */}
        <motion.div className="flex flex-col justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso</span>
                <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
              </div>
              <motion.div
                className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${levelColor.bg} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-amber-600">{pointsToNextLevel}</span> pts para nivel {userLevel + 1}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Total points */}
      <motion.div
        className="mt-6 pt-6 border-t border-gray-200 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500 mb-1">PUNTOS TOTALES</p>
        <motion.p
          className="text-2xl font-bold text-amber-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {totalPoints.toLocaleString('es-ES')}
        </motion.p>
      </motion.div>
    </motion.div>
  )
})
