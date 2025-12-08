-- ============================================================================
-- 🔴 CLEANUP AND RESET - Use only if you need to start fresh
-- ============================================================================
-- WARNING: This DELETES all tables, triggers, and types
-- Only use if setup failed or you want to start over
-- ============================================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_review_inserted ON reviews;
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS restaurants_updated_at ON restaurants;
DROP TRIGGER IF EXISTS burgers_updated_at ON burgers;
DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_burger_stats();
DROP FUNCTION IF EXISTS update_updated_at();
DROP FUNCTION IF EXISTS add_user_points(UUID, INTEGER);
DROP FUNCTION IF EXISTS update_user_level(UUID);

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS burger_matches;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS user_rewards;
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS review_tags;
DROP TABLE IF EXISTS review_images;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS burgers;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS profiles;

-- Drop types
DROP TYPE IF EXISTS tag_category;
DROP TYPE IF EXISTS price_range;
DROP TYPE IF EXISTS badge_type;
DROP TYPE IF EXISTS reward_type;
DROP TYPE IF EXISTS burger_type;
DROP TYPE IF EXISTS user_level;

-- ============================================================================
-- DONE - Database is now clean
-- Run SUPABASE_SETUP_COMPLETE.sql next
-- ============================================================================
