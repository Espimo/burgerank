-- ============================================================================
-- Auto-create profile when user signs up
-- ============================================================================

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
BEGIN
  -- Try to get username from user metadata, otherwise use email prefix
  username_value := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert new profile
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
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    username_value,
    COALESCE(NEW.raw_user_meta_data->>'city', 'Unknown'),
    'burger_fan'::user_level,
    0,
    0,
    0,
    FALSE,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that runs when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
