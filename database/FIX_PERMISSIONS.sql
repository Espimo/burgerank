-- ============================================================================
-- 🔧 ARREGLAR PERMISOS - EJECUTA ESTO AHORA
-- ============================================================================
-- Este script arregla el error "permission denied for schema public"
-- sin borrar nada de tu base de datos
-- ============================================================================

-- Permitir acceso al schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Permitir acceso completo a todas las tablas
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.cities TO anon, authenticated;
GRANT ALL ON public.restaurants TO anon, authenticated;
GRANT ALL ON public.burgers TO anon, authenticated;
GRANT ALL ON public.ratings TO anon, authenticated;
GRANT ALL ON public.badges TO anon, authenticated;
GRANT ALL ON public.user_badges TO anon, authenticated;
GRANT ALL ON public.rewards TO anon, authenticated;
GRANT ALL ON public.user_rewards TO anon, authenticated;
GRANT ALL ON public.notifications TO anon, authenticated;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
SELECT '✅ PERMISOS OTORGADOS CORRECTAMENTE' AS resultado;
SELECT 'Ahora intenta hacer login de nuevo' AS instruccion;
