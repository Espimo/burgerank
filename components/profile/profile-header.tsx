'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Mail, Calendar } from 'lucide-react'
import type { UserProfile } from '@/lib/api/user-stats'

interface ProfileHeaderProps {
  profile: UserProfile
  isOwnProfile: boolean
  isFollowing?: boolean
  onFollowClick?: () => void
  onEditClick?: () => void
  onAvatarUpload?: () => void
}

export const ProfileHeader = React.memo(function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing = false,
  onFollowClick,
  onEditClick,
  onAvatarUpload,
}: ProfileHeaderProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const joinedDate = useMemo(() => {
    if (!profile.created_at) return null
    const date = new Date(profile.created_at)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  }, [profile.created_at])

  return (
    <motion.div
      className="w-full bg-gradient-to-b from-amber-50 to-white rounded-lg shadow-sm border border-amber-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Banner background */}
      <div className="h-24 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-t-lg" />

      <div className="px-6 pb-6">
        {/* Avatar section */}
        <motion.div className="flex items-end gap-4 -mt-12 mb-6" variants={itemVariants}>
          <motion.div
            className="relative"
            whileHover={isOwnProfile ? { scale: 1.05 } : {}}
            onClick={isOwnProfile ? onAvatarUpload : undefined}
            role={isOwnProfile ? 'button' : undefined}
            tabIndex={isOwnProfile ? 0 : undefined}
          >
            <Image
              src={profile.avatar_url || '/default-avatar.png'}
              alt={profile.full_name || 'User'}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover cursor-pointer"
            />
            {isOwnProfile && (
              <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-2xl opacity-0 hover:opacity-100 transition-opacity">📷</span>
              </div>
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h1 className="text-2xl font-bold text-gray-900" variants={itemVariants}>
              {profile.full_name || 'Usuario'}
            </motion.h1>
            {profile.bio && (
              <motion.p className="text-gray-600 text-sm mt-1" variants={itemVariants}>
                {profile.bio}
              </motion.p>
            )}
          </div>

          <motion.div className="flex gap-2" variants={itemVariants}>
            {isOwnProfile ? (
              <button
                onClick={onEditClick}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={onFollowClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Info section */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={itemVariants}>
          {profile.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>{profile.city}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-amber-500" />
              <span className="truncate">{profile.email}</span>
            </div>
          )}
          {joinedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{joinedDate}</span>
            </div>
          )}
          {profile.preferred_category && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">🍔</span>
              <span className="capitalize">{profile.preferred_category}</span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})
