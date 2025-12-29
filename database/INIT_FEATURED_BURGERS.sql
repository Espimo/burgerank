-- ================================================
-- INICIALIZAR BURGERS DESTACADAS
-- ================================================
-- Este script establece las 3 burgers con mejor ranking como destacadas
-- Ejecutar en Supabase SQL Editor

-- Limpiar destacadas anteriores
UPDATE burgers 
SET is_featured = false, featured_order = NULL
WHERE is_featured = true;

-- Marcar las 3 burgers con mejor ranking_score como destacadas
-- Featured #1: La mejor del ranking
UPDATE burgers 
SET is_featured = true, featured_order = 1
WHERE id = (
  SELECT id FROM burgers 
  WHERE is_in_ranking = true 
    AND status = 'approved'
  ORDER BY ranking_score DESC 
  LIMIT 1
);

-- Featured #2: La segunda mejor
UPDATE burgers 
SET is_featured = true, featured_order = 2
WHERE id = (
  SELECT id FROM burgers 
  WHERE is_in_ranking = true 
    AND status = 'approved'
    AND is_featured = false
  ORDER BY ranking_score DESC 
  LIMIT 1
);

-- Featured #3: La tercera mejor
UPDATE burgers 
SET is_featured = true, featured_order = 3
WHERE id = (
  SELECT id FROM burgers 
  WHERE is_in_ranking = true 
    AND status = 'approved'
    AND is_featured = false
  ORDER BY ranking_score DESC 
  LIMIT 1
);

-- Verificar las burgers destacadas
SELECT 
  b.id,
  b.name,
  r.name as restaurant_name,
  c.name as city,
  b.is_featured,
  b.featured_order,
  b.ranking_score,
  b.simple_average,
  b.total_ratings
FROM burgers b
INNER JOIN restaurants r ON b.restaurant_id = r.id
INNER JOIN cities c ON r.city_id = c.id
WHERE b.is_featured = true
ORDER BY b.featured_order ASC;
