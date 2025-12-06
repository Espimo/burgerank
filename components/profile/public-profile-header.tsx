'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, MessageSquare, UserPlus, UserCheck } from 'lucide-react'
import { followUser, unfollowUser, isFollowing as checkIsFollowing } from '@/lib/api/social'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  level?: number
  total_reviews?: number
  followers_count?: number
  following_count?: number
  created_at?: string
}

interface PublicProfileHeaderProps {
  user: UserProfile
  currentUserId?: string
  onFollowChange?: () => void
}

const PublicProfileHeader = React.memo(function PublicProfileHeader({
  user,
  currentUserId,
  onFollowChange,
}: PublicProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingFollow, setIsCheckingFollow] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const isOwnProfile = currentUserId === user.id

  useEffect(() => {
    if (!currentUserId || isOwnProfile) return

    const checkFollow = async () => {
      setIsCheckingFollow(true)
      try {
        const result = await checkIsFollowing(currentUserId, user.id)
        setIsFollowing(result)
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setIsCheckingFollow(false)
      }
    }

    checkFollow()
  }, [currentUserId, user.id, isOwnProfile])

  const handleFollowToggle = async () => {
    if (!currentUserId) return

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
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-2xl">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>

            {/* Level Badge */}
            {user.level && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
              >
                Lvl {user.level}
              </motion.div>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-600 mb-4 italic">"{user.bio}"</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{user.total_reviews || 0}</div>
              <div className="text-xs text-gray-600">Reviews</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.followers_count || 0}</div>
              <div className="text-xs text-gray-600">Seguidores</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.following_count || 0}</div>
              <div className="text-xs text-gray-600">Siguiendo</div>
            </div>

            {user.created_at && (
              <div className="text-center hidden md:block">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(user.created_at).getFullYear()}
                </div>
                <div className="text-xs text-gray-600">Se unió</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            {isOwnProfile ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Link href="/app/profile/edit">
                    ✏️ Editar Perfil
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Follow Button */}
                {currentUserId && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                  >
                    <Button
                      onClick={handleFollowToggle}
                      disabled={isLoading || isCheckingFollow}
                      variant={isFollowing ? 'default' : 'outline'}
                      className={
                        isFollowing
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-red-500 hover:to-red-600 text-white'
                          : ''
                      }
                    >
                      {isLoading || isCheckingFollow ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          {isHovering ? (
                            <>
                              <span>Dejar de seguir</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-5 w-5 mr-2" />
                              <span>Siguiendo</span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5 mr-2" />
                          <span>Seguir</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Message Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Mensaje
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default PublicProfileHeader
