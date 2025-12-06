-- ============================================================================
-- BurgeRank Database Functions - Migration 002
-- ============================================================================
-- PostgreSQL functions for business logic, calculations, and automations
-- ============================================================================

-- ============================================================================
-- FUNCTION: update_updated_at()
-- ============================================================================
-- Generic function to update the updated_at timestamp on any table
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: calculate_burger_ranking()
-- ============================================================================
-- Algorithm for calculating burger rankings considering:
-- - Weighted average of ratings
-- - Verified reviews (with photos/receipts) get higher weight
-- - High-level users get higher weight
-- - Minimum 5 reviews to appear in ranking
-- - Temporal boost for new burgers (first 30 days)
-- - Match score from mini-game
CREATE OR REPLACE FUNCTION calculate_burger_ranking(burger_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_burger RECORD;
  v_weighted_score DECIMAL := 0;
  v_verification_weight DECIMAL;
  v_reviewer_level_weight DECIMAL;
  v_review_count INTEGER;
  v_base_score DECIMAL;
  v_new_burger_boost DECIMAL := 1.0;
  v_match_weight DECIMAL;
  v_final_score DECIMAL;
BEGIN
  -- Get burger info
  SELECT * INTO v_burger FROM burgers WHERE id = burger_id_param;
  
  IF v_burger IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Get review count
  SELECT COUNT(*) INTO v_review_count FROM reviews 
  WHERE burger_id = burger_id_param;
  
  -- Not enough reviews to rank
  IF v_review_count < 5 THEN
    RETURN 0;
  END IF;
  
  -- Calculate weighted score considering reviewer level and verification
  WITH weighted_reviews AS (
    SELECT 
      r.overall_rating,
      CASE 
        WHEN r.is_verified THEN 1.5  -- Verified reviews worth 50% more
        ELSE 1.0
      END as verification_weight,
      CASE 
        WHEN p.level = 'burger_obsessed' THEN 1.3
        WHEN p.level = 'burger_lover' THEN 1.15
        ELSE 1.0
      END as level_weight,
      (r.overall_rating * 
        CASE WHEN r.is_verified THEN 1.5 ELSE 1.0 END *
        CASE 
          WHEN p.level = 'burger_obsessed' THEN 1.3
          WHEN p.level = 'burger_lover' THEN 1.15
          ELSE 1.0
        END
      ) as weighted_rating
    FROM reviews r
    JOIN profiles p ON r.user_id = p.id
    WHERE r.burger_id = burger_id_param
  )
  SELECT 
    COALESCE(SUM(weighted_rating) / 
             NULLIF(SUM(verification_weight * level_weight), 0), 0)
  INTO v_base_score
  FROM weighted_reviews;
  
  -- Apply new burger boost (first 30 days)
  IF (CURRENT_TIMESTAMP - v_burger.created_at) < INTERVAL '30 days' THEN
    v_new_burger_boost := 1.15;  -- 15% boost
  END IF;
  
  -- Factor in match score (mini-game popularity)
  SELECT COALESCE(AVG(
    CASE 
      WHEN winner_id = burger_id_param THEN 1.0
      WHEN winner_id != burger_id_param AND 
           (burger_a_id = burger_id_param OR burger_b_id = burger_id_param) THEN 0.0
      ELSE 0.5
    END
  ), 0.5)
  INTO v_match_weight
  FROM burger_matches
  WHERE burger_a_id = burger_id_param OR burger_b_id = burger_id_param;
  
  -- Calculate final score (normalize to 0-5 range)
  v_final_score := LEAST(
    5.0,
    (v_base_score * v_new_burger_boost * 0.85) + (v_match_weight * 0.15)
  );
  
  RETURN ROUND(v_final_score::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_burger_ranking_position()
-- ============================================================================
-- Updates the ranking position for all burgers based on calculated scores
CREATE OR REPLACE FUNCTION update_burger_ranking_position()
RETURNS VOID AS $$
BEGIN
  WITH ranked_burgers AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY average_rating DESC, total_reviews DESC, created_at ASC) as new_position
    FROM burgers
    WHERE average_rating >= 3.0 AND total_reviews >= 5 AND verified = TRUE
  )
  UPDATE burgers
  SET ranking_position = ranked_burgers.new_position
  FROM ranked_burgers
  WHERE burgers.id = ranked_burgers.id;
  
  -- Clear ranking for burgers that don't meet criteria
  UPDATE burgers
  SET ranking_position = NULL
  WHERE average_rating < 3.0 OR total_reviews < 5 OR verified = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_burger_stats()
-- ============================================================================
-- Updates burger average rating and total reviews from reviews table
CREATE OR REPLACE FUNCTION update_burger_stats(burger_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE burgers
  SET 
    average_rating = COALESCE(
      (SELECT AVG(overall_rating) FROM reviews 
       WHERE burger_id = burger_id_param AND is_verified = TRUE),
      (SELECT AVG(overall_rating) FROM reviews 
       WHERE burger_id = burger_id_param),
      0
    ),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE burger_id = burger_id_param),
    match_score = calculate_burger_ranking(burger_id_param),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = burger_id_param;
  
  -- Update ranking position if criteria met
  PERFORM update_burger_ranking_position();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_restaurant_stats()
-- ============================================================================
-- Updates restaurant average rating and total burgers
CREATE OR REPLACE FUNCTION update_restaurant_stats(restaurant_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE restaurants
  SET 
    average_rating = COALESCE(
      (SELECT AVG(b.average_rating) 
       FROM burgers b 
       WHERE b.restaurant_id = restaurant_id_param AND b.average_rating > 0),
      0
    ),
    total_burgers = (SELECT COUNT(*) FROM burgers WHERE restaurant_id = restaurant_id_param),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = restaurant_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_user_stats()
-- ============================================================================
-- Updates user total reviews count
CREATE OR REPLACE FUNCTION update_user_stats(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE user_id = user_id_param),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_user_level()
-- ============================================================================
-- Updates user level based on total points
-- burger_fan: 0-500 points
-- burger_lover: 501-2000 points
-- burger_obsessed: 2001+ points
CREATE OR REPLACE FUNCTION update_user_level(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  v_total_points INTEGER;
  v_new_level user_level;
BEGIN
  SELECT total_points INTO v_total_points FROM profiles WHERE id = user_id_param;
  
  v_new_level := CASE
    WHEN v_total_points >= 2001 THEN 'burger_obsessed'::user_level
    WHEN v_total_points >= 501 THEN 'burger_lover'::user_level
    ELSE 'burger_fan'::user_level
  END;
  
  UPDATE profiles
  SET level = v_new_level, updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: add_user_points()
-- ============================================================================
-- Safely add points to a user's account and update their level
CREATE OR REPLACE FUNCTION add_user_points(user_id_param UUID, points_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  IF points_amount < 0 THEN
    RAISE EXCEPTION 'Points amount must be non-negative';
  END IF;
  
  UPDATE profiles
  SET 
    total_points = total_points + points_amount,
    available_points = available_points + points_amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
  
  PERFORM update_user_level(user_id_param);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: redeem_user_points()
-- ============================================================================
-- Safely redeem points from a user's account
CREATE OR REPLACE FUNCTION redeem_user_points(user_id_param UUID, points_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_available_points INTEGER;
BEGIN
  SELECT available_points INTO v_available_points 
  FROM profiles WHERE id = user_id_param;
  
  IF v_available_points < points_amount THEN
    RETURN FALSE;
  END IF;
  
  UPDATE profiles
  SET 
    available_points = available_points - points_amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: check_and_unlock_badges()
-- ============================================================================
-- Checks and unlocks badges based on user progress
CREATE OR REPLACE FUNCTION check_and_unlock_badges(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  v_user RECORD;
  v_explorer_count INTEGER;
  v_critic_count INTEGER;
  v_specialist_count INTEGER;
  v_match_count INTEGER;
BEGIN
  -- Get user info
  SELECT * INTO v_user FROM profiles WHERE id = user_id_param;
  
  -- Explorer badge: 50 reviews
  SELECT COUNT(*) INTO v_explorer_count FROM reviews WHERE user_id = user_id_param;
  UPDATE user_badges
  SET progress = v_explorer_count, unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param 
    AND badge_name = 'Explorer' 
    AND v_explorer_count >= 50
    AND NOT unlocked;
  
  -- Critic badge: 100 verified reviews
  SELECT COUNT(*) INTO v_critic_count FROM reviews 
  WHERE user_id = user_id_param AND is_verified = TRUE;
  UPDATE user_badges
  SET progress = v_critic_count, unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param 
    AND badge_name = 'Critic' 
    AND v_critic_count >= 100
    AND NOT unlocked;
  
  -- Specialist badge: Reviews in 5+ different cities
  SELECT COUNT(DISTINCT r.city) INTO v_specialist_count 
  FROM reviews rev
  JOIN burgers b ON rev.burger_id = b.id
  JOIN restaurants r ON b.restaurant_id = r.id
  WHERE rev.user_id = user_id_param;
  UPDATE user_badges
  SET progress = v_specialist_count, unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param 
    AND badge_name = 'Specialist' 
    AND v_specialist_count >= 5
    AND NOT unlocked;
  
  -- Match Master badge: 500 matches won
  SELECT COUNT(*) INTO v_match_count FROM burger_matches 
  WHERE user_id = user_id_param AND winner_id IS NOT NULL;
  UPDATE user_badges
  SET progress = v_match_count, unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param 
    AND badge_name = 'Match Master' 
    AND v_match_count >= 500
    AND NOT unlocked;
  
  -- Dedication badge: Level to burger_obsessed
  UPDATE user_badges
  SET progress = v_user.total_points, unlocked = TRUE, unlocked_at = CURRENT_TIMESTAMP
  WHERE user_id = user_id_param 
    AND badge_name = 'Dedication' 
    AND v_user.level = 'burger_obsessed'::user_level
    AND NOT unlocked;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: generate_qr_code()
-- ============================================================================
-- Generates a unique QR code for a reward
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS TEXT AS $$
DECLARE
  v_qr_code TEXT;
BEGIN
  -- Generate a unique QR code using MD5 hash
  LOOP
    v_qr_code := 'QR_' || 
                 TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') ||
                 '_' || 
                 SUBSTRING(MD5(uuid_generate_v4()::TEXT), 1, 8);
    
    -- Check if it's unique
    IF NOT EXISTS (SELECT 1 FROM user_rewards WHERE qr_code = v_qr_code) THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_qr_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: mark_burger_not_new()
-- ============================================================================
-- Marks burgers as not new if they are older than 30 days
CREATE OR REPLACE FUNCTION mark_burger_not_new()
RETURNS VOID AS $$
BEGIN
  UPDATE burgers
  SET is_new = FALSE, updated_at = CURRENT_TIMESTAMP
  WHERE is_new = TRUE 
    AND (CURRENT_TIMESTAMP - created_at) >= INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: calculate_match_score()
-- ============================================================================
-- Calculate match score for a burger based on mini-game results
CREATE OR REPLACE FUNCTION calculate_match_score(burger_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total_matches INTEGER;
  v_wins INTEGER;
  v_match_score DECIMAL;
BEGIN
  SELECT COUNT(*) INTO v_total_matches
  FROM burger_matches
  WHERE burger_a_id = burger_id_param OR burger_b_id = burger_id_param;
  
  IF v_total_matches = 0 THEN
    RETURN 0.5;  -- Default neutral score
  END IF;
  
  SELECT COUNT(*) INTO v_wins
  FROM burger_matches
  WHERE winner_id = burger_id_param;
  
  v_match_score := ROUND((v_wins::DECIMAL / v_total_matches::DECIMAL)::NUMERIC, 4);
  
  RETURN v_match_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF FUNCTIONS MIGRATION 002
-- ============================================================================
