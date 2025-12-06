-- ============================================================================
-- BurgeRank Database Seed Data - Migration 005
-- ============================================================================
-- Initial data for rewards, badges, test restaurants, and burgers
-- ============================================================================

-- ============================================================================
-- SEED DATA: Rewards
-- ============================================================================

-- Discount rewards
INSERT INTO rewards (name, description, points_cost, reward_type, discount_percentage, required_level)
VALUES
  ('10% Descuento', '10% de descuento en tu próxima compra', 200, 'discount'::reward_type, 10, 'burger_fan'::user_level),
  ('15% Descuento', '15% de descuento en tu próxima compra', 350, 'discount'::reward_type, 15, 'burger_lover'::user_level),
  ('20% Descuento VIP', '20% de descuento en tu próxima compra', 600, 'discount'::reward_type, 20, 'burger_obsessed'::user_level),
  ('Porción Gratis de Papas', 'Una porción de papas completamente gratis', 150, 'free_fries'::reward_type, NULL, 'burger_fan'::user_level),
  ('Papas Premium Gratis', 'Papas premium gratuitamente', 250, 'free_fries'::reward_type, NULL, 'burger_lover'::user_level),
  ('Bebida Gratis', 'Una bebida pequeña completamente gratis', 180, 'free_drink'::reward_type, NULL, 'burger_fan'::user_level),
  ('Bebida Mediana Gratis', 'Una bebida mediana completamente gratis', 300, 'free_drink'::reward_type, NULL, 'burger_lover'::user_level),
  ('Bebida Premium Gratis', 'Una bebida premium completamente gratis', 450, 'free_drink'::reward_type, NULL, 'burger_obsessed'::user_level),
  ('Hamburguesa Clásica Gratis', 'Una hamburguesa clásica completamente gratis', 500, 'free_burger'::reward_type, NULL, 'burger_lover'::user_level),
  ('Hamburguesa Premium Gratis', 'Una hamburguesa premium completamente gratis', 800, 'free_burger'::reward_type, NULL, 'burger_obsessed'::user_level),
  ('Experiencia VIP', 'Visita VIP con entrada prioritaria y sorpresas exclusivas', 1000, 'vip_experience'::reward_type, NULL, 'burger_obsessed'::user_level),
  ('Cata Premium', 'Cata de 3 hamburguesas nuevas con sommelier de salsas', 750, 'vip_experience'::reward_type, NULL, 'burger_lover'::user_level);

-- ============================================================================
-- SEED DATA: Restaurants (Test Data)
-- ============================================================================

INSERT INTO restaurants (name, slug, address, city, phone, latitude, longitude, average_rating, total_burgers, verified)
VALUES
  ('Burger Palace', 'burger-palace', 'Calle Principal 123', 'Madrid', '+34 91 234 5678', 40.4168, -3.7038, 4.5, 8, TRUE),
  ('The Burger House', 'the-burger-house', 'Avenida Central 456', 'Barcelona', '+34 93 456 7890', 41.3851, 2.1734, 4.3, 12, TRUE),
  ('Gourmet Burgers', 'gourmet-burgers', 'Plaza Mayor 789', 'Madrid', '+34 91 567 8901', 40.4156, -3.7076, 4.7, 10, TRUE),
  ('Fast & Furious Burgers', 'fast-furious-burgers', 'Calle Nueva 321', 'Valencia', '+34 96 234 5678', 39.4699, -0.3763, 4.1, 6, TRUE),
  ('Craft Burger Kitchen', 'craft-burger-kitchen', 'Avenida Paseo 654', 'Bilbao', '+34 94 456 7890', 43.2633, -2.9345, 4.6, 9, TRUE);

-- ============================================================================
-- SEED DATA: Burgers (Test Data)
-- ============================================================================

INSERT INTO burgers (restaurant_id, name, slug, description, price, type, is_gluten_free, is_vegan, is_vegetarian, average_rating, total_reviews, verified)
VALUES
  ((SELECT id FROM restaurants WHERE slug = 'burger-palace'), 'Clásica Royal', 'clasica-royal', 'Hamburguesa clásica con queso derretido', 8.99, 'clasica'::burger_type, FALSE, FALSE, FALSE, 4.5, 25, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'burger-palace'), 'Doble Juicy', 'doble-juicy', 'Doble carne con bacon crujiente', 12.99, 'doble'::burger_type, FALSE, FALSE, FALSE, 4.6, 18, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'burger-palace'), 'Veggie Supreme', 'veggie-supreme', 'Hamburguesa vegana con champiñones asados', 9.99, 'vegana'::burger_type, TRUE, TRUE, TRUE, 4.2, 12, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'the-burger-house'), 'Pollo BBQ', 'pollo-bbq', 'Pollo a la parrilla con salsa BBQ casera', 10.99, 'pollo'::burger_type, FALSE, FALSE, FALSE, 4.3, 22, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'the-burger-house'), 'Cerdo Ibérico', 'cerdo-iberico', 'Jamón ibérico con tomate confitado', 14.99, 'cerdo'::burger_type, FALSE, FALSE, FALSE, 4.7, 15, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'gourmet-burgers'), 'Cordero Premium', 'cordero-premium', 'Cordero de montaña con salsa de menta', 16.99, 'cordero'::burger_type, FALSE, FALSE, FALSE, 4.8, 19, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'gourmet-burgers'), 'Triple Cheeseburger', 'triple-cheeseburger', 'Tres carnes con triple queso fundido', 15.99, 'cheeseburger'::burger_type, FALSE, FALSE, FALSE, 4.4, 21, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'fast-furious-burgers'), 'Veggie Deluxe', 'veggie-deluxe', 'Hamburguesa vegana con aguacate', 11.99, 'vegana'::burger_type, TRUE, TRUE, TRUE, 4.1, 10, TRUE),
  ((SELECT id FROM restaurants WHERE slug = 'craft-burger-kitchen'), 'Lomo Picante', 'lomo-picante', 'Lomo de ternera con jalapeños y queso azul', 13.99, 'clasica'::burger_type, FALSE, FALSE, FALSE, 4.6, 17, TRUE);

-- ============================================================================
-- SEED DATA: Badge Templates (These are created per user via trigger)
-- Note: This is for reference. Actual badges are created per user on profile creation
-- ============================================================================

-- The badges are automatically created via trigger in 003_triggers.sql
-- when a new profile is created. The badge templates are:
-- 1. Explorer - 50 reviews
-- 2. Critic - 100 verified reviews  
-- 3. Specialist - Reviews in 5+ different cities
-- 4. Social Butterfly - 100 followers
-- 5. Dedication - Reach burger_obsessed level
-- 6. Match Master - 500 matches won

-- ============================================================================
-- VIEW HELPERS: Popular Tags
-- ============================================================================

-- These are common tags that will be used for reviews
-- Users can add these via the UI

-- ============================================================================
-- SEED DATA: Sample Test Data (Optional - for development only)
-- ============================================================================

-- Uncomment this section if you want to generate sample reviews for testing
-- Note: You'll need actual user IDs from the auth.users table

/*
-- This is pseudocode showing what sample data would look like
-- In production, actual user testing would create these naturally

INSERT INTO reviews (burger_id, user_id, overall_rating, bread_rating, meat_rating, toppings_rating, sauces_rating, originality_rating, sides_rating, value_rating, comment, visit_date, is_verified, likes_count)
SELECT 
  b.id,
  (SELECT id FROM profiles LIMIT 1) as user_id,
  4.5,
  4.5,
  4.7,
  4.3,
  4.4,
  4.2,
  4.1,
  4.5,
  'Excelente hamburguesa, el pan está perfectamente tostado. Muy recomendable.',
  CURRENT_DATE - INTERVAL '5 days',
  TRUE,
  12
FROM burgers b
WHERE b.name = 'Clásica Royal'
LIMIT 1;
*/

-- ============================================================================
-- FUNCTION: seed_initial_rewards
-- ============================================================================
-- Helper function to ensure rewards exist
CREATE OR REPLACE FUNCTION seed_initial_rewards()
RETURNS VOID AS $$
BEGIN
  IF (SELECT COUNT(*) FROM rewards) = 0 THEN
    -- Rewards already inserted above
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: seed_initial_restaurants
-- ============================================================================
-- Helper function to ensure test restaurants exist
CREATE OR REPLACE FUNCTION seed_initial_restaurants()
RETURNS VOID AS $$
BEGIN
  IF (SELECT COUNT(*) FROM restaurants) = 0 THEN
    -- Restaurants already inserted above
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Use these queries to verify seed data was inserted correctly

/*

-- Check rewards count
SELECT COUNT(*) as rewards_count FROM rewards;
-- Expected: 12

-- Check restaurants count
SELECT COUNT(*) as restaurants_count FROM restaurants;
-- Expected: 5

-- Check burgers count
SELECT COUNT(*) as burgers_count FROM burgers;
-- Expected: 9

-- List all rewards
SELECT name, points_cost, reward_type, required_level FROM rewards ORDER BY points_cost ASC;

-- List all restaurants
SELECT name, city, average_rating, total_burgers FROM restaurants ORDER BY average_rating DESC;

-- List all burgers with restaurant info
SELECT r.name as restaurant, b.name as burger, b.type, b.price, b.average_rating 
FROM burgers b
JOIN restaurants r ON b.restaurant_id = r.id
ORDER BY b.average_rating DESC;

*/

-- ============================================================================
-- END OF SEED DATA MIGRATION 005
-- ============================================================================
