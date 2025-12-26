-- ============================================
-- SCRIPT PARA SISTEMA DE APROBACIÓN
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 0. Asegurar que la tabla users tiene el campo is_admin
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 1. Añadir campos de aprobación a CITIES si no existen
ALTER TABLE cities 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 2. Añadir campos de revisión a RESTAURANTS si no existen
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 3. Añadir campos de revisión a BURGERS si no existen
ALTER TABLE burgers 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_burgers_status ON burgers(status);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_cities_status ON cities(status);

-- 5. Actualizar ciudades existentes para que tengan status='approved'
UPDATE cities SET status = 'approved' WHERE status IS NULL;

-- 6. Crear función helper para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_user_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Actualizar RLS policies para cities
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved cities" ON cities;
  DROP POLICY IF EXISTS "Anyone can view cities" ON cities;
  DROP POLICY IF EXISTS "Authenticated users can insert cities" ON cities;
  DROP POLICY IF EXISTS "Admins can update cities" ON cities;
END $$;

-- Cualquiera puede ver ciudades aprobadas
CREATE POLICY "Anyone can view approved cities"
ON cities
FOR SELECT
TO public
USING (status = 'approved' OR status IS NULL);

-- Usuarios autenticados pueden crear ciudades (pendientes de aprobación)
CREATE POLICY "Authenticated users can insert cities"
ON cities
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Admins pueden actualizar ciudades
CREATE POLICY "Admins can update cities"
ON cities
FOR UPDATE
TO authenticated
USING (is_user_admin());

-- 8. Actualizar RLS para burgers - mostrar solo aprobados públicamente
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved burgers" ON burgers;
  DROP POLICY IF EXISTS "Users can view approved and own burgers" ON burgers;
END $$;

CREATE POLICY "Users can view approved and own burgers"
ON burgers
FOR SELECT
TO public
USING (
  status = 'approved' 
  OR auth.uid() = submitted_by  -- El usuario puede ver sus propias burgers pendientes
  OR is_user_admin()  -- Admins ven todo
);

-- 9. Actualizar RLS para restaurants
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved restaurants" ON restaurants;
  DROP POLICY IF EXISTS "Users can view approved and own restaurants" ON restaurants;
  DROP POLICY IF EXISTS "Anyone can view restaurants" ON restaurants;
END $$;

CREATE POLICY "Users can view approved and own restaurants"
ON restaurants
FOR SELECT
TO public
USING (
  status = 'approved' 
  OR auth.uid() = submitted_by
  OR is_user_admin()
);

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de aprobación configurado correctamente';
  RAISE NOTICE '- Campo is_admin añadido a users (si no existía)';
  RAISE NOTICE '- Campos status, submitted_by, reviewed_by, reviewed_at añadidos';
  RAISE NOTICE '- Función is_user_admin() creada';
  RAISE NOTICE '- Índices creados para mejor rendimiento';
  RAISE NOTICE '- Políticas RLS actualizadas';
END $$;
