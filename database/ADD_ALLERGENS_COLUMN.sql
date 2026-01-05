-- ============================================================================
-- MIGRACIÓN: Añadir campo de alérgenos a hamburguesas
-- ============================================================================
-- Ejecuta este script en Supabase Dashboard > SQL Editor
-- ============================================================================

-- 1. Añadir columna de alérgenos a la tabla burgers (si no existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'burgers' 
    AND column_name = 'allergens'
  ) THEN
    ALTER TABLE public.burgers ADD COLUMN allergens TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Columna allergens añadida a burgers';
  ELSE
    RAISE NOTICE 'Columna allergens ya existe en burgers';
  END IF;
END $$;

-- 2. Comentario descriptivo de la columna
COMMENT ON COLUMN public.burgers.allergens IS 'Array de alérgenos: gluten, lactosa, huevo, frutos_secos, soja, marisco, pescado, cacahuete, apio, mostaza, sesamo, moluscos';

-- ============================================================================
-- LISTA DE ALÉRGENOS ESTÁNDAR (referencia)
-- ============================================================================
/*
Los 14 alérgenos principales que se deben declarar por ley en la UE:
1. gluten - Cereales que contienen gluten
2. lactosa - Leche y derivados
3. huevo - Huevos y productos derivados
4. frutos_secos - Frutos de cáscara (almendras, avellanas, nueces, etc.)
5. soja - Soja y productos a base de soja
6. marisco - Crustáceos y productos a base de crustáceos
7. pescado - Pescado y productos a base de pescado
8. cacahuete - Cacahuetes y productos a base de cacahuetes
9. apio - Apio y productos derivados
10. mostaza - Mostaza y productos derivados
11. sesamo - Granos de sésamo y productos derivados
12. moluscos - Moluscos y productos derivados
13. sulfitos - Dióxido de azufre y sulfitos
14. altramuces - Altramuces y productos a base de altramuces
*/

-- ============================================================================
-- VERIFICAR MIGRACIÓN
-- ============================================================================
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'burgers'
  AND column_name IN ('tags', 'allergens', 'type')
ORDER BY column_name;
