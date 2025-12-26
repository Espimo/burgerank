-- Migration: Add notifications and favorites tables
-- Run this script in your Supabase SQL editor

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'system', -- 'badge', 'rating', 'level', 'achievement', 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Extra data like badge_id, badge_emoji, points, level
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can insert notifications (via service role or trigger)
CREATE POLICY "Service role can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FAVORITES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  burger_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, burger_id)
);

CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_burger_id ON public.user_favorites(burger_id);

-- RLS for favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their favorites
CREATE POLICY "Users can add favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from their favorites
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER: Send notification when user earns a badge
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_badge_earned()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  SELECT 
    NEW.user_id,
    'badge',
    '¡Nueva insignia desbloqueada!',
    'Has conseguido la insignia ' || b.name,
    jsonb_build_object('badge_id', NEW.badge_id, 'badge_emoji', b.icon)
  FROM public.badges b
  WHERE b.id = NEW.badge_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_badge_earned ON public.user_badges;
CREATE TRIGGER on_badge_earned
  AFTER INSERT ON public.user_badges
  FOR EACH ROW
  EXECUTE FUNCTION notify_badge_earned();

-- ============================================================================
-- TRIGGER: Send notification when user levels up
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_level_up()
RETURNS TRIGGER AS $$
DECLARE
  old_category VARCHAR(50);
  new_category VARCHAR(50);
BEGIN
  -- Determine categories based on points
  old_category := CASE 
    WHEN OLD.points < 100 THEN 'Burger Fan'
    WHEN OLD.points < 500 THEN 'Burger Lover'
    ELSE 'Burger Obsessed'
  END;
  
  new_category := CASE 
    WHEN NEW.points < 100 THEN 'Burger Fan'
    WHEN NEW.points < 500 THEN 'Burger Lover'
    ELSE 'Burger Obsessed'
  END;
  
  -- Only notify if category changed (leveled up)
  IF old_category != new_category AND NEW.points > OLD.points THEN
    INSERT INTO public.notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.id,
      'level',
      '¡Has subido de nivel!',
      'Ahora eres ' || new_category || '. ¡Sigue así!',
      jsonb_build_object('level', new_category, 'points', NEW.points)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_level_up ON public.users;
CREATE TRIGGER on_level_up
  AFTER UPDATE OF points ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_level_up();

-- ============================================================================
-- FUNCTION: Create welcome notification for new users
-- ============================================================================
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (
    NEW.id,
    'system',
    '¡Bienvenido a BurgeRank!',
    '¡Hola ' || NEW.username || '! Tu aventura burger comienza ahora. Valora hamburguesas para ganar puntos e insignias.',
    jsonb_build_object('type', 'welcome')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_welcome_notification();
