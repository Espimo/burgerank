-- ============================================================================
-- ROW LEVEL SECURITY POLICIES PARA AUTENTICACIÓN
-- ============================================================================
-- Este archivo contiene todos los RLS policies necesarios para que 
-- la autenticación con Supabase funcione correctamente

-- ============================================================================
-- USERS TABLE - RLS POLICIES
-- ============================================================================

-- Habilitar RLS en tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios autenticados leer su propio perfil
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Permitir a usuarios autenticados ver perfiles públicos
CREATE POLICY "Users can view public profiles"
  ON public.users FOR SELECT
  USING (public_profile = true);

-- Permitir a usuarios autenticados actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Permitir a usuarios autenticados insertar su propio perfil
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RATINGS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver todas las calificaciones
CREATE POLICY "Anyone can view ratings"
  ON public.ratings FOR SELECT
  USING (true);

-- Permitir a usuarios autenticados crear calificaciones
CREATE POLICY "Authenticated users can create ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios actualizar sus propias calificaciones
CREATE POLICY "Users can update their own ratings"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Permitir a usuarios eliminar sus propias calificaciones
CREATE POLICY "Users can delete their own ratings"
  ON public.ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BURGERS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.burgers ENABLE ROW LEVEL SECURITY;

-- Permitir a todos ver todas las hamburguesas
CREATE POLICY "Anyone can view burgers"
  ON public.burgers FOR SELECT
  USING (true);

-- ============================================================================
-- RESTAURANTS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Permitir a todos ver todos los restaurantes
CREATE POLICY "Anyone can view restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

-- ============================================================================
-- CITIES TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Permitir a todos ver todas las ciudades
CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT
  USING (true);

-- ============================================================================
-- USER_REWARDS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver sus propios rewards
CREATE POLICY "Users can view their own rewards"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir a usuarios autenticados crear rewards para ellos mismos
CREATE POLICY "Users can create their own rewards"
  ON public.user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver sus propias notificaciones
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir a usuarios actualizar sus propias notificaciones
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- REWARDS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Permitir a todos ver todos los rewards
CREATE POLICY "Anyone can view rewards"
  ON public.rewards FOR SELECT
  USING (true);
