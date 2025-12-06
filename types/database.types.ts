// Types generados desde el esquema de Supabase
// Generado con: supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          city: string | null
          avatar_url: string | null
          bio: string | null
          level: Database["public"]["Enums"]["user_level"]
          points: number
          total_reviews: number
          followers_count: number
          following_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          city?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: Database["public"]["Enums"]["user_level"]
          points?: number
          total_reviews?: number
          followers_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          city?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: Database["public"]["Enums"]["user_level"]
          points?: number
          total_reviews?: number
          followers_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          website: string | null
          price_range: Database["public"]["Enums"]["price_range"]
          average_rating: number
          total_reviews: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          price_range: Database["public"]["Enums"]["price_range"]
          average_rating?: number
          total_reviews?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          price_range?: Database["public"]["Enums"]["price_range"]
          average_rating?: number
          total_reviews?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      burgers: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          burger_type: Database["public"]["Enums"]["burger_type"]
          ingredients: string[] | null
          average_rating: number
          total_reviews: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          burger_type: Database["public"]["Enums"]["burger_type"]
          ingredients?: string[] | null
          average_rating?: number
          total_reviews?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          burger_type?: Database["public"]["Enums"]["burger_type"]
          ingredients?: string[] | null
          average_rating?: number
          total_reviews?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          burger_id: string
          restaurant_id: string
          rating: number
          comment?: string | null
          helpful_count?: number
          unhelpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          burger_id?: string
          restaurant_id?: string
          rating?: number
          comment?: string | null
          helpful_count?: number
          unhelpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_tags: {
        Row: {
          id: string
          review_id: string
          tag: string
          category: Database["public"]["Enums"]["tag_category"]
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          tag: string
          category: Database["public"]["Enums"]["tag_category"]
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          tag?: string
          category?: Database["public"]["Enums"]["tag_category"]
          created_at?: string
        }
      }
      review_images: {
        Row: {
          id: string
          review_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          image_url?: string
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_type?: Database["public"]["Enums"]["badge_type"]
          unlocked_at?: string
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string
          points_required: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          discount_percentage: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          points_required: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          discount_percentage?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          points_required?: number
          reward_type?: Database["public"]["Enums"]["reward_type"]
          discount_percentage?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          qr_code: string
          redeemed: boolean
          redeemed_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          qr_code: string
          redeemed?: boolean
          redeemed_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          qr_code?: string
          redeemed?: boolean
          redeemed_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      burger_matches: {
        Row: {
          id: string
          user_id: string
          burger_id1: string
          burger_id2: string
          match_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          burger_id1: string
          burger_id2: string
          match_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          burger_id1?: string
          burger_id2?: string
          match_score?: number
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          favorite_burger_type: Database["public"]["Enums"]["burger_type"] | null
          favorite_city: string | null
          notifications_enabled: boolean
          private_profile: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          favorite_burger_type?: Database["public"]["Enums"]["burger_type"] | null
          favorite_city?: string | null
          notifications_enabled?: boolean
          private_profile?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          favorite_burger_type?: Database["public"]["Enums"]["burger_type"] | null
          favorite_city?: string | null
          notifications_enabled?: boolean
          private_profile?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      top_burgers_view: {
        Row: {
          id: string | null
          name: string | null
          restaurant_name: string | null
          average_rating: number | null
          total_reviews: number | null
        }
      }
      new_burgers_view: {
        Row: {
          id: string | null
          name: string | null
          restaurant_name: string | null
          created_at: string | null
        }
      }
      user_stats_view: {
        Row: {
          user_id: string | null
          username: string | null
          total_reviews: number | null
          average_rating: number | null
          badges_earned: number | null
        }
      }
      restaurant_rankings_view: {
        Row: {
          restaurant_id: string | null
          name: string | null
          average_rating: number | null
          total_reviews: number | null
          city: string | null
        }
      }
      trending_burgers_view: {
        Row: {
          id: string | null
          name: string | null
          restaurant_name: string | null
          review_count_last_7_days: number | null
        }
      }
      burger_reviews_detailed_view: {
        Row: {
          review_id: string | null
          burger_name: string | null
          restaurant_name: string | null
          username: string | null
          rating: number | null
          comment: string | null
          created_at: string | null
        }
      }
      user_rewards_status_view: {
        Row: {
          user_id: string | null
          username: string | null
          total_points: number | null
          available_rewards: number | null
          redeemed_rewards: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_level:
        | "beginner"
        | "intermediate"
        | "expert"
        | "master"
      burger_type:
        | "classic"
        | "gourmet"
        | "specialty"
        | "vegan"
        | "fusion"
      reward_type: "discount" | "free_item" | "points_bonus"
      badge_type:
        | "first_review"
        | "ten_reviews"
        | "helpful_reviewer"
        | "burger_expert"
        | "top_reviewer"
      price_range: "$" | "$$" | "$$$" | "$$$$"
      tag_category: "flavor" | "texture" | "presentation" | "value"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
