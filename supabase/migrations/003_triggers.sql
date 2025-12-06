-- ============================================================================
-- BurgeRank Database Triggers - Migration 003
-- ============================================================================
-- Triggers for automating updates, maintaining data consistency, and 
-- enforcing business logic
-- ============================================================================

-- ============================================================================
-- TRIGGER: Update updated_at on profiles
-- ============================================================================
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on restaurants
-- ============================================================================
CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on burgers
-- ============================================================================
CREATE TRIGGER burgers_updated_at
  BEFORE UPDATE ON burgers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on reviews
-- ============================================================================
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on review_images
-- ============================================================================
CREATE TRIGGER review_images_updated_at
  BEFORE UPDATE ON review_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on restaurants
-- ============================================================================
CREATE TRIGGER rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Update updated_at on user_preferences
-- ============================================================================
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: update_burger_stats_on_review_insert
-- ============================================================================
-- When a review is inserted, update burger stats and user stats
CREATE OR REPLACE FUNCTION on_review_inserted()
RETURNS TRIGGER AS $$
BEGIN
  -- Update burger statistics
  PERFORM update_burger_stats(NEW.burger_id);
  
  -- Update restaurant statistics
  PERFORM update_restaurant_stats(
    (SELECT restaurant_id FROM burgers WHERE id = NEW.burger_id LIMIT 1)
  );
  
  -- Update user statistics and check badges
  PERFORM update_user_stats(NEW.user_id);
  PERFORM check_and_unlock_badges(NEW.user_id);
  
  -- Add points to user for writing a review (10 points)
  PERFORM add_user_points(NEW.user_id, 10);
  
  -- Bonus points for verified reviews with images
  IF NEW.is_verified THEN
    PERFORM add_user_points(NEW.user_id, 5);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION on_review_inserted();

-- ============================================================================
-- TRIGGER: update_burger_stats_on_review_update
-- ============================================================================
-- When a review is updated, update burger stats
CREATE OR REPLACE FUNCTION on_review_updated()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_burger_stats(NEW.burger_id);
  
  PERFORM update_restaurant_stats(
    (SELECT restaurant_id FROM burgers WHERE id = NEW.burger_id LIMIT 1)
  );
  
  -- If review just got verified, add bonus points
  IF NEW.is_verified AND NOT OLD.is_verified THEN
    PERFORM add_user_points(NEW.user_id, 5);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_updated
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION on_review_updated();

-- ============================================================================
-- TRIGGER: update_burger_stats_on_review_delete
-- ============================================================================
-- When a review is deleted, update burger stats
CREATE OR REPLACE FUNCTION on_review_deleted()
RETURNS TRIGGER AS $$
DECLARE
  v_burger_id UUID;
  v_restaurant_id UUID;
BEGIN
  v_burger_id := OLD.burger_id;
  
  SELECT restaurant_id INTO v_restaurant_id 
  FROM burgers WHERE id = v_burger_id LIMIT 1;
  
  PERFORM update_burger_stats(v_burger_id);
  PERFORM update_restaurant_stats(v_restaurant_id);
  
  -- Remove points from user
  UPDATE profiles
  SET available_points = GREATEST(0, available_points - 10)
  WHERE id = OLD.user_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_deleted
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION on_review_deleted();

-- ============================================================================
-- TRIGGER: update_user_level_on_profile_update
-- ============================================================================
-- When profile points change, update user level
CREATE OR REPLACE FUNCTION on_profile_points_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_points != OLD.total_points THEN
    PERFORM update_user_level(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_points_changed
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.total_points IS DISTINCT FROM OLD.total_points)
  EXECUTE FUNCTION on_profile_points_changed();

-- ============================================================================
-- TRIGGER: update_match_score_on_match_insert
-- ============================================================================
-- When a burger match is recorded, update match scores for both burgers
CREATE OR REPLACE FUNCTION on_burger_match_inserted()
RETURNS TRIGGER AS $$
BEGIN
  -- Update match score for both burgers
  UPDATE burgers
  SET match_score = calculate_match_score(id)
  WHERE id IN (NEW.burger_a_id, NEW.burger_b_id);
  
  -- Add points to user for participating in a match
  PERFORM add_user_points(NEW.user_id, 1);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_burger_match_inserted
  AFTER INSERT ON burger_matches
  FOR EACH ROW
  EXECUTE FUNCTION on_burger_match_inserted();

-- ============================================================================
-- TRIGGER: mark_burgers_not_new_periodic
-- ============================================================================
-- Periodically mark burgers as not new (30 days old)
-- Note: This should be called via a scheduled job or cron
CREATE OR REPLACE FUNCTION periodic_mark_burgers_not_new()
RETURNS VOID AS $$
BEGIN
  PERFORM mark_burger_not_new();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: ensure_user_preferences_on_profile_creation
-- ============================================================================
-- When a profile is created, ensure user preferences record exists
CREATE OR REPLACE FUNCTION ensure_user_preferences_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_user_preferences_on_profile_creation
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_preferences_exists();

-- ============================================================================
-- TRIGGER: initialize_user_badges_on_profile_creation
-- ============================================================================
-- When a profile is created, initialize all badges
CREATE OR REPLACE FUNCTION initialize_user_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert all badge templates for new user
  INSERT INTO user_badges (user_id, badge_type, badge_name, target)
  VALUES
    (NEW.id, 'explorer'::badge_type, 'Explorer', 50),
    (NEW.id, 'critic'::badge_type, 'Critic', 100),
    (NEW.id, 'specialist'::badge_type, 'Specialist', 5),
    (NEW.id, 'social'::badge_type, 'Social Butterfly', 100),
    (NEW.id, 'dedication'::badge_type, 'Dedication', 2001),
    (NEW.id, 'match_master'::badge_type, 'Match Master', 500);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initialize_user_badges_on_profile_creation
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_badges();

-- ============================================================================
-- TRIGGER: handle_review_image_insert
-- ============================================================================
-- When a review image is added, mark review as verified if it has receipt/photo
CREATE OR REPLACE FUNCTION on_review_image_inserted()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-verify review if it has an image
  UPDATE reviews
  SET is_verified = TRUE
  WHERE id = NEW.review_id AND is_verified = FALSE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_image_inserted
  AFTER INSERT ON review_images
  FOR EACH ROW
  EXECUTE FUNCTION on_review_image_inserted();

-- ============================================================================
-- TRIGGER: handle_user_reward_redemption
-- ============================================================================
-- When a reward is redeemed, update redemption count
CREATE OR REPLACE FUNCTION on_user_reward_redeemed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.redeemed AND NOT OLD.redeemed THEN
    UPDATE rewards
    SET redemptions_count = redemptions_count + 1
    WHERE id = NEW.reward_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_reward_redeemed
  AFTER UPDATE ON user_rewards
  FOR EACH ROW
  WHEN (NEW.redeemed AND NOT OLD.redeemed)
  EXECUTE FUNCTION on_user_reward_redeemed();

-- ============================================================================
-- TRIGGER: clean_expired_rewards
-- ============================================================================
-- Periodically clean up expired rewards
CREATE OR REPLACE FUNCTION clean_expired_rewards()
RETURNS VOID AS $$
BEGIN
  DELETE FROM user_rewards
  WHERE expires_at < CURRENT_TIMESTAMP AND redeemed = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: update_follow_counts
-- ============================================================================
-- When follows are added/removed, update follower counts (stored as views instead)
CREATE OR REPLACE FUNCTION on_follow_created()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_follow_created
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION on_follow_created();

-- ============================================================================
-- END OF TRIGGERS MIGRATION 003
-- ============================================================================
