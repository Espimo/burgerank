-- ================================================
-- ADD FEATURED COLUMNS TO BURGERS TABLE
-- ================================================
-- Este script agrega las columnas necesarias para el
-- sistema de burgers destacadas en el carousel principal
-- ================================================

-- Agregar columna is_featured (indica si la burger está destacada)
ALTER TABLE burgers 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Agregar columna featured_order (posición en el carousel: 1, 2, 3)
ALTER TABLE burgers 
ADD COLUMN IF NOT EXISTS featured_order INT DEFAULT NULL;

-- Crear índice para optimizar queries de burgers destacadas
CREATE INDEX IF NOT EXISTS idx_burgers_featured 
ON burgers(is_featured, featured_order) 
WHERE is_featured = true;

-- Agregar constraint para asegurar que featured_order solo sea 1, 2 o 3
ALTER TABLE burgers 
ADD CONSTRAINT check_featured_order 
CHECK (featured_order IS NULL OR (featured_order >= 1 AND featured_order <= 3));

-- Agregar constraint único para evitar duplicados en featured_order
-- (solo puede haber una burger con featured_order = 1, otra con 2, etc.)
CREATE UNIQUE INDEX IF NOT EXISTS idx_burgers_featured_order_unique 
ON burgers(featured_order) 
WHERE featured_order IS NOT NULL;

-- Comentarios para documentación
COMMENT ON COLUMN burgers.is_featured IS 'Indica si la burger aparece en el carousel de destacados';
COMMENT ON COLUMN burgers.featured_order IS 'Posición en el carousel (1, 2, 3). NULL si no está featured';

-- ================================================
-- POLÍTICAS RLS (Row Level Security)
-- ================================================

-- Permitir a usuarios leer burgers destacadas
CREATE POLICY IF NOT EXISTS "Anyone can view featured burgers"
ON burgers FOR SELECT
USING (is_featured = true);

-- Solo admins pueden modificar el estado de featured
CREATE POLICY IF NOT EXISTS "Only admins can update featured status"
ON burgers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- ================================================
-- FUNCIÓN HELPER: Obtener burgers destacadas ordenadas
-- ================================================

CREATE OR REPLACE FUNCTION get_featured_burgers()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  restaurant_name VARCHAR,
  city VARCHAR,
  imagen_principal VARCHAR,
  ranking_score DECIMAL,
  simple_average DECIMAL,
  total_ratings INT,
  featured_order INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    r.name as restaurant_name,
    r.city,
    b.imagen_principal,
    b.ranking_score,
    b.simple_average,
    b.total_ratings,
    b.featured_order
  FROM burgers b
  INNER JOIN restaurants r ON b.restaurant_id = r.id
  WHERE b.is_featured = true 
    AND b.is_in_ranking = true
  ORDER BY b.featured_order ASC;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION get_featured_burgers() IS 'Obtiene las burgers destacadas ordenadas por featured_order';

-- ================================================
-- DATOS DE PRUEBA (OPCIONAL - comentar si no necesitas)
-- ================================================

-- Ejemplo: Marcar las 3 burgers con mejor ranking como destacadas
-- UPDATE burgers 
-- SET is_featured = true, featured_order = 1
-- WHERE id = (
--   SELECT id FROM burgers 
--   WHERE is_in_ranking = true 
--   ORDER BY ranking_score DESC 
--   LIMIT 1
-- );

-- UPDATE burgers 
-- SET is_featured = true, featured_order = 2
-- WHERE id = (
--   SELECT id FROM burgers 
--   WHERE is_in_ranking = true AND is_featured = false
--   ORDER BY ranking_score DESC 
--   LIMIT 1
-- );

-- UPDATE burgers 
-- SET is_featured = true, featured_order = 3
-- WHERE id = (
--   SELECT id FROM burgers 
--   WHERE is_in_ranking = true AND is_featured = false
--   ORDER BY ranking_score DESC 
--   LIMIT 1
-- );

-- ================================================
-- VERIFICACIÓN
-- ================================================

-- Ver burgers destacadas actuales
-- SELECT name, restaurant_id, is_featured, featured_order, ranking_score 
-- FROM burgers 
-- WHERE is_featured = true 
-- ORDER BY featured_order;

-- ================================================
-- ROLLBACK (si necesitas deshacer cambios)
-- ================================================

-- DROP FUNCTION IF EXISTS get_featured_burgers();
-- DROP INDEX IF EXISTS idx_burgers_featured_order_unique;
-- DROP INDEX IF EXISTS idx_burgers_featured;
-- ALTER TABLE burgers DROP CONSTRAINT IF EXISTS check_featured_order;
-- ALTER TABLE burgers DROP COLUMN IF EXISTS featured_order;
-- ALTER TABLE burgers DROP COLUMN IF EXISTS is_featured;
