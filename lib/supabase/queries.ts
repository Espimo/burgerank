import { getSupabaseClient } from "./client"
import { Burger, Rating, User, UserStats } from "@/types"

// Get supabase instance
const getSupabase = () => {
  const client = getSupabaseClient()
  if (!client) throw new Error("Supabase client not available on server")
  return client
}

// Auth functions
export async function signUp(email: string, password: string, displayName: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// Burger functions
export async function getBurgers(limit = 20, offset = 0) {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from("burgers")
    .select(
      "*, restaurant:restaurants(*)",
      { count: "exact" }
    )
    .order("rating_average", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { data: data as Burger[], count }
}

export async function searchBurgers(
  query: string,
  city?: string,
  limit = 20,
  offset = 0
) {
  const supabase = getSupabase()
  let queryBuilder = supabase
    .from("burgers")
    .select("*, restaurant:restaurants(*)", { count: "exact" })

  if (query) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    )
  }

  if (city) {
    queryBuilder = queryBuilder.eq("restaurant.city", city)
  }

  const { data, error, count } = await queryBuilder
    .order("rating_average", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { data: data as Burger[], count }
}

export async function getBurgerById(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("burgers")
    .select("*, restaurant:restaurants(*)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Burger
}

// Rating functions
export async function createRating(rating: Omit<Rating, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("ratings")
    .insert([rating])
    .select()
    .single()

  if (error) throw error
  return data as Rating
}

export async function getBurgerRatings(burgerId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("burger_id", burgerId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Rating[]
}

export async function getUserRatings(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Rating[]
}

// User functions
export async function getUserProfile(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) throw error
  return data as User
}

export async function createUserProfile(user: Omit<User, "created_at" | "updated_at">) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("get_user_stats", {
    p_user_id: userId,
  })

  if (error) throw error
  return data as UserStats
}

// Reward functions
export async function getUserRewards(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("user_rewards")
    .select("*")
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function addUserReward(userId: string, rewardId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("user_rewards")
    .insert([
      {
        user_id: userId,
        reward_id: rewardId,
        unlocked_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}
