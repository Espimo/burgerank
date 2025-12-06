'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserSuggestions } from '@/lib/api/social'
import UserFollowCard from './user-follow-card'

interface UserProfile {
  id: string
  username: string
  level?: number
  avatar_url?: string
  total_reviews?: number
  bio?: string
}

interface DiscoverUsersProps {
  userId: string
  onFollowChange?: () => void
}

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
  visible: { opacity: 1, y: 0 },
}

const DiscoverUsers = React.memo(function DiscoverUsers({
  userId,
  onFollowChange,
}: DiscoverUsersProps) {
  const [suggestions, setSuggestions] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadSuggestions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getUserSuggestions(userId, 10)
      setSuggestions(data)
    } catch (error) {
      console.error('Error loading suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const data = await getUserSuggestions(userId, 10)
      setSuggestions(data)
    } catch (error) {
      console.error('Error refreshing suggestions:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [userId])

  useEffect(() => {
    loadSuggestions()
  }, [loadSuggestions])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader2 className="h-8 w-8 text-amber-500" />
        </motion.div>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center"
      >
        <p className="text-gray-600 mb-4">No hay sugerencias disponibles en este momento</p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Intentar de nuevo
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🎯 Descubre Usuarios</h3>
          <p className="text-sm text-gray-600">Usuarios con gustos similares a ti</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto pb-4"
      >
        {suggestions.map((user) => (
          <motion.div key={user.id} variants={itemVariants}>
            <UserFollowCard
              user={user}
              currentUserId={userId}
              onFollowChange={onFollowChange}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-2 mt-6 justify-center">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Ver más sugerencias
            </>
          )}
        </Button>
      </div>
    </div>
  )
})

export default DiscoverUsers
