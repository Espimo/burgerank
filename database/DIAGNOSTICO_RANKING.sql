-- ============================================
-- DIAGNÓSTICO DEL RANKING
-- ============================================
-- Ejecuta estas queries en orden para diagnosticar

-- 1. Ver cuántas burgers hay y su estado
SELECT 
    status,
    is_in_ranking,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE total_reviews > 0) as con_reviews
FROM burgers
GROUP BY status, is_in_ranking;

-- 2. Ver el estado de ranking_config
SELECT * FROM ranking_config;

-- 3. Ver cuántas ratings hay por burger
SELECT 
    b.id,
    b.name,
    b.status,
    b.is_in_ranking,
    b.total_reviews,
    b.ranking_score,
    COUNT(r.id) as ratings_reales
FROM burgers b
LEFT JOIN ratings r ON r.burger_id = b.id
GROUP BY b.id, b.name, b.status, b.is_in_ranking, b.total_reviews, b.ranking_score
ORDER BY ratings_reales DESC;

-- 4. Ver si hay ratings en la BD
SELECT COUNT(*) as total_ratings FROM ratings;

-- ============================================
-- SOLUCIÓN: Ejecutar recálculo del ranking
-- ============================================
-- Si hay burgers con status='approved' Y ratings, ejecuta esto:

SELECT update_all_ranking_positions();

-- ============================================
-- VERIFICACIÓN POST-RECÁLCULO
-- ============================================
-- Después de ejecutar update_all_ranking_positions(), verifica:

SELECT 
    b.id,
    b.name,
    b.status,
    b.is_in_ranking,
    b.total_reviews,
    b.ranking_position,
    b.ranking_score,
    b.average_rating
FROM burgers b
WHERE b.status = 'approved'
ORDER BY b.ranking_position ASC NULLS LAST;
