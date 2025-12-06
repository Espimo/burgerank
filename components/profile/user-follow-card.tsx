'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { followUser, unfollowUser } from '@/lib/api/social'
import Link from 'next/link'

interface UserFollowCardProps {
  user: {
    id: string
    username: string
    level?: number
    avatar_url?: string
    total_reviews?: number
    bio?: string
  }
  currentUserId?: string
  isFollowing?: boolean
  onFollowChange?: () => void
}

const UserFollowCard = React.memo(function UserFollowCard({
  user,
  currentUserId,
  isFollowing: initialIsFollowing = false,
  onFollowChange,
}: UserFollowCardProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleFollowToggle = useCallback(async () => {
    if (!currentUserId || !currentUserId) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, user.id)
        setIsFollowing(false)
      } else {
        await followUser(currentUserId, user.id)
        setIsFollowing(true)
      }
      onFollowChange?.()
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isFollowing, currentUserId, user.id, onFollowChange])

  const isOwnProfile = currentUserId === user.id

  return (
    <motion.div
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{ y: -2 }}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link href={`/profile/${user.username}`}>
          <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 ring-amber-300">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${user.username}`}>
              <h3 className="font-semibold text-gray-900 hover:text-amber-600 cursor-pointer">
                {user.username}
              </h3>
            </Link>

            {/* Level Badge */}
            {user.level && (
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700"
              >
                Lvl {user.level}
              </motion.div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
            {user.total_reviews && (
              <span>📝 {user.total_reviews} reviews</span>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-1">{user.bio}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {/* View Profile */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Link href={`/profile/${user.username}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Follow Button */}
          {!isOwnProfile && currentUserId && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <Button
                onClick={handleFollowToggle}
                disabled={isLoading}
                variant={isFollowing ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'rounded-full',
                  isFollowing
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-red-500 hover:to-red-600 text-white'
                    : ''
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                  <>
                    {isHovering ? (
                      <>
                        <span className="text-xs">Dejar de seguir</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        <span className="text-xs">Siguiendo</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    <span className="text-xs">Seguir</span>
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

export default UserFollowCard
