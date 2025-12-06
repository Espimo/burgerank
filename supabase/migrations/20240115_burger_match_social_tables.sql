-- Burger Matches Table (para Burger Match minigame)
CREATE TABLE IF NOT EXISTS public.burger_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  burger_a_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  burger_b_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  elo_before_a FLOAT NOT NULL,
  elo_after_a FLOAT NOT NULL,
  elo_before_b FLOAT NOT NULL,
  elo_after_b FLOAT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Indexes para performance
  CONSTRAINT burger_match_different_burgers CHECK (burger_a_id != burger_b_id)
);

CREATE INDEX idx_burger_matches_user_id ON public.burger_matches(user_id);
CREATE INDEX idx_burger_matches_created_at ON public.burger_matches(created_at DESC);
CREATE INDEX idx_burger_matches_user_created ON public.burger_matches(user_id, created_at DESC);

-- Follows Table (para sistema social)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Constrains
  CONSTRAINT different_users CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_follows_created_at ON public.follows(created_at DESC);

-- User Activity Table (para activity feed)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  -- Tipos: 'review_created', 'badge_unlocked', 'level_up', 'top_five_updated', 'follow_user'
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Check constraint para tipos válidos
  CONSTRAINT valid_activity_type CHECK (
    activity_type IN (
      'review_created',
      'badge_unlocked',
      'level_up',
      'top_five_updated',
      'follow_user'
    )
  )
);

CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);

-- Alteraciones de tablas existentes

-- Agregar columnas a profiles si no existen
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Agregar columnas a burgers para ELO rating
ALTER TABLE public.burgers
ADD COLUMN IF NOT EXISTS match_score FLOAT DEFAULT 1200,
ADD COLUMN IF NOT EXISTS match_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS match_wins INTEGER DEFAULT 0;

CREATE INDEX idx_burgers_match_score ON public.burgers(match_score DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.burger_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies para burger_matches
CREATE POLICY burger_matches_select_all
  ON public.burger_matches FOR SELECT
  USING (true);

CREATE POLICY burger_matches_insert_own
  ON public.burger_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies para follows
CREATE POLICY follows_select_all
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY follows_insert_own
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY follows_delete_own
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- RLS Policies para user_activity
CREATE POLICY user_activity_select_own_or_following
  ON public.user_activity FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.follows
      WHERE follows.follower_id = auth.uid()
      AND follows.following_id = user_activity.user_id
    )
    OR auth.role() = 'authenticated'
  );

CREATE POLICY user_activity_insert_own
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);
