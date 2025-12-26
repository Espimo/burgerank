'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface BadgeData {
  id: string
  name: string
  description: string
  emoji: string
  unlocked_at?: string
  requirement_type?: string
  requirement_value?: number
}

interface RewardData {
  id: string
  name: string
  description: string
  emoji: string
  cost_points: number
}

interface ProfileData {
  user: {
    id: string
    username: string
    email: string
    avatar_url: string | null
    bio: string | null
    public_profile: boolean
    created_at: string
  }
  stats: {
    points: number
    totalRatings: number
    avgRating: number
    citiesVisited: number
    category: string
  }
  badges: {
    unlocked: BadgeData[]
    locked: BadgeData[]
    totalUnlocked: number
    totalAvailable: number
  }
  top3: { name: string; rating: number }[]
  recentRatings: { name: string; rating: number; created_at: string }[]
  rewards: {
    available: RewardData[]
    next: RewardData | null
    previous: RewardData | null
    progress: number
    pointsToNext: number
  }
}

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAllBadges, setShowAllBadges] = useState(false)
  const [showPersonalRanking, setShowPersonalRanking] = useState(false)
  const [rankingSortMode, setRankingSortMode] = useState<'rating' | 'date'>('rating')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [publicProfileChecked, setPublicProfileChecked] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const { authUser } = useAuth()
  const router = useRouter()

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) {
        router.push('/auth/signin')
        return
      }

      try {
        setLoading(true)
        const response = await fetch('/api/profile')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar perfil')
        }

        setProfileData(data)
        setProfileName(data.user.username)
        setProfileEmail(data.user.email)
        setPublicProfileChecked(data.user.public_profile)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar perfil')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [authUser, router])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const showBadgeInfo = (badge: BadgeData) => {
    const isUnlocked = !!badge.unlocked_at
    alert(`🏅 ${badge.name}\n\n${badge.description}\n\n${isUnlocked ? '✅ Desbloqueado' : '🔒 Bloqueado'}`)
  }

  const showRewardInfo = (reward: RewardData, userPoints: number) => {
    const canRedeem = userPoints >= reward.cost_points
    alert(`🎁 ${reward.name}\n\n${reward.description}\n\nCosto: ${reward.cost_points} puntos\n\n${canRedeem ? '✅ Puedes canjear esta recompensa' : `❌ Te faltan ${reward.cost_points - userPoints} puntos`}`)
  }

  const saveSettings = async () => {
    if (!profileData) return

    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profileName,
          public_profile: publicProfileChecked,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      alert('Configuración guardada correctamente')
      setShowSettings(false)

      // Reload profile data
      const newData = await (await fetch('/api/profile')).json()
      setProfileData(newData)
    } catch (err) {
      alert('Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = () => {
    const link = `https://burgerank.com/profile/${profileData?.user.username}`
    navigator.clipboard.writeText(link)
    alert('Enlace copiado al portapapeles')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `${diffDays} días`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`
    return `${Math.floor(diffDays / 30)} meses`
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Burger Obsessed': return '🔥'
      case 'Burger Lover': return '❤️'
      default: return '🍔'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <TopBar onMenuClick={handleMenuClick} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <div className="main" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando perfil...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="container">
        <TopBar onMenuClick={handleMenuClick} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <div className="main" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <p>{error || 'Error al cargar perfil'}</p>
          <button
            onClick={() => router.push('/auth/signin')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fbbf24',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Iniciar sesión
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const { user, stats, badges, top3, recentRatings, rewards } = profileData

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-2xl font-bold">👤 Mi Perfil</h2>
          </div>
          <button
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={() => setShowSettings(!showSettings)}
            title="Editar perfil"
          >
            ✏️
          </button>
        </div>

        {/* User Header */}
        <div className="card mb-4">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div
              className="avatar avatar-lg"
              style={{
                background: user.avatar_url 
                  ? `url(${user.avatar_url}) center/cover`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!user.avatar_url && getInitials(user.username)}
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="text-lg font-bold">{user.username}</h3>
              <div className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>
                @{user.username.toLowerCase().replace(/\s+/g, '_')}
              </div>
              <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.9rem' }}>
                {getCategoryEmoji(stats.category)} {stats.category}
              </div>
            </div>
          </div>

          {/* Insignias en Header */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem' 
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#9ca3af' }}>
                Insignias Desbloqueadas ({badges.totalUnlocked}/{badges.totalAvailable})
              </div>
              <button
                onClick={() => setShowAllBadges(true)}
                style={{
                  fontSize: '0.75rem',
                  color: '#fbbf24',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
              >
                Ver todos →
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {/* Todas las badges desbloqueadas */}
              {badges.unlocked.map(badge => (
                <div
                  key={badge.id}
                  style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                  title={badge.name}
                  onClick={() => showBadgeInfo(badge)}
                >
                  {badge.emoji}
                </div>
              ))}
              {/* Badges bloqueados (mostrar primero 2 como preview) */}
              {badges.locked.slice(0, 2).map(badge => (
                <div
                  key={badge.id}
                  style={{ fontSize: '1.5rem', opacity: 0.3, cursor: 'pointer' }}
                  title={`${badge.name} - Bloqueado`}
                  onClick={() => showBadgeInfo(badge)}
                >
                  {badge.emoji}
                </div>
              ))}
              {badges.locked.length > 2 && (
                <button
                  onClick={() => setShowAllBadges(true)}
                  style={{ 
                    fontSize: '1rem', 
                    opacity: 0.5, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: '#e5e7eb'
                  }}
                >
                  +{badges.locked.length - 2}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.points}</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Puntos</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.totalRatings}</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Valoraciones</div>
            </div>
          </div>
        </div>

        {/* Próxima Recompensa */}
        {rewards.next && (
          <div className="card mb-4">
            <div className="font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
              🎁 Próxima Recompensa
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{rewards.next.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>{rewards.next.name}</div>
                  <div className="text-xs text-muted" style={{ fontSize: '0.65rem' }}>
                    {rewards.next.description}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.75rem' }}>+{rewards.pointsToNext}</div>
                </div>
              </div>
              <div
                style={{
                  background: '#4b5563',
                  height: '4px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '0.3rem',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                    height: '100%',
                    width: `${rewards.progress}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#9ca3af' }}>
                {stats.points}/{rewards.next.cost_points} • {rewards.pointsToNext} pts restantes
              </div>
            </div>
          </div>
        )}

        {/* Recompensas Disponibles */}
        <div className="card mb-4">
          <div className="font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
            💰 Recompensas
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {rewards.available.map(reward => (
              <div
                key={reward.id}
                style={{
                  flexShrink: 0,
                  padding: '0.6rem',
                  background: 'rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  borderLeft: `3px solid ${stats.points >= reward.cost_points ? '#22c55e' : '#fbbf24'}`,
                  minWidth: '120px',
                  cursor: 'pointer',
                  opacity: stats.points >= reward.cost_points ? 1 : 0.7
                }}
                onClick={() => showRewardInfo(reward, stats.points)}
              >
                <div style={{ fontWeight: '600', color: stats.points >= reward.cost_points ? '#22c55e' : '#fbbf24', fontSize: '0.75rem' }}>
                  {reward.name.split(' ')[0]} {reward.emoji}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{reward.cost_points} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mi Ranking Personal */}
        {top3.length > 0 && (
          <div className="card mb-4">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div className="font-semibold" style={{ fontSize: '0.9rem' }}>
                📊 Mi Top 3
              </div>
              <button
                onClick={() => setShowPersonalRanking(true)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#374151',
                  color: '#fbbf24',
                  border: '1px solid #4b5563',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Ver Ranking Personal →
              </button>
            </div>
            <div>
              {top3.map((item, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.6rem', 
                    background: 'rgba(251, 191, 36, 0.05)', 
                    borderRadius: '0.375rem', 
                    borderLeft: `3px solid ${['#fbbf24', '#f59e0b', '#d97706'][index]}`, 
                    fontSize: '0.85rem',
                    marginBottom: index < top3.length - 1 ? '0.25rem' : 0
                  }}
                >
                  <div>
                    <span style={{ color: ['#fbbf24', '#f59e0b', '#d97706'][index], fontWeight: 'bold' }}>
                      {['🥇', '🥈', '🥉'][index]} 
                    </span>
                    {item.name}
                  </div>
                  <div style={{ color: ['#fbbf24', '#f59e0b', '#d97706'][index], fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {item.rating}/5
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Últimas Valoraciones */}
        {recentRatings.length > 0 && (
          <div className="card mb-4">
            <div className="font-semibold" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              ⭐ Últimas
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {recentRatings.map((rating, index) => (
                <div
                  key={index}
                  style={{
                    flexShrink: 0,
                    padding: '0.6rem',
                    background: 'rgba(75, 85, 99, 0.5)',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    minWidth: '120px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '0.75rem' }}>{rating.name}</div>
                  <div style={{ color: '#fbbf24', fontSize: '0.7rem', margin: '0.2rem 0' }}>
                    {renderStars(rating.rating)}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{formatDate(rating.created_at)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuración */}
        {showSettings && (
          <div className="card">
            <div className="font-semibold mb-3">⚙️ Configuración</div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  backgroundColor: '#1f2937',
                  color: '#e5e7eb'
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileEmail}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#9ca3af'
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.25rem' }}>
                El email no se puede cambiar
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={publicProfileChecked}
                  onChange={(e) => setPublicProfileChecked(e.target.checked)}
                />
                Perfil Público
              </label>
            </div>
            {publicProfileChecked && (
              <div style={{ padding: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <div className="text-xs text-muted mb-2" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Comparte tu perfil:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={`https://burgerank.com/profile/${user.username}`}
                    readOnly
                    style={{ 
                      fontSize: '0.85rem',
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #4b5563',
                      borderRadius: '0.375rem',
                      backgroundColor: '#1f2937',
                      color: '#e5e7eb'
                    }}
                  />
                  <button
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#374151',
                      color: '#e5e7eb',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    onClick={copyToClipboard}
                  >
                    📋
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                onClick={() => setShowSettings(false)}
              >
                Cancelar
              </button>
              <button 
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#fbbf24',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        {/* Modal: Todas las Insignias */}
        {showAllBadges && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowAllBadges(false)}
          >
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid #374151'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🏅 Todas las Insignias</h3>
                <button
                  onClick={() => setShowAllBadges(false)}
                  style={{
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Desbloqueadas */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.75rem' }}>
                  ✅ Desbloqueadas ({badges.unlocked.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {badges.unlocked.map(badge => (
                    <div
                      key={badge.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#374151',
                        borderRadius: '0.5rem',
                        border: '2px solid #22c55e',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => showBadgeInfo(badge)}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{badge.emoji}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#e5e7eb' }}>{badge.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloqueadas */}
              {badges.locked.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.75rem' }}>
                    🔒 Bloqueadas ({badges.locked.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {badges.locked.map(badge => (
                      <div
                        key={badge.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#374151',
                          borderRadius: '0.5rem',
                          border: '1px solid #4b5563',
                          textAlign: 'center',
                          opacity: 0.6,
                          cursor: 'pointer'
                        }}
                        onClick={() => showBadgeInfo(badge)}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.25rem', filter: 'grayscale(1)' }}>{badge.emoji}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af' }}>{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Ranking Personal */}
        {showPersonalRanking && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowPersonalRanking(false)}
          >
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid #374151'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>📊 Mi Ranking Personal</h3>
                <button
                  onClick={() => setShowPersonalRanking(false)}
                  style={{
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Ordenamiento */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setRankingSortMode('rating')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: rankingSortMode === 'rating' ? '#fbbf24' : '#374151',
                    color: rankingSortMode === 'rating' ? '#1a1a1a' : '#e5e7eb',
                    border: '1px solid #4b5563',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  ⭐ Por Puntuación
                </button>
                <button
                  onClick={() => setRankingSortMode('date')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: rankingSortMode === 'date' ? '#fbbf24' : '#374151',
                    color: rankingSortMode === 'date' ? '#1a1a1a' : '#e5e7eb',
                    border: '1px solid #4b5563',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  📅 Por Fecha
                </button>
              </div>

              {/* Lista de valoraciones */}
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[...recentRatings]
                  .sort((a, b) => {
                    if (rankingSortMode === 'rating') {
                      return b.rating - a.rating
                    } else {
                      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    }
                  })
                  .map((rating, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#374151',
                        borderRadius: '0.5rem',
                        border: '1px solid #4b5563'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rating.name}</div>
                        <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                          {renderStars(rating.rating)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {formatDate(rating.created_at)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
