import { createClient } from '@supabase/supabase-js'
import { calculateELO, getInitialELO } from '@/lib/utils/elo-algorithm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface MatchPair {
  burgerA: {
    id: string
    name: string
    type: string
    images?: string[]
    match_score?: number
  }
  burgerB: {
    id: string
    name: string
    type: string
    images?: string[]
    match_score?: number
  }
  restaurants: {
    [key: string]: { id: string; name: string }
  }
}

export interface MatchResult {
  newMatchCount: number
  pointsEarned: number
  levelUp?: boolean
  newLevel?: number
}

/**
 * Obtiene un par aleatorio de burgers para jugar
 * Excluye pares vistos recientemente y prioriza puntuaciones similares
 */
export async function getMatchPair(userId: string): Promise<MatchPair | null> {
  try {
    // Obtener todas las reviews del usuario
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('burger_id')
      .eq('user_id', userId)
      .limit(100)

    if (reviewsError || !reviews || reviews.length < 2) {
      return null // Necesita al menos 2 burgers valoradas
    }

    const burgerIds = reviews.map((r) => r.burger_id)

    // Obtener últimos matches para evitar repetir
    const { data: recentMatches } = await supabase
      .from('burger_matches')
      .select('burger_a_id, burger_b_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    const recentPairs = new Set<string>()
    recentMatches?.forEach((match) => {
      const pair = [match.burger_a_id, match.burger_b_id].sort().join('-')
      recentPairs.add(pair)
    })

    // Obtener datos de burgers con match_score
    const { data: burgers } = await supabase
      .from('burgers')
      .select(
        `
        id,
        name,
        type,
        images,
        match_score,
        restaurants (id, name)
      `
      )
      .in('id', burgerIds)

    if (!burgers || burgers.length < 2) {
      return null
    }

    // Buscar par aleatorio que no esté en recientes
    let found = false
    let attempts = 0
    let burgerA, burgerB

    while (!found && attempts < 10) {
      const idxA = Math.floor(Math.random() * burgers.length)
      let idxB = Math.floor(Math.random() * burgers.length)

      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * burgers.length)
      }

      burgerA = burgers[idxA]
      burgerB = burgers[idxB]

      const pair = [burgerA.id, burgerB.id].sort().join('-')
      if (!recentPairs.has(pair)) {
        found = true
      }

      attempts++
    }

    if (!burgerA || !burgerB) {
      return null
    }

    // Construir respuesta
    const restaurantMap: { [key: string]: any } = {}

    if (burgerA.restaurants) {
      restaurantMap[burgerA.id] = burgerA.restaurants
    }
    if (burgerB.restaurants) {
      restaurantMap[burgerB.id] = burgerB.restaurants
    }

    return {
      burgerA: {
        id: burgerA.id,
        name: burgerA.name,
        type: burgerA.type,
        images: burgerA.images,
        match_score: burgerA.match_score || getInitialELO(4), // Default to 4-star equivalent
      },
      burgerB: {
        id: burgerB.id,
        name: burgerB.name,
        type: burgerB.type,
        images: burgerB.images,
        match_score: burgerB.match_score || getInitialELO(4),
      },
      restaurants: restaurantMap,
    }
  } catch (error) {
    console.error('Error getting match pair:', error)
    return null
  }
}

/**
 * Registra un match y actualiza los ELO scores
 */
export async function submitMatch(
  userId: string,
  burgerAId: string,
  burgerBId: string,
  winnerId: string
): Promise<MatchResult> {
  try {
    // Obtener match_scores actuales
    const { data: burgers } = await supabase
      .from('burgers')
      .select('id, match_score')
      .in('id', [burgerAId, burgerBId])

    if (!burgers || burgers.length !== 2) {
      throw new Error('Burgers not found')
    }

    const burgerA = burgers.find((b) => b.id === burgerAId)
    const burgerB = burgers.find((b) => b.id === burgerBId)

    if (!burgerA || !burgerB) {
      throw new Error('One of the burgers not found')
    }

    const scoreA = burgerA.match_score || getInitialELO(4)
    const scoreB = burgerB.match_score || getInitialELO(4)

    // Calcular nuevo ELO
    const winner = winnerId === burgerAId ? 'A' : 'B'
    const { newRatingA, newRatingB } = calculateELO(scoreA, scoreB, winner)

    // Insertar match
    const { error: insertError } = await supabase.from('burger_matches').insert({
      user_id: userId,
      burger_a_id: burgerAId,
      burger_b_id: burgerBId,
      winner_id: winnerId,
      burger_a_score_before: scoreA,
      burger_b_score_before: scoreB,
      burger_a_score_after: newRatingA,
      burger_b_score_after: newRatingB,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      throw insertError
    }

    // Actualizar match_scores de ambas burgers
    await supabase
      .from('burgers')
      .update({ match_score: newRatingA })
      .eq('id', burgerAId)

    await supabase
      .from('burgers')
      .update({ match_score: newRatingB })
      .eq('id', burgerBId)

    // Obtener match count de hoy
    const { count: todayMatchCount } = await supabase
      .from('burger_matches')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

    const matchCount = todayMatchCount || 0
    let pointsEarned = 0
    let levelUp = false
    let newLevel = null

    // Cada 10 matches: +5 puntos
    if (matchCount % 10 === 0 && matchCount > 0) {
      pointsEarned = 5

      // Sumar puntos al usuario
      const { data: userData } = await supabase
        .from('user_points')
        .select('available_points, total_points')
        .eq('user_id', userId)
        .single()

      if (userData) {
        const newAvailable = (userData.available_points || 0) + pointsEarned
        const newTotal = (userData.total_points || 0) + pointsEarned

        await supabase
          .from('user_points')
          .update({
            available_points: newAvailable,
            total_points: newTotal,
          })
          .eq('user_id', userId)

        // Verificar level up (cada 100 puntos = new level)
        const previousLevel = Math.floor((newTotal - pointsEarned) / 100)
        const currentLevel = Math.floor(newTotal / 100)

        if (currentLevel > previousLevel) {
          levelUp = true
          newLevel = currentLevel

          // Actualizar level en profiles
          await supabase
            .from('profiles')
            .update({ level: currentLevel })
            .eq('id', userId)
        }
      }
    }

    return {
      newMatchCount: matchCount,
      pointsEarned,
      levelUp,
      newLevel: newLevel || undefined,
    }
  } catch (error) {
    console.error('Error submitting match:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de matches del usuario
 */
export async function getMatchStats(userId: string) {
  try {
    const { data: matches } = await supabase
      .from('burger_matches')
      .select('burger_a_id, burger_b_id, winner_id, created_at')
      .eq('user_id', userId)

    if (!matches || matches.length === 0) {
      return {
        totalMatches: 0,
        todayMatches: 0,
        mostWins: null,
        winRate: 0,
        currentStreak: 0,
      }
    }

    // Contar matches de hoy
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const todayMatches = matches.filter(
      (m) => new Date(m.created_at).getTime() >= today.getTime()
    )

    // Contar wins por burger
    const wins: { [key: string]: number } = {}
    matches.forEach((m) => {
      if (m.winner_id) {
        wins[m.winner_id] = (wins[m.winner_id] || 0) + 1
      }
    })

    const mostWins = Object.entries(wins).sort(([, a], [, b]) => b - a)[0]

    // Calcular racha actual
    let currentStreak = 0
    for (let i = 0; i < todayMatches.length; i++) {
      // Contar matches consecutivos
      currentStreak++
    }

    return {
      totalMatches: matches.length,
      todayMatches: todayMatches.length,
      mostWins: mostWins ? { burgerId: mostWins[0], wins: mostWins[1] } : null,
      winRate: Object.values(wins).length > 0 ? 100 : 0,
      currentStreak,
    }
  } catch (error) {
    console.error('Error getting match stats:', error)
    return {
      totalMatches: 0,
      todayMatches: 0,
      mostWins: null,
      winRate: 0,
      currentStreak: 0,
    }
  }
}

/**
 * Obtiene historial de matches
 */
export async function getMatchHistory(userId: string, limit = 10) {
  try {
    const { data: matches } = await supabase
      .from('burger_matches')
      .select(
        `
        id,
        burger_a_id,
        burger_b_id,
        winner_id,
        burger_a_score_before,
        burger_b_score_before,
        burger_a_score_after,
        burger_b_score_after,
        created_at,
        burgers!burger_a_id (id, name),
        burgers!burger_b_id (id, name)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return matches || []
  } catch (error) {
    console.error('Error getting match history:', error)
    return []
  }
}
