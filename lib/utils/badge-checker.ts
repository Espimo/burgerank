import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type BadgeCheckEvent =
  | 'review_submitted'
  | 'photo_added'
  | 'rating_given'
  | 'follower_added'
  | 'follower_count_reached'
  | 'like_received'
  | 'match_completed'

/**
 * Verifica y desbloquea badges basado en eventos
 */
export async function checkBadgesOnEvent(userId: string, eventType: BadgeCheckEvent, data?: Record<string, any>) {
  try {
    const stats = await getUserStats(userId)
    const userBadges = await getUserBadges(userId)

    const badgesToCheck: { badgeId: string; currentProgress: number }[] = []

    switch (eventType) {
      case 'review_submitted':
        badgesToCheck.push(
          { badgeId: 'primera_review', currentProgress: stats.totalReviews },
          { badgeId: 'critico_novato', currentProgress: stats.totalReviews },
          { badgeId: 'critico_experto', currentProgress: stats.totalReviews },
          { badgeId: 'juez_supremo', currentProgress: stats.totalReviews }
        )
        break

      case 'photo_added':
        badgesToCheck.push({ badgeId: 'paparazzi', currentProgress: stats.totalPhotos || 0 })
        break

      case 'rating_given':
        if (data?.rating === 5) {
          badgesToCheck.push({ badgeId: 'perfeccionista', currentProgress: stats.fiveStarRatings || 0 })
        }
        if (data?.rating === 1) {
          badgesToCheck.push({ badgeId: 'exigente', currentProgress: stats.oneStarRatings || 0 })
        }
        if (data?.category === 'vegetarian') {
          badgesToCheck.push({ badgeId: 'veggie_lover', currentProgress: stats.vegetarianReviews || 0 })
        }
        if (data?.category === 'glutenfree') {
          badgesToCheck.push({ badgeId: 'sin_gluten_pro', currentProgress: stats.glutenFreeReviews || 0 })
        }
        if (data?.category === 'spicy') {
          badgesToCheck.push({ badgeId: 'picante_expert', currentProgress: stats.spicyReviews || 0 })
        }
        break

      case 'follower_added':
        badgesToCheck.push(
          { badgeId: 'influyente', currentProgress: stats.followerCount || 0 },
          { badgeId: 'estrella', currentProgress: stats.followerCount || 0 }
        )
        break

      case 'follower_count_reached':
        if (data?.count === 10) {
          badgesToCheck.push({ badgeId: 'influyente', currentProgress: 10 })
        }
        if (data?.count === 50) {
          badgesToCheck.push({ badgeId: 'estrella', currentProgress: 50 })
        }
        break

      case 'like_received':
        badgesToCheck.push({ badgeId: 'top_reviewer', currentProgress: stats.totalLikes || 0 })
        break

      case 'match_completed':
        badgesToCheck.push(
          { badgeId: 'rookie_matcher', currentProgress: stats.matchesCompleted || 0 },
          { badgeId: 'match_addict', currentProgress: stats.matchesCompleted || 0 }
        )
        break
    }

    // Procesar cada badge
    for (const check of badgesToCheck) {
      await tryUnlockBadge(userId, check.badgeId, check.currentProgress, userBadges)
    }

    return { success: true }
  } catch (error) {
    console.error('Badge check error:', error)
    return { success: false }
  }
}

/**
 * Intenta desbloquear un badge si se cumple la condición
 */
async function tryUnlockBadge(
  userId: string,
  badgeId: string,
  currentProgress: number,
  userBadges: Array<{ badge_id: string; unlocked: boolean }>
) {
  try {
    const badgeDef = getBadgeDefinition(badgeId)
    if (!badgeDef) return

    const userBadge = userBadges.find((b) => b.badge_id === badgeId)

    // Si ya está desbloqueado, no hacer nada
    if (userBadge?.unlocked) return

    // Si se alcanzó el target, desbloquear
    if (currentProgress >= badgeDef.target) {
      await supabase
        .from('user_badges')
        .update({
          unlocked: true,
          progress: currentProgress,
          unlockedAt: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('badge_id', badgeId)

      // Otorgar puntos de recompensa
      await supabase.rpc('add_badge_points', {
        user_id: userId,
        points: badgeDef.points_reward,
      })
    } else {
      // Actualizar progreso
      await supabase
        .from('user_badges')
        .update({
          progress: currentProgress,
        })
        .eq('user_id', userId)
        .eq('badge_id', badgeId)
    }
  } catch (error) {
    console.error(`Error unlocking badge ${badgeId}:`, error)
  }
}

/**
 * Obtiene la definición de un badge
 */
function getBadgeDefinition(badgeId: string) {
  const definitions: Record<string, any> = {
    turista_burger: { target: 5, points_reward: 50 },
    trotamundos: { target: 10, points_reward: 100 },
    infiel: { target: 20, points_reward: 75 },
    primera_review: { target: 1, points_reward: 25 },
    critico_novato: { target: 10, points_reward: 50 },
    critico_experto: { target: 50, points_reward: 100 },
    juez_supremo: { target: 100, points_reward: 200 },
    paparazzi: { target: 50, points_reward: 75 },
    veggie_lover: { target: 10, points_reward: 50 },
    sin_gluten_pro: { target: 10, points_reward: 50 },
    picante_expert: { target: 10, points_reward: 50 },
    cazador_gangas: { target: 10, points_reward: 50 },
    gourmet: { target: 10, points_reward: 75 },
    influyente: { target: 10, points_reward: 50 },
    estrella: { target: 50, points_reward: 100 },
    networkker: { target: 20, points_reward: 50 },
    perfeccionista: { target: 10, points_reward: 75 },
    exigente: { target: 10, points_reward: 50 },
    top_reviewer: { target: 100, points_reward: 100 },
    rookie_matcher: { target: 10, points_reward: 50 },
    match_addict: { target: 50, points_reward: 100 },
  }
  return definitions[badgeId]
}

/**
 * Obtiene stats del usuario (helper)
 */
async function getUserStats(userId: string) {
  try {
    // Esta es una versión simplificada
    // En producción, esto vendría de cache o la función getUserStats de user-stats.ts
    const [reviews, followers, likes] = await Promise.all([
      supabase.from('reviews').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('followers').select('id', { count: 'exact' }).eq('follower_id', userId),
      supabase.from('review_likes').select('id', { count: 'exact' }).eq('review_id', userId),
    ])

    return {
      totalReviews: reviews.count || 0,
      totalPhotos: 0, // Calcular desde storage
      fiveStarRatings: 0,
      oneStarRatings: 0,
      vegetarianReviews: 0,
      glutenFreeReviews: 0,
      spicyReviews: 0,
      followerCount: followers.count || 0,
      totalLikes: likes.count || 0,
      matchesCompleted: 0,
    }
  } catch (error) {
    console.error('Get user stats error:', error)
    return {
      totalReviews: 0,
      totalPhotos: 0,
      fiveStarRatings: 0,
      oneStarRatings: 0,
      vegetarianReviews: 0,
      glutenFreeReviews: 0,
      spicyReviews: 0,
      followerCount: 0,
      totalLikes: 0,
      matchesCompleted: 0,
    }
  }
}

/**
 * Obtiene badges del usuario (helper)
 */
async function getUserBadges(userId: string) {
  try {
    const { data, error } = await supabase.from('user_badges').select('badge_id, unlocked').eq('user_id', userId)

    if (error) return []
    return data || []
  } catch (error) {
    console.error('Get user badges error:', error)
    return []
  }
}

/**
 * Inicializa badges para un nuevo usuario
 */
export async function initializeBadgesForUser(userId: string) {
  try {
    const badgeIds = Object.keys({
      turista_burger: true,
      trotamundos: true,
      infiel: true,
      primera_review: true,
      critico_novato: true,
      critico_experto: true,
      juez_supremo: true,
      paparazzi: true,
      veggie_lover: true,
      sin_gluten_pro: true,
      picante_expert: true,
      cazador_gangas: true,
      gourmet: true,
      influyente: true,
      estrella: true,
      networkker: true,
      perfeccionista: true,
      exigente: true,
      top_reviewer: true,
      rookie_matcher: true,
      match_addict: true,
    })

    const badgesToInsert = badgeIds.map((badgeId) => ({
      user_id: userId,
      badge_id: badgeId,
      unlocked: false,
      progress: 0,
      target: 0, // Se cargaría desde la definición
    }))

    const { error } = await supabase.from('user_badges').insert(badgesToInsert)

    if (error) {
      console.error('Error initializing badges:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Initialize badges error:', error)
    return false
  }
}
