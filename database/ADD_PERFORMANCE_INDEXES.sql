-- =============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =============================================
-- Ejecutar este script en Supabase SQL Editor
-- para mejorar significativamente el rendimiento de queries

-- BURGERS TABLE
-- Índice compuesto para queries de ranking con filtros
CREATE INDEX IF NOT EXISTS idx_burgers_ranking_lookup 
ON burgers(status, is_in_ranking, ranking_score DESC, total_ratings DESC);

-- Índice para búsqueda por restaurante
CREATE INDEX IF NOT EXISTS idx_burgers_restaurant 
ON burgers(restaurant_id, status);

-- Índice para destacadas
CREATE INDEX IF NOT EXISTS idx_burgers_featured 
ON burgers(is_featured, featured_order) 
WHERE is_featured = true;

-- Índice para búsqueda por ciudad (via restaurant)
CREATE INDEX IF NOT EXISTS idx_burgers_city_lookup
ON burgers(city_id, status, ranking_score DESC);

-- RATINGS TABLE
-- Índice compuesto para queries de perfil de usuario
CREATE INDEX IF NOT EXISTS idx_ratings_user_lookup 
ON ratings(user_id, created_at DESC);

-- Índice para obtener ratings por burger
CREATE INDEX IF NOT EXISTS idx_ratings_burger 
ON ratings(burger_id, created_at DESC);

-- Índice para estadísticas de verificación
CREATE INDEX IF NOT EXISTS idx_ratings_verified 
ON ratings(burger_id, has_ticket);

-- RESTAURANTS TABLE
-- Índice para búsqueda por ciudad
CREATE INDEX IF NOT EXISTS idx_restaurants_city 
ON restaurants(city_id, status);

-- Índice para búsqueda por nombre
CREATE INDEX IF NOT EXISTS idx_restaurants_name 
ON restaurants(name, status);

-- USER_BADGES TABLE
-- Índice para obtener badges de usuario
CREATE INDEX IF NOT EXISTS idx_user_badges_lookup 
ON user_badges(user_id, unlocked_at DESC);

-- CITIES TABLE
-- Índice para búsqueda por nombre
CREATE INDEX IF NOT EXISTS idx_cities_name 
ON cities(name);

-- REWARDS TABLE
-- Índice para ordenar por costo
CREATE INDEX IF NOT EXISTS idx_rewards_cost 
ON rewards(cost_points ASC);

-- =============================================
-- VERIFICAR ÍNDICES CREADOS
-- =============================================
-- Ejecutar esta query para ver todos los índices:
-- SELECT schemaname, tablename, indexname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;

-- =============================================
-- ESTADÍSTICAS Y MANTENIMIENTO
-- =============================================
-- Actualizar estadísticas de las tablas para mejor planificación de queries
ANALYZE burgers;
ANALYZE ratings;
ANALYZE restaurants;
ANALYZE cities;
ANALYZE user_badges;
ANALYZE rewards;
ANALYZE badges;

-- =============================================
-- NOTAS DE RENDIMIENTO
-- =============================================
-- Estos índices están optimizados para:
-- 1. Ranking page: Queries de burgers con filtros de ciudad y ordenamiento
-- 2. Profile page: Queries de ratings y badges del usuario
-- 3. Rate page: Búsqueda de burgers por popularidad
-- 4. Admin panel: Gestión de contenido y aprobaciones
--
-- Los índices parciales (WHERE) solo incluyen filas relevantes,
-- reduciendo el tamaño del índice y mejorando velocidad.
--
-- IMPACTO ESPERADO:
-- - Ranking load: 50-70% más rápido
-- - Profile load: 60-80% más rápido
-- - Rate page load: 40-60% más rápido
-- - Búsquedas admin: 30-50% más rápido
