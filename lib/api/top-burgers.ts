import { createClient } from '@supabase/supabase-js'
import type { Burger } from '@/components/profile/top-five-section'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hora

interface CachedTopFive {
  burgers: Burger[]
  timestamp: number
}

/**
 * Obtiene el top 5 del usuario
 * Primero intenta cargar el manual, sino auto-calcula
 * Implementa caché de 1 hora
 */
export async function getUserTopFive(userId: string): Promise<Burger[]> {
  try {
    // Intentar obtener el top 5 manual del usuario
    const { data: userTopFive, error: topFiveError } = await supabase
      .from('user_top_burgers')
      .select('ordered_burger_ids, updated_at')
      .eq('user_id', userId)
      .single()

    // Si existe y está en caché (menos de 1 hora), usarlo
    if (userTopFive && userTopFive.ordered_burger_ids) {
      const updatedAt = new Date(userTopFive.updated_at).getTime()
      const now = new Date().getTime()

      // Si el caché es válido, retornar
      if (now - updatedAt < CACHE_DURATION_MS) {
        return fetchBurgersById(userTopFive.ordered_burger_ids)
      }
    }

    // Si no existe manual o caché expiró, auto-calcular
    return autoCalculateTopFive(userId)
  } catch (error) {
    console.error('Get user top five error:', error)
    return []
  }
}

/**
 * Auto-calcula el top 5 basado en ratings y match_score
 */
export async function autoCalculateTopFive(userId: string): Promise<Burger[]> {
  try {
    // Obtener todas las reviews del usuario
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(
        `
        burger_id,
        overall_rating,
        created_at,
        likes_count,
        burgers (
          id,
          name,
          type,
          average_rating,
          restaurants (
            id,
            name,
            city
          )
        )
      `
      )
      .eq('user_id', userId)

    if (reviewsError || !reviews || reviews.length === 0) {
      return []
    }

    // Agrupar por burger y calcular score
    const burgerScores = new Map<string, Burger & { score: number; count: number }>(
    )

    reviews.forEach((review: any) => {
      const burger = review.burgers

      if (!burger) return

      const key = burger.id
      const existing = burgerScores.get(key) || {
        ...burger,
        restaurant: burger.restaurants,
        score: 0,
        count: 0,
      }

      // Score = (rating * 0.6 + likes * 0.4) * recency_factor
      const daysOld = (new Date().getTime() - new Date(review.created_at).getTime()) / (1000 * 60 * 60 * 24)
      const recencyFactor = Math.max(0.5, 1 - daysOld / 365) // Decae después de 1 año

      existing.score +=
        (review.overall_rating * 0.6 + (review.likes_count || 0) * 0.1) * recencyFactor
      existing.count += 1

      burgerScores.set(key, existing)
    })

    // Ordenar por score y obtener top 5
    const topFive = Array.from(burgerScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((b) => {
        const { score, count, ...burger } = b
        return burger as Burger
      })

    // Guardar en BD
    if (topFive.length > 0) {
      const burgerIds = topFive.map((b) => b.id)

      await supabase
        .from('user_top_burgers')
        .upsert({
          user_id: userId,
          ordered_burger_ids: burgerIds,
          updated_at: new Date().toISOString(),
          is_manual: false,
        })
        .eq('user_id', userId)
    }

    return topFive
  } catch (error) {
    console.error('Auto calculate top five error:', error)
    return []
  }
}

/**
 * Actualiza manualmente el top 5 del usuario
 * Valida que no haya duplicados
 */
export async function updateUserTopFive(userId: string, burgerIds: string[]): Promise<boolean> {
  try {
    // Validar que no hay duplicados
    if (new Set(burgerIds).size !== burgerIds.length) {
      throw new Error('No puedes tener la misma burger dos veces en el top 5')
    }

    // Validar que haya exactamente 5
    if (burgerIds.length !== 5) {
      throw new Error('El top 5 debe tener exactamente 5 burgers')
    }

    // Guardar en BD
    const { error } = await supabase
      .from('user_top_burgers')
      .upsert({
        user_id: userId,
        ordered_burger_ids: burgerIds,
        updated_at: new Date().toISOString(),
        is_manual: true,
      })
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Update user top five error:', error)
    throw error
  }
}

/**
 * Helper: Obtiene burgers por IDs en orden específico
 */
async function fetchBurgersById(burgerIds: string[]): Promise<Burger[]> {
  if (!burgerIds || burgerIds.length === 0) {
    return []
  }

  try {
    const { data: burgers, error } = await supabase
      .from('burgers')
      .select(
        `
        id,
        name,
        type,
        average_rating,
        restaurants (
          id,
          name,
          city
        )
      `
      )
      .in('id', burgerIds)

    if (error || !burgers) {
      return []
    }

    // Mantener el orden especificado
    const burgerMap = new Map(burgers.map((b: any) => [b.id, b]))
    return burgerIds
      .map((id) => burgerMap.get(id))
      .filter((b) => b !== undefined)
      .map((b: any) => ({
        ...b,
        restaurant: b.restaurants,
      })) as Burger[]
  } catch (error) {
    console.error('Fetch burgers by id error:', error)
    return []
  }
}

/**
 * Obtiene ranking general (comparativa global)
 */
export async function getGeneralTopFive(): Promise<Burger[]> {
  try {
    const { data: burgers, error } = await supabase
      .from('burgers')
      .select(
        `
        id,
        name,
        type,
        average_rating,
        restaurants (
          id,
          name,
          city
        )
      `
      )
      .order('average_rating', { ascending: false })
      .limit(5)

    if (error || !burgers) {
      return []
    }

    return burgers.map((b: any) => ({
      ...b,
      restaurant: b.restaurants,
    })) as Burger[]
  } catch (error) {
    console.error('Get general top five error:', error)
    return []
  }
}

/**
 * Invalida el caché del top 5 del usuario
 * Se llama cuando se añade/modifica una review
 */
export async function invalidateUserTopFiveCache(userId: string): Promise<void> {
  try {
    // Simplemente actualizar el timestamp para que se recalcule
    await supabase
      .from('user_top_burgers')
      .update({ updated_at: new Date(0).toISOString() })
      .eq('user_id', userId)
  } catch (error) {
    console.error('Invalidate cache error:', error)
  }
}
