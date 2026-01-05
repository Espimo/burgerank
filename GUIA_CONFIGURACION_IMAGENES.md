# 🖼️ Guía de Configuración de Imágenes - BurgeRank

## Error Actual
```
Upload failed: new row violates row-level security policy
```

Este error indica que las políticas RLS de Storage están bloqueando la subida.

## Solución Paso a Paso

### Paso 1: Ejecutar Script SQL para Corregir Políticas

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Copia y pega TODO el contenido de `database/SETUP_STORAGE_BUCKET.sql`
5. Haz clic en **Run**

### Paso 2: Verificar el Bucket

1. Ve a **Storage** en el menú lateral
2. Busca el bucket `burgerank-images`
3. Si NO existe:
   - Clic en **New Bucket**
   - Name: `burgerank-images`
   - ✅ **Public bucket**: ACTIVADO (muy importante!)
   - Clic en **Create bucket**
4. Si YA existe pero no es público:
   - Clic en el bucket
   - Clic en ⚙️ **Settings** (engranaje)
   - Activa **Public bucket**
   - Guarda

### Paso 3: Verificar SUPABASE_SERVICE_ROLE_KEY en Vercel

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard) > **Settings** > **API**
2. Copia la **service_role** key (la key secreta, NO la anon key)
   - Empieza con `eyJ...`
   - Dice "service_role" y tiene un ⚠️ warning
3. Ve a [Vercel Dashboard](https://vercel.com)
4. Selecciona tu proyecto **burgerank**
5. Ve a **Settings** > **Environment Variables**
6. Busca `SUPABASE_SERVICE_ROLE_KEY`:
   - Si existe: verifica que el valor sea correcto
   - Si NO existe: **Add New** con estos valores:
     - Key: `SUPABASE_SERVICE_ROLE_KEY`
     - Value: (pega la service_role key)
     - Environment: ✅ Production, ✅ Preview, ✅ Development
7. Haz clic en **Save**

### Paso 4: Redeploy en Vercel

⚠️ **MUY IMPORTANTE**: Las variables de entorno NO se aplican hasta hacer redeploy.

1. En Vercel, ve a **Deployments**
2. Encuentra el deployment más reciente
3. Clic en los **...** (tres puntos) a la derecha
4. Clic en **Redeploy**
5. Espera a que termine (~2 minutos)

### Paso 5: Probar Upload

1. Ve a `https://burgerank.vercel.app/admin`
2. Edita una hamburguesa
3. Intenta subir una imagen
4. Debería funcionar ✅

## Troubleshooting

### "new row violates row-level security policy"
- Ejecuta el script SQL de `database/SETUP_STORAGE_BUCKET.sql`
- Asegúrate de que el bucket es **Public**

### "Configuración de Supabase incompleta. Falta SUPABASE_SERVICE_ROLE_KEY"
- La variable no está configurada en Vercel
- Añádela y haz redeploy

### "Error de acceso a Storage"
- La service_role key es incorrecta
- Cópiala de nuevo desde Supabase > Settings > API

### La imagen se sube pero no aparece
- Verifica que el bucket sea público
- Mira en Storage si la imagen está ahí

## Verificar en Consola de Vercel

Si sigue fallando, mira los logs:
1. Vercel > tu proyecto > **Deployments**
2. Clic en el deployment activo
3. Clic en **Functions** o **Logs**
4. Busca mensajes que empiecen con `[Upload]`
