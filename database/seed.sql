-- Datos de ejemplo para BurgeRank
-- Adaptado al schema real con UUIDs, city_id y estructura correcta
-- NOTA: Añadido LIMIT 1 a todas las subqueries para evitar errores de múltiples filas

-- ============================================================================
-- INSERTAR USUARIOS
-- ============================================================================
INSERT INTO public.users (username, email, bio, category, public_profile)
VALUES
  ('usuario_burguer', 'usuario@burgerank.es', 'Apasionado por las hamburguesas frescas', 'Burger Fan', TRUE),
  ('foodlover_madrid', 'foodlover@burgerank.es', 'Crítico de burgers en Madrid', 'Burger Lover', TRUE),
  ('crítico_gastro', 'critico@burgerank.es', 'Analizo cada detalle de la hamburguesa', 'Burger Obsessed', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- INSERTAR RESTAURANTES (con city_id)
-- ============================================================================
INSERT INTO public.restaurants (name, city_id, address, phone, hours)
VALUES
-- Madrid
('Burger Palace', (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1), 'Calle Principal 123, 28001', '+34 91 234 5678', '12:00-23:30'),
('Taquería Mexicana', (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1), 'Gran Vía 321, 28013', '+34 91 555 6789', '12:00-23:00'),
('El Desayunador', (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1), 'Calle del Almirante 789, 28004', '+34 91 666 7890', '08:00-22:00'),
-- Barcelona
('The Smokehouse', (SELECT id FROM public.cities WHERE name = 'Barcelona' LIMIT 1), 'Paseo de Gracia 456, 08007', '+34 93 234 5678', '13:00-22:30'),
('Green Burgers', (SELECT id FROM public.cities WHERE name = 'Barcelona' LIMIT 1), 'Carrer de Còrsega 222, 08008', '+34 93 555 6789', '13:00-22:00'),
-- Valencia
('Hamburguesería Las Delicias', (SELECT id FROM public.cities WHERE name = 'Valencia' LIMIT 1), 'Calle del Mercado 789, 46001', '+34 96 234 5678', '12:00-23:00'),
('Burger Lab', (SELECT id FROM public.cities WHERE name = 'Valencia' LIMIT 1), 'Plaza de la Virgen 100, 46003', '+34 96 555 6789', '12:30-23:30'),
-- Sevilla
('Gourmet Burgers Co.', (SELECT id FROM public.cities WHERE name = 'Sevilla' LIMIT 1), 'Avenida Constitución 789, 41002', '+34 95 234 5678', '12:00-00:00'),
('Premium Burgers', (SELECT id FROM public.cities WHERE name = 'Sevilla' LIMIT 1), 'Calle Betis 321, 41010', '+34 95 666 7890', '12:00-23:00'),
-- Bilbao
('Route 66 Diner', (SELECT id FROM public.cities WHERE name = 'Bilbao' LIMIT 1), 'Casco Viejo 555, 48005', '+34 94 234 5678', '11:00-23:30')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR BURGERS (hamburguesas)
-- ============================================================================
INSERT INTO public.burgers (name, restaurant_id, city_id, description, type, tags)
VALUES
-- Burger Palace (Madrid)
(
  'The King',
  (SELECT id FROM public.restaurants WHERE name = 'Burger Palace' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1),
  'Doble carne, queso cheddar, bacon, lechuga y tomate',
  'premium',
  ARRAY['Jugosa', 'Doble Carne', 'Premium']
),
(
  'Royal Deluxe',
  (SELECT id FROM public.restaurants WHERE name = 'Burger Palace' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1),
  'Triple carne con setas salteadas y queso azul',
  'premium',
  ARRAY['Premium', 'Gourmet', 'Triple Carne']
),
-- The Smokehouse (Barcelona)
(
  'Smoky BBQ Delight',
  (SELECT id FROM public.restaurants WHERE name = 'The Smokehouse' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Barcelona' LIMIT 1),
  'Carne ahumada con salsa BBQ premium',
  'premium',
  ARRAY['Ahumada', 'BBQ', 'Specialty']
),
-- Hamburguesería Las Delicias (Valencia)
(
  'Doble Sabor Clásico',
  (SELECT id FROM public.restaurants WHERE name = 'Hamburguesería Las Delicias' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Valencia' LIMIT 1),
  'Hamburguesa clásica con doble carne y queso fundido',
  'clásica',
  ARRAY['Clásica', 'Doble Carne', 'Queso']
),
-- Gourmet Burgers Co. (Sevilla)
(
  'Gourmet Cheese Premium',
  (SELECT id FROM public.restaurants WHERE name = 'Gourmet Burgers Co.' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Sevilla' LIMIT 1),
  'Triple queso premium: cheddar, azul y brie',
  'premium',
  ARRAY['Gourmet', 'Premium', 'Quesos']
),
(
  'Executive Gold',
  (SELECT id FROM public.restaurants WHERE name = 'Gourmet Burgers Co.' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Sevilla' LIMIT 1),
  'Carnes premium con trufa negra y queso de cabra',
  'premium',
  ARRAY['Luxury', 'Trufa', 'Premium']
),
-- Taquería Mexicana (Madrid)
(
  'Picante Jalapeño',
  (SELECT id FROM public.restaurants WHERE name = 'Taquería Mexicana' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1),
  'Carne especiada con jalapeños y salsa mexicana',
  'premium',
  ARRAY['Picante', 'Mexicana', 'Especiada']
),
-- Route 66 Diner (Bilbao)
(
  'Clásica Americana',
  (SELECT id FROM public.restaurants WHERE name = 'Route 66 Diner' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Bilbao' LIMIT 1),
  'Auténtica hamburguesa americana de tamaño generoso',
  'clásica',
  ARRAY['Clásica', 'Americana', 'Grande']
),
-- Green Burgers (Barcelona)
(
  'Vegetariana Gourmet',
  (SELECT id FROM public.restaurants WHERE name = 'Green Burgers' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Barcelona' LIMIT 1),
  'Lenteja con aguacate, quinoa y vegetales frescos',
  'vegana',
  ARRAY['Vegetariana', 'Gourmet', 'Saludable']
),
-- Burger Lab (Valencia)
(
  'Smash Burger Crujiente',
  (SELECT id FROM public.restaurants WHERE name = 'Burger Lab' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Valencia' LIMIT 1),
  'Técnica smash con pan tostado',
  'clásica',
  ARRAY['Smash', 'Crujiente', 'Premium']
),
-- El Desayunador (Madrid)
(
  'Bacon & Huevo',
  (SELECT id FROM public.restaurants WHERE name = 'El Desayunador' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Madrid' LIMIT 1),
  'Carne con huevo frito y bacon crujiente',
  'clásica',
  ARRAY['Desayuno', 'Bacon', 'Huevo']
),
-- Premium Burgers (Sevilla)
(
  'Trufada Negra',
  (SELECT id FROM public.restaurants WHERE name = 'Premium Burgers' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Sevilla' LIMIT 1),
  'Carne con trufa negra y queso azul',
  'premium',
  ARRAY['Trufa', 'Premium', 'Lujo']
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR RATINGS (Calificaciones)
-- ============================================================================
INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  5,
  3,
  3,
  3,
  3,
  12.99,
  'Hamburguesa increíble, muy jugosa y bien presentada.',
  'local',
  20
FROM public.users u, public.burgers b
WHERE u.username = 'usuario_burguer' AND b.name = 'The King'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  3,
  2,
  3,
  13.99,
  'Excelente sabor ahumado. Un poco más de carne habría sido perfecto.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'foodlover_madrid' AND b.name = 'Smoky BBQ Delight'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  3,
  2,
  2,
  11.50,
  'Muy buena relación calidad-precio. Recomendado.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'crítico_gastro' AND b.name = 'Doble Sabor Clásico'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  5,
  3,
  3,
  3,
  3,
  16.99,
  'Los quesos combinan perfectamente, una experiencia premium.',
  'local',
  20
FROM public.users u, public.burgers b
WHERE u.username = 'usuario_burguer' AND b.name = 'Gourmet Cheese Premium'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  2,
  3,
  3,
  11.99,
  'Muy picante para algunos, pero deliciosa. Ideal con cerveza fría.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'foodlover_madrid' AND b.name = 'Picante Jalapeño'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  3,
  2,
  2,
  11.99,
  'Auténtica hamburguesa americana. Tamaño generoso.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'crítico_gastro' AND b.name = 'Clásica Americana'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  5,
  3,
  3,
  3,
  2,
  11.99,
  'Sorprendentemente deliciosa incluso sin carne. La lenteja está perfecta.',
  'local',
  20
FROM public.users u, public.burgers b
WHERE u.username = 'usuario_burguer' AND b.name = 'Vegetariana Gourmet'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  3,
  3,
  2,
  11.50,
  'Técnica smash ejecutada correctamente. Muy crujiente por fuera.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'foodlover_madrid' AND b.name = 'Smash Burger Crujiente'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  3,
  3,
  2,
  2,
  2,
  10.99,
  'Buen desayuno, pero el huevo estaba ligeramente pasado.',
  'local',
  10
FROM public.users u, public.burgers b
WHERE u.username = 'crítico_gastro' AND b.name = 'Bacon & Huevo'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, consumption_type, points_awarded)
SELECT 
  u.id,
  b.id,
  4,
  3,
  3,
  3,
  2,
  14.99,
  'La trufa le da un toque especial, un poco cara pero vale la pena.',
  'local',
  15
FROM public.users u, public.burgers b
WHERE u.username = 'usuario_burguer' AND b.name = 'Trufada Negra'
LIMIT 1
ON CONFLICT (user_id, burger_id) DO NOTHING;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Este script está adaptado al schema real con UUIDs
-- 2. Utiliza LIMIT 1 en todas las subqueries para evitar errores de múltiples filas
-- 3. Los ratings se insertan con overall_rating (1-5) como lo especifica el schema
-- 4. Cada rating incluye: pan_rating, carne_rating, toppings_rating, salsa_rating
-- 5. Los puntos se asignan automáticamente (20 para 5 estrellas, 15 para 4, etc)
-- 6. Las ciudades ya existen en el schema, así que se usan como foreign keys
-- 7. Los usuarios, restaurantes y burgers se crean en orden para mantener integridad referencial
-- 8. El script está optimizado para ejecutarse sin conflictos en Supabase
