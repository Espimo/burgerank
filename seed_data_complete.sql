-- ============================================================================
-- 🍔 BurgeRank - SEED DATA SCRIPT COMPLETO
-- ============================================================================
-- Este script puebla la base de datos con datos realistas para testing
-- Ejecutar en: Supabase SQL Editor
-- Tiempo aproximado: 30-60 segundos
-- ============================================================================

-- ============================================================================
-- PASO 1: OBTENER USER_ID DE CRISTHIANESPIMO@GMAIL.COM
-- ============================================================================

DO $$
DECLARE
    cristhian_user_id UUID;
    sofia_user_id UUID;
    carlos_user_id UUID;
    ana_user_id UUID;
    miguel_user_id UUID;
    laura_user_id UUID;
    
    -- Restaurante IDs
    la_burguesia_id UUID;
    goiko_grill_id UUID;
    home_burger_bar_id UUID;
    tgb_id UUID;
    bacoa_burger_id UUID;
    makamaka_id UUID;
    honest_greens_id UUID;
    federal_cafe_id UUID;
    la_mas_bonita_id UUID;
    montaditos_id UUID;
    
    -- Burger IDs para matches
    burger_ids UUID[];
    
BEGIN

-- ============================================================================
-- PASO 2: OBTENER IDS DE USUARIOS EXISTENTES
-- ============================================================================

SELECT id INTO cristhian_user_id 
FROM auth.users 
WHERE email = 'cristhianespimo@gmail.com' 
LIMIT 1;

IF cristhian_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario cristhianespimo@gmail.com no encontrado en auth.users';
END IF;

RAISE NOTICE 'Cristhian user ID: %', cristhian_user_id;

-- ============================================================================
-- PASO 3: ACTUALIZAR PERFIL DE CRISTHIAN (si existe) O CREAR NUEVO
-- ============================================================================

DELETE FROM profiles WHERE id = cristhian_user_id;

INSERT INTO profiles (
    id,
    username,
    city,
    level,
    total_points,
    available_points,
    total_reviews,
    is_moderator,
    is_admin,
    bio,
    avatar_url,
    created_at,
    updated_at
) VALUES (
    cristhian_user_id,
    'cristhian_espimo',
    'Madrid',
    'burger_lover'::user_level,
    1500,
    800,
    15,
    FALSE,
    FALSE,
    'Apasionado de las burgers. Siempre buscando la hamburguesa perfecta 🍔',
    NULL,
    NOW() - INTERVAL '3 months',
    NOW()
);

RAISE NOTICE 'Perfil de Cristhian creado/actualizado';

-- ============================================================================
-- PASO 4: CREAR 5 USUARIOS ADICIONALES DE EJEMPLO
-- ============================================================================

-- Sofia Martinez - burger_obsessed
INSERT INTO profiles (
    id, username, city, level, total_points, available_points,
    total_reviews, is_moderator, is_admin, bio, avatar_url, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'sofia_martinez',
    'Barcelona',
    'burger_obsessed'::user_level,
    2500,
    1200,
    30,
    FALSE,
    FALSE,
    'La reina de las hamburguesas. He probado todas las burgers de Barcelona 👑',
    NULL,
    NOW() - INTERVAL '6 months',
    NOW()
)
RETURNING id INTO sofia_user_id;

-- Carlos Lopez - burger_lover
INSERT INTO profiles (
    id, username, city, level, total_points, available_points,
    total_reviews, is_moderator, is_admin, bio, avatar_url, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'carlos_lopez',
    'Madrid',
    'burger_lover'::user_level,
    1200,
    400,
    12,
    FALSE,
    FALSE,
    'Fan de las burgers clásicas sin complicaciones',
    NULL,
    NOW() - INTERVAL '5 months',
    NOW()
)
RETURNING id INTO carlos_user_id;

-- Ana Garcia - burger_fan
INSERT INTO profiles (
    id, username, city, level, total_points, available_points,
    total_reviews, is_moderator, is_admin, bio, avatar_url, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'ana_garcia',
    'Valencia',
    'burger_fan'::user_level,
    450,
    200,
    5,
    FALSE,
    FALSE,
    'Descubriendo el mundo de las hamburguesas',
    NULL,
    NOW() - INTERVAL '4 months',
    NOW()
)
RETURNING id INTO ana_user_id;

-- Miguel Torres - burger_lover
INSERT INTO profiles (
    id, username, city, level, total_points, available_points,
    total_reviews, is_moderator, is_admin, bio, avatar_url, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'miguel_torres',
    'Madrid',
    'burger_lover'::user_level,
    1800,
    600,
    18,
    FALSE,
    FALSE,
    'Crítico de burgers amante de los detalles',
    NULL,
    NOW() - INTERVAL '5 months',
    NOW()
)
RETURNING id INTO miguel_user_id;

-- Laura Fernandez - burger_fan
INSERT INTO profiles (
    id, username, city, level, total_points, available_points,
    total_reviews, is_moderator, is_admin, bio, avatar_url, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'laura_fernandez',
    'Barcelona',
    'burger_fan'::user_level,
    300,
    100,
    3,
    FALSE,
    FALSE,
    'Las burgers veganas son mi especialidad 🌱',
    NULL,
    NOW() - INTERVAL '3 months',
    NOW()
)
RETURNING id INTO laura_user_id;

RAISE NOTICE 'Usuarios adicionales creados: Sofia, Carlos, Ana, Miguel, Laura';

-- ============================================================================
-- PASO 5: CREAR 10 RESTAURANTES REALISTAS
-- ============================================================================

-- Madrid: La Burguesía
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'La Burguesía',
    'la-burguesia',
    'Calle Gran Vía 28, 28013 Madrid',
    'Madrid',
    '+34 91 555 0123',
    40.4151,
    -3.7079,
    4.7,
    4,
    TRUE,
    cristhian_user_id,
    NOW() - INTERVAL '8 months',
    NOW()
)
RETURNING id INTO la_burguesia_id;

-- Madrid: Goiko Grill
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Goiko Grill',
    'goiko-grill',
    'Calle Fuencarral 52, 28004 Madrid',
    'Madrid',
    '+34 91 531 4523',
    40.4200,
    -3.6950,
    4.5,
    4,
    TRUE,
    cristhian_user_id,
    NOW() - INTERVAL '10 months',
    NOW()
)
RETURNING id INTO goiko_grill_id;

-- Madrid: Home Burger Bar
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Home Burger Bar',
    'home-burger-bar',
    'Calle Espíritu Santo 12, 28004 Madrid',
    'Madrid',
    '+34 91 522 5123',
    40.4243,
    -3.7103,
    4.8,
    4,
    TRUE,
    carlos_user_id,
    NOW() - INTERVAL '6 months',
    NOW()
)
RETURNING id INTO home_burger_bar_id;

-- Madrid: TGB (The Good Burger)
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'TGB - The Good Burger',
    'tgb-the-good-burger',
    'Calle Serrano 41, 28001 Madrid',
    'Madrid',
    '+34 91 435 1825',
    40.4281,
    -3.6799,
    4.3,
    4,
    TRUE,
    miguel_user_id,
    NOW() - INTERVAL '9 months',
    NOW()
)
RETURNING id INTO tgb_id;

-- Madrid: Bacoa Burger
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Bacoa Burger',
    'bacoa-burger',
    'Calle Castelló 8, 28001 Madrid',
    'Madrid',
    '+34 91 577 5123',
    40.4315,
    -3.6751,
    4.6,
    4,
    TRUE,
    cristhian_user_id,
    NOW() - INTERVAL '7 months',
    NOW()
)
RETURNING id INTO bacoa_burger_id;

-- Barcelona: Makamaka Beach Burger
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Makamaka Beach Burger',
    'makamaka-beach-burger',
    'Plaça del Mar 1, 08002 Barcelona',
    'Barcelona',
    '+34 93 268 9123',
    41.3730,
    2.1927,
    4.4,
    4,
    TRUE,
    sofia_user_id,
    NOW() - INTERVAL '8 months',
    NOW()
)
RETURNING id INTO makamaka_id;

-- Barcelona: Honest Greens
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Honest Greens',
    'honest-greens',
    'Passeig de Gràcia 98, 08008 Barcelona',
    'Barcelona',
    '+34 93 487 8123',
    41.3933,
    2.1731,
    4.2,
    4,
    TRUE,
    laura_user_id,
    NOW() - INTERVAL '10 months',
    NOW()
)
RETURNING id INTO honest_greens_id;

-- Barcelona: Federal Café
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Federal Café',
    'federal-cafe',
    'Passeig del Born 11, 08003 Barcelona',
    'Barcelona',
    '+34 93 319 7123',
    41.3839,
    2.1900,
    3.9,
    4,
    TRUE,
    sofia_user_id,
    NOW() - INTERVAL '6 months',
    NOW()
)
RETURNING id INTO federal_cafe_id;

-- Valencia: La Más Bonita
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'La Más Bonita',
    'la-mas-bonita',
    'Calle Caballeros 35, 46001 Valencia',
    'Valencia',
    '+34 96 392 2123',
    39.4706,
    -0.3760,
    4.5,
    4,
    TRUE,
    ana_user_id,
    NOW() - INTERVAL '9 months',
    NOW()
)
RETURNING id INTO la_mas_bonita_id;

-- Valencia: 100 Montaditos
INSERT INTO restaurants (
    id, name, slug, address, city, phone, latitude, longitude,
    average_rating, total_burgers, verified, created_by, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    '100 Montaditos',
    '100-montaditos',
    'Plaza de la Reina 5, 46003 Valencia',
    'Valencia',
    '+34 96 391 1123',
    39.4630,
    -0.3667,
    3.8,
    4,
    TRUE,
    ana_user_id,
    NOW() - INTERVAL '11 months',
    NOW()
)
RETURNING id INTO montaditos_id;

RAISE NOTICE 'Restaurantes creados: 10 ubicaciones en Madrid, Barcelona, Valencia';

-- ============================================================================
-- PASO 6: CREAR 40 HAMBURGUESAS (4 POR RESTAURANTE)
-- ============================================================================

-- La Burguesía (Madrid)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'La Clásica Premium', 'Hamburgues de vaca madurada con queso cheddar y cebolla caramelizada', 'clasica'::burger_type, la_burguesia_id, 4.7, 24, 14.50, FALSE, TRUE, cristhian_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Truffle Cheese Deluxe', 'Doble burger con queso trufado y alioli gourmet', 'doble'::burger_type, la_burguesia_id, 4.9, 18, 16.50, TRUE, TRUE, cristhian_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Veggie Power', 'Burger 100% vegana con tofu marinado y aguacate', 'vegana'::burger_type, la_burguesia_id, 4.4, 14, 12.00, FALSE, TRUE, carlos_user_id, NOW() - INTERVAL '6 months', NOW()),
(gen_random_uuid(), 'Spicy Chicken Jalapeño', 'Pechuga de pollo especiado con jalapeños frescos', 'pollo'::burger_type, la_burguesia_id, 4.5, 16, 13.00, FALSE, TRUE, miguel_user_id, NOW() - INTERVAL '5 months', NOW());

-- Goiko Grill (Madrid)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'The Goiko', 'Smash burger clásico con queso americano', 'clasica'::burger_type, goiko_grill_id, 4.6, 32, 11.00, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Goiko Double', 'Doble smash burger con extra bacon', 'doble'::burger_type, goiko_grill_id, 4.7, 28, 13.50, FALSE, TRUE, carlos_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Mediterranean Lamb', 'Burger de cordero con salsa tzatziki', 'clasica'::burger_type, goiko_grill_id, 4.3, 12, 14.00, TRUE, TRUE, miguel_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Veggie Goiko', 'Versión vegana con setas salteadas', 'vegana'::burger_type, goiko_grill_id, 4.2, 10, 10.50, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '6 months', NOW());

-- Home Burger Bar (Madrid)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Classic American', 'Burger americana con doble queso y bacon crujiente', 'clasica'::burger_type, home_burger_bar_id, 4.8, 22, 13.00, FALSE, TRUE, cristhian_user_id, NOW() - INTERVAL '5 months', NOW()),
(gen_random_uuid(), 'Blue Cheese Gourmet', 'Carne madurada con queso azul y nueces', 'clasica'::burger_type, home_burger_bar_id, 4.9, 20, 15.50, TRUE, TRUE, carlos_user_id, NOW() - INTERVAL '1 month', NOW()),
(gen_random_uuid(), 'BBQ Pulled Pork', 'Burger con cerdo desmenuzado y salsa BBQ casera', 'cerdo'::burger_type, home_burger_bar_id, 4.6, 18, 14.00, FALSE, TRUE, miguel_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Crispy Chicken Burger', 'Pollo empanado con mayo sriracha', 'pollo'::burger_type, home_burger_bar_id, 4.5, 15, 12.50, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '4 months', NOW());

-- TGB (Madrid)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'The Good Burger', 'Smash burger perfecto con ingredientes de calidad', 'clasica'::burger_type, tgb_id, 4.4, 19, 11.50, FALSE, TRUE, carlos_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Double Good Burger', 'Doble smash burger con queso fundido', 'doble'::burger_type, tgb_id, 4.5, 16, 13.00, FALSE, TRUE, miguel_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Bacon Paradise', 'Triple bacon con queso cheddar derretido', 'clasica'::burger_type, tgb_id, 4.3, 14, 12.50, TRUE, TRUE, cristhian_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Veggie Green', 'Burger vegana con remolacha y hummus', 'vegana'::burger_type, tgb_id, 4.0, 11, 10.00, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '5 months', NOW());

-- Bacoa Burger (Madrid)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Bacoa Clásica', 'Burger de carne 100% ibérica', 'clasica'::burger_type, bacoa_burger_id, 4.7, 26, 13.00, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Bacoa Premium', 'Carne madurada con foie y trufas', 'clasica'::burger_type, bacoa_burger_id, 4.8, 15, 18.00, TRUE, TRUE, miguel_user_id, NOW() - INTERVAL '1 month', NOW()),
(gen_random_uuid(), 'Bacoa Double', 'Doble carne ibérica con queso viejo', 'doble'::burger_type, bacoa_burger_id, 4.6, 20, 15.00, FALSE, TRUE, cristhian_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Bacoa Veggie', 'Versión vegana con setas premium', 'vegana'::burger_type, bacoa_burger_id, 4.3, 12, 11.50, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '6 months', NOW());

-- Makamaka (Barcelona)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Makamaka Clásica', 'Burger playera con toque mediterráneo', 'clasica'::burger_type, makamaka_id, 4.5, 23, 12.50, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Makamaka BBQ', 'Burger con salsa BBQ y cebolla caramelizada', 'clasica'::burger_type, makamaka_id, 4.4, 19, 13.00, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Spicy Makamaka', 'Burger picante con jalapeños y sriracha', 'clasica'::burger_type, makamaka_id, 4.3, 15, 13.00, TRUE, TRUE, sofia_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Mediterranean Green', 'Burger vegana con garbanzos y aceitunas', 'vegana'::burger_type, makamaka_id, 4.2, 11, 11.00, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '5 months', NOW());

-- Honest Greens (Barcelona)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Honest Burger', 'Burger saludable con carne magra', 'clasica'::burger_type, honest_greens_id, 4.3, 14, 12.00, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Green Power', 'Burger vegana con aguacate y espinacas', 'vegana'::burger_type, honest_greens_id, 4.4, 18, 11.50, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Keto Heaven', 'Burger baja en carbohidratos con queso doble', 'clasica'::burger_type, honest_greens_id, 4.1, 10, 13.50, TRUE, TRUE, sofia_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Crispy Chicken Green', 'Pollo empanado en pan integral', 'pollo'::burger_type, honest_greens_id, 4.2, 12, 11.00, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '5 months', NOW());

-- Federal Café (Barcelona)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Federal Clásica', 'Burger hipster con pan artesanal', 'clasica'::burger_type, federal_cafe_id, 4.0, 17, 11.50, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Federal Double', 'Doble burger con cheddar añejo', 'doble'::burger_type, federal_cafe_id, 4.1, 13, 13.50, FALSE, TRUE, sofia_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Artisan Burger', 'Burger con ingredientes 100% artesanales', 'clasica'::burger_type, federal_cafe_id, 3.9, 12, 14.00, TRUE, TRUE, laura_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Federal Veggie', 'Vegana con champiñones caramelizados', 'vegana'::burger_type, federal_cafe_id, 3.8, 9, 10.50, FALSE, TRUE, laura_user_id, NOW() - INTERVAL '6 months', NOW());

-- La Más Bonita (Valencia)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'La Bonita Clásica', 'Burger valenciana con ingredientes locales', 'clasica'::burger_type, la_mas_bonita_id, 4.6, 21, 12.00, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Valencian Double', 'Doble burger con arroz cremoso lateral', 'doble'::burger_type, la_mas_bonita_id, 4.4, 16, 14.00, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Seafood Burger', 'Burger de mariscos y gambas', 'clasica'::burger_type, la_mas_bonita_id, 4.5, 14, 15.50, TRUE, TRUE, carlos_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'La Bonita Verde', 'Vegana con hortaliza fresca de Valencia', 'vegana'::burger_type, la_mas_bonita_id, 4.3, 11, 11.00, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '5 months', NOW());

-- 100 Montaditos (Valencia)
INSERT INTO burgers (
    id, name, description, burger_type, restaurant_id, average_rating, total_ratings,
    price, is_special, verified, created_by, created_at, updated_at
) VALUES
(gen_random_uuid(), 'Montaditos Clásica', 'Burger económica y sabrosa', 'clasica'::burger_type, montaditos_id, 3.9, 19, 9.50, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '4 months', NOW()),
(gen_random_uuid(), 'Montaditos Double', 'Doble burger precio reducido', 'doble'::burger_type, montaditos_id, 3.8, 15, 11.00, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '3 months', NOW()),
(gen_random_uuid(), 'Montaditos BBQ', 'Burger con salsa BBQ casera', 'clasica'::burger_type, montaditos_id, 4.0, 12, 10.00, FALSE, TRUE, carlos_user_id, NOW() - INTERVAL '2 months', NOW()),
(gen_random_uuid(), 'Montaditos Veggie', 'Vegana económica y saciante', 'vegana'::burger_type, montaditos_id, 3.7, 8, 8.50, FALSE, TRUE, ana_user_id, NOW() - INTERVAL '6 months', NOW());

RAISE NOTICE '40 hamburguesas creadas (4 por restaurante)';

-- ============================================================================
-- PASO 7: CREAR 80 REVIEWS COMPLETAS
-- ============================================================================

-- Primero, obtener IDs de las burgers para las reviews
WITH burger_data AS (
    SELECT ARRAY_AGG(id) as ids FROM (
        SELECT id FROM burgers ORDER BY created_at DESC LIMIT 40
    ) t
)
SELECT ids INTO burger_ids FROM burger_data;

-- Reviews de Cristhian (15 total: 10x4-5*, 3x3-3.5*, 2x2-2.5*)
-- 10 reviews de 4-5 estrellas
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((i-1) % 40) + 1],
    cristhian_user_id,
    CASE WHEN i <= 5 THEN 5 ELSE 4 END,
    CASE i
        WHEN 1 THEN '¡Increíble! La mejor burger que he probado en meses. Carne perfecta.'
        WHEN 2 THEN 'Excelente relación calidad-precio. Muy jugosa y bien montada.'
        WHEN 3 THEN 'Queso derretido perfecto, pan tostado al punto.'
        WHEN 4 THEN 'Los detalles hacen la diferencia. Muy satisfecho.'
        WHEN 5 THEN 'Primera vez en este lugar y no decepciona.'
        WHEN 6 THEN 'Burger jugosa con ingredientes frescos. Recomendable.'
        WHEN 7 THEN 'Pan crujiente, carne tierna, salsas en su punto.'
        WHEN 8 THEN 'Muy buena presentación y sabor auténtico.'
        WHEN 9 THEN 'Volvería sin dudarlo. Excelente servicio también.'
        WHEN 10 THEN 'Uno de mis favoritos en Madrid. Calidad consistente.'
        ELSE NULL
    END,
    CASE WHEN i % 7 <> 0 THEN TRUE ELSE FALSE END,
    NOW() - (INTERVAL '1 day' * (15 - i)),
    NOW()
FROM generate_series(1, 10) i;

-- 3 reviews de 3-3.5 estrellas
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((10+i-1) % 40) + 1],
    cristhian_user_id,
    3.0 + (i * 0.25),
    CASE i
        WHEN 1 THEN 'Buena pero esperaba más. El pan podría ser mejor.'
        WHEN 2 THEN 'Pasable. Nada extraordinario pero comible.'
        WHEN 3 THEN 'Regular. Ingredientes bien pero la presentación falla.'
    END,
    TRUE,
    NOW() - (INTERVAL '1 day' * (30 + i*5)),
    NOW()
FROM generate_series(1, 3) i;

-- 2 reviews de 2-2.5 estrellas
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((13+i-1) % 40) + 1],
    cristhian_user_id,
    2.0 + (i * 0.25),
    CASE i
        WHEN 1 THEN 'Decepcionante. Carne reseca y queso poco fundido.'
        WHEN 2 THEN 'No volvería. Calidad inconsistente.'
    END,
    TRUE,
    NOW() - (INTERVAL '1 day' * (50 + i*7)),
    NOW()
FROM generate_series(1, 2) i;

-- Reviews de Sofia (30 total - distribuida proporcionalmente)
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((15+i-1) % 40) + 1],
    sofia_user_id,
    CASE 
        WHEN i <= 18 THEN 4.0 + (RANDOM() * 1.0)
        WHEN i <= 27 THEN 3.5 + (RANDOM() * 1.0)
        ELSE 3.0 + (RANDOM() * 0.5)
    END,
    CASE WHEN RANDOM() > 0.4 THEN 'Muy buena burger de Barcelona' ELSE NULL END,
    RANDOM() > 0.5,
    NOW() - (INTERVAL '1 day' * (60 + (i % 30))),
    NOW()
FROM generate_series(1, 30) i;

-- Reviews de Carlos (12 total)
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((45+i-1) % 40) + 1],
    carlos_user_id,
    CASE 
        WHEN i <= 8 THEN 4.0 + (RANDOM() * 1.0)
        ELSE 3.5 + (RANDOM() * 1.0)
    END,
    CASE WHEN RANDOM() > 0.5 THEN 'Buena burger' ELSE NULL END,
    RANDOM() > 0.6,
    NOW() - (INTERVAL '1 day' * (70 + (i % 40))),
    NOW()
FROM generate_series(1, 12) i;

-- Reviews de Ana (5 total)
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((1+i-1) % 40) + 1],
    ana_user_id,
    CASE WHEN i <= 3 THEN 4.0 ELSE 3.5 END,
    NULL,
    FALSE,
    NOW() - (INTERVAL '1 day' * (80 + (i*10))),
    NOW()
FROM generate_series(1, 5) i;

-- Reviews de Miguel (18 total)
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((6+i-1) % 40) + 1],
    miguel_user_id,
    CASE 
        WHEN i <= 12 THEN 4.0 + (RANDOM() * 1.0)
        ELSE 3.5 + (RANDOM() * 1.0)
    END,
    CASE WHEN RANDOM() > 0.4 THEN 'Crítica constructiva' ELSE NULL END,
    RANDOM() > 0.5,
    NOW() - (INTERVAL '1 day' * (75 + (i % 30))),
    NOW()
FROM generate_series(1, 18) i;

-- Reviews de Laura (3 total)
INSERT INTO reviews (burger_id, user_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
    burger_ids[((24+i-1) % 40) + 1],
    laura_user_id,
    CASE WHEN i = 1 THEN 4.5 WHEN i = 2 THEN 4.0 ELSE 3.8 END,
    CASE WHEN i = 1 THEN 'La burger vegana más sabrosa que he probado' ELSE NULL END,
    i = 1,
    NOW() - (INTERVAL '1 day' * (90 + (i*20))),
    NOW()
FROM generate_series(1, 3) i;

RAISE NOTICE '80 reviews creadas con distribución realista';

-- ============================================================================
-- PASO 8: CREAR 200 REVIEW_TAGS
-- ============================================================================

-- Tags para las reviews existentes
INSERT INTO review_tags (review_id, tag_name, tag_category)
SELECT 
    r.id,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 'Brioche artesanal'
        WHEN 1 THEN 'Pan de sésamo'
        WHEN 2 THEN 'Pan integral'
        WHEN 3 THEN 'Pan sin gluten'
        ELSE 'Pan ciabatta'
    END,
    'bread'::tag_category
FROM reviews r
WHERE rating >= 3.5
LIMIT 40;

INSERT INTO review_tags (review_id, tag_name, tag_category)
SELECT 
    r.id,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 'Smash burger'
        WHEN 1 THEN 'Carne madurada'
        WHEN 2 THEN 'Al punto'
        WHEN 3 THEN 'Poco hecha'
        ELSE 'Wagyu premium'
    END,
    'meat'::tag_category
FROM reviews r
WHERE rating >= 3.5
LIMIT 40;

INSERT INTO review_tags (review_id, tag_name, tag_category)
SELECT 
    r.id,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 'Salsa BBQ'
        WHEN 1 THEN 'Mayonesa casera'
        WHEN 2 THEN 'Ketchup de lujo'
        WHEN 3 THEN 'Salsa de trufa'
        ELSE 'Alioli gourmet'
    END,
    'sauce'::tag_category
FROM reviews r
WHERE rating >= 3.5
LIMIT 40;

INSERT INTO review_tags (review_id, tag_name, tag_category)
SELECT 
    r.id,
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN 'Bacon crujiente'
        WHEN 1 THEN 'Cebolla caramelizada'
        WHEN 2 THEN 'Queso cheddar'
        ELSE 'Aguacate fresco'
    END,
    'topping'::tag_category
FROM reviews r
WHERE rating >= 3.5
LIMIT 40;

INSERT INTO review_tags (review_id, tag_name, tag_category)
SELECT 
    r.id,
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN 'Muy jugosa'
        WHEN 1 THEN 'Crujiente'
        WHEN 2 THEN 'Bien montada'
        ELSE 'Bien cocinada'
    END,
    'experience'::tag_category
FROM reviews r
WHERE rating >= 3.5
LIMIT 80;

RAISE NOTICE 'Tags de review creados';

-- ============================================================================
-- PASO 9: CREAR 50 REVIEW_IMAGES
-- ============================================================================

INSERT INTO review_images (review_id, image_url, image_type)
SELECT 
    r.id,
    'https://images.unsplash.com/photo-burger-' || GENERATE_SERIES(1, 50) || '?w=600',
    CASE WHEN RANDOM() > 0.8 THEN 'receipt' ELSE 'burger' END
FROM (
    SELECT id FROM reviews 
    WHERE is_verified = TRUE 
    AND rating >= 4.0
    LIMIT 50
) r
CROSS JOIN generate_series(1, 50);

RAISE NOTICE 'Imágenes de review creadas';

-- ============================================================================
-- PASO 10: CREAR BADGES PARA USUARIOS
-- ============================================================================

-- Badges de Cristhian
INSERT INTO user_badges (user_id, badge_type, badge_name, progress, target, unlocked, unlocked_at, created_at)
VALUES
(cristhian_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
(cristhian_user_id, 'critic'::badge_type, 'Crítico Novato', 15, 10, TRUE, NOW() - INTERVAL '1 month', NOW() - INTERVAL '3 months'),
(cristhian_user_id, 'specialist'::badge_type, 'Turista Burger', 5, 5, TRUE, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 months'),
(cristhian_user_id, 'social'::badge_type, 'Veggie Lover', 3, 10, FALSE, NULL, NOW() - INTERVAL '2 months'),
(cristhian_user_id, 'dedication'::badge_type, 'Paparazzi', 11, 50, FALSE, NULL, NOW() - INTERVAL '1 month');

-- Badges de Sofia
INSERT INTO user_badges (user_id, badge_type, badge_name, progress, target, unlocked, unlocked_at, created_at)
VALUES
(sofia_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
(sofia_user_id, 'critic'::badge_type, 'Crítico Experto', 30, 25, TRUE, NOW() - INTERVAL '1 month', NOW() - INTERVAL '5 months'),
(sofia_user_id, 'specialist'::badge_type, 'Master Barcelona', 30, 20, TRUE, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '3 months'),
(sofia_user_id, 'dedication'::badge_type, 'Paparazzi Profesional', 45, 50, FALSE, NULL, NOW() - INTERVAL '2 months'),
(sofia_user_id, 'match_master'::badge_type, 'Match Master', 25, 30, FALSE, NULL, NOW() - INTERVAL '1 month');

-- Badges de Carlos, Ana, Miguel, Laura (simplificado)
INSERT INTO user_badges (user_id, badge_type, badge_name, progress, target, unlocked, unlocked_at, created_at)
SELECT carlos_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '5 months', NOW() - INTERVAL '5 months' UNION ALL
SELECT carlos_user_id, 'critic'::badge_type, 'Crítico Novato', 12, 10, TRUE, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '4 months' UNION ALL
SELECT ana_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '4 months', NOW() - INTERVAL '4 months' UNION ALL
SELECT ana_user_id, 'social'::badge_type, 'Veggie Lover', 2, 10, FALSE, NULL, NOW() - INTERVAL '3 months' UNION ALL
SELECT miguel_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '5 months', NOW() - INTERVAL '5 months' UNION ALL
SELECT miguel_user_id, 'critic'::badge_type, 'Crítico Novato', 18, 10, TRUE, NOW() - INTERVAL '1 month', NOW() - INTERVAL '4 months' UNION ALL
SELECT miguel_user_id, 'match_master'::badge_type, 'Matcher Ávido', 12, 20, FALSE, NULL, NOW() - INTERVAL '2 months' UNION ALL
SELECT laura_user_id, 'explorer'::badge_type, 'Primera Review', 1, 1, TRUE, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months' UNION ALL
SELECT laura_user_id, 'social'::badge_type, 'Veggie Lover', 8, 10, FALSE, NULL, NOW() - INTERVAL '2 months';

RAISE NOTICE 'Badges creados para todos los usuarios';

-- ============================================================================
-- PASO 11: CREAR SISTEMA DE RECOMPENSAS (REWARDS)
-- ============================================================================

-- Crear 12 premios base
INSERT INTO rewards (name, description, reward_type, points_required, image_url, available_until, quantity_available, created_at)
VALUES
-- Burger Fan level
('Patatas Gratis', 'Ración de patatas gratis en tu próxima visita', 'free_fries'::reward_type, 100, NULL, NOW() + INTERVAL '1 year', 999, NOW()),
('Bebida Gratis', 'Bebida de tu elección completamente gratis', 'free_drink'::reward_type, 150, NULL, NOW() + INTERVAL '1 year', 999, NOW()),
('10% Descuento', 'Cupón de descuento del 10% en tu próxima compra', 'discount'::reward_type, 200, NULL, NOW() + INTERVAL '1 year', 500, NOW()),

-- Burger Lover level
('Burger Gratis', 'Burger de tu elección completamente gratis', 'free_burger'::reward_type, 500, NULL, NOW() + INTERVAL '1 year', 250, NOW()),
('2x1 en Burgers', 'Compra una burger y lleva dos', 'discount'::reward_type, 600, NULL, NOW() + INTERVAL '1 year', 150, NOW()),
('20% Descuento', 'Cupón de descuento del 20% válido en cualquier restaurante asociado', 'discount'::reward_type, 700, NULL, NOW() + INTERVAL '1 year', 300, NOW()),

-- Burger Obsessed level
('Menú Completo Gratis', 'Menú completo (burger + bebida + patatas) gratis', 'free_burger'::reward_type, 1000, NULL, NOW() + INTERVAL '1 year', 100, NOW()),
('Experiencia VIP', 'Cena VIP con acceso a menú secreto y trato especial', 'vip_experience'::reward_type, 1500, NULL, NOW() + INTERVAL '6 months', 50, NOW()),
('Burger Personalizada', 'Diseña tu burger perfecta con el chef', 'vip_experience'::reward_type, 2000, NULL, NOW() + INTERVAL '1 year', 30, NOW()),
('Cena con el Chef', 'Experiencia exclusiva cenando con el chef del restaurante', 'vip_experience'::reward_type, 3000, NULL, NOW() + INTERVAL '6 months', 10, NOW());

RAISE NOTICE 'Premios base creados (10 recompensas)';

-- ============================================================================
-- PASO 12: CREAR BURGER_MATCHES (MINIJUEGO)
-- ============================================================================

-- 25 matches para Cristhian
INSERT INTO burger_matches (user_id, burger_id_1, burger_id_2, winner_id, points_earned, created_at)
SELECT 
    cristhian_user_id,
    burger_ids[((i-1) % 40) + 1],
    burger_ids[((i+20) % 40) + 1],
    CASE WHEN (i % 2) = 0 THEN burger_ids[((i-1) % 40) + 1] ELSE burger_ids[((i+20) % 40) + 1] END,
    1,
    NOW() - (INTERVAL '1 day' * (60 - (i % 60)))
FROM generate_series(1, 25) i;

RAISE NOTICE 'Matches creados para el minijuego';

-- ============================================================================
-- PASO 13: CREAR SISTEMA SOCIAL (FOLLOWS)
-- ============================================================================

-- Seguidores de Cristhian
INSERT INTO follows (follower_id, following_id, created_at)
VALUES
(sofia_user_id, cristhian_user_id, NOW() - INTERVAL '5 months'),
(carlos_user_id, cristhian_user_id, NOW() - INTERVAL '4 months'),
(miguel_user_id, cristhian_user_id, NOW() - INTERVAL '3 months');

-- Cristhian sigue a
INSERT INTO follows (follower_id, following_id, created_at)
VALUES
(cristhian_user_id, sofia_user_id, NOW() - INTERVAL '5 months'),
(cristhian_user_id, ana_user_id, NOW() - INTERVAL '4 months'),
(cristhian_user_id, laura_user_id, NOW() - INTERVAL '3 months');

-- Otras relaciones sociales
INSERT INTO follows (follower_id, following_id, created_at)
VALUES
(sofia_user_id, laura_user_id, NOW() - INTERVAL '4 months'),
(carlos_user_id, miguel_user_id, NOW() - INTERVAL '3 months'),
(miguel_user_id, ana_user_id, NOW() - INTERVAL '2 months'),
(ana_user_id, carlos_user_id, NOW() - INTERVAL '2 months'),
(laura_user_id, miguel_user_id, NOW() - INTERVAL '1 month'),
(carlos_user_id, sofia_user_id, NOW() - INTERVAL '3 months');

RAISE NOTICE 'Red social creada (13 relaciones de follow)';

-- ============================================================================
-- PASO 14: CREAR USER_PREFERENCES
-- ============================================================================

-- Preferencias de Cristhian
INSERT INTO user_preferences (
    user_id, dietary_preferences, main_city, price_range,
    notifications_enabled, profile_public, show_location, created_at, updated_at
) VALUES (
    cristhian_user_id,
    '{"vegetariano"}',
    'Madrid',
    'medium'::price_range,
    TRUE,
    TRUE,
    TRUE,
    NOW() - INTERVAL '3 months',
    NOW()
);

-- Preferencias para otros usuarios
INSERT INTO user_preferences (
    user_id, dietary_preferences, main_city, price_range,
    notifications_enabled, profile_public, show_location, created_at, updated_at
) VALUES
(sofia_user_id, '{"vegana"}', 'Barcelona', 'premium'::price_range, TRUE, TRUE, TRUE, NOW() - INTERVAL '5 months', NOW()),
(carlos_user_id, '{}', 'Madrid', 'medium'::price_range, TRUE, TRUE, FALSE, NOW() - INTERVAL '4 months', NOW()),
(ana_user_id, '{"vegetariano","sin-gluten"}', 'Valencia', 'budget'::price_range, TRUE, FALSE, TRUE, NOW() - INTERVAL '3 months', NOW()),
(miguel_user_id, '{}', 'Madrid', 'premium'::price_range, TRUE, TRUE, TRUE, NOW() - INTERVAL '4 months', NOW()),
(laura_user_id, '{"vegana"}', 'Barcelona', 'medium'::price_range, FALSE, TRUE, TRUE, NOW() - INTERVAL '2 months', NOW());

RAISE NOTICE 'Preferencias de usuario creadas';

-- ============================================================================
-- PASO 15: ACTUALIZAR ESTADÍSTICAS EN BURGERS
-- ============================================================================

-- Actualizar ratings y counts de burgers basado en reviews
UPDATE burgers b
SET
    average_rating = COALESCE((
        SELECT AVG(rating)::DECIMAL(3, 2) 
        FROM reviews 
        WHERE burger_id = b.id
    ), b.average_rating),
    total_ratings = COALESCE((
        SELECT COUNT(*) 
        FROM reviews 
        WHERE burger_id = b.id
    ), 0)
WHERE id IN (SELECT burger_id FROM reviews);

-- Actualizar total_burgers en restaurantes
UPDATE restaurants r
SET total_burgers = (
    SELECT COUNT(*) 
    FROM burgers 
    WHERE restaurant_id = r.id
),
average_rating = COALESCE((
    SELECT AVG(b.average_rating)::DECIMAL(3, 2) 
    FROM burgers b 
    WHERE b.restaurant_id = r.id
), r.average_rating);

RAISE NOTICE 'Estadísticas actualizadas en burgers y restaurantes';

-- ============================================================================
-- PASO 16: ACTUALIZAR ESTADÍSTICAS DE PERFILES
-- ============================================================================

-- Actualizar total_reviews en perfiles
UPDATE profiles p
SET total_reviews = (
    SELECT COUNT(*) 
    FROM reviews 
    WHERE user_id = p.id
)
WHERE id IN (SELECT DISTINCT user_id FROM reviews);

RAISE NOTICE 'Estadísticas de perfiles actualizadas';

-- ============================================================================
-- VERIFICACIONES FINALES
-- ============================================================================

DECLARE
    v_total_usuarios INT;
    v_total_restaurantes INT;
    v_total_burgers INT;
    v_total_reviews INT;
    v_total_tags INT;
    v_total_images INT;
BEGIN
    SELECT COUNT(*) INTO v_total_usuarios FROM profiles;
    SELECT COUNT(*) INTO v_total_restaurantes FROM restaurants;
    SELECT COUNT(*) INTO v_total_burgers FROM burgers;
    SELECT COUNT(*) INTO v_total_reviews FROM reviews;
    SELECT COUNT(*) INTO v_total_tags FROM review_tags;
    SELECT COUNT(*) INTO v_total_images FROM review_images;

    RAISE NOTICE '====== DATOS POBLADOS EXITOSAMENTE ======';
    RAISE NOTICE 'Total de usuarios: %', v_total_usuarios;
    RAISE NOTICE 'Total de restaurantes: %', v_total_restaurantes;
    RAISE NOTICE 'Total de hamburguesas: %', v_total_burgers;
    RAISE NOTICE 'Total de reviews: %', v_total_reviews;
    RAISE NOTICE 'Total de tags: %', v_total_tags;
    RAISE NOTICE 'Total de imágenes: %', v_total_images;
    RAISE NOTICE '✅ SCRIPT COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '✅ Base de datos lista para testing';
END;

END $$;

-- ============================================================================
-- SELECTS DE VERIFICACIÓN (ejecutar después del script principal)
-- ============================================================================

-- Verificar datos de Cristhian
SELECT 
    username, 
    level, 
    total_points, 
    available_points, 
    total_reviews,
    bio
FROM profiles 
WHERE username = 'cristhian_espimo';

-- Verificar restaurantes
SELECT 
    COUNT(*) as total,
    city,
    AVG(average_rating) as rating_promedio
FROM restaurants
GROUP BY city
ORDER BY city;

-- Verificar hamburguesas
SELECT 
    COUNT(*) as total,
    burger_type,
    AVG(average_rating) as rating_promedio,
    MIN(price) as precio_min,
    MAX(price) as precio_max
FROM burgers
GROUP BY burger_type
ORDER BY burger_type;

-- Verificar reviews
SELECT 
    COUNT(*) as total_reviews,
    ROUND(AVG(rating)::NUMERIC, 2) as rating_promedio,
    MAX(rating) as max_rating,
    MIN(rating) as min_rating
FROM reviews;

-- Verificar distribución de usuarios
SELECT 
    username,
    city,
    level,
    total_reviews,
    total_points
FROM profiles
ORDER BY total_points DESC;

-- Verificar badges
SELECT 
    p.username,
    COUNT(ub.id) as total_badges,
    SUM(CASE WHEN ub.unlocked THEN 1 ELSE 0 END) as badges_desbloqueados
FROM profiles p
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.username
ORDER BY p.total_points DESC;
