export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          points: number;
          category: string;
          public_profile: boolean;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          avatar_url?: string;
          bio?: string;
          points?: number;
          category?: string;
          public_profile?: boolean;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          email?: string;
          avatar_url?: string;
          bio?: string;
          points?: number;
          category?: string;
          public_profile?: boolean;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          country?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          city_id: string;
          address: string | null;
          phone: string | null;
          hours: string | null;
          average_rating: number;
          total_ratings: number;
          delivery_url: string | null;
          reservation_url: string | null;
          website: string | null;
          banner_url: string | null;
          logo_url: string | null;
          status: string;
          submitted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city_id: string;
          address?: string;
          phone?: string;
          hours?: string;
          average_rating?: number;
          total_ratings?: number;
          delivery_url?: string;
          reservation_url?: string;
          website?: string;
          banner_url?: string;
          logo_url?: string;
          status?: string;
          submitted_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          city_id?: string;
          address?: string;
          phone?: string;
          hours?: string;
          average_rating?: number;
          total_ratings?: number;
          delivery_url?: string;
          reservation_url?: string;
          website?: string;
          banner_url?: string;
          logo_url?: string;
          status?: string;
          submitted_by?: string;
          updated_at?: string;
        };
      };
      burgers: {
        Row: {
          id: string;
          name: string;
          restaurant_id: string;
          description: string | null;
          position: number | null;
          type: string | null;
          tags: string[] | null;
          city_id: string;
          average_rating: number;
          total_ratings: number;
          image_url: string | null;
          is_featured: boolean;
          featured_order: number | null;
          status: string;
          submitted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          restaurant_id: string;
          description?: string;
          position?: number;
          type?: string;
          tags?: string[];
          city_id: string;
          average_rating?: number;
          total_ratings?: number;
          image_url?: string;
          is_featured?: boolean;
          featured_order?: number;
          status?: string;
          submitted_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          restaurant_id?: string;
          description?: string;
          position?: number;
          type?: string;
          tags?: string[];
          city_id?: string;
          average_rating?: number;
          total_ratings?: number;
          image_url?: string;
          is_featured?: boolean;
          featured_order?: number;
          status?: string;
          submitted_by?: string;
          updated_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          burger_id: string;
          overall_rating: number;
          pan_rating: number | null;
          carne_rating: number | null;
          toppings_rating: number | null;
          salsa_rating: number | null;
          price: number | null;
          comment: string | null;
          has_ticket: boolean;
          ticket_url: string | null;
          consumption_type: string | null;
          appetizers: string[] | null;
          points_awarded: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          burger_id: string;
          overall_rating: number;
          pan_rating?: number;
          carne_rating?: number;
          toppings_rating?: number;
          salsa_rating?: number;
          price?: number;
          comment?: string;
          has_ticket?: boolean;
          ticket_url?: string;
          consumption_type?: string;
          appetizers?: string[];
          points_awarded?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          overall_rating?: number;
          pan_rating?: number;
          carne_rating?: number;
          toppings_rating?: number;
          salsa_rating?: number;
          price?: number;
          comment?: string;
          has_ticket?: boolean;
          ticket_url?: string;
          consumption_type?: string;
          appetizers?: string[];
          points_awarded?: number;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          emoji: string | null;
          requirement_type: string;
          requirement_value: number;
          icon_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          emoji?: string;
          requirement_type: string;
          requirement_value: number;
          icon_url?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          emoji?: string;
          requirement_type?: string;
          requirement_value?: number;
          icon_url?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          unlocked_at?: string;
        };
        Update: {
          unlocked_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          type: string;
          icon_emoji: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          type: string;
          icon_emoji?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          type?: string;
          icon_emoji?: string;
          is_read?: boolean;
        };
      };
      restaurant_promotions: {
        Row: {
          id: string;
          restaurant_id: string;
          title: string;
          description: string | null;
          discount_percentage: number | null;
          valid_from: string | null;
          valid_until: string | null;
          terms: string | null;
          is_active: boolean;
          emoji: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          title: string;
          description?: string;
          discount_percentage?: number;
          valid_from?: string;
          valid_until?: string;
          terms?: string;
          is_active?: boolean;
          emoji?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          restaurant_id?: string;
          title?: string;
          description?: string;
          discount_percentage?: number;
          valid_from?: string;
          valid_until?: string;
          terms?: string;
          is_active?: boolean;
          emoji?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
