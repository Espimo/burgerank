-- ============================================================================
-- 📋 AGREGAR TABLA DE PROMOCIONES Y DATOS DE EJEMPLO
-- ============================================================================
-- Este script agrega la tabla de promociones y datos de ejemplo
-- sin afectar las tablas existentes
-- ============================================================================

-- ============================================================================
-- PASO 1: CREAR TABLA DE PROMOCIONES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.restaurant_promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INT,
  valid_from DATE,
  valid_until DATE,
  terms TEXT,
  is_active BOOLEAN DEFAULT true,
  emoji VARCHAR(10) DEFAULT '🎉',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_restaurant_promotions_restaurant_id ON public.restaurant_promotions(restaurant_id);
CREATE INDEX idx_restaurant_promotions_active ON public.restaurant_promotions(is_active);

-- ============================================================================
-- PASO 2: AGREGAR COLUMNAS A RESTAURANTS (delivery/reserva)
-- ============================================================================

-- Agregar campos para delivery y reserva si no existen
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'restaurants' 
    AND column_name = 'delivery_url'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN delivery_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'restaurants' 
    AND column_name = 'reservation_url'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN reservation_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'restaurants' 
    AND column_name = 'website'
  ) THEN
    ALTER TABLE public.restaurants ADD COLUMN website TEXT;
  END IF;
END $$;

-- ============================================================================
-- PASO 3: HABILITAR RLS
-- ============================================================================

ALTER TABLE public.restaurant_promotions ENABLE ROW LEVEL SECURITY;

-- Políticas: las promociones son públicas (lectura)
CREATE POLICY "restaurant_promotions_select_all" ON public.restaurant_promotions
  FOR SELECT USING (true);

-- Solo admins pueden crear/actualizar/borrar (se implementará más tarde)
CREATE POLICY "restaurant_promotions_admin_all" ON public.restaurant_promotions
  FOR ALL USING (false); -- Cambiar cuando se implemente el sistema de admin

-- ============================================================================
-- PASO 4: OTORGAR PERMISOS
-- ============================================================================

GRANT ALL ON public.restaurant_promotions TO anon, authenticated;

-- ============================================================================
-- PASO 5: INSERTAR DATOS DE EJEMPLO
-- ============================================================================

-- Actualizar restaurantes existentes con URLs
DO $$
DECLARE
  rest_id UUID;
BEGIN
  -- Burger Palace
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Palace' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.ubereats.com/es/madrid/food-delivery/burger-palace',
      reservation_url = 'https://www.thefork.es/restaurante/burger-palace',
      website = 'https://www.burgerpalace.es'
    WHERE id = rest_id;

    -- Promociones para Burger Palace
    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, '2x1 en Hamburguesas', 'Lleva dos hamburguesas al precio de una todos los martes', 50, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Válido solo los martes. No acumulable con otras promociones.', '🎉'),
      (rest_id, 'Happy Hour 20% OFF', 'Descuento del 20% en toda la carta de 18:00 a 20:00', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Válido de lunes a viernes. Horario: 18:00-20:00h', '⏰'),
      (rest_id, 'Bebida Gratis', 'Bebida gratis con tu menú completo', 0, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Válido con la compra de menú completo (hamburguesa + acompañamiento)', '🥤');
  END IF;

  -- Fast Burger
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Fast Burger' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.glovoapp.com/es/es/madrid/fast-burger',
      reservation_url = 'https://fastburger.es/reservas',
      website = 'https://www.fastburger.es'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Combo Familiar 25% OFF', 'Descuento del 25% en combos para 4 personas o más', 25, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Válido para grupos de 4+ personas. Reserva previa recomendada.', '👨‍👩‍👧‍👦'),
      (rest_id, 'Estudiantes 15% OFF', 'Descuento del 15% presentando carnet de estudiante', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'Válido de lunes a jueves. Presentar carnet vigente.', '🎓');
  END IF;

  -- Premium Beef
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Premium Beef' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.justeat.es/restaurants-premium-beef-madrid',
      reservation_url = 'https://premiumbeef.es/book',
      website = 'https://www.premiumbeef.es'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Menú Degustación Premium', 'Menú degustación con 10% de descuento', 10, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Incluye: Entrante + Hamburguesa Premium + Postre + Bebida', '⭐'),
      (rest_id, 'Reserva Anticipada 15% OFF', 'Descuento del 15% reservando con 48h de antelación', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '180 days', 'Reserva mínimo 48h antes. Válido de martes a viernes.', '📅');
  END IF;

  -- Grill House (Barcelona)
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Grill House' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.ubereats.com/es/barcelona/food-delivery/grill-house',
      reservation_url = 'https://www.opentable.es/grill-house-barcelona',
      website = 'https://www.grillhouse.es'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Miércoles de Parrilla 20% OFF', 'Descuento del 20% en hamburguesas a la parrilla', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Válido solo los miércoles. No incluye bebidas.', '🔥'),
      (rest_id, 'Pack Amigos 30% OFF', 'Descuento del 30% en pedidos de 6+ hamburguesas', 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Válido para grupos. Mínimo 6 hamburguesas.', '🎊');
  END IF;

  -- Burger Barcelona
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Barcelona' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.glovoapp.com/es/es/barcelona/burger-barcelona',
      reservation_url = 'https://burgerbarcelona.com/reserva',
      website = 'https://www.burgerbarcelona.com'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Barcelona Lovers 25% OFF', 'Descuento del 25% mostrando tu entrada del Camp Nou o Sagrada Familia', 25, CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'Válido con entrada vigente. Mismo día o hasta 3 días después.', '🏟️');
  END IF;

  -- Burger Artisan (Valencia)
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Burger Artisan' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.deliveroo.es/es/menu/valencia/burger-artisan',
      reservation_url = 'https://burgerartisan.es/reservar',
      website = 'https://www.burgerartisan.es'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Fallas Especial 30% OFF', 'Descuento especial durante las Fallas', 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Válido durante las Fallas. Presentar entrada de eventos.', '🎆');
  END IF;

  -- Andaluz Burger (Sevilla)
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Andaluz Burger' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.justeat.es/restaurants-andaluz-burger-sevilla',
      reservation_url = 'https://andaluzburger.es/book',
      website = 'https://www.andaluzburger.es'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Tapas + Burger Combo', 'Menú especial: Tapas + Hamburguesa con 20% descuento', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Incluye: 3 tapas + hamburguesa + bebida', '🍷');
  END IF;

  -- Basque Burger (Bilbao)
  SELECT id INTO rest_id FROM public.restaurants WHERE name = 'Basque Burger' LIMIT 1;
  IF rest_id IS NOT NULL THEN
    UPDATE public.restaurants SET 
      delivery_url = 'https://www.ubereats.com/es/bilbao/food-delivery/basque-burger',
      reservation_url = 'https://basqueburger.eus/reservas',
      website = 'https://www.basqueburger.eus'
    WHERE id = rest_id;

    INSERT INTO public.restaurant_promotions (restaurant_id, title, description, discount_percentage, valid_from, valid_until, terms, emoji) VALUES
      (rest_id, 'Pintxo-Pote + Burger', 'Especial pintxo-pote: burger + bebida + pintxo con 15% OFF', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'Válido de jueves a sábado de 19:00 a 21:00', '🍻'),
      (rest_id, 'Euskal Burger Premium', 'Descuento del 20% en hamburguesas con productos vascos', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'Solo en hamburguesas con sello de producto vasco', '🏔️');
  END IF;
END $$;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

SELECT '✅ TABLA DE PROMOCIONES CREADA CORRECTAMENTE' AS resultado;
SELECT 'Promociones insertadas:' AS info, COUNT(*) AS total FROM public.restaurant_promotions;
SELECT 'Restaurantes con URLs actualizadas:' AS info, COUNT(*) AS total FROM public.restaurants WHERE delivery_url IS NOT NULL;
