-- ============================================================================
-- BurgeRank Materialized Views - Migration 006
-- ============================================================================
-- Optimized views for common queries and rankings
-- ============================================================================

-- ============================================================================
-- VIEW: top_burgers_view
-- ============================================================================
-- Master ranking view of all burgers with aggregated stats
CREATE MATERIALIZED VIEW top_burgers_view AS
SELECT 
  b.id,
  b.name,
  b.slug,
  b.description,
  b.price,
  b.type,
  b.average_rating,
  b.total_reviews,
  b.match_score,
  b.ranking_position,
  b.is_new,
  b.verified,
  r.name as restaurant_name,
  r.slug as restaurant_slug,
  r.city,
  r.average_rating as restaurant_rating,
  COUNT(DISTINCT rev.id) as review_count,
  COUNT(DISTINCT CASE WHEN rev.is_verified THEN rev.id END) as verified_review_count,
  ROUND(
    (b.average_rating * 0.85 + (b.match_score::NUMERIC) * 5 * 0.15)::NUMERIC, 
    2
  )::DECIMAL as composite_score,
  b.created_at,
  b.updated_at
FROM burgers b
LEFT JOIN restaurants r ON b.restaurant_id = r.id
LEFT JOIN reviews rev ON b.id = rev.burger_id
WHERE b.verified = TRUE
GROUP BY 
  b.id, b.name, b.slug, b.description, b.price, b.type,
  b.average_rating, b.total_reviews, b.match_score, b.ranking_position,
  b.is_new, b.verified, r.id, r.name, r.slug, r.city, r.average_rating,
  b.created_at, b.updated_at
ORDER BY b.ranking_position ASC NULLS LAST, b.average_rating DESC;

CREATE INDEX idx_top_burgers_view_ranking ON top_burgers_view(ranking_position NULLS LAST);
CREATE INDEX idx_top_burgers_view_rating ON top_burgers_view(average_rating DESC);
CREATE INDEX idx_top_burgers_view_city ON top_burgers_view(city);
CREATE INDEX idx_top_burgers_view_type ON top_burgers_view(type);

-- ============================================================================
-- VIEW: new_burgers_view
-- ============================================================================
-- New/trending burgers from the last 4-6 weeks
CREATE MATERIALIZED VIEW new_burgers_view AS
SELECT 
  b.id,
  b.name,
  b.slug,
  b.description,
  b.price,
  b.type,
  b.average_rating,
  b.total_reviews,
  b.is_new,
  b.created_at,
  r.name as restaurant_name,
  r.slug as restaurant_slug,
  r.city,
  r.average_rating as restaurant_rating,
  EXTRACT(DAY FROM (CURRENT_TIMESTAMP - b.created_at))::INTEGER as days_since_created,
  ROUND(
    (EXTRACT(DAY FROM (CURRENT_TIMESTAMP - b.created_at)) / 30.0)::NUMERIC * 100,
    1
  )::DECIMAL as age_percentage
FROM burgers b
LEFT JOIN restaurants r ON b.restaurant_id = r.id
WHERE 
  b.verified = TRUE 
  AND b.is_new = TRUE
  AND (CURRENT_TIMESTAMP - b.created_at) <= INTERVAL '30 days'
ORDER BY b.created_at DESC;

CREATE INDEX idx_new_burgers_view_created_at ON new_burgers_view(created_at DESC);
CREATE INDEX idx_new_burgers_view_city ON new_burgers_view(city);
CREATE INDEX idx_new_burgers_view_type ON new_burgers_view(type);

-- ============================================================================
-- VIEW: user_stats_view
-- ============================================================================
-- Aggregated user statistics and achievements
CREATE MATERIALIZED VIEW user_stats_view AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.city,
  p.level,
  p.total_points,
  p.available_points,
  p.total_reviews,
  COUNT(DISTINCT CASE WHEN rev.is_verified THEN rev.id END) as verified_reviews,
  COUNT(DISTINCT f.follower_id) as followers_count,
  COUNT(DISTINCT f2.following_id) as following_count,
  COUNT(DISTINCT bm.id) as total_matches,
  COUNT(DISTINCT CASE WHEN bm.winner_id = bm.burger_a_id OR bm.winner_id = bm.burger_b_id THEN bm.id END) as matches_won,
  COUNT(DISTINCT ub.id) as badges_unlocked,
  COUNT(DISTINCT CASE WHEN ub.unlocked = TRUE THEN ub.id END) as total_badges_earned,
  ROUND(
    (COUNT(DISTINCT CASE WHEN rev.is_verified THEN rev.id END)::NUMERIC / 
     NULLIF(COUNT(DISTINCT rev.id), 0) * 100)::NUMERIC,
    1
  ) as verification_percentage,
  p.created_at,
  p.updated_at
FROM profiles p
LEFT JOIN reviews rev ON p.id = rev.user_id
LEFT JOIN follows f ON p.id = f.following_id
LEFT JOIN follows f2 ON p.id = f2.follower_id
LEFT JOIN burger_matches bm ON p.id = bm.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.username, p.avatar_url, p.city, p.level, 
         p.total_points, p.available_points, p.total_reviews, p.created_at, p.updated_at
ORDER BY p.total_points DESC;

CREATE INDEX idx_user_stats_view_level ON user_stats_view(level);
CREATE INDEX idx_user_stats_view_total_points ON user_stats_view(total_points DESC);
CREATE INDEX idx_user_stats_view_city ON user_stats_view(city);
CREATE INDEX idx_user_stats_view_followers ON user_stats_view(followers_count DESC);

-- ============================================================================
-- VIEW: restaurant_rankings_view
-- ============================================================================
-- Restaurant ranking based on burger quality
CREATE MATERIALIZED VIEW restaurant_rankings_view AS
SELECT 
  r.id,
  r.name,
  r.slug,
  r.address,
  r.city,
  r.latitude,
  r.longitude,
  r.average_rating,
  r.total_burgers,
  r.verified,
  COUNT(DISTINCT b.id) as verified_burgers,
  COUNT(DISTINCT rev.id) as total_reviews,
  COUNT(DISTINCT CASE WHEN rev.is_verified THEN rev.id END) as verified_reviews,
  ROUND(
    (COUNT(DISTINCT b.id)::DECIMAL / NULLIF(EXTRACT(DAY FROM (CURRENT_TIMESTAMP - r.created_at)), 0) * 7)::NUMERIC,
    2
  )::DECIMAL as burgers_per_week,
  ROW_NUMBER() OVER (ORDER BY r.average_rating DESC, COUNT(DISTINCT rev.id) DESC) as rank,
  r.created_at,
  r.updated_at
FROM restaurants r
LEFT JOIN burgers b ON r.id = b.restaurant_id AND b.verified = TRUE
LEFT JOIN reviews rev ON b.id = rev.burger_id
GROUP BY r.id, r.name, r.slug, r.address, r.city, r.latitude, r.longitude,
         r.average_rating, r.total_burgers, r.verified, r.created_at, r.updated_at
ORDER BY r.average_rating DESC, COUNT(DISTINCT rev.id) DESC;

CREATE INDEX idx_restaurant_rankings_view_city ON restaurant_rankings_view(city);
CREATE INDEX idx_restaurant_rankings_view_rating ON restaurant_rankings_view(average_rating DESC);
CREATE INDEX idx_restaurant_rankings_view_rank ON restaurant_rankings_view(rank);

-- ============================================================================
-- VIEW: trending_burgers_view
-- ============================================================================
-- Burgers trending based on recent activity and match wins
CREATE MATERIALIZED VIEW trending_burgers_view AS
SELECT 
  b.id,
  b.name,
  b.slug,
  b.average_rating,
  b.total_reviews,
  b.match_score,
  b.type,
  b.price,
  r.name as restaurant_name,
  r.city,
  COUNT(DISTINCT rev.id) as recent_reviews_7days,
  COUNT(DISTINCT CASE WHEN bm.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN bm.id END) as recent_matches_7days,
  COUNT(DISTINCT CASE WHEN bm.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') AND bm.winner_id = b.id THEN bm.id END) as recent_wins_7days,
  ROUND(
    (
      (COUNT(DISTINCT CASE WHEN rev.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN rev.id END)::DECIMAL * 0.4) +
      (COUNT(DISTINCT CASE WHEN bm.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') AND bm.winner_id = b.id THEN bm.id END)::DECIMAL * 0.3) +
      (b.average_rating::DECIMAL * 0.3)
    )::NUMERIC,
    2
  )::DECIMAL as trend_score,
  ROW_NUMBER() OVER (ORDER BY 
    (COUNT(DISTINCT CASE WHEN rev.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN rev.id END)::DECIMAL * 0.4) +
    (COUNT(DISTINCT CASE WHEN bm.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') AND bm.winner_id = b.id THEN bm.id END)::DECIMAL * 0.3) +
    (b.average_rating::DECIMAL * 0.3)
    DESC
  ) as trend_rank
FROM burgers b
LEFT JOIN restaurants r ON b.restaurant_id = r.id
LEFT JOIN reviews rev ON b.id = rev.burger_id
LEFT JOIN burger_matches bm ON b.id = bm.burger_a_id OR b.id = bm.burger_b_id
WHERE b.verified = TRUE
GROUP BY b.id, b.name, b.slug, b.average_rating, b.total_reviews, b.match_score, 
         b.type, b.price, r.id, r.name, r.city
ORDER BY trend_score DESC;

CREATE INDEX idx_trending_burgers_view_trend_rank ON trending_burgers_view(trend_rank);
CREATE INDEX idx_trending_burgers_view_city ON trending_burgers_view(city);

-- ============================================================================
-- VIEW: burger_reviews_detailed_view
-- ============================================================================
-- Detailed view of burger reviews with reviewer info
CREATE MATERIALIZED VIEW burger_reviews_detailed_view AS
SELECT 
  rev.id,
  rev.burger_id,
  b.name as burger_name,
  b.slug as burger_slug,
  rev.user_id,
  p.username,
  p.level,
  p.avatar_url,
  rev.overall_rating,
  rev.bread_rating,
  rev.meat_rating,
  rev.toppings_rating,
  rev.sauces_rating,
  rev.originality_rating,
  rev.sides_rating,
  rev.value_rating,
  rev.comment,
  rev.visit_date,
  rev.is_verified,
  rev.likes_count,
  COUNT(DISTINCT img.id) as image_count,
  COUNT(DISTINCT tags.id) as tag_count,
  r.name as restaurant_name,
  r.city,
  rev.created_at,
  rev.updated_at
FROM reviews rev
LEFT JOIN burgers b ON rev.burger_id = b.id
LEFT JOIN profiles p ON rev.user_id = p.id
LEFT JOIN review_images img ON rev.id = img.review_id
LEFT JOIN review_tags tags ON rev.id = tags.review_id
LEFT JOIN restaurants r ON b.restaurant_id = r.id
GROUP BY 
  rev.id, rev.burger_id, b.name, b.slug, rev.user_id, p.username, p.level, p.avatar_url,
  rev.overall_rating, rev.bread_rating, rev.meat_rating, rev.toppings_rating,
  rev.sauces_rating, rev.originality_rating, rev.sides_rating, rev.value_rating,
  rev.comment, rev.visit_date, rev.is_verified, rev.likes_count, r.name, r.city,
  rev.created_at, rev.updated_at
ORDER BY rev.created_at DESC;

CREATE INDEX idx_burger_reviews_detailed_view_burger_id ON burger_reviews_detailed_view(burger_id);
CREATE INDEX idx_burger_reviews_detailed_view_user_id ON burger_reviews_detailed_view(user_id);
CREATE INDEX idx_burger_reviews_detailed_view_created_at ON burger_reviews_detailed_view(created_at DESC);

-- ============================================================================
-- VIEW: user_rewards_status_view
-- ============================================================================
-- User's reward status and availability
CREATE MATERIALIZED VIEW user_rewards_status_view AS
SELECT 
  ur.id,
  ur.user_id,
  p.username,
  ur.reward_id,
  rw.name as reward_name,
  rw.reward_type,
  rw.points_cost,
  rw.discount_percentage,
  ur.qr_code,
  ur.redeemed,
  ur.redeemed_at,
  ur.expires_at,
  CASE 
    WHEN ur.redeemed THEN 'redeemed'
    WHEN ur.expires_at < CURRENT_TIMESTAMP THEN 'expired'
    ELSE 'active'
  END as status,
  ur.created_at
FROM user_rewards ur
LEFT JOIN profiles p ON ur.user_id = p.id
LEFT JOIN rewards rw ON ur.reward_id = rw.id
ORDER BY ur.created_at DESC;

CREATE INDEX idx_user_rewards_status_view_user_id ON user_rewards_status_view(user_id);
CREATE INDEX idx_user_rewards_status_view_status ON user_rewards_status_view(status);

-- ============================================================================
-- FUNCTION: refresh_all_materialized_views
-- ============================================================================
-- Refreshes all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY top_burgers_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY new_burgers_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY restaurant_rankings_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_burgers_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY burger_reviews_detailed_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_rewards_status_view;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: refresh_top_burgers_view
-- ============================================================================
-- Refreshes only the top burgers view
CREATE OR REPLACE FUNCTION refresh_top_burgers_view()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY top_burgers_view;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GRANT PERMISSIONS FOR MATERIALIZED VIEWS
-- ============================================================================

-- Allow authenticated users to read views
GRANT SELECT ON top_burgers_view TO authenticated;
GRANT SELECT ON new_burgers_view TO authenticated;
GRANT SELECT ON user_stats_view TO authenticated;
GRANT SELECT ON restaurant_rankings_view TO authenticated;
GRANT SELECT ON trending_burgers_view TO authenticated;
GRANT SELECT ON burger_reviews_detailed_view TO authenticated;
GRANT SELECT ON user_rewards_status_view TO authenticated;

-- Allow anonymous users to read public views
GRANT SELECT ON top_burgers_view TO anon;
GRANT SELECT ON new_burgers_view TO anon;
GRANT SELECT ON restaurant_rankings_view TO anon;
GRANT SELECT ON trending_burgers_view TO anon;
GRANT SELECT ON burger_reviews_detailed_view TO anon;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
/*

-- Verify views were created
SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = 'public';

-- Query top burgers
SELECT id, name, restaurant_name, average_rating, ranking_position FROM top_burgers_view LIMIT 10;

-- Query new burgers
SELECT id, name, restaurant_name, days_since_created FROM new_burgers_view LIMIT 10;

-- Query user stats
SELECT username, level, total_points, total_reviews, followers_count, badges_unlocked 
FROM user_stats_view 
ORDER BY total_points DESC 
LIMIT 10;

-- Query trending burgers
SELECT name, restaurant_name, trend_score, trend_rank FROM trending_burgers_view LIMIT 10;

*/

-- ============================================================================
-- END OF MATERIALIZED VIEWS MIGRATION 006
-- ============================================================================
