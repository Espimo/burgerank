import { Database } from "./database.types"

// ============================================================================
// User Types
// ============================================================================

export interface Profile {
  id: string
  email: string
  username: string
  full_name: string | null
  city: string | null
  avatar_url: string | null
  bio: string | null
  level: "beginner" | "intermediate" | "expert" | "master"
  points: number
  total_reviews: number
  followers_count: number
  following_count: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  profile?: Profile
}

export interface CurrentUser extends User {
  profile: Profile
}

// ============================================================================
// Restaurant Types
// ============================================================================

export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  price_range: "$" | "$$" | "$$$" | "$$$$"
  average_rating: number
  total_reviews: number
  image_url: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// Burger Types
// ============================================================================

export interface Burger {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number
  burger_type: "classic" | "gourmet" | "specialty" | "vegan" | "fusion"
  ingredients: string[] | null
  average_rating: number
  total_reviews: number
  image_url: string | null
  created_at: string
  updated_at: string
  restaurant?: Restaurant
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string
  user_id: string
  burger_id: string
  restaurant_id: string
  rating: number
  comment: string | null
  helpful_count: number
  unhelpful_count: number
  created_at: string
  updated_at: string
  user?: Profile
  burger?: Burger
  tags?: ReviewTag[]
  images?: ReviewImage[]
}

// Alias for Rating (used in some contexts)
export type Rating = Review

export interface ReviewTag {
  id: string
  review_id: string
  tag: string
  category: "flavor" | "texture" | "presentation" | "value"
  created_at: string
}

export interface ReviewImage {
  id: string
  review_id: string
  image_url: string
  created_at: string
}

// ============================================================================
// Badge & Reward Types
// ============================================================================

export interface Badge {
  id: string
  user_id: string
  badge_type: "first_review" | "ten_reviews" | "helpful_reviewer" | "burger_expert" | "top_reviewer"
  unlocked_at: string
  created_at: string
}

export interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  reward_type: "discount" | "free_item" | "points_bonus"
  discount_percentage: number | null
  created_at: string
  updated_at: string
}

export interface UserReward {
  id: string
  user_id: string
  reward_id: string
  qr_code: string
  redeemed: boolean
  redeemed_at: string | null
  expires_at: string | null
  created_at: string
  reward?: Reward
}

// ============================================================================
// User Stats Types
// ============================================================================

export interface UserStats {
  total_reviews: number
  average_rating: number
  total_points: number
  level: "beginner" | "intermediate" | "expert" | "master"
  badges_earned: number
  restaurants_visited: number
  followers_count: number
  following_count: number
}

// ============================================================================
// Form Types
// ============================================================================

export interface SignUpForm {
  email: string
  password: string
  username: string
  city: string
}

export interface SignInForm {
  email: string
  password: string
}

export interface UpdateProfileForm {
  full_name?: string
  bio?: string
  city?: string
  avatar_url?: string
}

export interface CreateReviewForm {
  burger_id: string
  rating: number
  comment?: string
  tags?: string[]
  images?: File[]
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface BurgerFilters {
  burger_type?: "classic" | "gourmet" | "specialty" | "vegan" | "fusion"
  min_rating?: number
  max_price?: number
  city?: string
  search?: string
}

export interface RestaurantFilters {
  price_range?: "$" | "$$" | "$$$" | "$$$$"
  city?: string
  search?: string
  min_rating?: number
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data?: T
  error?: {
    code: string
    message: string
  }
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthError {
  code: string
  message: string
  status?: number
}

export interface AuthSession {
  user: User | null
  session: {
    access_token: string
    refresh_token: string
    expires_in: number
    expires_at: number
  } | null
}

// ============================================================================
// Storage Types
// ============================================================================

export interface UploadOptions {
  bucket: "avatars" | "burger-photos" | "receipts"
  path: string
  file: File
  maxSize?: number // en bytes
  allowedTypes?: string[]
}

export interface StorageError {
  message: string
  statusCode: number
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SearchFilters {
  query?: string
  city?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  max_rating?: number
  sort_by?: "rating" | "recent" | "price"
  type?: "burger_type"
  tags?: string[]
  limit?: number
  offset?: number
}
