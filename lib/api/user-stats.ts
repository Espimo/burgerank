import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface UserProfile {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
  bio?: string
  city?: string
  created_at?: string
  preferred_category?: string
}

export interface UserStats {
  totalReviews: number
  totalPoints: number
  followers?: number
  following?: number
  totalLikes?: number
  favoriteBurger?: {
    id: string
    name: string
    rating: number
  }
  favoriteRestaurant?: {
    id: string
    name: string
    visitCount: number
  }
  favoriteCategory?: string
  unlockedBadgesCount: number
  averageRating: number
}

/**
 * Obtiene estadísticas del usuario
 * Cachea resultados por 5 minutos
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Total de reviews
    const { count: totalReviews } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Total points from user_points table
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('total_points, available_points')
      .eq('user_id', userId)
      .single()

    const totalPoints = pointsData?.total_points || 0

    // Burger favorita (rating más alto)
    const { data: favoriteBurgerData } = await supabase
      .from('reviews')
      .select(
        `
        burger:burgers (
          id,
          name,
          average_rating
        )
      `
      )
      .eq('user_id', userId)
      .order('overall_rating', { ascending: false })
      .limit(1)
      .single()

    const favoriteBurger = favoriteBurgerData?.burger && Array.isArray(favoriteBurgerData.burger) && favoriteBurgerData.burger.length > 0
      ? {
          id: favoriteBurgerData.burger[0].id,
          name: favoriteBurgerData.burger[0].name,
          rating: favoriteBurgerData.burger[0].average_rating,
        }
      : undefined

    // Restaurante favorito (más reviews)
    const { data: favoriteRestaurantData } = await supabase
      .from('reviews')
      .select(
        `
        burger:burgers (
          restaurant:restaurants (
            id,
            name
          )
        )
      `
      )
      .eq('user_id', userId)

    const restaurantCounts = new Map<string, { id: string; name: string; count: number }>()
    favoriteRestaurantData?.forEach((review) => {
      const burger = review.burger && Array.isArray(review.burger) && review.burger.length > 0 ? review.burger[0] : null
      const restaurant = burger?.restaurant && Array.isArray(burger.restaurant) && burger.restaurant.length > 0 ? burger.restaurant[0] : null
      if (restaurant && restaurant.id) {
        const key = restaurant.id
        if (restaurantCounts.has(key)) {
          const entry = restaurantCounts.get(key)!
          entry.count += 1
        } else {
          restaurantCounts.set(key, {
            id: restaurant.id,
            name: restaurant.name,
            count: 1,
          })
        }
      }
    })

    const favoriteRestaurant = Array.from(restaurantCounts.values()).sort((a, b) => b.count - a.count)[0]
      ? {
          id: Array.from(restaurantCounts.values()).sort((a, b) => b.count - a.count)[0].id,
          name: Array.from(restaurantCounts.values()).sort((a, b) => b.count - a.count)[0].name,
          visitCount: Array.from(restaurantCounts.values()).sort((a, b) => b.count - a.count)[0].count,
        }
      : undefined

    // Categoría favorita
    const { data: categoryData } = await supabase
      .from('reviews')
      .select(
        `
        category_tags
      `
      )
      .eq('user_id', userId)

    const categoryCount = new Map<string, number>()
    categoryData?.forEach((review) => {
      Object.values(review.category_tags || {}).forEach((tags: any) => {
        (tags as string[]).forEach((tag) => {
          categoryCount.set(tag, (categoryCount.get(tag) || 0) + 1)
        })
      })
    })

    const favoriteCategory = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]

    // Badges count
    const { count: unlockedBadgesCount } = await supabase
      .from('user_badges')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('unlocked', true)

    // Promedio de ratings dado
    const { data: ratingsData } = await supabase
      .from('reviews')
      .select('overall_rating')
      .eq('user_id', userId)

    const averageRating =
      ratingsData && ratingsData.length > 0
        ? ratingsData.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / ratingsData.length
        : 0

    return {
      totalReviews: totalReviews || 0,
      totalPoints,
      favoriteBurger,
      favoriteRestaurant,
      favoriteCategory,
      unlockedBadgesCount: unlockedBadgesCount || 0,
      averageRating: Math.round(averageRating * 10) / 10,
    }
  } catch (error) {
    console.error('Get user stats error:', error)
    return {
      totalReviews: 0,
      totalPoints: 0,
      unlockedBadgesCount: 0,
      averageRating: 0,
    }
  }
}

/**
 * Obtiene información pública del usuario para mostrar en perfil
 */
export async function getUserPublicProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        full_name,
        email,
        bio,
        city,
        avatar_url,
        preferred_category,
        created_at
      `
      )
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      bio: data.bio,
      city: data.city,
      avatar_url: data.avatar_url,
      preferred_category: data.preferred_category,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error('Get user public profile error:', error)
    return null
  }
}

/**
 * Obtiene últimas reviews del usuario
 */
export async function getUserRecentReviews(userId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        `
        id,
        overall_rating,
        comment,
        created_at,
        image_urls,
        burger:burgers (
          id,
          name,
          image_url,
          restaurant:restaurants (
            id,
            name
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return data || []
  } catch (error) {
    console.error('Get user recent reviews error:', error)
    return []
  }
}
