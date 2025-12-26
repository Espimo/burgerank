-- ============================================
-- FIX: Políticas RLS para ranking_config
-- ============================================
-- Este script corrige los permisos de la tabla ranking_config
-- para que las funciones del sistema puedan leerla

-- Habilitar RLS si no está habilitado
ALTER TABLE ranking_config ENABLE ROW LEVEL SECURITY;

-- Borrar políticas existentes
DROP POLICY IF EXISTS "ranking_config_read" ON ranking_config;
DROP POLICY IF EXISTS "ranking_config_write" ON ranking_config;

-- Permitir lectura pública (necesario para las funciones)
CREATE POLICY "ranking_config_read" ON ranking_config 
  FOR SELECT 
  USING (true);

-- Permitir escritura solo a admins
CREATE POLICY "ranking_config_write" ON ranking_config 
  FOR ALL 
  USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
  );

-- Verificar que existe un registro de configuración
INSERT INTO ranking_config (id, min_reviews_for_ranking, confidence_threshold) 
VALUES (1, 1, 25) 
ON CONFLICT (id) DO NOTHING;
