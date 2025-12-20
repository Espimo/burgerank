-- ============================================================================
-- ADD ADMIN FIELD TO USERS TABLE
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Add is_admin column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- ============================================================================
-- RLS POLICIES FOR ADMIN ACCESS
-- ============================================================================

-- Policy: Admins can read all users
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- Policy: Admins can update all users
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- Policy: Admins can manage all restaurants
DROP POLICY IF EXISTS "Admins can manage restaurants" ON public.restaurants;
CREATE POLICY "Admins can manage restaurants" ON public.restaurants
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- Policy: Admins can manage all burgers
DROP POLICY IF EXISTS "Admins can manage burgers" ON public.burgers;
CREATE POLICY "Admins can manage burgers" ON public.burgers
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- Policy: Admins can manage promotions
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.restaurant_promotions;
CREATE POLICY "Admins can manage promotions" ON public.restaurant_promotions
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- Policy: Admins can manage all ratings
DROP POLICY IF EXISTS "Admins can manage ratings" ON public.ratings;
CREATE POLICY "Admins can manage ratings" ON public.ratings
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE is_admin = true)
  );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.restaurants TO authenticated;
GRANT ALL ON public.burgers TO authenticated;
GRANT ALL ON public.ratings TO authenticated;

-- ============================================================================
-- VERIFY
-- ============================================================================
SELECT 'Admin field added successfully!' AS status;
