'use client'

export async function getReviewsByBurger(
  burgerId: string,
  limit = 20,
  page = 0,
  sortBy: 'recent' | 'helpful' | 'rating' = 'helpful'
) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    sortBy,
  })

  const response = await fetch(`/api/burgers/${burgerId}/reviews?${params}`)
  if (!response.ok) throw new Error('Failed to fetch reviews')
  return response.json()
}

export async function getReviewsByUser(userId: string, limit = 20, page = 0) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  })

  const response = await fetch(`/api/users/${userId}/reviews?${params}`)
  if (!response.ok) throw new Error('Failed to fetch reviews')
  return response.json()
}

export async function likeReview(reviewId: string) {
  const response = await fetch(`/api/reviews/${reviewId}/like`, { method: 'POST' })
  if (!response.ok) throw new Error('Failed to like review')
  return response.json()
}

export async function getRatingBreakdown(burgerId: string) {
  const response = await fetch(`/api/burgers/${burgerId}/rating-breakdown`)
  if (!response.ok) throw new Error('Failed to fetch rating breakdown')
  return response.json()
}
