/**
 * ELO Algorithm for Burger Ranking
 * Standard chess rating system adapted for burger matching
 * K-factor: 32 (standard for established ratings)
 */

interface ELOResult {
  newRatingA: number
  newRatingB: number
  changeA: number
  changeB: number
}

/**
 * Calculate new ELO ratings after a match
 * @param ratingA - Current rating of burger A
 * @param ratingB - Current rating of burger B
 * @param winner - 'A' or 'B' (which burger won)
 * @returns New ratings and changes
 */
export function calculateELO(
  ratingA: number,
  ratingB: number,
  winner: 'A' | 'B'
): ELOResult {
  const K_FACTOR = 32 // Standard for established ratings

  // Calculate expected scores
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400))

  // Determine actual scores
  const scoreA = winner === 'A' ? 1 : 0
  const scoreB = winner === 'B' ? 1 : 0

  // Calculate new ratings
  const newRatingA = ratingA + K_FACTOR * (scoreA - expectedA)
  const newRatingB = ratingB + K_FACTOR * (scoreB - expectedB)

  return {
    newRatingA: Math.round(newRatingA * 100) / 100,
    newRatingB: Math.round(newRatingB * 100) / 100,
    changeA: Math.round((newRatingA - ratingA) * 100) / 100,
    changeB: Math.round((newRatingB - ratingB) * 100) / 100,
  }
}

/**
 * Get initial ELO rating based on user's overall rating of the burger
 * Higher user ratings = higher starting ELO
 */
export function getInitialELO(userRating: number): number {
  // Map 0-5 scale to 1200-1600 ELO range
  // 0 stars = 1200 (weak)
  // 5 stars = 1600 (strong)
  const baseELO = 1200
  const ratingRange = 400
  return baseELO + (userRating / 5) * ratingRange
}

/**
 * Get probability that burger A wins against burger B
 */
export function getWinProbability(ratingA: number, ratingB: number): number {
  const probability = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  return Math.round(probability * 100)
}

/**
 * Get rating description (like chess ELO descriptions)
 */
export function getRatingDescription(rating: number): string {
  if (rating < 1000) return 'Novato'
  if (rating < 1200) return 'Principiante'
  if (rating < 1400) return 'Intermedio'
  if (rating < 1600) return 'Avanzado'
  if (rating < 1800) return 'Experto'
  return 'Maestro'
}
