'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Loader2, Users } from 'lucide-react'
import { getFollowers, getFollowing } from '@/lib/api/social'
import UserFollowCard from './user-follow-card'
import type { UserProfile } from '@/lib/api/social'

interface FollowersSectionProps {
  userId: string
  currentUserId?: string // Para saber si puede seguir/unfollow
}

const FollowersSection = React.memo(function FollowersSection({
  userId,
  currentUserId,
}: FollowersSectionProps) {
  const [followers, setFollowers] = useState<UserProfile[]>([])
  const [following, setFollowing] = useState<UserProfile[]>([])
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true)
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false)
  const [searchFollowers, setSearchFollowers] = useState('')
  const [searchFollowing, setSearchFollowing] = useState('')

  useEffect(() => {
    const loadFollowers = async () => {
      setIsLoadingFollowers(true)
      const data = await getFollowers(userId)
      setFollowers(data)
      setIsLoadingFollowers(false)
    }

    loadFollowers()
  }, [userId])

  const handleFollowingTab = async () => {
    if (following.length === 0 && !isLoadingFollowing) {
      setIsLoadingFollowing(true)
      const data = await getFollowing(userId)
      setFollowing(data)
      setIsLoadingFollowing(false)
    }
  }

  const filteredFollowers = followers.filter((u) =>
    u.username.toLowerCase().includes(searchFollowers.toLowerCase())
  )

  const filteredFollowing = following.filter((u) =>
    u.username.toLowerCase().includes(searchFollowing.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="followers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Seguidores</span>
            <span className="sm:hidden">Followers</span>
            <span className="ml-1 text-xs font-bold">{followers.length}</span>
          </TabsTrigger>

          <TabsTrigger
            value="following"
            onClick={handleFollowingTab}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Siguiendo</span>
            <span className="sm:hidden">Following</span>
            <span className="ml-1 text-xs font-bold">{following.length}</span>
          </TabsTrigger>
        </TabsList>

        {/* Followers Tab */}
        <TabsContent value="followers" className="space-y-4">
          {isLoadingFollowers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No tiene seguidores aún</p>
            </div>
          ) : (
            <>
              <Input
                placeholder="Buscar seguidores..."
                value={searchFollowers}
                onChange={(e) => setSearchFollowers(e.target.value)}
                className="mb-4"
              />

              {filteredFollowers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No se encontraron seguidores</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {filteredFollowers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <UserFollowCard
                        user={user}
                        currentUserId={currentUserId}
                        onFollowChange={() => {
                          // Actualizar lista si es necesario
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </TabsContent>

        {/* Following Tab */}
        <TabsContent value="following" className="space-y-4">
          {isLoadingFollowing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No está siguiendo a nadie</p>
            </div>
          ) : (
            <>
              <Input
                placeholder="Buscar seguidos..."
                value={searchFollowing}
                onChange={(e) => setSearchFollowing(e.target.value)}
                className="mb-4"
              />

              {filteredFollowing.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No se encontraron usuarios</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {filteredFollowing.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <UserFollowCard
                        user={user}
                        currentUserId={currentUserId}
                        isFollowing={true}
                        onFollowChange={() => {
                          // Actualizar lista si es necesario
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
})

export default FollowersSection
