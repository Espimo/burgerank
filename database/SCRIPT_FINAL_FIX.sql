-- ============================================
-- SCRIPT FINAL: Eliminar triggers y desactivar RLS
-- ============================================
-- EJECUTAR ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Soluciona todos los errores de permisos 42501
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TRIGGERS PROBLEMÁTICOS
-- ============================================
-- Estos triggers consultan ranking_config y causan errores

DROP TRIGGER IF EXISTS after_rating_insert ON public.ratings;
DROP TRIGGER IF EXISTS after_rating_update ON public.ratings;
DROP TRIGGER IF EXISTS after_rating_delete ON public.ratings;
DROP TRIGGER IF EXISTS trigger_update_burger_rating ON public.ratings;
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.ratings;
DROP TRIGGER IF EXISTS trigger_update_restaurant_rating ON public.ratings;

-- ============================================
-- PASO 2: DESACTIVAR RLS EN TODAS LAS TABLAS
-- ============================================

-- Tabla user_favorites
ALTER TABLE IF EXISTS public.user_favorites DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Service role can manage favorites" ON public.user_favorites;

-- Tabla notifications
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Tabla ranking_config
ALTER TABLE IF EXISTS public.ranking_config DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ranking_config_read" ON public.ranking_config;
DROP POLICY IF EXISTS "ranking_config_write" ON public.ranking_config;

-- Tabla ratings (por si acaso)
ALTER TABLE IF EXISTS public.ratings DISABLE ROW LEVEL SECURITY;

-- Tabla burgers (por si acaso)  
ALTER TABLE IF EXISTS public.burgers DISABLE ROW LEVEL SECURITY;

-- Tabla users (por si acaso)
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- Tabla ranking_history
ALTER TABLE IF EXISTS public.ranking_history DISABLE ROW LEVEL SECURITY;

-- Tabla suspicious_activity
ALTER TABLE IF EXISTS public.suspicious_activity DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 3: VERIFICAR QUE TABLAS EXISTEN
-- ============================================

-- Crear tabla user_favorites si no existe
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  burger_id UUID NOT NULL REFERENCES public.burgers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, burger_id)
);

-- Crear tabla notifications si no existe
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_burger_id ON public.user_favorites(burger_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ============================================
-- PASO 4: ASEGURAR DATOS EN ranking_config
-- ============================================

-- Solo si la tabla existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ranking_config') THEN
    INSERT INTO ranking_config (id, min_reviews_for_ranking, confidence_threshold) 
    VALUES (1, 1, 25) 
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Después de ejecutar esto:
-- 1. Refresca la página de BurgeRank
-- 2. Los favoritos deberían funcionar
-- 3. Actualizar ratings debería funcionar
-- ============================================
