-- ============================================
-- SCRIPT PARA SISTEMA DE APROBACIÓN
-- Ejecutar en Supabase SQL Editor
-- ============================================

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

-- 6. Actualizar RLS policies para cities
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved cities" ON cities;
  DROP POLICY IF EXISTS "Anyone can view cities" ON cities;
  DROP POLICY IF EXISTS "Authenticated users can insert cities" ON cities;
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

-- 7. Actualizar RLS para burgers - mostrar solo aprobados públicamente
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved burgers" ON burgers;
END $$;

CREATE POLICY "Anyone can view approved burgers"
ON burgers
FOR SELECT
TO public
USING (
  status = 'approved' 
  OR auth.uid() = submitted_by  -- El usuario puede ver sus propias burgers pendientes
  OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'  -- Admins ven todo
);

-- 8. Actualizar RLS para restaurants
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view approved restaurants" ON restaurants;
  DROP POLICY IF EXISTS "Anyone can view restaurants" ON restaurants;
END $$;

CREATE POLICY "Anyone can view approved restaurants"
ON restaurants
FOR SELECT
TO public
USING (
  status = 'approved' 
  OR auth.uid() = submitted_by
  OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de aprobación configurado correctamente';
  RAISE NOTICE '- Campos status, submitted_by, reviewed_by, reviewed_at añadidos';
  RAISE NOTICE '- Índices creados para mejor rendimiento';
  RAISE NOTICE '- Políticas RLS actualizadas';
END $$;
