-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - VERSIÓN CORREGIDA PARA SIGNUP
-- ============================================================================
-- Ejecutar PRIMERO: Deshabilitar todas las políticas existentes
-- Ejecutar en Supabase SQL Editor

-- ============================================================================
-- STEP 1: LIMPIAR POLÍTICAS EXISTENTES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- ============================================================================
-- STEP 2: HABILITAR RLS
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: CREAR NUEVAS POLÍTICAS
-- ============================================================================

-- POLÍTICA 1: Usuarios autenticados leen su propio perfil
CREATE POLICY "Authenticated users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- POLÍTICA 2: Todos ven perfiles públicos (sin autenticación)
CREATE POLICY "Anyone can view public profiles"
  ON public.users
  FOR SELECT
  USING (public_profile = true OR auth.uid() = id);

-- POLÍTICA 3: Usuarios autenticados actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- POLÍTICA 4: CRÍTICA - Permitir inserción desde API (durante signup)
-- Esta política usa una función para verificar que el usuario puede insertarse a sí mismo
CREATE POLICY "Service role or authenticated user can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (
    -- Permitir si el uid coincide con el id que se intenta insertar
    auth.uid() = id
  );

-- ============================================================================
-- RATINGS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view ratings" ON public.ratings;
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- POLÍTICA 1: Todos ven todas las calificaciones
CREATE POLICY "Anyone can view ratings"
  ON public.ratings
  FOR SELECT
  USING (true);

-- POLÍTICA 2: Usuarios autenticados crean sus calificaciones
CREATE POLICY "Authenticated users can create ratings"
  ON public.ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- POLÍTICA 3: Usuarios actualizan sus propias calificaciones
CREATE POLICY "Users can update their own ratings"
  ON public.ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- POLÍTICA 4: Usuarios eliminan sus propias calificaciones
CREATE POLICY "Users can delete their own ratings"
  ON public.ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- OTRAS TABLAS (SOLO LECTURA PÚBLICA)
-- ============================================================================

-- Deshabilitar políticas antiguas
DROP POLICY IF EXISTS "Anyone can view restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Anyone can view burgers" ON public.burgers;
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;

-- Habilitar RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Tablas públicas de solo lectura
CREATE POLICY "Anyone can view restaurants"
  ON public.restaurants FOR SELECT USING (true);

CREATE POLICY "Anyone can view burgers"
  ON public.burgers FOR SELECT USING (true);

CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT USING (true);

-- User rewards (solo usuario puede ver/crear sus propios)
CREATE POLICY "Users can view their own rewards"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rewards"
  ON public.user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notifications (solo usuario puede ver/actualizar)
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Ejecuta esto después de crear las políticas para verificar:
-- SELECT tablename, policyname, qual, with_check FROM pg_policies WHERE schemaname = 'public';
