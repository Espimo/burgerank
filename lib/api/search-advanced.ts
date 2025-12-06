import { createClient } from '@supabase/supabase-js'
import { type Burger, type Restaurant } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Full-text search with relevance scoring
export async function fullTextSearch(query: string, limit = 20) {
  if (!query.trim()) {
    return { burgers: [], restaurants: [] }
  }

  const trimmed = query.trim()

  const [burgersResponse, restaurantsResponse] = await Promise.all([
    // Search burgers with FTS
    supabase
      .from('burgers')
      .select(
        `
        id,
        name,
        description,
        image_url,
        average_rating,
        restaurant:restaurants (
          id,
          name,
          city
        )
      `,
        { count: 'exact' }
      )
      .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
      .order('average_rating', { ascending: false })
      .limit(limit),

    // Search restaurants with FTS
    supabase
      .from('restaurants')
      .select(
        `
        id,
        name,
        city,
        logo_url,
        description
      `,
        { count: 'exact' }
      )
      .or(`name.ilike.%${trimmed}%,city.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  // Get burger count for restaurants
  const restaurantsWithCount = await Promise.all(
    (restaurantsResponse.data || []).map(async (restaurant) => {
      const { count } = await supabase
        .from('burgers')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id)

      return {
        ...restaurant,
        burgers_count: count || 0,
      }
    })
  )

  return {
    burgers: burgersResponse.data || [],
    restaurants: restaurantsWithCount,
  }
}

// Search by tags/categories
export async function searchByTags(tags: string[], limit = 20) {
  if (tags.length === 0) {
    return { burgers: [], restaurants: [] }
  }

  const [burgersResponse, restaurantsResponse] = await Promise.all([
    supabase
      .from('burgers')
      .select('*')
      .containsFilter('tags', tags)
      .order('average_rating', { ascending: false })
      .limit(limit),

    supabase
      .from('restaurants')
      .select('*')
      .containsFilter('categories', tags)
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  const restaurantsWithCount = await Promise.all(
    (restaurantsResponse.data || []).map(async (restaurant) => {
      const { count } = await supabase
        .from('burgers')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id)

      return {
        ...restaurant,
        burgers_count: count || 0,
      }
    })
  )

  return {
    burgers: burgersResponse.data || [],
    restaurants: restaurantsWithCount,
  }
}

// Search by ingredients
export async function searchByIngredients(ingredients: string[], limit = 20) {
  if (ingredients.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('burgers')
    .select(
      `
      *,
      ingredients:burger_ingredients (
        ingredient:ingredients (
          id,
          name
        )
      )
    `
    )
    .containsFilter('ingredients', ingredients)
    .order('average_rating', { ascending: false })
    .limit(limit)

  return data || []
}

// Fuzzy search with scoring
export async function fuzzySearch(query: string, limit = 20) {
  if (!query.trim()) {
    return { burgers: [], restaurants: [] }
  }

  const trimmed = query.trim()
  const words = trimmed.toLowerCase().split(/\s+/)

  const [burgersData, restaurantsData] = await Promise.all([
    supabase
      .from('burgers')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(limit * 2),

    supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit * 2),
  ])

  // Score function for fuzzy matching
  const calculateScore = (text: string): number => {
    const lowerText = text.toLowerCase()
    let score = 0

    // Exact match at start
    if (lowerText.startsWith(trimmed)) score += 100

    // Word-by-word matching
    words.forEach((word) => {
      if (lowerText.includes(word)) {
        score += 50
      }
    })

    // Levenshtein-like scoring for partial matches
    if (lowerText.includes(trimmed)) {
      score += 30
    }

    return score
  }

  // Score and sort burgers
  const scoredBurgers = (burgersData.data || [])
    .map((burger) => ({
      burger,
      score: calculateScore(burger.name) + calculateScore(burger.description || ''),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ burger }) => burger)

  // Score and sort restaurants
  const restaurantsWithCount = await Promise.all(
    (restaurantsData.data || [])
      .map((restaurant) => ({
        restaurant,
        score: calculateScore(restaurant.name) + calculateScore(restaurant.city),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(async ({ restaurant }) => {
        const { count } = await supabase
          .from('burgers')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', restaurant.id)

        return {
          ...restaurant,
          burgers_count: count || 0,
        }
      })
  )

  return {
    burgers: scoredBurgers,
    restaurants: await Promise.all(restaurantsWithCount),
  }
}

// Get popular suggestions
export async function getPopularSuggestions() {
  const [topBurgersResponse, newRestaurantsResponse] = await Promise.all([
    supabase
      .from('burgers')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(4),

    supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const newRestaurantsWithCount = await Promise.all(
    (newRestaurantsResponse.data || []).map(async (restaurant) => {
      const { count } = await supabase
        .from('burgers')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id)

      return {
        ...restaurant,
        burgers_count: count || 0,
      }
    })
  )

  return {
    topBurgers: topBurgersResponse.data || [],
    newRestaurants: newRestaurantsWithCount,
  }
}
