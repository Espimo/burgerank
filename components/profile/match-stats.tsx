'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Target, Trophy, Zap } from 'lucide-react'
import { getMatchStats } from '@/lib/api/burger-match'
import { cn } from '@/lib/utils'

interface MatchStatsProps {
  userId: string
}

const MatchStats = React.memo(function MatchStats({ userId }: MatchStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      const data = await getMatchStats(userId)
      setStats(data)
      setIsLoading(false)
    }

    loadStats()
  }, [userId])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {/* Total Matches */}
      <motion.div variants={itemVariants} className="group">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <motion.div whileHover={{ scale: 1.1 }} className="mb-3 text-3xl">
            🎮
          </motion.div>
          <p className="text-2xl font-bold text-blue-900">{stats.totalMatches}</p>
          <p className="text-xs text-blue-600 mt-1">Total Matches</p>
        </div>
      </motion.div>

      {/* Today's Matches */}
      <motion.div variants={itemVariants} className="group">
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-4 hover:shadow-lg transition-shadow">
          <motion.div whileHover={{ scale: 1.1 }} className="mb-3 text-3xl">
            ⭐
          </motion.div>
          <p className="text-2xl font-bold text-orange-900">{stats.todayMatches}</p>
          <p className="text-xs text-orange-600 mt-1">Hoy</p>
        </div>
      </motion.div>

      {/* Current Streak */}
      <motion.div variants={itemVariants} className="group">
        <div className="rounded-lg bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 p-4 hover:shadow-lg transition-shadow">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-3 text-3xl origin-left"
          >
            🔥
          </motion.div>
          <p className="text-2xl font-bold text-red-900">{stats.currentStreak}</p>
          <p className="text-xs text-red-600 mt-1">Racha Actual</p>
        </div>
      </motion.div>

      {/* MVP Burger */}
      <motion.div variants={itemVariants} className="group">
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 hover:shadow-lg transition-shadow">
          <motion.div whileHover={{ scale: 1.1 }} className="mb-3 text-3xl">
            👑
          </motion.div>
          <p className="text-2xl font-bold text-purple-900">
            {stats.mostWins?.wins || '-'}
          </p>
          <p className="text-xs text-purple-600 mt-1">MVP Wins</p>
        </div>
      </motion.div>
    </motion.div>
  )
})

export default MatchStats
