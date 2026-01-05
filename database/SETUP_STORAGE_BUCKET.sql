-- ============================================================================
-- CONFIGURACIÓN DE STORAGE PARA BURGERANK
-- ============================================================================
-- Ejecuta este script en Supabase Dashboard > SQL Editor
-- Este script configura el bucket para almacenar imágenes de hamburguesas y restaurantes
-- ============================================================================

-- ============================================================================
-- PASO 1: ELIMINAR POLÍTICAS EXISTENTES
-- ============================================================================
-- Primero eliminamos cualquier política existente que pueda estar causando conflictos

DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Buscar y eliminar todas las políticas del bucket burgerank-images
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%burgerank%' OR policyname LIKE '%imagen%' OR policyname LIKE '%image%' OR policyname LIKE '%admin%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
        RAISE NOTICE 'Eliminada política: %', policy_record.policyname;
    END LOOP;
END $$;

-- Eliminar políticas específicas por si acaso
DROP POLICY IF EXISTS "Imagenes publicas para todos" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden subir imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden actualizar imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Admins pueden eliminar imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin write access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- ============================================================================
-- PASO 2: CREAR POLÍTICAS SIMPLES Y PERMISIVAS
-- ============================================================================

-- Política de lectura pública - TODOS pueden ver las imágenes
CREATE POLICY "public_read_burgerank_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'burgerank-images');

-- Política de inserción - service_role puede subir (bypassa RLS automáticamente)
-- También permitir a cualquier usuario autenticado subir
CREATE POLICY "authenticated_insert_burgerank_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'burgerank-images');

-- Política para permitir a service_role (no debería ser necesaria, pero por si acaso)
CREATE POLICY "service_role_all_burgerank_images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'burgerank-images')
WITH CHECK (bucket_id = 'burgerank-images');

-- Política de actualización para usuarios autenticados
CREATE POLICY "authenticated_update_burgerank_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'burgerank-images')
WITH CHECK (bucket_id = 'burgerank-images');

-- Política de eliminación para usuarios autenticados
CREATE POLICY "authenticated_delete_burgerank_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'burgerank-images');

-- ============================================================================
-- VERIFICAR CONFIGURACIÓN
-- ============================================================================
SELECT 
  policyname,
  cmd as operation,
  permissive,
  roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- INSTRUCCIONES IMPORTANTES
-- ============================================================================
/*
DESPUÉS DE EJECUTAR ESTE SCRIPT:

1. Ve a Supabase Dashboard > Storage
2. Verifica que el bucket 'burgerank-images' existe
3. Si no existe, créalo con estos parámetros:
   - Name: burgerank-images
   - Public bucket: ✅ ACTIVADO
4. En Vercel, asegúrate de tener la variable:
   - SUPABASE_SERVICE_ROLE_KEY = (tu service role key)
5. Redeploy la aplicación en Vercel

NOTA: La service_role key debería bypassear RLS automáticamente,
pero estas políticas son un respaldo por si hay problemas.
*/
