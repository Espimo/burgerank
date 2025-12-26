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
    v_user_ids UUID[];
    v_user_id UUID;
    v_burger RECORD;
    v_num_ratings INTEGER;
    v_rating NUMERIC;
    i INTEGER;
    v_random_user_id UUID;
BEGIN
    -- Buscar usuarios existentes
    SELECT ARRAY_AGG(id) INTO v_user_ids FROM users LIMIT 20;
    
    -- Si no hay suficientes usuarios, crear usuarios temporales para ratings
    IF v_user_ids IS NULL OR array_length(v_user_ids, 1) < 5 THEN
        v_user_ids := ARRAY[]::UUID[];
        
        RAISE NOTICE 'Creando usuarios temporales para generar ratings...';
        
        -- Crear 10 usuarios bot
        FOR i IN 1..10 LOOP
            INSERT INTO users (id, username, email, is_admin)
            VALUES (
                gen_random_uuid(),
                'rating_bot_' || i,
                'bot' || i || '@burgerank.dev',
                false
            )
            RETURNING id INTO v_user_id;
            
            v_user_ids := array_append(v_user_ids, v_user_id);
        END LOOP;
        
        RAISE NOTICE 'Creados % usuarios temporales', array_length(v_user_ids, 1);
    END IF;
    
    RAISE NOTICE 'Usando % usuarios para generar ratings', array_length(v_user_ids, 1);
    
    -- Iterar sobre todas las burgers aprobadas
    FOR v_burger IN 
        SELECT id, name 
        FROM burgers 
        WHERE status = 'approved'
    LOOP
        -- Generar número aleatorio de ratings (1-8, limitado por usuarios disponibles)
        v_num_ratings := LEAST(
            array_length(v_user_ids, 1), 
            1 + floor(random() * 8)::INTEGER
        );
        
        RAISE NOTICE 'Generando % ratings para burger: %', v_num_ratings, v_burger.name;
        
        -- Insertar los ratings usando usuarios diferentes
        FOR i IN 1..v_num_ratings LOOP
            -- Seleccionar un usuario aleatorio del array
            v_random_user_id := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))::INT];
            
            -- Rating aleatorio entre 2.5 y 5.0 (más realista)
            v_rating := 2.5 + (random() * 2.5);
            -- Redondear a 0.5
            v_rating := round(v_rating * 2) / 2;
            
            -- Insertar el rating (con manejo de duplicados)
            BEGIN
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
                    v_random_user_id,
                    v_burger.id,
                    LEAST(5, GREATEST(1, ROUND(v_rating)::INT)), -- overall_rating: 1-5
                    LEAST(3, GREATEST(1, 1 + floor(random() * 3)::INT)), -- pan_rating: 1-3
                    LEAST(3, GREATEST(1, 1 + floor(random() * 3)::INT)), -- carne_rating: 1-3
                    LEAST(3, GREATEST(1, 1 + floor(random() * 3)::INT)), -- toppings_rating: 1-3
                    LEAST(3, GREATEST(1, 1 + floor(random() * 3)::INT)), -- salsa_rating: 1-3
                    8.50 + (random() * 6.50), -- precio: 8.50 - 15.00
                    CASE 
                        WHEN v_rating >= 4.5 THEN '¡Excelente hamburguesa!'
                        WHEN v_rating >= 4.0 THEN 'Muy buena, la recomiendo'
                        WHEN v_rating >= 3.5 THEN 'Está bien, cumple'
                        WHEN v_rating >= 3.0 THEN 'Regular, puede mejorar'
                        ELSE 'No está mal'
                    END,
                    random() > 0.7, -- 30% con ticket
                    CASE 
                        WHEN random() > 0.5 THEN 'local'
                        ELSE 'domicilio'
                    END,
                    10, -- puntos otorgados
                    NOW() - (random() * INTERVAL '30 days') -- Fechas aleatorias en los últimos 30 días
                );
            EXCEPTION
                WHEN unique_violation THEN
                    -- Si el usuario ya valoró esta burger, saltamos
                    RAISE NOTICE 'Usuario ya valoró esta burger, saltando...';
            END;
        END LOOP;
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
        WHERE r.burger_id = b.id AND r.has_ticket = true
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
