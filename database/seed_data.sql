-- BurgeRank Seed Data
-- Insert sample data for testing and development

-- ============================================================================
-- SAMPLE RESTAURANTS
-- ============================================================================

INSERT INTO public.restaurants (name, city_id, address, phone, hours) VALUES
  (
    'Burger Palace',
    (SELECT id FROM public.cities WHERE name = 'Madrid'),
    'Calle Principal 123, Madrid',
    '+34 123 456 789',
    '12:00 - 23:00'
  ),
  (
    'Grill House',
    (SELECT id FROM public.cities WHERE name = 'Barcelona'),
    'Avenida Diagonal 456, Barcelona',
    '+34 234 567 890',
    '11:00 - 00:00'
  ),
  (
    'Burger Artisan',
    (SELECT id FROM public.cities WHERE name = 'Valencia'),
    'Calle del Mar 789, Valencia',
    '+34 345 678 901',
    '13:00 - 22:00'
  ),
  (
    'Fast Burger',
    (SELECT id FROM public.cities WHERE name = 'Madrid'),
    'Plaza Mayor 321, Madrid',
    '+34 456 789 012',
    '12:00 - 23:30'
  ),
  (
    'Green Burger',
    (SELECT id FROM public.cities WHERE name = 'Barcelona'),
    'Paseo de Gracia 654, Barcelona',
    '+34 567 890 123',
    '10:00 - 22:00'
  );

-- ============================================================================
-- SAMPLE BURGERS
-- ============================================================================

INSERT INTO public.burgers (name, restaurant_id, description, position, type, tags, city_id, average_rating, total_ratings) VALUES
  (
    'The King Burger',
    (SELECT id FROM public.restaurants WHERE name = 'Burger Palace'),
    'Smash beef con queso fundido y bacon crujiente',
    1,
    'premium',
    ARRAY['Jugosa', 'Carne Fresca', 'Premium'],
    (SELECT id FROM public.cities WHERE name = 'Madrid'),
    4.8,
    245
  ),
  (
    'Smoky BBQ',
    (SELECT id FROM public.restaurants WHERE name = 'Grill House'),
    'Ternera con salsa BBQ y cebolla caramelizada',
    2,
    'premium',
    ARRAY['BBQ', 'Ternera', 'Salsa'],
    (SELECT id FROM public.cities WHERE name = 'Barcelona'),
    4.7,
    186
  ),
  (
    'Clásica Tradicional',
    (SELECT id FROM public.restaurants WHERE name = 'Burger Artisan'),
    'Simple pero perfecta, carne de calidad con queso',
    3,
    'clásica',
    ARRAY['Clásica', 'Económica'],
    (SELECT id FROM public.cities WHERE name = 'Valencia'),
    4.5,
    312
  ),
  (
    'Doble Sabor',
    (SELECT id FROM public.restaurants WHERE name = 'Fast Burger'),
    'Dos carnes con doble queso y salsa especial',
    4,
    'doble',
    ARRAY['Doble', 'Picante'],
    (SELECT id FROM public.cities WHERE name = 'Madrid'),
    4.3,
    198
  ),
  (
    'Veggie Supreme',
    (SELECT id FROM public.restaurants WHERE name = 'Green Burger'),
    'Lentejas y setas con aguacate y rúcula',
    5,
    'vegana',
    ARRAY['Vegana', 'Sano'],
    (SELECT id FROM public.cities WHERE name = 'Barcelona'),
    4.2,
    156
  );

-- ============================================================================
-- SAMPLE USERS (Note: In production, users should be created via Auth)
-- ============================================================================

-- Create sample users (you'll need to replace IDs with actual auth.users IDs)
-- These are for demonstration purposes

INSERT INTO public.users (id, username, email, bio, points, category, public_profile) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'cristhian_guzman',
    'cristhian@burgerank.com',
    'Burger enthusiast desde el 2020',
    340,
    'Burger Obsessed',
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'elena_burger',
    'elena@burgerank.com',
    'Amante de las hamburguesas gourmet',
    215,
    'Burger Lover',
    TRUE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'juan_fast',
    'juan@burgerank.com',
    'Probando todas las burgers del país',
    520,
    'Burger Obsessed',
    TRUE
  );

-- ============================================================================
-- SAMPLE RATINGS
-- ============================================================================

INSERT INTO public.ratings (user_id, burger_id, overall_rating, pan_rating, carne_rating, toppings_rating, salsa_rating, price, comment, has_ticket, consumption_type, appetizers, points_awarded) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM public.burgers WHERE name = 'The King Burger'),
    5,
    3,
    3,
    3,
    2,
    12.50,
    'Increíble, definitivamente la mejor burger que he probado',
    TRUE,
    'local',
    ARRAY['fries', 'nachos'],
    75
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    (SELECT id FROM public.burgers WHERE name = 'Smoky BBQ'),
    4,
    2,
    3,
    3,
    3,
    11.00,
    'La salsa BBQ es excepcional, aunque la carne podría ser más jugosa',
    TRUE,
    'local',
    ARRAY['chicken'],
    60
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    (SELECT id FROM public.burgers WHERE name = 'Veggie Supreme'),
    4,
    3,
    2,
    3,
    3,
    9.50,
    'Sorprendentemente deliciosa para una burger vegana',
    FALSE,
    'delivery',
    ARRAY['none'],
    50
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    (SELECT id FROM public.burgers WHERE name = 'The King Burger'),
    5,
    3,
    3,
    3,
    3,
    12.50,
    'Perfecta en todos los aspectos',
    TRUE,
    'local',
    ARRAY['fries'],
    75
  );

-- ============================================================================
-- SAMPLE USER BADGES
-- ============================================================================

INSERT INTO public.user_badges (user_id, badge_id, unlocked_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Primer Rating'), NOW() - INTERVAL '6 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Crítico Ardiente'), NOW() - INTERVAL '4 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Maestro de Sabores'), NOW() - INTERVAL '2 months'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.badges WHERE name = 'Coleccionista'), NOW() - INTERVAL '1 month'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.badges WHERE name = 'Crítico Leyenda'), NOW());

-- ============================================================================
-- SAMPLE USER REWARDS
-- ============================================================================

INSERT INTO public.user_rewards (user_id, reward_id, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.rewards WHERE name = '10% Descuento'), NOW() - INTERVAL '1 month'),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM public.rewards WHERE name = 'Bebida Gratis'), NOW() - INTERVAL '2 weeks'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, (SELECT id FROM public.rewards WHERE name = 'Hamburguesa Gratis'), NOW());

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

INSERT INTO public.notifications (user_id, title, description, type, icon_emoji, is_read) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '¡Subiste de nivel!',
    'Alcanzaste Nivel 3 - Maestro',
    'level_up',
    '⬆️',
    FALSE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Nueva recompensa desbloqueada',
    'Crítico Ardiente - Valora 10 burgers',
    'badge_unlocked',
    '🎁',
    FALSE
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Nueva hamburguesa agregada',
    'The Spicy Inferno en Grill House',
    'new_burger',
    '🍔',
    TRUE
  );
