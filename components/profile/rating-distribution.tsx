'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card } from '@/components/ui/card'

interface Review {
  overall_rating: number
}

interface RatingDistributionProps {
  reviews: Review[]
  variant?: 'bar' | 'pie'
}

const RATING_COLORS = {
  5: '#fbbf24', // amber-400
  4: '#34d399', // emerald-400
  3: '#fbbf24', // amber-400
  2: '#fb923c', // orange-400
  1: '#ef4444', // red-400
}

const RatingDistribution = React.memo(function RatingDistribution({
  reviews,
  variant = 'bar',
}: RatingDistributionProps) {
  const data = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    reviews.forEach((review) => {
      const rating = Math.round(review.overall_rating)
      if (rating >= 1 && rating <= 5) {
        counts[rating as keyof typeof counts]++
      }
    })

    return Object.entries(counts)
      .map(([rating, count]) => ({
        rating: `${rating}⭐`,
        count,
        percentage: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0,
      }))
      .reverse()
  }, [reviews])

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 p-8 text-center"
      >
        <p className="text-sm text-amber-700">No hay valoraciones para mostrar distribución</p>
      </motion.div>
    )
  }

  if (variant === 'pie') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ payload, percent }) => `${(payload as any)?.rating}: ${Math.round((percent || 0) * 100)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={RATING_COLORS[parseInt(entry.rating[0]) as keyof typeof RATING_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="rating"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value, name) => {
                if (name === 'count') return [value, 'Valoraciones']
                if (name === 'percentage') return [`${value}%`, 'Porcentaje']
                return value
              }}
            />
            <Bar
              dataKey="count"
              fill="#fbbf24"
              radius={[8, 8, 0, 0]}
              animationDuration={500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={RATING_COLORS[parseInt(entry.rating[0]) as keyof typeof RATING_COLORS]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {data.map((item, index) => (
          <motion.div
            key={item.rating}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex items-center gap-2 rounded-lg bg-gray-50 p-2"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  RATING_COLORS[parseInt(item.rating[0]) as keyof typeof RATING_COLORS],
              }}
            />
            <span className="text-xs font-medium text-gray-700">{item.rating}</span>
            <span className="ml-auto text-xs font-bold text-gray-600">
              {item.count} ({item.percentage}%)
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
})

export default RatingDistribution
