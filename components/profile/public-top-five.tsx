'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Lock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Burger {
  id: string
  name: string
  restaurant_id: string
  restaurant?: {
    name: string
    image_url?: string
  }
  image_url?: string
  rating?: number
}

interface PublicTopFiveProps {
  userId: string
  topFive: Burger[]
  isPrivate?: boolean
  isOwnProfile?: boolean
  onMakePublic?: () => void
}

const topFiveEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

const PublicTopFive = React.memo(function PublicTopFive({
  userId,
  topFive,
  isPrivate = false,
  isOwnProfile = false,
  onMakePublic,
}: PublicTopFiveProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!topFive || topFive.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center"
      >
        <p className="text-gray-600 mb-4">Este usuario aún no tiene un top 5</p>
      </motion.div>
    )
  }

  if (isPrivate && !isOwnProfile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center"
      >
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Este top 5 es privado</p>
        <p className="text-sm text-gray-500">El usuario ha elegido no compartir su top 5</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🏆 Top 5 Hamburguesas</h3>
          <p className="text-sm text-gray-600">Las favoritas de este usuario</p>
        </div>

        {isOwnProfile && isPrivate && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onMakePublic}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="text-amber-600 border-amber-300"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Hacer público
            </Button>
          </motion.div>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {topFive.map((burger, index) => (
          <motion.div
            key={burger.id}
            variants={itemVariants}
            className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Rank */}
              <div className="text-3xl font-bold flex-shrink-0">
                {topFiveEmojis[index]}
              </div>

              {/* Image */}
              {burger.image_url && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <img
                    src={burger.image_url}
                    alt={burger.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-lg">{burger.name}</h4>

                <p className="text-sm text-gray-600 mb-2">
                  🏪 {burger.restaurant?.name || 'Restaurante desconocido'}
                </p>

                {burger.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-amber-600">
                      {burger.rating.toFixed(1)}
                    </span>
                    <span className="text-lg">⭐</span>
                  </div>
                )}
              </div>

              {/* Badge */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl flex-shrink-0"
              >
                ❤️
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
})

export default PublicTopFive
