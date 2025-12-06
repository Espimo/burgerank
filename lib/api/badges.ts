import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Badge {
  id: string
  type: string
  name: string
  description: string
  icon_emoji: string
  how_to_unlock: string
  points_reward: number
  rarity_percentage?: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  unlocked: boolean
  progress: number
  target: number
  unlockedAt?: string
  badge: Badge
}

// Definición de badges disponibles
export const BADGE_DEFINITIONS = {
  // Badges de explorador
  turista_burger: {
    name: 'Turista Burger',
    description: 'Valoraste burgers en 5 ciudades diferentes',
    icon_emoji: '🌍',
    how_to_unlock: 'Valora burgers en 5 ciudades diferentes',
    points_reward: 50,
    target: 5,
  },
  trotamundos: {
    name: 'Trotamundos',
    description: 'Valoraste burgers en 10 ciudades diferentes',
    icon_emoji: '✈️',
    how_to_unlock: 'Valora burgers en 10 ciudades diferentes',
    points_reward: 100,
    target: 10,
  },
  infiel: {
    name: 'Infiel',
    description: 'Valoraste en 20 restaurantes diferentes',
    icon_emoji: '💔',
    how_to_unlock: 'Valora burgers en 20 restaurantes diferentes',
    points_reward: 75,
    target: 20,
  },

  // Badges de crítico
  primera_review: {
    name: 'Primera Valoración',
    description: 'Publicaste tu primera valoración',
    icon_emoji: '✨',
    how_to_unlock: 'Publica tu primera valoración',
    points_reward: 25,
    target: 1,
  },
  critico_novato: {
    name: 'Crítico Novato',
    description: 'Publicaste 10 valoraciones',
    icon_emoji: '📝',
    how_to_unlock: 'Publica 10 valoraciones',
    points_reward: 50,
    target: 10,
  },
  critico_experto: {
    name: 'Crítico Experto',
    description: 'Publicaste 50 valoraciones',
    icon_emoji: '🎓',
    how_to_unlock: 'Publica 50 valoraciones',
    points_reward: 100,
    target: 50,
  },
  juez_supremo: {
    name: 'Juez Supremo',
    description: 'Publicaste 100 valoraciones',
    icon_emoji: '⚖️',
    how_to_unlock: 'Publica 100 valoraciones',
    points_reward: 200,
    target: 100,
  },
  paparazzi: {
    name: 'Paparazzi',
    description: 'Subiste 50 fotos en tus valoraciones',
    icon_emoji: '📸',
    how_to_unlock: 'Sube fotos en 50 valoraciones',
    points_reward: 75,
    target: 50,
  },

  // Badges de especialista
  veggie_lover: {
    name: 'Veggie Lover',
    description: 'Valoraste 10 burgers veganas',
    icon_emoji: '🥗',
    how_to_unlock: 'Valora 10 burgers veganas',
    points_reward: 50,
    target: 10,
  },
  sin_gluten_pro: {
    name: 'Sin Gluten Pro',
    description: 'Valoraste 10 burgers sin gluten',
    icon_emoji: '🌾',
    how_to_unlock: 'Valora 10 burgers sin gluten',
    points_reward: 50,
    target: 10,
  },
  picante_expert: {
    name: 'Picante Expert',
    description: 'Valoraste 10 burgers picantes',
    icon_emoji: '🌶️',
    how_to_unlock: 'Valora 10 burgers picantes',
    points_reward: 50,
    target: 10,
  },
  cazador_gangas: {
    name: 'Cazador de Gangas',
    description: 'Encontraste 10 burgers económicas',
    icon_emoji: '💰',
    how_to_unlock: 'Valora 10 burgers con precio < €8',
    points_reward: 50,
    target: 10,
  },
  gourmet: {
    name: 'Gourmet',
    description: 'Valoraste 10 burgers premium',
    icon_emoji: '👑',
    how_to_unlock: 'Valora 10 burgers premium (> €15)',
    points_reward: 75,
    target: 10,
  },

  // Badges sociales
  influyente: {
    name: 'Influyente',
    description: 'Conseguiste 10 seguidores',
    icon_emoji: '📣',
    how_to_unlock: 'Consigue 10 seguidores',
    points_reward: 50,
    target: 10,
  },
  estrella: {
    name: 'Estrella',
    description: 'Conseguiste 50 seguidores',
    icon_emoji: '⭐',
    how_to_unlock: 'Consigue 50 seguidores',
    points_reward: 100,
    target: 50,
  },
  networker: {
    name: 'Networker',
    description: 'Sigues a 20 usuarios',
    icon_emoji: '🤝',
    how_to_unlock: 'Sigue a 20 usuarios',
    points_reward: 50,
    target: 20,
  },

  // Badges de dedicación
  perfeccionista: {
    name: 'Perfeccionista',
    description: 'Diste 10 puntuaciones de 5 estrellas',
    icon_emoji: '⭐⭐⭐⭐⭐',
    how_to_unlock: 'Valora 10 burgers con 5 estrellas',
    points_reward: 75,
    target: 10,
  },
  exigente: {
    name: 'Exigente',
    description: 'Diste 10 puntuaciones de 1 estrella',
    icon_emoji: '👎',
    how_to_unlock: 'Valora 10 burgers con 1 estrella',
    points_reward: 50,
    target: 10,
  },
  top_reviewer: {
    name: 'Top Reviewer',
    description: 'Recibiste 100 likes en tus valoraciones',
    icon_emoji: '👍',
    how_to_unlock: 'Recibe 100 likes en tus valoraciones',
    points_reward: 100,
    target: 100,
  },

  // Badges de Match Master
  rookie_matcher: {
    name: 'Rookie Matcher',
    description: 'Completaste 10 Burger Matches',
    icon_emoji: '🎮',
    how_to_unlock: 'Completa 10 Burger Matches',
    points_reward: 50,
    target: 10,
  },
  match_addict: {
    name: 'Match Addict',
    description: 'Completaste 50 Burger Matches',
    icon_emoji: '🕹️',
    how_to_unlock: 'Completa 50 Burger Matches',
    points_reward: 100,
    target: 50,
  },
}

/**
 * Obtiene badges del usuario
 */
export async function getUserBadges(userId: string, onlyUnlocked = false): Promise<UserBadge[]> {
  try {
    let query = supabase
      .from('user_badges')
      .select(
        `
        id,
        user_id,
        badge_id,
        unlocked,
        progress,
        target,
        unlockedAt,
        badge:badges (*)
      `
      )
      .eq('user_id', userId)

    if (onlyUnlocked) {
      query = query.eq('unlocked', true)
    }

    const { data, error } = await query.order('unlocked', { ascending: false }).order('unlockedAt', { ascending: false })

    if (error) {
      console.error('Error fetching user badges:', error)
      return []
    }

    return (data as UserBadge[]) || []
  } catch (error) {
    console.error('Get user badges error:', error)
    return []
  }
}

/**
 * Obtiene el progreso de un badge específico
 */
export async function getBadgeProgress(userId: string, badgeId: string) {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('progress, target, unlocked, unlockedAt')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single()

    if (error) {
      return { progress: 0, target: 0, unlocked: false }
    }

    return data
  } catch (error) {
    console.error('Get badge progress error:', error)
    return { progress: 0, target: 0, unlocked: false }
  }
}

/**
 * Verifica y desbloquea badges si es necesario
 */
export async function checkAndUnlockBadges(userId: string, eventType: string) {
  try {
    // Esta función se llama desde el backend después de eventos importantes
    // Se puede implementar como una función Edge de Supabase
    console.log(`Checking badges for user ${userId} after event: ${eventType}`)
    return { success: true }
  } catch (error) {
    console.error('Check and unlock badges error:', error)
    return { success: false }
  }
}
