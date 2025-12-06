'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, Heart, MessageSquare, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserActivity } from '@/lib/api/social'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserActivity {
  id: string
  user_id: string
  username: string
  avatar_url?: string
  activity_type: 'review_created' | 'badge_unlocked' | 'level_up' | 'top_five_updated'
  description: string
  data?: {
    burger_name?: string
    restaurant_name?: string
    rating?: number
    badge_name?: string
    new_level?: number
  }
  created_at: string
}

interface UserActivityFeedProps {
  userId: string
  followingOnly?: boolean
}

const activityIcons = {
  review_created: <MessageSquare className="h-5 w-5 text-blue-500" />,
  badge_unlocked: <Trophy className="h-5 w-5 text-purple-500" />,
  level_up: <Zap className="h-5 w-5 text-yellow-500" />,
  top_five_updated: <Heart className="h-5 w-5 text-red-500" />,
}

const activityColors = {
  review_created: 'bg-blue-50 border-blue-200',
  badge_unlocked: 'bg-purple-50 border-purple-200',
  level_up: 'bg-yellow-50 border-yellow-200',
  top_five_updated: 'bg-red-50 border-red-200',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

const UserActivityFeed = React.memo(function UserActivityFeed({
  userId,
  followingOnly = true,
}: UserActivityFeedProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadActivities = useCallback(async (page = 1) => {
    const isFirstLoad = page === 1
    if (isFirstLoad) setIsLoading(true)

    try {
      const data = await getUserActivity(userId, followingOnly, 20)
      setActivities(isFirstLoad ? data : [...activities, ...data])
      setHasMore(data.length >= 20)
    } catch (error) {
      console.error('Error loading activities:', error)
      if (isFirstLoad) setActivities([])
    } finally {
      if (isFirstLoad) setIsLoading(false)
    }
  }, [userId, followingOnly, activities])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const data = await getUserActivity(userId, followingOnly, 20)
      setActivities(data)
      setHasMore(data.length >= 20)
    } catch (error) {
      console.error('Error refreshing activities:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [userId, followingOnly])

  useEffect(() => {
    loadActivities()
  }, [userId, followingOnly])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && activities.length > 0) {
          loadActivities((Math.floor(activities.length / 20) + 1))
        }
      },
      { threshold: 0.5 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [activities.length, hasMore, isLoading, loadActivities])

  const getActivityText = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'review_created':
        return `Calificó "${activity.data?.burger_name || 'una hamburguesa'}" con ${activity.data?.rating || 0}⭐`
      case 'badge_unlocked':
        return `Desbloqueó insignia: ${activity.data?.badge_name || 'Nueva insignia'}`
      case 'level_up':
        return `¡Subió a nivel ${activity.data?.new_level || 0}!`
      case 'top_five_updated':
        return 'Actualizó su top 5'
      default:
        return activity.description
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader2 className="h-8 w-8 text-amber-500" />
        </motion.div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center"
      >
        <p className="text-gray-600 mb-4">
          {followingOnly ? 'Aún no sigues a nadie o no tienen actividad' : 'Sin actividad disponible'}
        </p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">📰 Feed de Actividad</h3>
          <p className="text-sm text-gray-600">
            {followingOnly ? 'Actividad de usuarios que sigues' : 'Toda la actividad'}
          </p>
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
        className="space-y-3"
      >
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              exit="exit"
              className={`rounded-lg border p-4 ${activityColors[activity.activity_type]}`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Link href={`/profile/${activity.username}`}>
                  <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 ring-amber-300 flex-shrink-0">
                    <AvatarImage src={activity.avatar_url} alt={activity.username} />
                    <AvatarFallback>{activity.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {activityIcons[activity.activity_type]}
                    <Link href={`/profile/${activity.username}`}>
                      <span className="font-semibold text-gray-900 hover:text-amber-600">
                        {activity.username}
                      </span>
                    </Link>
                  </div>

                  <p className="text-sm text-gray-700">{getActivityText(activity)}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>

                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {activity.activity_type === 'review_created' && '📝'}
                  {activity.activity_type === 'badge_unlocked' && '🏆'}
                  {activity.activity_type === 'level_up' && '⚡'}
                  {activity.activity_type === 'top_five_updated' && '❤️'}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerTarget} className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}

      {!hasMore && activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-gray-500 text-sm"
        >
          ✨ Llegaste al final del feed
        </motion.div>
      )}
    </div>
  )
})

export default UserActivityFeed
