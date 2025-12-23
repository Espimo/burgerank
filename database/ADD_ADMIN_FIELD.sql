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
-- RLS POLICIES FOR ADMIN ACCESS (FIXED - NO RECURSION)
-- ============================================================================

-- IMPORTANT: Policies must avoid infinite recursion
-- Users must be able to read their own record without additional restrictions

-- Policy: Users can read their own profile (needed to check is_admin)
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create helper function to check if a user is admin
-- This avoids recursion because it uses SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can view all users (using helper function)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT 
  USING (public.is_user_admin(auth.uid()));

-- Policy: Admins can update any user
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE 
  USING (public.is_user_admin(auth.uid()));

-- Policy: Admins can manage all restaurants
DROP POLICY IF EXISTS "Admins can manage restaurants" ON public.restaurants;
CREATE POLICY "Admins can manage restaurants" ON public.restaurants
  FOR ALL
  USING (public.is_user_admin(auth.uid()));

-- Policy: Admins can manage all burgers
DROP POLICY IF EXISTS "Admins can manage burgers" ON public.burgers;
CREATE POLICY "Admins can manage burgers" ON public.burgers
  FOR ALL
  USING (public.is_user_admin(auth.uid()));

-- Policy: Admins can manage promotions
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.restaurant_promotions;
CREATE POLICY "Admins can manage promotions" ON public.restaurant_promotions
  FOR ALL
  USING (public.is_user_admin(auth.uid()));

-- Policy: Admins can manage all ratings
DROP POLICY IF EXISTS "Admins can manage ratings" ON public.ratings;
CREATE POLICY "Admins can manage ratings" ON public.ratings
  FOR ALL
  USING (public.is_user_admin(auth.uid()));

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
