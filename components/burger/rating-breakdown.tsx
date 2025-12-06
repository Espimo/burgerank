'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface RatingBreakdownProps {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingBreakdown({
  average,
  total,
  distribution,
}: RatingBreakdownProps) {
  const stats = useMemo(() => {
    return [
      {
        stars: 5,
        count: distribution[5],
        percentage: total > 0 ? (distribution[5] / total) * 100 : 0,
      },
      {
        stars: 4,
        count: distribution[4],
        percentage: total > 0 ? (distribution[4] / total) * 100 : 0,
      },
      {
        stars: 3,
        count: distribution[3],
        percentage: total > 0 ? (distribution[3] / total) * 100 : 0,
      },
      {
        stars: 2,
        count: distribution[2],
        percentage: total > 0 ? (distribution[2] / total) * 100 : 0,
      },
      {
        stars: 1,
        count: distribution[1],
        percentage: total > 0 ? (distribution[1] / total) * 100 : 0,
      },
    ]
  }, [distribution, total])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <div className="space-y-4">
      {/* Average Rating */}
      <div className="flex items-start gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{average.toFixed(1)}</div>
          <div className="flex justify-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(average) ? '⭐' : '☆'}>
                {i < Math.round(average) ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{total} reseñas</p>
        </div>

        {/* Distribution bars */}
        <motion.div
          className="flex-1 space-y-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat) => (
            <motion.div key={stat.stars} className="flex items-center gap-2" variants={item}>
              <div className="flex items-center gap-1 w-12 text-xs">
                <span>{stat.stars}</span>
                <span>⭐</span>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {stat.count}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
