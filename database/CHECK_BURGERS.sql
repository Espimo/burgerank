-- Script para verificar burgers en la base de datos

-- Ver cuántas burgers hay
SELECT COUNT(*) as total_burgers FROM burgers;

-- Ver las primeras burgers con sus IDs
SELECT 
  id,
  name,
  restaurant_id,
  created_at
FROM burgers
ORDER BY created_at DESC
LIMIT 10;

-- Verificar el tipo de dato de la columna id
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'burgers' 
  AND column_name IN ('id', 'restaurant_id');

-- Verificar user_favorites
SELECT COUNT(*) as total_favorites FROM user_favorites;

-- Ver estructura de user_favorites
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_favorites';
