-- ============================================================================
-- 🍔 BURGERANK - SCRIPT COMPLETO DE BASE DE DATOS
-- ============================================================================
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard → SQL Editor
-- 2. Copia y pega TODO este script
-- 3. Ejecuta (Run)
-- 4. Espera a que termine
-- 5. Prueba registrarte en la web
-- ============================================================================

-- ============================================================================
-- PASO 1: LIMPIAR TODO (BORRAR TABLAS EXISTENTES)
-- ============================================================================

-- Eliminar triggers primero
DROP TRIGGER IF EXISTS trigger_update_burger_rating ON public.ratings;
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.ratings;
DROP TRIGGER IF EXISTS trigger_update_restaurant_rating ON public.ratings;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Eliminar funciones
DROP FUNCTION IF EXISTS public.update_burger_rating() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_stats() CASCADE;
DROP FUNCTION IF EXISTS public.update_restaurant_rating() CASCADE;
DROP FUNCTION IF EXISTS public.check_and_unlock_badges(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Eliminar vistas
DROP VIEW IF EXISTS public.top_burgers CASCADE;
DROP VIEW IF EXISTS public.user_stats CASCADE;
DROP VIEW IF EXISTS public.restaurants_with_stats CASCADE;

-- Eliminar tablas en orden correcto (por dependencias)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.ratings CASCADE;
DROP TABLE IF EXISTS public.burgers CASCADE;
DROP TABLE IF EXISTS public.restaurants CASCADE;
DROP TABLE IF EXISTS public.rewards CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================================================
-- PASO 2: CREAR TABLAS
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLA: users (perfiles de usuario)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INT DEFAULT 0,
  category VARCHAR(50) DEFAULT 'Burger Fan',
  public_profile BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: cities
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100) DEFAULT 'España',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: restaurants
CREATE TABLE public.restaurants (
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

-- TABLA: burgers
CREATE TABLE public.burgers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  description TEXT,
  position INT,
  type VARCHAR(50),
  tags TEXT[],
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: ratings
CREATE TABLE public.ratings (
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
  has_ticket BOOLEAN DEFAULT false,
  ticket_url TEXT,
  consumption_type VARCHAR(50),
  appetizers TEXT[],
  points_awarded INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, burger_id)
);

-- TABLA: badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  requirement_type VARCHAR(100),
  requirement_value INT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: user_badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- TABLA: rewards
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  cost_points INT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: user_rewards
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  icon_emoji VARCHAR(10),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PASO 3: CREAR ÍNDICES
-- ============================================================================

CREATE INDEX idx_restaurants_city_id ON public.restaurants(city_id);
CREATE INDEX idx_burgers_restaurant_id ON public.burgers(restaurant_id);
CREATE INDEX idx_burgers_city_id ON public.burgers(city_id);
CREATE INDEX idx_burgers_position ON public.burgers(position);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_ratings_burger_id ON public.ratings(burger_id);
CREATE INDEX idx_ratings_created_at ON public.ratings(created_at DESC);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_rewards_user_id ON public.user_rewards(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- ============================================================================
-- PASO 4: HABILITAR RLS (Row Level Security)
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PASO 5: CREAR POLÍTICAS RLS
-- ============================================================================

-- =====================
-- USERS - Políticas
-- =====================

-- Permitir INSERT cuando auth.uid() coincide con el id del nuevo registro
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir SELECT de su propio perfil
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Permitir SELECT de perfiles públicos
CREATE POLICY "users_select_public" ON public.users
  FOR SELECT USING (public_profile = true);

-- Permitir UPDATE de su propio perfil
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- =====================
-- CITIES - Públicas
-- =====================
CREATE POLICY "cities_select_all" ON public.cities
  FOR SELECT USING (true);

-- =====================
-- RESTAURANTS - Públicas
-- =====================
CREATE POLICY "restaurants_select_all" ON public.restaurants
  FOR SELECT USING (true);

-- =====================
-- BURGERS - Públicas
-- =====================
CREATE POLICY "burgers_select_all" ON public.burgers
  FOR SELECT USING (true);

-- =====================
-- BADGES - Públicas
-- =====================
CREATE POLICY "badges_select_all" ON public.badges
  FOR SELECT USING (true);

-- =====================
-- REWARDS - Públicas
-- =====================
CREATE POLICY "rewards_select_all" ON public.rewards
  FOR SELECT USING (true);

-- =====================
-- RATINGS - Políticas
-- =====================
CREATE POLICY "ratings_select_all" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "ratings_insert_own" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_update_own" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ratings_delete_own" ON public.ratings
  FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- USER_BADGES - Políticas
-- =====================
CREATE POLICY "user_badges_select_own" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_badges_insert_own" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- USER_REWARDS - Políticas
-- =====================
CREATE POLICY "user_rewards_select_own" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_rewards_insert_own" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- NOTIFICATIONS - Políticas
-- =====================
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- PASO 6: CREAR FUNCIÓN PARA AUTO-CREAR PERFIL EN SIGNUP
-- ============================================================================

-- Esta función se ejecuta automáticamente cuando un usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, public_profile, points, category)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    false,
    0,
    'Burger Fan'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se crea un usuario en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PASO 7: INSERTAR DATOS DE EJEMPLO
-- ============================================================================

-- Ciudades
INSERT INTO public.cities (name, country) VALUES
  ('Madrid', 'España'),
  ('Barcelona', 'España'),
  ('Valencia', 'España'),
  ('Sevilla', 'España'),
  ('Bilbao', 'España');

-- Badges
INSERT INTO public.badges (name, description, emoji, requirement_type, requirement_value) VALUES
  ('Primer Rating', 'Realiza tu primera valoración', '⭐', 'first_rating', 1),
  ('Crítico Ardiente', 'Valora 10 hamburguesas', '🔥', 'total_ratings', 10),
  ('Maestro de Sabores', 'Valora 25 hamburguesas', '👑', 'total_ratings', 25),
  ('Coleccionista', 'Valora 50 hamburguesas', '🏆', 'total_ratings', 50),
  ('Explorador de Ciudades', 'Valora burgers en 5 ciudades', '🗺️', 'cities_visited', 5),
  ('Paladar Exigente', 'Promedio de 4.5+ en ratings', '💎', 'average_rating', 45),
  ('Crítico Leyenda', 'Valora 100 hamburguesas', '🌟', 'total_ratings', 100);

-- Rewards
INSERT INTO public.rewards (name, description, emoji, cost_points) VALUES
  ('10% Descuento', '10% en tu próxima burger', '🏷️', 50),
  ('Bebida Gratis', 'Una bebida con tu burger', '🥤', 75),
  ('Aperitivo Gratis', 'Papas, nachos o alitas', '🍟', 100),
  ('Hamburguesa Gratis', 'Una hamburguesa completa', '🍔', 150),
  ('50% Descuento', '50% en menú completo', '🎉', 200);

-- Restaurantes (con referencia a city_id)
DO $$
DECLARE
  madrid_id UUID;
  barcelona_id UUID;
  valencia_id UUID;
  sevilla_id UUID;
  bilbao_id UUID;
BEGIN
  SELECT id INTO madrid_id FROM public.cities WHERE name = 'Madrid';
  SELECT id INTO barcelona_id FROM public.cities WHERE name = 'Barcelona';
  SELECT id INTO valencia_id FROM public.cities WHERE name = 'Valencia';
  SELECT id INTO sevilla_id FROM public.cities WHERE name = 'Sevilla';
  SELECT id INTO bilbao_id FROM public.cities WHERE name = 'Bilbao';

  -- Restaurantes Madrid
  INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
    ('Burger Palace', madrid_id, 'Calle Gran Vía 45', '915551234', 'Lun-Dom 12:00-23:00'),
    ('Fast Burger', madrid_id, 'Calle Serrano 78', '915552345', 'Lun-Dom 11:00-24:00'),
    ('Premium Beef', madrid_id, 'Paseo Castellana 120', '915553456', 'Mar-Dom 13:00-23:30'),
    ('Smash Burguer', madrid_id, 'Calle Fuencarral 92', '915554567', 'Lun-Dom 12:30-23:00');

  -- Restaurantes Barcelona
  INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
    ('Grill House', barcelona_id, 'Passeig de Gràcia 55', '934441234', 'Lun-Dom 12:00-23:00'),
    ('Green Burger', barcelona_id, 'Carrer de Mallorca 234', '934442345', 'Lun-Dom 11:30-22:30'),
    ('Burger Barcelona', barcelona_id, 'La Rambla 89', '934443456', 'Lun-Dom 11:00-24:00'),
    ('The Meat House', barcelona_id, 'Carrer de València 156', '934444567', 'Mar-Dom 13:00-23:00');

  -- Restaurantes Valencia
  INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
    ('Burger Artisan', valencia_id, 'Carrer de Colón 45', '963331234', 'Lun-Dom 12:00-22:30'),
    ('Turia Burgers', valencia_id, 'Avinguda del Port 78', '963332345', 'Mar-Dom 12:30-23:00'),
    ('Valencia Grill', valencia_id, 'Carrer de la Pau 23', '963333456', 'Lun-Dom 11:00-23:00');

  -- Restaurantes Sevilla
  INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
    ('Andaluz Burger', sevilla_id, 'Calle Sierpes 67', '954441234', 'Lun-Dom 12:00-23:00'),
    ('Giralda Grill', sevilla_id, 'Avenida de la Constitución 34', '954442345', 'Mar-Dom 13:00-24:00'),
    ('Triana Burger', sevilla_id, 'Calle Betis 45', '954443456', 'Lun-Sab 12:30-23:30');

  -- Restaurantes Bilbao
  INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
    ('Basque Burger', bilbao_id, 'Gran Vía Don Diego López de Haro 23', '944551234', 'Lun-Dom 12:00-22:30'),
    ('Guggenheim Grill', bilbao_id, 'Abandoibarra Etorbidea 12', '944552345', 'Mar-Dom 11:30-23:00'),
    ('Casco Viejo Burger', bilbao_id, 'Casco Viejo 56', '944553456', 'Lun-Dom 12:00-23:00');
END $$;

-- Burgers (con referencia a restaurant_id y city_id)
DO $$
DECLARE
  madrid_id UUID;
  barcelona_id UUID;
  valencia_id UUID;
  sevilla_id UUID;
  bilbao_id UUID;
  rest_id UUID;
BEGIN
  SELECT id INTO madrid_id FROM public.cities WHERE name = 'Madrid';
  SELECT id INTO barcelona_id FROM public.cities WHERE name = 'Barcelona';
  SELECT id INTO valencia_id FROM public.cities WHERE name = 'Valencia';
  SELECT id INTO sevilla_id FROM public.cities WHERE name = 'Sevilla';
  SELECT id INTO bilbao_id FROM public.cities WHERE name = 'Bilbao';

  -- Burgers Madrid - Burger Palace
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Palace';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('The King Burger', rest_id, madrid_id, 'Smash beef con queso fundido y bacon crujiente', 'premium', ARRAY['Jugosa', 'Carne Fresca', 'Premium'], 1, 4.8, 245),
    ('Double Stack Madrid', rest_id, madrid_id, 'Dos carnes smash con queso americano y cebolla', 'doble', ARRAY['Doble', 'Clásica'], 2, 4.6, 198);

  -- Burgers Madrid - Fast Burger
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Fast Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('BBQ Master', rest_id, madrid_id, 'Ternera con salsa BBQ casera', 'premium', ARRAY['BBQ', 'Ternera'], 3, 4.7, 212),
    ('Classic Madrid', rest_id, madrid_id, 'La clásica de toda la vida, simple y perfecta', 'clásica', ARRAY['Clásica', 'Económica'], 4, 4.4, 189),
    ('The Inferno', rest_id, madrid_id, 'Picante con jalapeños y salsa de fuego', 'premium', ARRAY['Picante', 'Jalapeños'], 8, 4.5, 156);

  -- Burgers Madrid - Premium Beef
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Premium Beef';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Premium Gold', rest_id, madrid_id, 'Carne wagyu con foie gras', 'premium', ARRAY['Wagyu', 'Luxury'], 5, 4.9, 89),
    ('Truffle Burger', rest_id, madrid_id, 'Con queso trufado y cebolla caramelizada', 'premium', ARRAY['Trufado', 'Gourmet'], 6, 4.8, 76);

  -- Burgers Madrid - Smash Burguer
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Smash Burguer';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Smash Classic', rest_id, madrid_id, 'Dos smash con queso y bacon', 'premium', ARRAY['Smash', 'Bacon'], 7, 4.7, 203);

  -- Burgers Barcelona - Grill House
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Grill House';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Smoky BBQ', rest_id, barcelona_id, 'Ternera con salsa BBQ y cebolla caramelizada', 'premium', ARRAY['BBQ', 'Ternera', 'Salsa'], 9, 4.7, 186);

  -- Burgers Barcelona - Green Burger
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Green Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Green Supreme', rest_id, barcelona_id, 'Lentejas y setas con aguacate y rúcula', 'vegana', ARRAY['Vegana', 'Sano'], 10, 4.2, 156);

  -- Burgers Barcelona - Burger Barcelona
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Barcelona';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('BCN Meat Heaven', rest_id, barcelona_id, 'Tres tipos de carnes premium', 'premium', ARRAY['Triple', 'Premium'], 11, 4.6, 198),
    ('Catalan Burger', rest_id, barcelona_id, 'Con tomates de Ribarroja y jamón ibérico', 'premium', ARRAY['Ibérico', 'Local'], 12, 4.8, 212);

  -- Burgers Barcelona - The Meat House
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'The Meat House';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('The Beast', rest_id, barcelona_id, 'Gran burger con tres carnes y tocino', 'doble', ARRAY['Beast', 'Triple'], 13, 4.7, 189),
    ('Barcelona Triple Stack', rest_id, barcelona_id, 'Tres carnes apiladas', 'premium', ARRAY['Triple', 'Stack'], 16, 4.8, 201);

  -- Burgers Valencia
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Artisan';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Clásica Tradicional', rest_id, valencia_id, 'Simple pero perfecta, carne de calidad con queso', 'clásica', ARRAY['Clásica', 'Económica'], 17, 4.5, 312);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Turia Burgers';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Turia Premium', rest_id, valencia_id, 'Con ingredientes especiales del río Turia', 'premium', ARRAY['Premium', 'Local'], 18, 4.6, 178);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Valencia Grill';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Valencia Grill Master', rest_id, valencia_id, 'Especialidad a la parrilla', 'premium', ARRAY['Parrilla', 'Especial'], 20, 4.7, 198);

  -- Burgers Sevilla
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Andaluz Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Andaluz Classic', rest_id, sevilla_id, 'Clásica andaluza con especias', 'clásica', ARRAY['Andaluz', 'Especias'], 25, 4.5, 189);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Giralda Grill';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Giralda Premium', rest_id, sevilla_id, 'Premium con vistas a la Giralda', 'premium', ARRAY['Premium', 'Monumental'], 26, 4.7, 167);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Triana Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Triana Soul', rest_id, sevilla_id, 'El alma de Triana en una burger', 'premium', ARRAY['Soul', 'Triana'], 29, 4.6, 156);

  -- Burgers Bilbao
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Basque Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Basque Country', rest_id, bilbao_id, 'Ingredientes vascos locales', 'premium', ARRAY['Vasco', 'Local'], 31, 4.7, 198);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Guggenheim Grill';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Guggenheim', rest_id, bilbao_id, 'Arte moderno en una burger', 'premium', ARRAY['Arte', 'Moderno'], 32, 4.6, 167);

  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Casco Viejo Burger';
  INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags, position, average_rating, total_ratings) VALUES
    ('Casco Viejo Wonder', rest_id, bilbao_id, 'Maravilla del Casco Viejo', 'premium', ARRAY['Medieval', 'Tradicional'], 34, 4.7, 178),
    ('Basque Excellence', rest_id, bilbao_id, 'Excelencia vasca', 'premium', ARRAY['Excelencia', 'Vasco'], 36, 4.9, 189);
END $$;

-- ============================================================================
-- PASO 8: VERIFICACIÓN FINAL
-- ============================================================================

-- Este SELECT muestra el resumen de lo creado
SELECT 'Tablas creadas:' AS info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT 'Ciudades:' AS info, COUNT(*) AS total FROM public.cities;
SELECT 'Restaurantes:' AS info, COUNT(*) AS total FROM public.restaurants;
SELECT 'Burgers:' AS info, COUNT(*) AS total FROM public.burgers;
SELECT 'Badges:' AS info, COUNT(*) AS total FROM public.badges;
SELECT 'Rewards:' AS info, COUNT(*) AS total FROM public.rewards;

SELECT 'Políticas RLS en users:' AS info;
SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users';

SELECT '✅ BASE DE DATOS CONFIGURADA CORRECTAMENTE' AS resultado;
SELECT 'Ahora puedes registrarte en la web' AS instruccion;
