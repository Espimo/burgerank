import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'burgerank-images';

export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos la service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      console.error('[Upload] NEXT_PUBLIC_SUPABASE_URL no configurado');
      return NextResponse.json(
        { error: 'Configuración de Supabase incompleta. Falta SUPABASE_URL.' },
        { status: 500 }
      );
    }
    
    if (!serviceRoleKey) {
      console.error('[Upload] SUPABASE_SERVICE_ROLE_KEY no configurado');
      return NextResponse.json(
        { error: 'Configuración de Supabase incompleta. Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno de Vercel.' },
        { status: 500 }
      );
    }
    
    // Log para debug (solo muestra primeros caracteres)
    console.log(`[Upload] Using service role key: ${serviceRoleKey.substring(0, 20)}...`);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string; // 'burgers' o 'restaurants'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.' },
        { status: 400 }
      );
    }

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Crear cliente Supabase con service role key (bypassa RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await adminClient.storage.listBuckets();
    
    if (listError) {
      console.error('[Upload] Error listando buckets:', listError);
      return NextResponse.json(
        { error: `Error de acceso a Storage: ${listError.message}. Verifica SUPABASE_SERVICE_ROLE_KEY.` },
        { status: 500 }
      );
    }
    
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`[Upload] Bucket '${BUCKET_NAME}' no existe. Intentando crear...`);
      const { error: createError } = await adminClient.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      
      if (createError) {
        console.error('[Upload] Error creando bucket:', createError);
        return NextResponse.json(
          { error: `No se pudo crear el bucket. Créalo manualmente en Supabase Dashboard > Storage con nombre '${BUCKET_NAME}' y marcado como Public.` },
          { status: 500 }
        );
      }
      console.log(`[Upload] Bucket '${BUCKET_NAME}' creado exitosamente`);
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeFolder = folder === 'restaurants' ? 'restaurants' : 'burgers';
    const fileName = `${safeFolder}/${timestamp}-${randomId}.${extension}`;

    // Convertir archivo a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[Upload] Subiendo archivo: ${fileName}, tamaño: ${buffer.length} bytes`);

    // Subir a Supabase Storage
    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // Cambiar a true para permitir sobrescribir
      });

    if (error) {
      console.error('[Upload] Supabase upload error:', error);
      
      // Mensaje de error más descriptivo
      let errorMessage = error.message;
      if (error.message.includes('Bucket not found')) {
        errorMessage = `El bucket '${BUCKET_NAME}' no existe. Por favor, créalo en Supabase Dashboard > Storage con acceso público.`;
      } else if (error.message.includes('policy')) {
        errorMessage = 'Error de permisos. Verifica las políticas RLS del bucket en Supabase.';
      }
      
      return NextResponse.json(
        { error: `Upload failed: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: publicData } = adminClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    console.log(`[Upload] Imagen subida exitosamente: ${fileName}`);
    
    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
