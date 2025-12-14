-- BurgeRank Database Schema for Supabase
-- Complete schema with all tables, relationships, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INT DEFAULT 0,
  category VARCHAR(50) DEFAULT 'Burger Fan', -- 'Burger Fan', 'Burger Lover', 'Burger Obsessed'
  public_profile BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial cities
INSERT INTO public.cities (name, country) VALUES
  ('Madrid', 'España'),
  ('Barcelona', 'España'),
  ('Valencia', 'España'),
  ('Sevilla', 'España'),
  ('Bilbao', 'España')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RESTAURANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  address TEXT,
  phone VARCHAR(20),
  hours VARCHAR(100),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_restaurants_city_id ON public.restaurants(city_id);

-- ============================================================================
-- BURGERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.burgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  description TEXT,
  position INT,
  type VARCHAR(50), -- 'premium', 'clásica', 'doble', 'vegana'
  tags TEXT[], -- array of tags: ['Jugosa', 'Carne Fresca', 'Premium']
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_burgers_restaurant_id ON public.burgers(restaurant_id);
CREATE INDEX idx_burgers_city_id ON public.burgers(city_id);
CREATE INDEX idx_burgers_position ON public.burgers(position);

-- ============================================================================
-- RATINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  burger_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
  pan_rating INT CHECK (pan_rating >= 1 AND pan_rating <= 3),
  carne_rating INT CHECK (carne_rating >= 1 AND carne_rating <= 3),
  toppings_rating INT CHECK (toppings_rating >= 1 AND toppings_rating <= 3),
  salsa_rating INT CHECK (salsa_rating >= 1 AND salsa_rating <= 3),
  price DECIMAL(5, 2),
  comment TEXT,
  has_ticket BOOLEAN DEFAULT FALSE,
  ticket_url TEXT,
  consumption_type VARCHAR(50), -- 'local' or 'delivery'
  appetizers TEXT[], -- array: ['fries', 'nachos', 'chicken', 'rings', 'none']
  points_awarded INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, burger_id)
);

CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_ratings_burger_id ON public.ratings(burger_id);
CREATE INDEX idx_ratings_created_at ON public.ratings(created_at DESC);

-- ============================================================================
-- BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  requirement_type VARCHAR(100), -- 'total_ratings', 'average_rating', 'cities_visited', 'points', etc
  requirement_value INT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert predefined badges
INSERT INTO public.badges (name, description, emoji, requirement_type, requirement_value) VALUES
  ('Primer Rating', 'Realiza tu primera valoración', '⭐', 'first_rating', 1),
  ('Crítico Ardiente', 'Valora 10 hamburguesas', '🔥', 'total_ratings', 10),
  ('Maestro de Sabores', 'Valora 25 hamburguesas', '👑', 'total_ratings', 25),
  ('Coleccionista', 'Valora 50 hamburguesas', '🏆', 'total_ratings', 50),
  ('Explorador de Ciudades', 'Valora burgers en 5 ciudades', '🗺️', 'cities_visited', 5),
  ('Paladar Exigente', 'Promedio de 4.5+ en ratings', '💎', 'average_rating', 45),
  ('Crítico Leyenda', 'Valora 100 hamburguesas', '🌟', 'total_ratings', 100)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- USER_BADGES TABLE (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON public.user_badges(badge_id);

-- ============================================================================
-- REWARDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  cost_points INT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert predefined rewards
INSERT INTO public.rewards (name, description, emoji, cost_points) VALUES
  ('10% Descuento', '10% en tu próxima burger', '🏷️', 50),
  ('Bebida Gratis', 'Una bebida con tu burger', '🥤', 75),
  ('Aperitivo Gratis', 'Papas, nachos o alitas', '🍟', 100),
  ('Hamburguesa Gratis', 'Una hamburguesa completa', '🍔', 150),
  ('50% Descuento', '50% en menú completo', '🎉', 200)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- USER_REWARDS TABLE (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_rewards_user_id ON public.user_rewards(user_id);
CREATE INDEX idx_user_rewards_reward_id ON public.user_rewards(reward_id);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100), -- 'level_up', 'badge_unlocked', 'new_burger', etc
  icon_emoji VARCHAR(10),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to calculate and update burger average rating
CREATE OR REPLACE FUNCTION public.update_burger_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.burgers
  SET 
    average_rating = (
      SELECT ROUND(AVG(overall_rating)::numeric, 2)
      FROM public.ratings
      WHERE burger_id = NEW.burger_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.ratings
      WHERE burger_id = NEW.burger_id
    ),
    updated_at = NOW()
  WHERE id = NEW.burger_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for burger rating updates
CREATE TRIGGER trigger_update_burger_rating
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_burger_rating();

-- Function to calculate and update user points and category
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET 
    points = COALESCE((
      SELECT SUM(points_awarded)
      FROM public.ratings
      WHERE user_id = NEW.user_id
    ), 0),
    category = CASE 
      WHEN COALESCE((
        SELECT SUM(points_awarded)
        FROM public.ratings
        WHERE user_id = NEW.user_id
      ), 0) >= 300 THEN 'Burger Obsessed'
      WHEN COALESCE((
        SELECT SUM(points_awarded)
        FROM public.ratings
        WHERE user_id = NEW.user_id
      ), 0) >= 101 THEN 'Burger Lover'
      ELSE 'Burger Fan'
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user stats updates
CREATE TRIGGER trigger_update_user_stats
AFTER INSERT OR UPDATE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_user_stats();

-- Function to update restaurant rating
CREATE OR REPLACE FUNCTION public.update_restaurant_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_restaurant_id UUID;
BEGIN
  -- Get restaurant_id from burgers table using burger_id
  SELECT restaurant_id INTO v_restaurant_id
  FROM public.burgers
  WHERE id = NEW.burger_id;
  
  -- Update restaurant rating
  UPDATE public.restaurants
  SET 
    average_rating = (
      SELECT ROUND(AVG(b.average_rating)::numeric, 2)
      FROM public.burgers b
      WHERE b.restaurant_id = v_restaurant_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.ratings r
      JOIN public.burgers b ON r.burger_id = b.id
      WHERE b.restaurant_id = v_restaurant_id
    ),
    updated_at = NOW()
  WHERE id = v_restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for restaurant rating updates
CREATE TRIGGER trigger_update_restaurant_rating
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_restaurant_rating();

-- Function to check and unlock badges
CREATE OR REPLACE FUNCTION public.check_and_unlock_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name VARCHAR) AS $$
DECLARE
  v_total_ratings INT;
  v_avg_rating DECIMAL;
  v_cities_count INT;
  v_first_rating BOOLEAN;
BEGIN
  -- Get user stats
  SELECT COUNT(DISTINCT r.id) INTO v_total_ratings
  FROM public.ratings r
  WHERE r.user_id = p_user_id;

  SELECT ROUND(AVG(GREATEST(r.overall_rating, 0))::numeric, 2) INTO v_avg_rating
  FROM public.ratings r
  WHERE r.user_id = p_user_id;

  SELECT COUNT(DISTINCT b.city_id) INTO v_cities_count
  FROM public.ratings r
  JOIN public.burgers b ON r.burger_id = b.id
  WHERE r.user_id = p_user_id;

  SELECT EXISTS(
    SELECT 1 FROM public.ratings WHERE user_id = p_user_id LIMIT 1
  ) INTO v_first_rating;

  -- Check badges and insert if earned but not yet unlocked
  -- Primer Rating
  IF v_first_rating THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE requirement_type = 'first_rating'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Crítico Ardiente (10 ratings)
  IF v_total_ratings >= 10 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Crítico Ardiente'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Maestro de Sabores (25 ratings)
  IF v_total_ratings >= 25 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Maestro de Sabores'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Coleccionista (50 ratings)
  IF v_total_ratings >= 50 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Coleccionista'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Explorador de Ciudades (5 cities)
  IF v_cities_count >= 5 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Explorador de Ciudades'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Paladar Exigente (4.5+ avg)
  IF v_avg_rating >= 4.5 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Paladar Exigente'
    ON CONFLICT DO NOTHING;
  END IF;

  -- Crítico Leyenda (100 ratings)
  IF v_total_ratings >= 100 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM public.badges WHERE name = 'Crítico Leyenda'
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN QUERY
  SELECT ub.badge_id, b.name
  FROM public.user_badges ub
  JOIN public.badges b ON ub.badge_id = b.id
  WHERE ub.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Users: Can view own profile or public profiles
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT USING (public_profile = TRUE);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Ratings: Can view all, create own, update/delete own
CREATE POLICY "Anyone can view ratings" ON public.ratings
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Can view own
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- User Rewards: Can view own
CREATE POLICY "Users can view own rewards" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

-- User Badges: Can view own
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Burgers and Restaurants: Anyone can view
ALTER TABLE public.burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view burgers" ON public.burgers FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view restaurants" ON public.restaurants FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view rewards" ON public.rewards FOR SELECT USING (TRUE);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Top ranked burgers
CREATE OR REPLACE VIEW public.top_burgers AS
SELECT 
  b.id,
  b.name,
  b.restaurant_id,
  r.name AS restaurant_name,
  c.name AS city,
  b.average_rating,
  b.total_ratings,
  ROW_NUMBER() OVER (ORDER BY b.average_rating DESC, b.total_ratings DESC) AS position
FROM public.burgers b
JOIN public.restaurants r ON b.restaurant_id = r.id
JOIN public.cities c ON b.city_id = c.id
WHERE b.total_ratings > 0
ORDER BY b.average_rating DESC, b.total_ratings DESC;

-- View: User stats
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  u.id,
  u.username,
  u.points,
  u.category,
  COUNT(DISTINCT r.id) AS total_ratings,
  COUNT(DISTINCT b.city_id) AS cities_visited,
  ROUND(AVG(r.overall_rating)::numeric, 2) AS average_rating,
  COUNT(DISTINCT ub.badge_id) AS badges_unlocked
FROM public.users u
LEFT JOIN public.ratings r ON u.id = r.user_id
LEFT JOIN public.burgers b ON r.burger_id = b.id
LEFT JOIN public.user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.username, u.points, u.category;

-- View: Restaurants with stats
CREATE OR REPLACE VIEW public.restaurants_with_stats AS
SELECT 
  r.id,
  r.name,
  c.name AS city,
  r.address,
  r.phone,
  r.hours,
  r.average_rating,
  r.total_ratings,
  COUNT(DISTINCT b.id) AS burger_count
FROM public.restaurants r
JOIN public.cities c ON r.city_id = c.id
LEFT JOIN public.burgers b ON r.id = b.restaurant_id
GROUP BY r.id, r.name, c.name, r.address, r.phone, r.hours, r.average_rating, r.total_ratings;
