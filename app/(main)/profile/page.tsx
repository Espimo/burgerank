'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader, AlertCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthUser } from '@/lib/stores/auth-store'
import { ProfileHeader } from '@/components/profile/profile-header'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import { EditProfileModal } from '@/components/profile/edit-profile-modal'
import { LevelDisplay } from '@/components/profile/level-display'
import { LevelInfoModal } from '@/components/profile/level-info-modal'
import { SocialStats } from '@/components/profile/social-stats'
import { UserStatsComponent } from '@/components/profile/user-stats'
import { BadgesSection } from '@/components/profile/badges-section'
import { BadgeDetailModal } from '@/components/profile/badge-detail-modal'
import { ProfileSettingsModal } from '@/components/profile/profile-settings-modal'
import { BadgeInfoModal } from '@/components/profile/badge-info-modal'
import { RewardInfoModal } from '@/components/profile/reward-info-modal'
import { getUserStats, getUserPublicProfile } from '@/lib/api/user-stats'
import { getUserBadges } from '@/lib/api/badges'
import { useBurgeRankFunctions } from '@/lib/hooks/use-burger-rank-functions'
import type { UserProfile, UserStats } from '@/lib/api/user-stats'
import type { UserBadge } from '@/lib/api/badges'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLevelInfoOpen, setIsLevelInfoOpen] = useState(false)
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null)
  const [isBadgeDetailOpen, setIsBadgeDetailOpen] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [showBadgeInfoModal, setShowBadgeInfoModal] = useState(false)
  const [selectedBadgeInfo, setSelectedBadgeInfo] = useState<any>(null)
  const [showRewardInfoModal, setShowRewardInfoModal] = useState(false)
  const [selectedRewardInfo, setSelectedRewardInfo] = useState<any>(null)

  const { user } = useAuthUser()
  const [error, setError] = useState<string | null>(null)

  // Burger Rank Functions
  const {
    markAllRead,
  } = useBurgeRankFunctions()

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        if (!user) {
          setError('Debes iniciar sesión para ver tu perfil')
          return
        }

        const [profileData, statsData, badgesData] = await Promise.all([
          getUserPublicProfile(user.id),
          getUserStats(user.id),
          getUserBadges(user.id),
        ])

        if (profileData) {
          setProfile(profileData)
        }
        if (statsData) {
          setStats(statsData)
        }
        setBadges(badgesData)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Error al cargar el perfil. Intenta de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [user])

  const handleEditProfile = async (data: Partial<UserProfile>) => {
    try {
      // Aquí iría la llamada a la API para actualizar el perfil
      // await updateUserProfile(data)
      setProfile((prev) => (prev ? { ...prev, ...data } : null))
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsEditingAvatar(true)
      // Aquí iría la lógica de upload a Supabase Storage
      // const url = await uploadAvatar(file)
      // setProfile(prev => prev ? { ...prev, avatar_url: url } : null)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    } finally {
      setIsEditingAvatar(false)
      setIsAvatarUploadOpen(false)
    }
  }

  const handleBadgeClick = (badge: UserBadge) => {
    setSelectedBadgeInfo(badge)
    setShowBadgeInfoModal(true)
  }

  // Calcular nivel
  const userLevel = stats ? Math.floor(stats.totalPoints / 500) + 1 : 1
  const pointsToNextLevel = stats ? 500 - (stats.totalPoints % 500) : 500

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Loader className="w-8 h-8 text-amber-500" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 max-w-md">
          <AlertCircle className="w-8 h-8" />
          <p className="text-center">{error}</p>
        </div>
      </div>
    )
  }

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Error cargando perfil</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            onEditClick={() => setIsEditModalOpen(true)}
            onAvatarUpload={() => setIsAvatarUploadOpen(true)}
            onSettingsClick={() => setIsSettingsModalOpen(true)}
          />
        </motion.div>

        {/* Main content tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="reviews">Valoraciones</TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LevelDisplay
                  userLevel={userLevel}
                  totalPoints={stats.totalPoints}
                  pointsToNextLevel={pointsToNextLevel}
                  onInfoClick={() => setIsLevelInfoOpen(true)}
                />
                <SocialStats
                  followers={stats.followers || 0}
                  following={stats.following || 0}
                  totalLikes={stats.totalLikes || 0}
                />
              </div>
            </TabsContent>

            {/* Stats tab */}
            <TabsContent value="stats" className="mt-6">
              <UserStatsComponent stats={stats} />
            </TabsContent>

            {/* Badges tab */}
            <TabsContent value="badges" className="mt-6">
              <BadgesSection badges={badges} onBadgeClick={handleBadgeClick} />
            </TabsContent>

            {/* Reviews tab */}
            <TabsContent value="reviews" className="mt-6">
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-600">Tus últimas valoraciones aparecerán aquí</p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
      />

      <LevelInfoModal isOpen={isLevelInfoOpen} onClose={() => setIsLevelInfoOpen(false)} />

      {/* Avatar Upload Modal */}
      {isAvatarUploadOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsAvatarUploadOpen(false)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Cambiar Avatar</h3>
            <AvatarUpload onUpload={handleAvatarUpload} isLoading={isEditingAvatar} />
            <button
              onClick={() => setIsAvatarUploadOpen(false)}
              className="mt-4 w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}

      <BadgeDetailModal
        isOpen={isBadgeDetailOpen}
        badge={selectedBadge}
        onClose={() => setIsBadgeDetailOpen(false)}
      />

      {/* Settings Modal */}
      <ProfileSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        userName={profile?.full_name || 'Usuario'}
        userEmail={profile?.email || ''}
      />

      {/* Badge Info Modal */}
      <BadgeInfoModal
        open={showBadgeInfoModal}
        onOpenChange={setShowBadgeInfoModal}
        badge={selectedBadgeInfo}
      />

      {/* Reward Info Modal */}
      <RewardInfoModal
        open={showRewardInfoModal}
        onOpenChange={setShowRewardInfoModal}
        reward={selectedRewardInfo}
      />
    </div>
  )
}
