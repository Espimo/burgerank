'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, MessageCircle } from 'lucide-react'

interface SocialStatsProps {
  followers: number
  following: number
  totalLikes: number
}

export const SocialStats = React.memo(function SocialStats({
  followers,
  following,
  totalLikes,
}: SocialStatsProps) {
  const stats = [
    {
      label: 'Seguidores',
      value: followers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Siguiendo',
      value: following,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Likes',
      value: totalLikes,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
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
      className="w-full grid grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`${stat.bgColor} rounded-lg p-4 text-center border border-gray-100`}
          >
            <motion.div
              className={`flex justify-center mb-2`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </motion.div>
            <motion.div
              className="text-2xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              {stat.value.toLocaleString('es-ES')}
            </motion.div>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
})
