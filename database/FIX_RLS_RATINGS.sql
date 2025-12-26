-- ============================================
-- SCRIPT DE CORRECCIÓN DE RLS PARA RATINGS
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Este script asegura que los usuarios autenticados puedan:
-- 1. Insertar sus propias valoraciones
-- 2. Ver valoraciones públicas
-- 3. Actualizar solo sus propias valoraciones

-- ============================================
-- 0. CREAR FUNCIÓN is_user_admin()
-- ============================================

-- Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_user_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 1. VERIFICAR Y CREAR POLÍTICAS PARA RATINGS
-- ============================================

-- Primero verificamos si existen las políticas
DO $$
BEGIN
  -- Eliminar políticas existentes si causan problemas
  DROP POLICY IF EXISTS "Users can insert their own ratings" ON ratings;
  DROP POLICY IF EXISTS "Users can view all ratings" ON ratings;
  DROP POLICY IF EXISTS "Users can update their own ratings" ON ratings;
  DROP POLICY IF EXISTS "Allow authenticated users to insert ratings" ON ratings;
  DROP POLICY IF EXISTS "Anyone can view ratings" ON ratings;
END $$;

-- Habilitar RLS en ratings si no está habilitado
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: usuarios autenticados pueden insertar
CREATE POLICY "Allow authenticated users to insert ratings"
ON ratings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT: cualquiera puede ver ratings
CREATE POLICY "Anyone can view ratings"
ON ratings
FOR SELECT
TO public
USING (true);

-- Política para UPDATE: solo el propietario puede actualizar
CREATE POLICY "Users can update their own ratings"
ON ratings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: solo el propietario puede eliminar
CREATE POLICY "Users can delete their own ratings"
ON ratings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 2. VERIFICAR Y CREAR POLÍTICAS PARA BURGERS
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved burgers" ON burgers;
  DROP POLICY IF EXISTS "Authenticated users can insert burgers" ON burgers;
  DROP POLICY IF EXISTS "Admins can update burgers" ON burgers;
END $$;

ALTER TABLE burgers ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver hamburguesas aprobadas
CREATE POLICY "Anyone can view approved burgers"
ON burgers
FOR SELECT
TO public
USING (status = 'approved' OR auth.uid() = submitted_by);

-- Usuarios autenticados pueden crear hamburguesas
CREATE POLICY "Authenticated users can insert burgers"
ON burgers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Admins o el creador pueden actualizar
CREATE POLICY "Users can update their burgers or admins all"
ON burgers
FOR UPDATE
TO authenticated
USING (
  auth.uid() = submitted_by 
  OR 
  is_user_admin()
);

-- ============================================
-- 3. VERIFICAR Y CREAR POLÍTICAS PARA RESTAURANTS
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view restaurants" ON restaurants;
  DROP POLICY IF EXISTS "Authenticated users can insert restaurants" ON restaurants;
END $$;

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view restaurants"
ON restaurants
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert restaurants"
ON restaurants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 4. VERIFICAR Y CREAR POLÍTICAS PARA CITIES
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view cities" ON cities;
  DROP POLICY IF EXISTS "Authenticated users can insert cities" ON cities;
END $$;

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cities"
ON cities
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert cities"
ON cities
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 5. VERIFICAR Y CREAR POLÍTICAS PARA USERS
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON users;
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
END $$;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id OR is_user_admin());

CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- 6. VERIFICAR Y CREAR POLÍTICAS PARA NOTIFICATIONS
-- ============================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
  DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
END $$;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS configuradas correctamente';
  RAISE NOTICE '- ratings: insert, select, update, delete';
  RAISE NOTICE '- burgers: select, insert, update';
  RAISE NOTICE '- restaurants: select, insert';
  RAISE NOTICE '- cities: select, insert';
  RAISE NOTICE '- users: select, update';
  RAISE NOTICE '- notifications: select, insert';
END $$;
