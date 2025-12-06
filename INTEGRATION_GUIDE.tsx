/*
  GUÍA DE INTEGRACIÓN: BURGER MATCH & SOCIAL SYSTEM
  ==================================================

  Este archivo proporciona ejemplos prácticos de cómo integrar
  el sistema de Burger Match y Social en diferentes partes de tu aplicación.

*/

// ============================================================================
// 1. INICIALIZAR LA BASE DE DATOS
// ============================================================================

/*
PASO 1: Ejecutar la migración en Supabase

Opción A - Dashboard Supabase:
1. Ir a: Database > SQL Editor > New Query
2. Copiar contenido de: supabase/migrations/20240115_burger_match_social_tables.sql
3. Ejecutar (▶ button)

Opción B - Supabase CLI:
$ cd supabase
$ supabase migration up

Esto creará:
✅ burger_matches table
✅ follows table
✅ user_activity table
✅ Columnas en profiles (followers_count, following_count)
✅ Columnas en burgers (match_score, match_count, match_wins)
✅ Todos los índices y RLS policies
*/

// ============================================================================
// 2. EN LA PÁGINA DE PERFIL PRIVADO
// ============================================================================

/*
Archivo: app/(main)/profile/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PrivateProfileTabs from '@/components/profile/private-profile-tabs'
import { Loader2 } from 'lucide-react'

export default function PrivateProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUserId(session.user.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </main>
    )
  }

  if (!userId) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mi Perfil</h1>
        <PrivateProfileTabs userId={userId} currentUserId={userId} />
      </div>
    </main>
  )
}
*/

// ============================================================================
// 3. EN EL LAYOUT DE PERFILES
// ============================================================================

/*
Archivo: app/(main)/profile/layout.tsx

import { ReactNode } from 'react'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  )
}
*/

// ============================================================================
// 4. FLUJO DE LOGEAR ACTIVIDAD DE USUARIO
// ============================================================================

/*
Cuando un usuario haga ciertas acciones, registra la actividad:

Archivo: app/(main)/burgers/[id]/page.tsx (donde se hace review)

'use client'

import { logUserActivity } from '@/lib/api/social'

async function handleReviewSubmit(reviewData: ReviewData) {
  // ... guardar review en DB ...
  
  // Log activity
  await logUserActivity(
    userId,
    'review_created',
    `Calificó "${burger.name}" con ${reviewData.rating}⭐`,
    {
      burger_name: burger.name,
      burger_id: burger.id,
      restaurant_name: burger.restaurant?.name,
      rating: reviewData.rating
    }
  )
  
  // Toast de éxito
  toast.success('Review guardado')
}

// En otros eventos:

// Cuando sube de nivel:
await logUserActivity(
  userId,
  'level_up',
  `¡Subió a nivel ${newLevel}!`,
  { new_level: newLevel, old_level: oldLevel }
)

// Cuando desbloquea insignia:
await logUserActivity(
  userId,
  'badge_unlocked',
  `Desbloqueó insignia: ${badge.name}`,
  { badge_id: badge.id, badge_name: badge.name }
)

// Cuando actualiza top 5:
await logUserActivity(
  userId,
  'top_five_updated',
  'Actualizó su top 5',
  { top_five: updatedTopFive }
)
*/

// ============================================================================
// 5. MOSTRAR ESTADÍSTICAS DE BURGER MATCH EN PROFILE HEADER
// ============================================================================

/*
'use client'

import { useEffect, useState } from 'react'
import { getMatchStats } from '@/lib/api/burger-match'

interface MatchStats {
  totalMatches: number
  todayMatches: number
  mostWins: string
  winRate: number
  currentStreak: number
}

export function ProfileHeader({ userId }: { userId: string }) {
  const [stats, setStats] = useState<MatchStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getMatchStats(userId)
        setStats(data)
      } catch (error) {
        console.error('Error loading match stats:', error)
      }
    }

    loadStats()
  }, [userId])

  if (!stats) return null

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600">{stats.totalMatches}</div>
        <div className="text-xs text-gray-600">Matches Totales</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{stats.todayMatches}</div>
        <div className="text-xs text-gray-600">Hoy</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{stats.winRate.toFixed(1)}%</div>
        <div className="text-xs text-gray-600">Win Rate</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">🔥 {stats.currentStreak}</div>
        <div className="text-xs text-gray-600">Racha Actual</div>
      </div>
    </div>
  )
}
*/

// ============================================================================
// 6. NOTIFICACIONES PARA NUEVOS FOLLOWERS
// ============================================================================

/*
Cuando alguien sigue al usuario, mostrar notificación:

Opción A - Toast de la aplicación (inmediato)
Opción B - Notificación Push (background)

import { followUser } from '@/lib/api/social'
import { toast } from 'sonner'

async function handleFollow(followingId: string) {
  try {
    await followUser(currentUserId, followingId)
    toast.success(`¡Ahora sigues a este usuario!`)
    
    // Opcional: Notificación para el otro usuario
    // await sendNotification(followingId, `${currentUser.username} te está siguiendo`)
  } catch (error) {
    toast.error('Error al seguir usuario')
  }
}
*/

// ============================================================================
// 7. INTEGRACIÓN CON REAL-TIME SUPABASE (FUTURO)
// ============================================================================

/*
Para agregar live updates cuando otros usuarios realizan acciones:

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useLiveActivity(userId: string) {
  const supabase = createClient()

  useEffect(() => {
    const subscription = supabase
      .channel('user-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity'
        },
        (payload) => {
          console.log('New activity:', payload.new)
          // Update state con nueva actividad
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, userId])
}

// Uso:
const YourActivityFeed = ({ userId }: { userId: string }) => {
  useLiveActivity(userId)
  
  return <UserActivityFeed userId={userId} />
}
*/

// ============================================================================
// 8. CUSTOM HOOKS PARA INTEGRACIÓN
// ============================================================================

/*
Archivo: hooks/useBurgerMatch.ts

import { useCallback, useEffect, useState } from 'react'
import { getMatchPair, submitMatch, getMatchStats } from '@/lib/api/burger-match'

export function useBurgerMatch(userId: string) {
  const [pair, setPair] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionMatches, setSessionMatches] = useState(0)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadNextPair()
    loadStats()
  }, [userId])

  const loadNextPair = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getMatchPair(userId)
      setPair(data)
    } catch (error) {
      console.error('Error loading pair:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const loadStats = useCallback(async () => {
    try {
      const data = await getMatchStats(userId)
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [userId])

  const handleMatch = useCallback(
    async (winnerId: string) => {
      if (!pair) return

      try {
        await submitMatch(
          userId,
          pair.burger_a.id,
          pair.burger_b.id,
          winnerId
        )
        setSessionMatches((prev) => prev + 1)
        await loadNextPair()
        await loadStats()
      } catch (error) {
        console.error('Error submitting match:', error)
      }
    },
    [userId, pair, loadNextPair, loadStats]
  )

  return {
    pair,
    isLoading,
    sessionMatches,
    stats,
    handleMatch,
  }
}

// Uso en componente:
export function MyMatchGame({ userId }: { userId: string }) {
  const { pair, sessionMatches, stats, handleMatch } = useBurgerMatch(userId)

  return (
    <div>
      <h2>Matches: {sessionMatches}</h2>
      {pair && (
        <div className="flex gap-4">
          <BurgerCard burger={pair.burger_a} onSelect={() => handleMatch(pair.burger_a.id)} />
          <BurgerCard burger={pair.burger_b} onSelect={() => handleMatch(pair.burger_b.id)} />
        </div>
      )}
      <Stats stats={stats} />
    </div>
  )
}
*/

// ============================================================================
// 9. BÚSQUEDA DE USUARIOS CON FILTROS
// ============================================================================

/*
Archivo: components/search/user-search.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import UserFollowCard from '@/components/profile/user-follow-card'

export function UserSearch() {
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const searchUsers = async () => {
      setIsLoading(true)
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, level, total_reviews, bio')
          .ilike('username', `%${searchQuery}%`)
          .limit(10)

        setResults(data || [])
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, supabase])

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300"
      />

      <div className="mt-4 space-y-2">
        {results.map((user) => (
          <UserFollowCard key={user.id} user={user} />
        ))}
      </div>

      {isLoading && <p>Cargando...</p>}
      {!isLoading && searchQuery && results.length === 0 && (
        <p className="text-gray-500">No se encontraron usuarios</p>
      )}
    </div>
  )
}
*/

// ============================================================================
// 10. EXPORTAR DATOS PARA ANÁLISIS
// ============================================================================

/*
Para obtener datos agregados:

import { createClient } from '@/lib/supabase/server'

export async function getUserStats(userId: string) {
  const supabase = createClient()

  // Burger Match Stats
  const { data: matches } = await supabase
    .from('burger_matches')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)

  // Social Stats
  const { data: followers } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('following_id', userId)

  const { data: following } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('follower_id', userId)

  return {
    totalMatches: matches?.length || 0,
    followers: followers?.length || 0,
    following: following?.length || 0,
  }
}
*/

export const INTEGRATION_GUIDE = {
  database: 'Run migration: 20240115_burger_match_social_tables.sql',
  components: [
    'burger-match-section',
    'followers-section',
    'discover-users',
    'user-activity-feed',
    'public-profile-header',
    'public-top-five',
    'public-reviews',
  ],
  apis: [
    'lib/api/burger-match.ts',
    'lib/api/social.ts',
    'lib/utils/elo-algorithm.ts',
  ],
}
