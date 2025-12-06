import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AntiSpamResult {
  allowed: boolean
  reason?: string
  remainingToday?: number
}

/**
 * Verifica el límite diario de reviews (máximo 3 por día)
 */
export async function checkDailyLimit(userId: string): Promise<AntiSpamResult> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())

    if (error) {
      console.error('Error checking daily limit:', error)
      return { allowed: false, reason: 'Error al verificar límite' }
    }

    const count = data?.length || 0
    const limit = 3
    const remaining = Math.max(0, limit - count)

    if (count >= limit) {
      return {
        allowed: false,
        reason: `Has alcanzado el límite de ${limit} valoraciones por día`,
        remainingToday: 0,
      }
    }

    return {
      allowed: true,
      remainingToday: remaining,
    }
  } catch (error) {
    console.error('Check daily limit error:', error)
    return { allowed: false, reason: 'Error al verificar límite' }
  }
}

/**
 * Valida que el usuario esté cerca del restaurante (radio 5km)
 * Nota: Esta es una verificación básica. En producción, usar Google Places API
 */
export async function validateGeolocation(
  userId: string,
  restaurantId: string,
  userLat: number,
  userLng: number
): Promise<AntiSpamResult> {
  try {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('latitude, longitude')
      .eq('id', restaurantId)
      .single()

    if (error || !restaurant) {
      return { allowed: false, reason: 'Restaurante no encontrado' }
    }

    const EARTH_RADIUS_KM = 6371
    const dLat = ((restaurant.latitude - userLat) * Math.PI) / 180
    const dLng = ((restaurant.longitude - userLng) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((restaurant.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = EARTH_RADIUS_KM * c

    const maxDistance = 5 // km
    if (distance > maxDistance) {
      return {
        allowed: false,
        reason: `Debes estar dentro de ${maxDistance}km del restaurante para valorar`,
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Validate geolocation error:', error)
    // En caso de error, permitir (no bloquear por problemas técnicos)
    return { allowed: true }
  }
}

/**
 * Marca una review como verificada (después de validar ticket/imagen)
 */
export async function markAsVerified(reviewId: string): Promise<AntiSpamResult> {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', reviewId)

    if (error) {
      return { allowed: false, reason: 'Error al marcar como verificada' }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Mark as verified error:', error)
    return { allowed: false, reason: 'Error al marcar como verificada' }
  }
}

/**
 * Verifica si el usuario ya ha valorado esta burger recientemente
 */
export async function checkDuplicateReview(
  userId: string,
  burgerId: string
): Promise<AntiSpamResult> {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('burger_id', burgerId)
      .gte('created_at', sevenDaysAgo.toISOString())

    if (error) {
      return { allowed: false, reason: 'Error al verificar reviews previas' }
    }

    if (data && data.length > 0) {
      return {
        allowed: false,
        reason: 'Ya has valorado esta burger recientemente. Intenta en 7 días',
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Check duplicate review error:', error)
    return { allowed: false, reason: 'Error al verificar' }
  }
}
