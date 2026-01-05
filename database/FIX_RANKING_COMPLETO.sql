-- ============================================================================
-- SCRIPT: Arreglar sistema de ranking completo
-- ============================================================================
-- Este script:
-- 1. Genera 1 valoración por cada burger sin valoraciones
-- 2. Recalcula todas las estadísticas
-- 3. Corrige el sistema de empates
-- 4. Asigna posiciones correctamente
-- ============================================================================

-- Paso 1: Crear usuario de prueba si no existe ninguno
DO $$
DECLARE
    v_test_user_id UUID;
BEGIN
    -- Buscar cualquier usuario existente
    SELECT id INTO v_test_user_id FROM users LIMIT 1;
    
    -- Si no existe ningún usuario, no podemos continuar
    IF v_test_user_id IS NULL THEN
        RAISE NOTICE 'ADVERTENCIA: No hay usuarios en la base de datos.';
        RAISE NOTICE 'Por favor, crea al menos un usuario antes de ejecutar este script.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Usuario disponible: %', v_test_user_id;
END $$;

-- Paso 2: Generar 1 rating por cada burger sin valoraciones
DO $$
DECLARE
    v_user_id UUID;
    v_burger RECORD;
    v_random_rating INTEGER;
    v_inserted INTEGER := 0;
BEGIN
    -- Obtener primer usuario
    SELECT id INTO v_user_id FROM users LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'No hay usuarios disponibles';
        RETURN;
    END IF;
    
    -- Iterar burgers aprobadas sin ratings
    FOR v_burger IN 
        SELECT b.id, b.name 
        FROM burgers b
        WHERE b.status = 'approved'
        AND NOT EXISTS (
            SELECT 1 FROM ratings r WHERE r.burger_id = b.id
        )
    LOOP
        -- Rating aleatorio entre 3 y 5 (realista para testing)
        v_random_rating := 3 + floor(random() * 3)::INTEGER;
        v_random_rating := LEAST(5, v_random_rating);
        
        INSERT INTO ratings (
            id,
            user_id,
            burger_id,
            overall_rating,
            pan_rating,
            carne_rating,
            toppings_rating,
            salsa_rating,
            price,
            comment,
            has_ticket,
            consumption_type,
            points_awarded,
            created_at
        ) VALUES (
            gen_random_uuid(),
            v_user_id,
            v_burger.id,
            v_random_rating,
            LEAST(3, 1 + floor(random() * 3)::INT),
            LEAST(3, 1 + floor(random() * 3)::INT),
            LEAST(3, 1 + floor(random() * 3)::INT),
            LEAST(3, 1 + floor(random() * 3)::INT),
            10.00 + (random() * 5),
            CASE v_random_rating
                WHEN 5 THEN 'Excelente hamburguesa, muy recomendada!'
                WHEN 4 THEN 'Muy buena, la probaré de nuevo'
                ELSE 'Buena hamburguesa, cumple las expectativas'
            END,
            FALSE, -- sin ticket (valoración de prueba)
            'local',
            0, -- sin puntos porque no tiene ticket
            NOW() - (random() * INTERVAL '14 days')
        );
        
        v_inserted := v_inserted + 1;
        RAISE NOTICE 'Rating creado para: % (Rating: %)', v_burger.name, v_random_rating;
    END LOOP;
    
    RAISE NOTICE '✅ Total de ratings creados: %', v_inserted;
END $$;

-- Paso 3: Recalcular estadísticas de TODAS las burgers
UPDATE burgers b
SET 
    average_rating = sub.avg_rating,
    total_reviews = sub.review_count,
    total_ratings = sub.review_count,
    verified_reviews_count = sub.verified_count
FROM (
    SELECT 
        burger_id,
        COALESCE(AVG(overall_rating), 0) as avg_rating,
        COUNT(*) as review_count,
        COUNT(*) FILTER (WHERE has_ticket = true) as verified_count
    FROM ratings
    GROUP BY burger_id
) sub
WHERE b.id = sub.burger_id;

-- Paso 4: Marcar burgers sin reviews con valores por defecto
UPDATE burgers
SET 
    average_rating = 0,
    total_reviews = 0,
    total_ratings = 0,
    verified_reviews_count = 0,
    is_in_ranking = FALSE,
    ranking_score = 0,
    ranking_position = 0
WHERE id NOT IN (SELECT DISTINCT burger_id FROM ratings)
AND status = 'approved';

-- Paso 5: Marcar como "en ranking" las que tienen al menos 1 review
UPDATE burgers
SET is_in_ranking = TRUE
WHERE total_reviews >= 1 
AND status = 'approved';

-- Paso 6: Calcular ranking_score con sistema de desempate integrado
-- Fórmula: base = average_rating + bonus_reviews + bonus_verificados
UPDATE burgers
SET ranking_score = 
    CASE 
        WHEN total_reviews > 0 THEN
            -- Base: promedio de rating (0-5)
            average_rating 
            -- Bonus por cantidad de reviews (máx +0.5)
            + LEAST(0.5, LN(total_reviews + 1) * 0.1)
            -- Bonus por reviews verificados (máx +0.3)
            + CASE 
                WHEN total_reviews > 0 
                THEN LEAST(0.3, (verified_reviews_count::DECIMAL / total_reviews) * 0.3)
                ELSE 0 
              END
            -- Pequeño factor de desempate basado en fecha de última review
            + COALESCE(EXTRACT(EPOCH FROM last_review_date)::DECIMAL / 10000000000000, 0)
        ELSE 0
    END
WHERE status = 'approved';

-- Paso 7: Asignar posiciones con criterios de desempate claros
WITH ranked AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            ORDER BY 
                -- 1. ranking_score (incluye average_rating y bonuses)
                ranking_score DESC,
                -- 2. Desempate: más reviews totales
                total_reviews DESC,
                -- 3. Desempate: mayor porcentaje de reviews verificados
                CASE WHEN total_reviews > 0 
                    THEN verified_reviews_count::DECIMAL / total_reviews 
                    ELSE 0 
                END DESC,
                -- 4. Desempate: review más reciente
                last_review_date DESC NULLS LAST,
                -- 5. Desempate final: fecha creación de la burger
                created_at ASC,
                -- 6. Desempate último: ID (determinístico)
                id ASC
        ) as new_position
    FROM burgers
    WHERE is_in_ranking = TRUE 
    AND status = 'approved'
)
UPDATE burgers b
SET ranking_position = r.new_position
FROM ranked r
WHERE b.id = r.id;

-- Paso 8: Las burgers fuera del ranking tienen posición 0
UPDATE burgers
SET ranking_position = 0
WHERE is_in_ranking = FALSE OR status != 'approved';

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Ver el ranking resultante
SELECT 
    ranking_position as "Pos",
    name as "Hamburguesa",
    (SELECT name FROM restaurants WHERE id = b.restaurant_id LIMIT 1) as "Restaurante",
    ROUND(average_rating::numeric, 2) as "Rating",
    total_reviews as "Reviews",
    verified_reviews_count as "Verificados",
    ROUND(ranking_score::numeric, 4) as "Score",
    is_in_ranking as "En Ranking"
FROM burgers b
WHERE status = 'approved'
ORDER BY 
    CASE WHEN is_in_ranking THEN 0 ELSE 1 END,
    ranking_position ASC,
    name ASC
LIMIT 30;

-- Resumen
SELECT 
    '🍔 Total burgers aprobadas' as metric, COUNT(*)::TEXT as value 
    FROM burgers WHERE status = 'approved'
UNION ALL
SELECT 
    '📊 Burgers en el ranking', COUNT(*)::TEXT 
    FROM burgers WHERE status = 'approved' AND is_in_ranking = TRUE
UNION ALL
SELECT 
    '⭐ Burgers con reviews', COUNT(*)::TEXT 
    FROM burgers WHERE status = 'approved' AND total_reviews > 0
UNION ALL
SELECT 
    '✅ Reviews totales', COUNT(*)::TEXT 
    FROM ratings
UNION ALL
SELECT 
    '🎫 Reviews verificados', COUNT(*)::TEXT 
    FROM ratings WHERE has_ticket = TRUE;
