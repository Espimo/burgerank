-- ============================================================================
-- Demo User for Testing
-- ============================================================================
-- This script creates a demo user for testing purposes
-- Email: demo@burgerank.com
-- Password: Demo123456! (set via Supabase Auth UI)

-- Note: In production, this should be created through the web UI
-- The user ID shown below is a placeholder and should be replaced

-- You can create this user manually via Supabase:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Email: demo@burgerank.com
-- 4. Password: Demo123456!
-- 5. The profile will be created automatically via trigger

-- OR use this SQL after getting the user ID from auth.users:
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users

INSERT INTO public.profiles (
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
  'USER_ID_HERE',
  'demo_user',
  'Madrid',
  'burger_fan'::user_level,
  250,
  250,
  5,
  FALSE,
  FALSE,
  'Demo user for testing BurgeRank',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
