-- ============================================================================
-- BurgeRank Database Row Level Security Policies - Migration 004
-- ============================================================================
-- RLS policies for fine-grained access control across all tables
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTION: is_admin
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_admin FROM profiles WHERE id = user_id LIMIT 1
  ) = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER FUNCTION: is_moderator
-- ============================================================================
CREATE OR REPLACE FUNCTION is_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_moderator OR is_admin FROM profiles WHERE id = user_id LIMIT 1
  ) IS TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ENABLE RLS FOR ALL TABLES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE burger_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: profiles TABLE
-- ============================================================================

-- Everyone can read profiles
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- System can insert profiles during auth signup
CREATE POLICY "profiles_insert_system"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- POLICIES: restaurants TABLE
-- ============================================================================

-- Everyone can read restaurants
CREATE POLICY "restaurants_select_public"
  ON restaurants FOR SELECT
  USING (TRUE);

-- Authenticated users can insert restaurants (pending verification)
CREATE POLICY "restaurants_insert_authenticated"
  ON restaurants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only admin/moderator can update restaurants
CREATE POLICY "restaurants_update_admin"
  ON restaurants FOR UPDATE
  USING (is_admin(auth.uid()) OR is_moderator(auth.uid()))
  WITH CHECK (is_admin(auth.uid()) OR is_moderator(auth.uid()));

-- Only admin can delete restaurants
CREATE POLICY "restaurants_delete_admin"
  ON restaurants FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: burgers TABLE
-- ============================================================================

-- Everyone can read verified burgers, creators can see their own
CREATE POLICY "burgers_select_public"
  ON burgers FOR SELECT
  USING (
    verified = TRUE 
    OR auth.uid() = created_by 
    OR is_moderator(auth.uid())
  );

-- Authenticated users can insert burgers (pending verification)
CREATE POLICY "burgers_insert_authenticated"
  ON burgers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own burgers, admin can update any
CREATE POLICY "burgers_update_own_or_admin"
  ON burgers FOR UPDATE
  USING (
    auth.uid() = created_by 
    OR is_admin(auth.uid()) 
    OR is_moderator(auth.uid())
  )
  WITH CHECK (
    auth.uid() = created_by 
    OR is_admin(auth.uid()) 
    OR is_moderator(auth.uid())
  );

-- Only admin can delete burgers
CREATE POLICY "burgers_delete_admin"
  ON burgers FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: reviews TABLE
-- ============================================================================

-- Everyone can read reviews
CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT
  USING (TRUE);

-- Authenticated users can insert reviews
CREATE POLICY "reviews_insert_authenticated"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = user_id
  );

-- Users can update their own reviews
CREATE POLICY "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id OR is_moderator(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR is_moderator(auth.uid()));

-- Users can delete their own reviews
CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id OR is_moderator(auth.uid()));

-- ============================================================================
-- POLICIES: review_tags TABLE
-- ============================================================================

-- Everyone can read review tags
CREATE POLICY "review_tags_select_public"
  ON review_tags FOR SELECT
  USING (TRUE);

-- Only review author or moderator can insert/update/delete tags
CREATE POLICY "review_tags_manage_own"
  ON review_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_tags.review_id 
      AND (reviews.user_id = auth.uid() OR is_moderator(auth.uid()))
    )
  );

CREATE POLICY "review_tags_update_own"
  ON review_tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_tags.review_id 
      AND (reviews.user_id = auth.uid() OR is_moderator(auth.uid()))
    )
  );

CREATE POLICY "review_tags_delete_own"
  ON review_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_tags.review_id 
      AND (reviews.user_id = auth.uid() OR is_moderator(auth.uid()))
    )
  );

-- ============================================================================
-- POLICIES: review_images TABLE
-- ============================================================================

-- Everyone can read review images
CREATE POLICY "review_images_select_public"
  ON review_images FOR SELECT
  USING (TRUE);

-- Only review author or moderator can insert/update/delete images
CREATE POLICY "review_images_manage_own"
  ON review_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_images.review_id 
      AND (reviews.user_id = auth.uid() OR is_moderator(auth.uid()))
    )
  );

CREATE POLICY "review_images_delete_own"
  ON review_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM reviews 
      WHERE reviews.id = review_images.review_id 
      AND (reviews.user_id = auth.uid() OR is_moderator(auth.uid()))
    )
  );

-- ============================================================================
-- POLICIES: user_badges TABLE
-- ============================================================================

-- Everyone can read badges
CREATE POLICY "user_badges_select_public"
  ON user_badges FOR SELECT
  USING (TRUE);

-- Only system/admin can insert/update badges
CREATE POLICY "user_badges_manage_system"
  ON user_badges FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "user_badges_update_system"
  ON user_badges FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: rewards TABLE
-- ============================================================================

-- Everyone can read active rewards
CREATE POLICY "rewards_select_active"
  ON rewards FOR SELECT
  USING (is_active = TRUE OR is_admin(auth.uid()));

-- Only admin can manage rewards
CREATE POLICY "rewards_manage_admin"
  ON rewards FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "rewards_update_admin"
  ON rewards FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "rewards_delete_admin"
  ON rewards FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: user_rewards TABLE
-- ============================================================================

-- Users can only read their own rewards
CREATE POLICY "user_rewards_select_own"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Authenticated users can insert rewards for themselves
CREATE POLICY "user_rewards_insert_own"
  ON user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rewards (mark as redeemed)
CREATE POLICY "user_rewards_update_own"
  ON user_rewards FOR UPDATE
  USING (auth.uid() = user_id OR is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR is_admin(auth.uid()));

-- Users can only delete their own rewards
CREATE POLICY "user_rewards_delete_own"
  ON user_rewards FOR DELETE
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: burger_matches TABLE
-- ============================================================================

-- Everyone can read burger matches
CREATE POLICY "burger_matches_select_public"
  ON burger_matches FOR SELECT
  USING (TRUE);

-- Authenticated users can insert matches
CREATE POLICY "burger_matches_insert_authenticated"
  ON burger_matches FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = user_id
  );

-- Users can only see/update their own matches or if they're admin
CREATE POLICY "burger_matches_update_own"
  ON burger_matches FOR UPDATE
  USING (auth.uid() = user_id OR is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: follows TABLE
-- ============================================================================

-- Everyone can read follows
CREATE POLICY "follows_select_public"
  ON follows FOR SELECT
  USING (TRUE);

-- Authenticated users can insert follows (for themselves)
CREATE POLICY "follows_insert_own"
  ON follows FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = follower_id
  );

-- Users can only delete their own follows
CREATE POLICY "follows_delete_own"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id OR is_admin(auth.uid()));

-- ============================================================================
-- POLICIES: user_preferences TABLE
-- ============================================================================

-- Users can only read their own preferences
CREATE POLICY "user_preferences_select_own"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Users can only update their own preferences
CREATE POLICY "user_preferences_update_own"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only insert their own preferences
CREATE POLICY "user_preferences_insert_own"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- END OF RLS POLICIES MIGRATION 004
-- ============================================================================
