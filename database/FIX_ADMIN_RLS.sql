-- ==========================================
-- ARREGLAR POLÍTICAS RLS PARA EVITAR RECURSIÓN
-- ==========================================

-- 1. ELIMINAR LAS POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- 2. PERMITIR QUE TODOS LOS USUARIOS AUTENTICADOS LEAN SU PROPIO REGISTRO
-- Esto es necesario para que puedan verificar su estado de is_admin
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

-- 3. PERMITIR QUE LOS USUARIOS ACTUALICEN SU PROPIO PERFIL
-- (pero no el campo is_admin, eso se controla a nivel de aplicación)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id);

-- 4. CREAR UNA FUNCIÓN HELPER PARA VERIFICAR SI UN USUARIO ES ADMIN
-- Esto evita la recursión porque usa una consulta directa sin políticas RLS
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. POLÍTICAS PARA ADMINS (usando la función helper)
-- Los admins pueden ver todos los usuarios
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT 
  USING (public.is_user_admin(auth.uid()));

-- Los admins pueden actualizar cualquier usuario
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE 
  USING (public.is_user_admin(auth.uid()));

-- 6. POLÍTICAS PARA OTRAS TABLAS
-- Admins pueden gestionar restaurantes
DROP POLICY IF EXISTS "Admins can manage restaurants" ON public.restaurants;
CREATE POLICY "Admins can manage restaurants" ON public.restaurants
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- Admins pueden gestionar hamburguesas
DROP POLICY IF EXISTS "Admins can manage burgers" ON public.burgers;
CREATE POLICY "Admins can manage burgers" ON public.burgers
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- Admins pueden gestionar promociones
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.restaurant_promotions;
CREATE POLICY "Admins can manage promotions" ON public.restaurant_promotions
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- Admins pueden gestionar ratings
DROP POLICY IF EXISTS "Admins can manage ratings" ON public.ratings;
CREATE POLICY "Admins can manage ratings" ON public.ratings
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- 7. VERIFICAR QUE FUNCIONÓ
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'users'
ORDER BY tablename, policyname;
