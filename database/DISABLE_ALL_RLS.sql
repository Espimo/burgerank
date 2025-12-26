-- Script para deshabilitar RLS en todas las tablas necesarias
-- Ejecutar en Supabase SQL Editor

-- Deshabilitar RLS en burgers (para búsquedas de favoritos)
ALTER TABLE burgers DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en restaurants (para joins)
ALTER TABLE restaurants DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en cities (para joins)
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;

-- Ya se había deshabilitado antes pero por si acaso:
ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Verificar qué tablas tienen RLS habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
