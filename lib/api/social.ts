import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface UserProfile {
  id: string
  username: string
  level?: number
  avatar_url?: string
  total_reviews?: number
  bio?: string
  is_following?: boolean
}

export interface UserActivity {
  id: string
  user_id: string
  username: string
  avatar_url?: string
  activity_type: 'review_created' | 'badge_unlocked' | 'level_up' | 'top_five_updated'
  description: string
  burger_id?: string
  burger_name?: string
  created_at: string
}

/**
 * Seguir a un usuario
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    // Validar que no sea a sí mismo
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself')
    }

    // Verificar que no exista ya el follow
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single()

    if (existing) {
      return true // Ya sigue
    }

    // Crear follow
    const { error: followError } = await supabase.from('follows').insert({
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date().toISOString(),
    })

    if (followError) {
      throw followError
    }

    // Incrementar followers count
    const { data: followedUser } = await supabase
      .from('profiles')
      .select('followers_count')
      .eq('id', followingId)
      .single()

    if (followedUser) {
      await supabase
        .from('profiles')
        .update({ followers_count: (followedUser.followers_count || 0) + 1 })
        .eq('id', followingId)
    }

    // Incrementar following count
    const { data: followerUser } = await supabase
      .from('profiles')
      .select('following_count')
      .eq('id', followerId)
      .single()

    if (followerUser) {
      await supabase
        .from('profiles')
        .update({ following_count: (followerUser.following_count || 0) + 1 })
        .eq('id', followerId)
    }

    // Crear notificación
    await supabase.from('notifications').insert({
      user_id: followingId,
      type: 'new_follower',
      from_user_id: followerId,
      message: 'has empezado a seguirte',
      read: false,
      created_at: new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}

/**
 * Dejar de seguir a un usuario
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)

    if (deleteError) {
      throw deleteError
    }

    // Decrementar followers count
    const { data: followedUser } = await supabase
      .from('profiles')
      .select('followers_count')
      .eq('id', followingId)
      .single()

    if (followedUser && followedUser.followers_count > 0) {
      await supabase
        .from('profiles')
        .update({ followers_count: followedUser.followers_count - 1 })
        .eq('id', followingId)
    }

    // Decrementar following count
    const { data: followerUser } = await supabase
      .from('profiles')
      .select('following_count')
      .eq('id', followerId)
      .single()

    if (followerUser && followerUser.following_count > 0) {
      await supabase
        .from('profiles')
        .update({ following_count: followerUser.following_count - 1 })
        .eq('id', followerId)
    }

    return true
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}

/**
 * Obtiene lista de seguidores
 */
export async function getFollowers(userId: string, page = 1, pageSize = 20) {
  try {
    const offset = (page - 1) * pageSize

    const { data: followers, error } = await supabase
      .from('follows')
      .select(
        `
        follower_id,
        followers:follower_id (
          id,
          username,
          level,
          avatar_url,
          total_reviews,
          bio
        )
      `
      )
      .eq('following_id', userId)
      .range(offset, offset + pageSize - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (followers || [])
      .map((f: any) => f.followers)
      .filter(Boolean) as UserProfile[]
  } catch (error) {
    console.error('Error getting followers:', error)
    return []
  }
}

/**
 * Obtiene lista de usuarios que sigue
 */
export async function getFollowing(userId: string, page = 1, pageSize = 20) {
  try {
    const offset = (page - 1) * pageSize

    const { data: following, error } = await supabase
      .from('follows')
      .select(
        `
        following_id,
        following:following_id (
          id,
          username,
          level,
          avatar_url,
          total_reviews,
          bio
        )
      `
      )
      .eq('follower_id', userId)
      .range(offset, offset + pageSize - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (following || [])
      .map((f: any) => f.following)
      .filter(Boolean) as UserProfile[]
  } catch (error) {
    console.error('Error getting following:', error)
    return []
  }
}

/**
 * Verifica si usuario A sigue a usuario B
 */
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}

/**
 * Obtiene sugerencias de usuarios a seguir
 */
export async function getUserSuggestions(userId: string, limit = 10) {
  try {
    // 1. Obtener el top burger del usuario actual
    const { data: topBurger } = await supabase
      .from('user_top_burgers')
      .select('ordered_burger_ids')
      .eq('user_id', userId)
      .single()

    const topBurgerId = topBurger?.ordered_burger_ids?.[0]

    // 2. Encontrar otros usuarios con el mismo top burger (gustos similares)
    let similarUsers: string[] = []
    if (topBurgerId) {
      const { data: otherReviews } = await supabase
        .from('reviews')
        .select('user_id')
        .eq('burger_id', topBurgerId)
        .neq('user_id', userId)
        .limit(50)

      similarUsers = otherReviews?.map((r) => r.user_id) || []
    }

    // 3. Obtener usuarios a sugerir (excluir a quienes ya sigue)
    const { data: alreadyFollowing } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    const followingIds = new Set(alreadyFollowing?.map((f) => f.following_id) || [])
    followingIds.add(userId) // No sugerir a sí mismo

    // 4. Priorizar por:
    // - Usuarios con gustos similares (similar burgers)
    // - Top reviewers (más reviews)
    // - Friends of friends

    const { data: suggestions } = await supabase
      .from('profiles')
      .select('id, username, level, avatar_url, total_reviews, bio')
      .not('id', 'in', `(${Array.from(followingIds).join(',')})`)
      .order('total_reviews', { ascending: false })
      .limit(limit)

    // Reordenar para priorizar similares
    const suggestionArray = suggestions || []
    const reordered = [
      ...suggestionArray.filter((s) => similarUsers.includes(s.id)),
      ...suggestionArray.filter((s) => !similarUsers.includes(s.id)),
    ].slice(0, limit)

    return reordered as UserProfile[]
  } catch (error) {
    console.error('Error getting user suggestions:', error)
    return []
  }
}

/**
 * Obtiene feed de actividad de usuarios que sigue
 */
export async function getUserActivity(
  userId: string,
  followingOnly = true,
  limit = 20
): Promise<UserActivity[]> {
  try {
    let query = supabase.from('user_activity').select(
      `
        id,
        user_id,
        username,
        avatar_url,
        activity_type,
        description,
        burger_id,
        burger_name,
        created_at
      `
    )

    if (followingOnly) {
      // Obtener IDs de usuarios que sigue
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId)

      const followingIds = following?.map((f) => f.following_id) || []

      if (followingIds.length === 0) {
        return []
      }

      query = query.in('user_id', followingIds)
    }

    const { data } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    return (data || []) as UserActivity[]
  } catch (error) {
    console.error('Error getting user activity:', error)
    return []
  }
}

/**
 * Registra una actividad del usuario (llamar cuando hace algo importante)
 */
export async function logUserActivity(
  userId: string,
  username: string,
  activityType: 'review_created' | 'badge_unlocked' | 'level_up' | 'top_five_updated',
  description: string,
  burgerId?: string,
  burgerName?: string
) {
  try {
    await supabase.from('user_activity').insert({
      user_id: userId,
      username,
      activity_type: activityType,
      description,
      burger_id: burgerId,
      burger_name: burgerName,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}
