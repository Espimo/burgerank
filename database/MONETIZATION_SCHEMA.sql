-- ============================================================================
-- BURGERANK MONETIZATION SCHEMA - FASE 1
-- Links de afiliación y descuentos
-- ============================================================================

-- ============================================================================
-- AFFILIATE PLATFORMS TABLE
-- Tabla maestra de plataformas de afiliación
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,           -- 'uber_eats', 'glovo', 'just_eat', 'el_tenedor', 'direct'
  display_name VARCHAR(100) NOT NULL,          -- 'Uber Eats', 'Glovo', 'Just Eat', 'El Tenedor', 'Reserva Directa'
  type VARCHAR(50) NOT NULL,                   -- 'delivery', 'reservation', 'direct'
  icon_emoji VARCHAR(10) DEFAULT '🔗',
  default_priority INT DEFAULT 100,            -- Menor = mayor prioridad
  cta_text VARCHAR(100) DEFAULT 'Pedir ahora', -- Texto del botón
  color VARCHAR(20) DEFAULT '#fbbf24',         -- Color del tema
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar plataformas comunes
INSERT INTO public.affiliate_platforms (name, display_name, type, icon_emoji, default_priority, cta_text, color) VALUES
  ('uber_eats', 'Uber Eats', 'delivery', '🚗', 10, 'Pedir en Uber Eats', '#06C167'),
  ('glovo', 'Glovo', 'delivery', '📦', 20, 'Pedir en Glovo', '#FFC244'),
  ('just_eat', 'Just Eat', 'delivery', '🍽️', 30, 'Pedir en Just Eat', '#FF8000'),
  ('deliveroo', 'Deliveroo', 'delivery', '🛵', 40, 'Pedir en Deliveroo', '#00CCBC'),
  ('el_tenedor', 'El Tenedor', 'reservation', '🍴', 50, 'Reservar mesa', '#C1272D'),
  ('direct_reservation', 'Reserva Directa', 'reservation', '📞', 60, 'Reservar', '#fbbf24'),
  ('direct_order', 'Pedido Directo', 'direct', '🏪', 70, 'Ver restaurante', '#374151')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- RESTAURANT AFFILIATE LINKS TABLE
-- Links de afiliación por restaurante y plataforma
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.restaurant_affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES public.affiliate_platforms(id) ON DELETE CASCADE,
  affiliate_url TEXT NOT NULL,                 -- URL con parámetros de afiliación
  custom_priority INT,                         -- Prioridad personalizada (null = usar default)
  custom_cta_text VARCHAR(100),                -- Texto personalizado del botón
  is_active BOOLEAN DEFAULT TRUE,
  commission_rate DECIMAL(5,2),                -- Tasa de comisión (para tracking interno)
  notes TEXT,                                  -- Notas internas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, platform_id)
);

CREATE INDEX idx_affiliate_links_restaurant ON public.restaurant_affiliate_links(restaurant_id);
CREATE INDEX idx_affiliate_links_platform ON public.restaurant_affiliate_links(platform_id);
CREATE INDEX idx_affiliate_links_active ON public.restaurant_affiliate_links(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- RESTAURANT DISCOUNTS TABLE
-- Descuentos activos por restaurante
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.restaurant_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,                  -- '10% de descuento en tu primer pedido'
  description TEXT,                             -- Detalles del descuento
  discount_code VARCHAR(50),                    -- Código si aplica: 'BURGERANK10'
  discount_type VARCHAR(50) NOT NULL,           -- 'percentage', 'fixed_amount', 'free_delivery', 'other'
  discount_value DECIMAL(10,2),                 -- 10 (para 10%), 5.00 (para €5)
  min_order_value DECIMAL(10,2),                -- Pedido mínimo si aplica
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,         -- NULL = sin fecha límite
  terms TEXT,                                   -- Términos y condiciones
  platform_id UUID REFERENCES public.affiliate_platforms(id), -- Plataforma específica o NULL para todas
  is_active BOOLEAN DEFAULT TRUE,
  is_exclusive BOOLEAN DEFAULT FALSE,           -- Exclusivo de BurgeRank
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_discounts_restaurant ON public.restaurant_discounts(restaurant_id);
CREATE INDEX idx_discounts_active ON public.restaurant_discounts(is_active, valid_until) 
  WHERE is_active = TRUE;

-- ============================================================================
-- AFFILIATE CLICKS TABLE
-- Tracking de clicks de afiliación
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES public.affiliate_platforms(id) ON DELETE CASCADE,
  affiliate_link_id UUID REFERENCES public.restaurant_affiliate_links(id) ON DELETE SET NULL,
  discount_id UUID REFERENCES public.restaurant_discounts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL si usuario no logueado
  source_page VARCHAR(100) NOT NULL,            -- 'ranking', 'restaurant', 'burger_detail', 'search'
  source_burger_id UUID REFERENCES public.burgers(id) ON DELETE SET NULL, -- Si el click vino desde una burger
  referrer TEXT,                                -- URL de referencia
  user_agent TEXT,                              -- Para análisis de dispositivos
  ip_hash VARCHAR(64),                          -- Hash de IP para analytics (no IP directa por privacidad)
  session_id VARCHAR(100),                      -- Para agrupar clicks del mismo usuario
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clicks_restaurant ON public.affiliate_clicks(restaurant_id);
CREATE INDEX idx_clicks_platform ON public.affiliate_clicks(platform_id);
CREATE INDEX idx_clicks_date ON public.affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_clicks_source ON public.affiliate_clicks(source_page);

-- ============================================================================
-- VIEWS PARA REPORTES
-- ============================================================================

-- Vista de resumen de clicks por restaurante
CREATE OR REPLACE VIEW public.affiliate_clicks_summary AS
SELECT 
  r.id as restaurant_id,
  r.name as restaurant_name,
  ap.name as platform_name,
  ap.display_name as platform_display,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT ac.session_id) as unique_sessions,
  COUNT(ac.user_id) as logged_in_clicks,
  DATE_TRUNC('day', ac.clicked_at) as click_date
FROM public.affiliate_clicks ac
JOIN public.restaurants r ON r.id = ac.restaurant_id
JOIN public.affiliate_platforms ap ON ap.id = ac.platform_id
GROUP BY r.id, r.name, ap.name, ap.display_name, DATE_TRUNC('day', ac.clicked_at);

-- ============================================================================
-- FUNCIONES HELPER
-- ============================================================================

-- Función para obtener el mejor link de afiliación de un restaurante
CREATE OR REPLACE FUNCTION get_best_affiliate_link(p_restaurant_id UUID)
RETURNS TABLE (
  platform_name VARCHAR(100),
  platform_display VARCHAR(100),
  platform_type VARCHAR(50),
  affiliate_url TEXT,
  cta_text VARCHAR(100),
  icon_emoji VARCHAR(10),
  color VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.name,
    ap.display_name,
    ap.type,
    ral.affiliate_url,
    COALESCE(ral.custom_cta_text, ap.cta_text) as cta_text,
    ap.icon_emoji,
    ap.color
  FROM public.restaurant_affiliate_links ral
  JOIN public.affiliate_platforms ap ON ap.id = ral.platform_id
  WHERE ral.restaurant_id = p_restaurant_id
    AND ral.is_active = TRUE
    AND ap.is_active = TRUE
  ORDER BY COALESCE(ral.custom_priority, ap.default_priority) ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener descuento activo de un restaurante
CREATE OR REPLACE FUNCTION get_active_discount(p_restaurant_id UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  description TEXT,
  discount_code VARCHAR(50),
  discount_type VARCHAR(50),
  discount_value DECIMAL(10,2),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_exclusive BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rd.id,
    rd.title,
    rd.description,
    rd.discount_code,
    rd.discount_type,
    rd.discount_value,
    rd.valid_until,
    rd.is_exclusive
  FROM public.restaurant_discounts rd
  WHERE rd.restaurant_id = p_restaurant_id
    AND rd.is_active = TRUE
    AND (rd.valid_from IS NULL OR rd.valid_from <= NOW())
    AND (rd.valid_until IS NULL OR rd.valid_until > NOW())
  ORDER BY rd.is_exclusive DESC, rd.discount_value DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Habilitar RLS
ALTER TABLE public.affiliate_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (datos no sensibles)
CREATE POLICY "Public can read active platforms" ON public.affiliate_platforms
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read active affiliate links" ON public.restaurant_affiliate_links
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can read active discounts" ON public.restaurant_discounts
  FOR SELECT USING (
    is_active = TRUE 
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until > NOW())
  );

-- Política para insertar clicks (cualquiera puede registrar un click)
CREATE POLICY "Anyone can insert clicks" ON public.affiliate_clicks
  FOR INSERT WITH CHECK (TRUE);

-- Políticas de admin para gestión completa
CREATE POLICY "Admins can manage platforms" ON public.affiliate_platforms
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can manage affiliate links" ON public.restaurant_affiliate_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can manage discounts" ON public.restaurant_discounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admins can read clicks" ON public.affiliate_clicks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- ============================================================================
-- DATOS DE EJEMPLO (Opcional - para testing)
-- ============================================================================
-- NOTA: Descomentar y adaptar con IDs reales de restaurantes para testing

/*
-- Ejemplo: Añadir links de afiliación a un restaurante
INSERT INTO public.restaurant_affiliate_links (restaurant_id, platform_id, affiliate_url)
SELECT 
  r.id,
  (SELECT id FROM public.affiliate_platforms WHERE name = 'uber_eats'),
  'https://www.ubereats.com/store/example?utm_source=burgerank&utm_medium=affiliate'
FROM public.restaurants r
WHERE r.name ILIKE '%goiko%'
LIMIT 1;

-- Ejemplo: Añadir descuento a un restaurante
INSERT INTO public.restaurant_discounts (restaurant_id, title, discount_type, discount_value, discount_code, is_exclusive)
SELECT 
  r.id,
  '10% de descuento exclusivo BurgeRank',
  'percentage',
  10,
  'BURGERANK10',
  TRUE
FROM public.restaurants r
WHERE r.name ILIKE '%goiko%'
LIMIT 1;
*/
