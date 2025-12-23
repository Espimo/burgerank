-- ============================================================================
-- ADD IMAGE FIELDS AND APPROVAL SYSTEM TO BURGERS AND RESTAURANTS
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ==========================================
-- 1. ADD IMAGE FIELDS TO BURGERS TABLE
-- ==========================================
ALTER TABLE public.burgers 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_order INT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES public.users(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_burgers_is_featured ON public.burgers(is_featured);
CREATE INDEX IF NOT EXISTS idx_burgers_status ON public.burgers(status);
CREATE INDEX IF NOT EXISTS idx_burgers_featured_order ON public.burgers(featured_order);

-- ==========================================
-- 2. ADD IMAGE FIELDS TO RESTAURANTS TABLE
-- ==========================================
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES public.users(id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON public.restaurants(status);

-- ==========================================
-- 3. UPDATE TYPES DEFINITIONS
-- ==========================================
COMMENT ON COLUMN public.burgers.image_url IS 'URL de la imagen de la hamburguesa (aparece en ranking, valoraciones, etc.)';
COMMENT ON COLUMN public.burgers.is_featured IS 'Si la hamburguesa está destacada en el slider de "Para Ti"';
COMMENT ON COLUMN public.burgers.featured_order IS 'Orden en el slider de destacados (1, 2, 3)';
COMMENT ON COLUMN public.burgers.status IS 'Estado: pending, approved, rejected';
COMMENT ON COLUMN public.burgers.submitted_by IS 'Usuario que envió la hamburguesa (para submissions de usuarios)';

COMMENT ON COLUMN public.restaurants.banner_url IS 'URL del banner del restaurante (aparece en la página del restaurante)';
COMMENT ON COLUMN public.restaurants.logo_url IS 'URL del logo del restaurante';
COMMENT ON COLUMN public.restaurants.status IS 'Estado: pending, approved, rejected';
COMMENT ON COLUMN public.restaurants.submitted_by IS 'Usuario que envió el restaurante';

-- ==========================================
-- 4. UPDATE EXISTING DATA
-- ==========================================
-- Marcar todo como aprobado por defecto
UPDATE public.burgers SET status = 'approved' WHERE status IS NULL;
UPDATE public.restaurants SET status = 'approved' WHERE status IS NULL;

-- Limpiar featured_order duplicados
UPDATE public.burgers SET featured_order = NULL WHERE featured_order IS NOT NULL;

-- ==========================================
-- 5. CREATE FUNCTION TO GET FEATURED BURGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.get_featured_burgers()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  image_url TEXT,
  restaurant_id UUID,
  restaurant_name VARCHAR,
  average_rating DECIMAL,
  total_ratings INT,
  featured_order INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.image_url,
    b.restaurant_id,
    r.name AS restaurant_name,
    b.average_rating,
    b.total_ratings,
    b.featured_order
  FROM public.burgers b
  JOIN public.restaurants r ON b.restaurant_id = r.id
  WHERE b.is_featured = true 
    AND b.status = 'approved'
    AND b.featured_order IS NOT NULL
  ORDER BY b.featured_order ASC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. CREATE FUNCTION TO GET PENDING ITEMS
-- ==========================================
CREATE OR REPLACE FUNCTION public.get_pending_items()
RETURNS TABLE (
  item_type VARCHAR,
  item_id UUID,
  item_name VARCHAR,
  submitted_by UUID,
  submitter_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  -- Pending burgers
  SELECT 
    'burger'::VARCHAR AS item_type,
    b.id AS item_id,
    b.name AS item_name,
    b.submitted_by,
    u.username AS submitter_name,
    b.created_at
  FROM public.burgers b
  LEFT JOIN public.users u ON b.submitted_by = u.id
  WHERE b.status = 'pending'
  
  UNION ALL
  
  -- Pending restaurants
  SELECT 
    'restaurant'::VARCHAR AS item_type,
    r.id AS item_id,
    r.name AS item_name,
    r.submitted_by,
    u.username AS submitter_name,
    r.created_at
  FROM public.restaurants r
  LEFT JOIN public.users u ON r.submitted_by = u.id
  WHERE r.status = 'pending'
  
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. RLS POLICIES FOR PENDING ITEMS
-- ==========================================

-- Allow authenticated users to submit burgers/restaurants
DROP POLICY IF EXISTS "Users can submit burgers" ON public.burgers;
CREATE POLICY "Users can submit burgers" ON public.burgers
  FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Users can submit restaurants" ON public.restaurants;
CREATE POLICY "Users can submit restaurants" ON public.restaurants
  FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Only show approved items to regular users
DROP POLICY IF EXISTS "Users can view approved burgers" ON public.burgers;
CREATE POLICY "Users can view approved burgers" ON public.burgers
  FOR SELECT
  USING (status = 'approved' OR submitted_by = auth.uid());

DROP POLICY IF EXISTS "Users can view approved restaurants" ON public.restaurants;
CREATE POLICY "Users can view approved restaurants" ON public.restaurants
  FOR SELECT
  USING (status = 'approved' OR submitted_by = auth.uid());

-- ==========================================
-- 8. VERIFY
-- ==========================================
SELECT 'Image fields and approval system added successfully!' AS status;

-- Verificar columnas añadidas
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('burgers', 'restaurants')
  AND column_name IN ('image_url', 'banner_url', 'logo_url', 'is_featured', 'featured_order', 'status', 'submitted_by')
ORDER BY table_name, column_name;
