-- ============================================================================
-- SCRIPT: Generar ratings aleatorios para todas las burgers
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- Este script crea ratings aleatorios para todas las hamburguesas aprobadas
-- que aún no tienen valoraciones, para poder ver el ranking funcionando.

-- Paso 1: Obtener un usuario existente para asignar los ratings
-- (Si no existe ningún usuario, primero debes crear uno)

DO $$
DECLARE
    v_user_id UUID;
    v_burger RECORD;
    v_num_ratings INTEGER;
    v_rating NUMERIC;
    i INTEGER;
BEGIN
    -- Buscar un usuario existente (preferiblemente admin)
    SELECT id INTO v_user_id FROM users WHERE is_admin = true LIMIT 1;
    
    -- Si no hay admin, buscar cualquier usuario
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM users LIMIT 1;
    END IF;
    
    -- Si no hay usuarios, crear uno temporal para los ratings
    IF v_user_id IS NULL THEN
        INSERT INTO users (id, username, email, is_admin)
        VALUES (
            gen_random_uuid(),
            'rating_bot',
            'bot@burgerank.dev',
            false
        )
        RETURNING id INTO v_user_id;
        
        RAISE NOTICE 'Usuario temporal creado con ID: %', v_user_id;
    END IF;
    
    RAISE NOTICE 'Usando usuario ID: % para generar ratings', v_user_id;
    
    -- Iterar sobre todas las burgers aprobadas
    FOR v_burger IN 
        SELECT id, name 
        FROM burgers 
        WHERE status = 'approved'
    LOOP
        -- Verificar si ya tiene ratings
        IF NOT EXISTS (SELECT 1 FROM ratings WHERE burger_id = v_burger.id) THEN
            -- Generar número aleatorio de ratings (1-8)
            v_num_ratings := 1 + floor(random() * 8)::INTEGER;
            
            RAISE NOTICE 'Generando % ratings para burger: %', v_num_ratings, v_burger.name;
            
            -- Insertar los ratings
            FOR i IN 1..v_num_ratings LOOP
                -- Rating aleatorio entre 2.5 y 5.0 (más realista - nadie pone 1 a menos que sea terrible)
                v_rating := 2.5 + (random() * 2.5);
                -- Redondear a 0.5
                v_rating := round(v_rating * 2) / 2;
                
                -- Insertar el rating
                INSERT INTO ratings (
                    id,
                    user_id,
                    burger_id,
                    overall_rating,
                    taste_rating,
                    texture_rating,
                    presentation_rating,
                    value_rating,
                    comment,
                    is_verified,
                    created_at
                ) VALUES (
                    gen_random_uuid(),
                    v_user_id,
                    v_burger.id,
                    v_rating,
                    v_rating + (random() - 0.5), -- Variación pequeña
                    v_rating + (random() - 0.5),
                    v_rating + (random() - 0.5),
                    v_rating + (random() - 0.5),
                    CASE 
                        WHEN v_rating >= 4.5 THEN '¡Excelente hamburguesa!'
                        WHEN v_rating >= 4.0 THEN 'Muy buena, la recomiendo'
                        WHEN v_rating >= 3.5 THEN 'Está bien, cumple'
                        WHEN v_rating >= 3.0 THEN 'Regular, puede mejorar'
                        ELSE 'No está mal'
                    END,
                    random() > 0.5, -- 50% verificadas
                    NOW() - (random() * INTERVAL '30 days') -- Fechas aleatorias en los últimos 30 días
                );
            END LOOP;
        ELSE
            RAISE NOTICE 'Burger % ya tiene ratings, saltando...', v_burger.name;
        END IF;
    END LOOP;
    
    RAISE NOTICE '¡Ratings generados exitosamente!';
END $$;

-- Paso 2: Actualizar las estadísticas de las burgers
UPDATE burgers b
SET 
    average_rating = (
        SELECT COALESCE(AVG(r.overall_rating), 0)
        FROM ratings r 
        WHERE r.burger_id = b.id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM ratings r 
        WHERE r.burger_id = b.id
    ),
    verified_reviews_count = (
        SELECT COUNT(*)
        FROM ratings r 
        WHERE r.burger_id = b.id AND r.is_verified = true
    )
WHERE status = 'approved';

-- Paso 3: Marcar burgers como "en ranking" si tienen al menos 1 review
UPDATE burgers
SET is_in_ranking = true
WHERE total_reviews >= 1 AND status = 'approved';

-- Paso 4: Calcular ranking_score simple (basado en average_rating y total_reviews)
UPDATE burgers
SET ranking_score = 
    CASE 
        WHEN total_reviews > 0 THEN
            -- Fórmula simple: rating promedio + bonus por cantidad de reviews
            average_rating + (LN(total_reviews + 1) * 0.1)
        ELSE 0
    END
WHERE status = 'approved';

-- Paso 5: Asignar posiciones en el ranking
WITH ranked AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY ranking_score DESC, total_reviews DESC) as pos
    FROM burgers
    WHERE is_in_ranking = true AND status = 'approved'
)
UPDATE burgers b
SET ranking_position = r.pos
FROM ranked r
WHERE b.id = r.id;

-- Verificar resultados
SELECT 
    ranking_position as "#",
    name as "Hamburguesa",
    (SELECT name FROM restaurants WHERE id = b.restaurant_id) as "Restaurante",
    ROUND(average_rating::numeric, 2) as "Rating",
    total_reviews as "Reviews",
    ROUND(ranking_score::numeric, 4) as "Score"
FROM burgers b
WHERE status = 'approved' AND is_in_ranking = true
ORDER BY ranking_position
LIMIT 20;

-- Resumen
SELECT 
    COUNT(*) FILTER (WHERE is_in_ranking = true) as "Burgers en Ranking",
    COUNT(*) FILTER (WHERE total_reviews > 0) as "Burgers con Reviews",
    COUNT(*) as "Total Burgers Aprobadas",
    ROUND(AVG(total_reviews)::numeric, 1) as "Promedio Reviews por Burger"
FROM burgers
WHERE status = 'approved';
