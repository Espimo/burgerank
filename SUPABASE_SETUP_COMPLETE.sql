-- ============================================================================
-- 🍔 BurgeRank - COMPLETE DATABASE SETUP
-- ============================================================================
-- Execute this in Supabase SQL Editor to set up the entire database
-- This consolidates all migrations into one file
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_level AS ENUM ('burger_fan', 'burger_lover', 'burger_obsessed');
CREATE TYPE burger_type AS ENUM ('clasica', 'cheeseburger', 'doble', 'vegana', 'pollo', 'cerdo', 'cordero');
CREATE TYPE reward_type AS ENUM ('discount', 'free_fries', 'free_drink', 'free_burger', 'vip_experience');
CREATE TYPE badge_type AS ENUM ('explorer', 'critic', 'specialist', 'social', 'dedication', 'match_master');
CREATE TYPE price_range AS ENUM ('budget', 'medium', 'premium');
CREATE TYPE tag_category AS ENUM ('bread', 'meat', 'sauce', 'topping', 'experience');

-- ============================================================================
-- TABLE: profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
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

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- TABLE: restaurants
-- ============================================================================

CREATE TABLE IF NOT EXISTS restaurants (
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

CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_verified ON restaurants(verified);
CREATE INDEX IF NOT EXISTS idx_restaurants_average_rating ON restaurants(average_rating DESC);

-- ============================================================================
-- TABLE: burgers
-- ============================================================================

CREATE TABLE IF NOT EXISTS burgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  burger_type burger_type,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_ratings INTEGER DEFAULT 0 CHECK (total_ratings >= 0),
  image_url TEXT,
  price DECIMAL(5, 2),
  is_special BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_burgers_restaurant_id ON burgers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_burgers_burger_type ON burgers(burger_type);
CREATE INDEX IF NOT EXISTS idx_burgers_average_rating ON burgers(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_burgers_created_at ON burgers(created_at DESC);

-- ============================================================================
-- TABLE: reviews
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  burger_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_burger_id ON reviews(burger_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================================
-- TABLE: review_images
-- ============================================================================

CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('burger', 'receipt', 'ambiance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);

-- ============================================================================
-- TABLE: review_tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS review_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  tag_category tag_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_tags_review_id ON review_tags(review_id);
CREATE INDEX IF NOT EXISTS idx_review_tags_tag_category ON review_tags(tag_category);

-- ============================================================================
-- TABLE: user_preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_preferences TEXT[] DEFAULT '{}',
  main_city TEXT,
  price_range price_range DEFAULT 'medium',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  profile_public BOOLEAN DEFAULT TRUE,
  show_location BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: follows
-- ============================================================================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- ============================================================================
-- TABLE: rewards
-- ============================================================================

CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  reward_type reward_type NOT NULL,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  available_until TIMESTAMP WITH TIME ZONE,
  quantity_available INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rewards_points_required ON rewards(points_required);

-- ============================================================================
-- TABLE: user_rewards
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward_id ON user_rewards(reward_id);

-- ============================================================================
-- TABLE: user_badges
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  badge_name TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 1,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked ON user_badges(unlocked);

-- ============================================================================
-- TABLE: burger_matches
-- ============================================================================

CREATE TABLE IF NOT EXISTS burger_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  burger_id_1 UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  burger_id_2 UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES burgers(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (burger_id_1 != burger_id_2)
);

CREATE INDEX IF NOT EXISTS idx_burger_matches_user_id ON burger_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_burger_matches_created_at ON burger_matches(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE burger_matches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================

CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "profiles_insert_authenticated"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES: restaurants
-- ============================================================================

CREATE POLICY "restaurants_select_public"
  ON restaurants FOR SELECT USING (TRUE);

CREATE POLICY "restaurants_insert_authenticated"
  ON restaurants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "restaurants_update_owner"
  ON restaurants FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ============================================================================
-- RLS POLICIES: burgers
-- ============================================================================

CREATE POLICY "burgers_select_public"
  ON burgers FOR SELECT USING (TRUE);

CREATE POLICY "burgers_insert_authenticated"
  ON burgers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "burgers_update_owner"
  ON burgers FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- ============================================================================
-- RLS POLICIES: reviews
-- ============================================================================

CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT USING (TRUE);

CREATE POLICY "reviews_insert_authenticated"
  ON reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES: review_images
-- ============================================================================

CREATE POLICY "review_images_select_public"
  ON review_images FOR SELECT USING (TRUE);

CREATE POLICY "review_images_insert_authenticated"
  ON review_images FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_images.review_id
      AND reviews.user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: follows
-- ============================================================================

CREATE POLICY "follows_select_public"
  ON follows FOR SELECT USING (TRUE);

CREATE POLICY "follows_insert_authenticated"
  ON follows FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = follower_id);

CREATE POLICY "follows_delete_own"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- RLS POLICIES: burger_matches
-- ============================================================================

CREATE POLICY "burger_matches_select_own"
  ON burger_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "burger_matches_insert_authenticated"
  ON burger_matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update user level based on points
CREATE OR REPLACE FUNCTION update_user_level(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  v_total_points INTEGER;
  v_new_level user_level;
BEGIN
  SELECT total_points INTO v_total_points FROM profiles WHERE id = user_id_param;
  
  v_new_level := CASE
    WHEN v_total_points >= 2001 THEN 'burger_obsessed'::user_level
    WHEN v_total_points >= 501 THEN 'burger_lover'::user_level
    ELSE 'burger_fan'::user_level
  END;
  
  UPDATE profiles
  SET level = v_new_level, updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Add points to user
CREATE OR REPLACE FUNCTION add_user_points(user_id_param UUID, points_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  IF points_amount < 0 THEN
    RAISE EXCEPTION 'Points amount must be positive';
  END IF;
  
  UPDATE profiles
  SET
    total_points = total_points + points_amount,
    available_points = available_points + points_amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
  
  PERFORM update_user_level(user_id_param);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER burgers_updated_at
  BEFORE UPDATE ON burgers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    city,
    level,
    total_points,
    available_points,
    total_reviews,
    is_moderator,
    is_admin,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Unknown'),
    'burger_fan'::user_level,
    0,
    0,
    0,
    FALSE,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update burger ratings when review is added
CREATE OR REPLACE FUNCTION update_burger_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating DECIMAL(3, 2);
  v_total_count INTEGER;
BEGIN
  SELECT AVG(rating)::DECIMAL(3, 2), COUNT(*)
  INTO v_avg_rating, v_total_count
  FROM reviews
  WHERE burger_id = NEW.burger_id;
  
  UPDATE burgers
  SET
    average_rating = COALESCE(v_avg_rating, 0),
    total_ratings = COALESCE(v_total_count, 0),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.burger_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_burger_stats();

-- ============================================================================
-- DONE!
-- ============================================================================
-- Run this entire script in Supabase SQL Editor
-- All tables, enums, policies, and triggers will be created
