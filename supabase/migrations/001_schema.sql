-- ============================================================================
-- BurgeRank Database Schema - Migration 001
-- ============================================================================
-- This migration creates all base tables, enums, indexes, and foreign keys
-- for the BurgeRank burger rating platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User level enumeration
CREATE TYPE user_level AS ENUM ('burger_fan', 'burger_lover', 'burger_obsessed');

-- Burger type enumeration
CREATE TYPE burger_type AS ENUM ('clasica', 'cheeseburger', 'doble', 'vegana', 'pollo', 'cerdo', 'cordero');

-- Reward type enumeration
CREATE TYPE reward_type AS ENUM ('discount', 'free_fries', 'free_drink', 'free_burger', 'vip_experience');

-- Badge type enumeration
CREATE TYPE badge_type AS ENUM ('explorer', 'critic', 'specialist', 'social', 'dedication', 'match_master');

-- Price range enumeration
CREATE TYPE price_range AS ENUM ('budget', 'medium', 'premium');

-- Review tag category enumeration
CREATE TYPE tag_category AS ENUM ('bread', 'meat', 'sauce', 'topping', 'experience');

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
-- User profiles and authentication data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 160),
  city TEXT,
  level user_level DEFAULT 'burger_fan',
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  available_points INTEGER DEFAULT 0 CHECK (available_points >= 0),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  is_moderator BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for profiles table
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_level ON profiles(level);
CREATE INDEX idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- TABLE: restaurants
-- ============================================================================
-- Restaurant information
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_burgers INTEGER DEFAULT 0 CHECK (total_burgers >= 0),
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for restaurants table
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_verified ON restaurants(verified);
CREATE INDEX idx_restaurants_average_rating ON restaurants(average_rating DESC);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
CREATE INDEX idx_restaurants_geolocation ON restaurants(latitude, longitude);

-- ============================================================================
-- TABLE: burgers
-- ============================================================================
-- Burger menu items
CREATE TABLE burgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(8, 2),
  type burger_type NOT NULL DEFAULT 'clasica',
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_keto BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  match_score DECIMAL(5, 4) DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 1),
  ranking_position INTEGER,
  is_new BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for burgers table
CREATE INDEX idx_burgers_restaurant_id ON burgers(restaurant_id);
CREATE INDEX idx_burgers_slug ON burgers(slug);
CREATE INDEX idx_burgers_type ON burgers(type);
CREATE INDEX idx_burgers_average_rating ON burgers(average_rating DESC);
CREATE INDEX idx_burgers_ranking_position ON burgers(ranking_position ASC NULLS LAST);
CREATE INDEX idx_burgers_is_new ON burgers(is_new);
CREATE INDEX idx_burgers_verified ON burgers(verified);
CREATE INDEX idx_burgers_created_at ON burgers(created_at DESC);
CREATE INDEX idx_burgers_dietary_filters ON burgers(is_vegan, is_vegetarian, is_gluten_free, is_keto);

-- ============================================================================
-- TABLE: reviews
-- ============================================================================
-- User reviews/ratings for burgers
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  burger_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  overall_rating DECIMAL(3, 2) NOT NULL CHECK (overall_rating >= 0 AND overall_rating <= 5),
  bread_rating DECIMAL(3, 2) CHECK (bread_rating >= 0 AND bread_rating <= 5),
  meat_rating DECIMAL(3, 2) CHECK (meat_rating >= 0 AND meat_rating <= 5),
  toppings_rating DECIMAL(3, 2) CHECK (toppings_rating >= 0 AND toppings_rating <= 5),
  sauces_rating DECIMAL(3, 2) CHECK (sauces_rating >= 0 AND sauces_rating <= 5),
  originality_rating DECIMAL(3, 2) CHECK (originality_rating >= 0 AND originality_rating <= 5),
  sides_rating DECIMAL(3, 2) CHECK (sides_rating >= 0 AND sides_rating <= 5),
  value_rating DECIMAL(3, 2) CHECK (value_rating >= 0 AND value_rating <= 5),
  comment TEXT CHECK (LENGTH(comment) <= 280),
  visit_date DATE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(burger_id, user_id, visit_date)
);

-- Create indexes for reviews table
CREATE INDEX idx_reviews_burger_id ON reviews(burger_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_overall_rating ON reviews(overall_rating DESC);
CREATE INDEX idx_reviews_is_verified ON reviews(is_verified);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_visit_date ON reviews(visit_date DESC);

-- ============================================================================
-- TABLE: review_tags
-- ============================================================================
-- Tags for detailed review categorization
CREATE TABLE review_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category tag_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for review_tags table
CREATE INDEX idx_review_tags_review_id ON review_tags(review_id);
CREATE INDEX idx_review_tags_tag ON review_tags(tag);
CREATE INDEX idx_review_tags_category ON review_tags(category);
CREATE INDEX idx_review_tags_review_category ON review_tags(review_id, category);

-- ============================================================================
-- TABLE: review_images
-- ============================================================================
-- Image attachments for reviews (photos, receipts)
CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_receipt BOOLEAN DEFAULT FALSE,
  verified_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for review_images table
CREATE INDEX idx_review_images_review_id ON review_images(review_id);
CREATE INDEX idx_review_images_is_receipt ON review_images(is_receipt);

-- ============================================================================
-- TABLE: user_badges
-- ============================================================================
-- User achievements and badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  target INTEGER NOT NULL CHECK (target > 0),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_name)
);

-- Create indexes for user_badges table
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_unlocked ON user_badges(unlocked);
CREATE INDEX idx_user_badges_badge_type ON user_badges(badge_type);

-- ============================================================================
-- TABLE: rewards
-- ============================================================================
-- Available rewards for redemption
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  reward_type reward_type NOT NULL,
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  required_level user_level NOT NULL DEFAULT 'burger_fan',
  is_active BOOLEAN DEFAULT TRUE,
  max_redemptions INTEGER,
  redemptions_count INTEGER DEFAULT 0 CHECK (redemptions_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for rewards table
CREATE INDEX idx_rewards_points_cost ON rewards(points_cost);
CREATE INDEX idx_rewards_required_level ON rewards(required_level);
CREATE INDEX idx_rewards_is_active ON rewards(is_active);

-- ============================================================================
-- TABLE: user_rewards
-- ============================================================================
-- User's redeemed or pending rewards
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user_rewards table
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_qr_code ON user_rewards(qr_code);
CREATE INDEX idx_user_rewards_redeemed ON user_rewards(redeemed);
CREATE INDEX idx_user_rewards_expires_at ON user_rewards(expires_at);

-- ============================================================================
-- TABLE: burger_matches
-- ============================================================================
-- Mini-game: Battle Royale between burgers
CREATE TABLE burger_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  burger_a_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  burger_b_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (burger_a_id != burger_b_id AND winner_id IN (burger_a_id, burger_b_id))
);

-- Create indexes for burger_matches table
CREATE INDEX idx_burger_matches_user_id ON burger_matches(user_id);
CREATE INDEX idx_burger_matches_burger_a_id ON burger_matches(burger_a_id);
CREATE INDEX idx_burger_matches_burger_b_id ON burger_matches(burger_b_id);
CREATE INDEX idx_burger_matches_winner_id ON burger_matches(winner_id);
CREATE INDEX idx_burger_matches_created_at ON burger_matches(created_at DESC);

-- ============================================================================
-- TABLE: follows
-- ============================================================================
-- User follow relationships
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for follows table
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at DESC);

-- ============================================================================
-- TABLE: user_preferences
-- ============================================================================
-- User preferences and notification settings
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_preferences TEXT[] DEFAULT '{}',
  main_city TEXT,
  price_range price_range DEFAULT 'medium',
  notifications_new_nearby BOOLEAN DEFAULT TRUE,
  notifications_recommended BOOLEAN DEFAULT TRUE,
  notifications_level_up BOOLEAN DEFAULT TRUE,
  notifications_followers BOOLEAN DEFAULT FALSE,
  profile_public BOOLEAN DEFAULT TRUE,
  show_location BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- END OF SCHEMA MIGRATION 001
-- ============================================================================
