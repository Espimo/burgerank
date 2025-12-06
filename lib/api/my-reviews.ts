import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface DetailedRatings {
  bread?: number
  meat?: number
  sauce?: number
  toppings?: number
  presentation?: number
  price_value?: number
  overall_experience?: number
}

export interface Review {
  id: string
  user_id: string
  burger_id: string
  burger?: {
    id: string
    name: string
    type: string
    average_rating: number
  }
  restaurant_id: string
  restaurant?: {
    id: string
    name: string
    city: string
  }
  overall_rating: number
  detailed_ratings?: DetailedRatings
  comment?: string
  experience_tags?: string[]
  images?: string[]
  verified: boolean
  likes_count: number
  created_at: string
  updated_at: string
}

/**
 * Obtiene las valoraciones del usuario
 */
export async function getMyReviews(
  userId: string,
  limit = 20,
  offset = 0
): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        `
        id,
        user_id,
        burger_id,
        burger:burgers (
          id,
          name,
          type,
          average_rating
        ),
        restaurant_id,
        restaurant:restaurants (
          id,
          name,
          city
        ),
        overall_rating,
        detailed_ratings,
        comment,
        experience_tags,
        images,
        verified,
        likes_count,
        created_at,
        updated_at
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return (data as Review[]) || []
  } catch (error) {
    console.error('Get my reviews error:', error)
    return []
  }
}

/**
 * Actualiza una valoración existente
 */
export async function updateReview(
  reviewId: string,
  data: Partial<Review>
): Promise<Review | null> {
  try {
    const { data: updated, error } = await supabase
      .from('reviews')
      .update({
        overall_rating: data.overall_rating,
        detailed_ratings: data.detailed_ratings,
        comment: data.comment,
        experience_tags: data.experience_tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .select()
      .single()

    if (error) {
      console.error('Error updating review:', error)
      throw error
    }

    return updated as Review
  } catch (error) {
    console.error('Update review error:', error)
    throw error
  }
}

/**
 * Elimina una valoración
 * Valida propiedad, elimina fotos, actualiza stats
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    // Obtener review primero
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('id, burger_id, user_id, images, overall_rating, likes_count')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      throw new Error('Review no encontrada')
    }

    // Iniciar transacción (en Supabase, hacemos múltiples operaciones)
    // 1. Eliminar fotos de Storage
    if (review.images && review.images.length > 0) {
      const paths = review.images.map((url: string) => {
        const path = url.split('/').pop()
        return path
      })

      for (const path of paths) {
        if (path) {
          await supabase.storage.from('reviews').remove([path])
        }
      }
    }

    // 2. Eliminar review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (deleteError) {
      throw deleteError
    }

    // 3. Actualizar rating promedio de la burger
    const { data: burgerReviews } = await supabase
      .from('reviews')
      .select('overall_rating')
      .eq('burger_id', review.burger_id)

    if (burgerReviews) {
      const avgRating =
        burgerReviews.length > 0
          ? burgerReviews.reduce((sum: number, r: any) => sum + (r.overall_rating || 0), 0) /
            burgerReviews.length
          : 0

      await supabase
        .from('burgers')
        .update({ average_rating: avgRating })
        .eq('id', review.burger_id)
    }

    // 4. Restar puntos al usuario (-50 por eliminación)
    await supabase.rpc('subtract_points', {
      user_id: review.user_id,
      points: 50,
    })

    // 5. Actualizar contador de reviews del usuario
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })
      .eq('user_id', review.user_id)

    await supabase
      .from('profiles')
      .update({ total_reviews: reviewCount })
      .eq('id', review.user_id)

    return true
  } catch (error) {
    console.error('Delete review error:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de reviews del usuario
 */
export async function getReviewStats(userId: string) {
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('overall_rating, created_at, restaurant_id, likes_count, burger_id')
      .eq('user_id', userId)

    if (!reviews || reviews.length === 0) {
      return {
        avgRating: 0,
        totalReviews: 0,
        mostPopular: null,
        mostVisitedRestaurant: null,
        monthWithMostReviews: null,
        totalLikes: 0,
      }
    }

    // Promedio de rating
    const avgRating =
      reviews.reduce((sum: number, r: any) => sum + (r.overall_rating || 0), 0) / reviews.length

    // Review más popular (más likes)
    const mostPopular = reviews.reduce((max: any, r: any) =>
      (r.likes_count || 0) > (max.likes_count || 0) ? r : max
    )

    // Restaurante más visitado
    const restaurantCounts = new Map<string, number>()
    reviews.forEach((r: any) => {
      restaurantCounts.set(r.restaurant_id, (restaurantCounts.get(r.restaurant_id) || 0) + 1)
    })
    const mostVisitedRestaurant = Array.from(restaurantCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0]

    // Mes con más reviews
    const monthCounts = new Map<string, number>()
    reviews.forEach((r: any) => {
      const date = new Date(r.created_at)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1)
    })
    const monthWithMostReviews = Array.from(monthCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]

    // Total likes
    const totalLikes = reviews.reduce((sum: number, r: any) => sum + (r.likes_count || 0), 0)

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      mostPopular,
      mostVisitedRestaurant,
      monthWithMostReviews,
      totalLikes,
    }
  } catch (error) {
    console.error('Get review stats error:', error)
    return {
      avgRating: 0,
      totalReviews: 0,
      mostPopular: null,
      mostVisitedRestaurant: null,
      monthWithMostReviews: null,
      totalLikes: 0,
    }
  }
}
