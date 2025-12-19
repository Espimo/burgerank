# Configuración de Autenticación Supabase - BurgeRank

## 📋 Checklist de Configuración

Este documento describe los pasos necesarios para configurar correctamente la autenticación en Supabase.

## 1️⃣ Variables de Entorno (.env.local)

Asegúrate de tener estas variables configuradas en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000  # En producción: tu_dominio.com
```

## 2️⃣ Configuración en Supabase Dashboard

### A. Habilitar Email/Password Authentication

1. Ve a **Authentication** > **Providers**
2. Busca **Email** en la lista
3. Asegúrate de que esté **habilitado** (toggle verde)
4. Configura:
   - ✅ **Email Confirmations**: Enabled (para verificación de email)
   - ✅ **Secure email change**: Enabled
   - ✅ **Double confirm changes**: Disabled (opcional)

### B. Configurar Email Templates

1. Ve a **Authentication** > **Email Templates**
2. Configura plantilla de confirmación:
   - Subject: "Confirma tu email - BurgeRank"
   - Asegúrate de que incluya el botón/enlace de confirmación

### C. URL Redirect (IMPORTANTE)

1. Ve a **Authentication** > **URL Configuration**
2. Agregar URLs permitidas en **Redirect URLs**:
   ```
   http://localhost:3000/auth/verify-email
   http://localhost:3000/auth/signin
   http://localhost:3000/ranking
   https://tu-dominio.com/auth/verify-email
   https://tu-dominio.com/auth/signin
   https://tu-dominio.com/ranking
   ```

## 3️⃣ Ejecutar SQL Scripts

Ve a **SQL Editor** en Supabase y ejecuta los siguientes scripts:

### a. Crear tabla de usuarios (si no existe)

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INT DEFAULT 0,
  category VARCHAR(50) DEFAULT 'Burger Fan',
  public_profile BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);
```

### b. Aplicar RLS Policies

Ejecuta el archivo: `database/rls_policies.sql`

O manually ejecuta:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles"
  ON public.users FOR SELECT
  USING (public_profile = true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 4️⃣ Probar Autenticación Localmente

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a http://localhost:3000/auth/signup

3. Intenta registrarte con:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `TestPassword123`

4. Verifica los siguientes pasos:
   ✅ Se crea registro en `auth.users`
   ✅ Se crea perfil en `public.users`
   ✅ Recibes email de confirmación (si está configurado)
   ✅ Puedes iniciar sesión después

## 5️⃣ Verificación de Errores Comunes

### Error: "Usuario no encontrado en tabla users"
- **Causa**: La tabla users no tiene RLS policies correctas
- **Solución**: Ejecuta el script `rls_policies.sql`

### Error: "No se puede insertar en tabla users"
- **Causa**: Policy de INSERT no está configurada correctamente
- **Solución**: Verifica que `CHECK (auth.uid() = id)` esté en la policy

### Error: "Email ya existe"
- **Causa**: El email ya está registrado
- **Solución**: Usa un email diferente o resetea la base de datos

### Error: "Contraseña muy débil"
- **Causa**: Supabase requiere contraseñas fuertes
- **Solución**: Usa contraseñas con 8+ caracteres, mayúsculas, números

## 6️⃣ Estructura de Archivos de Autenticación

```
app/
  api/auth/
    signin/route.ts      ← Endpoint de login
    signup/route.ts      ← Endpoint de registro
    logout/route.ts      ← Endpoint de logout
  auth/
    signin/page.tsx      ← Página de login
    signup/page.tsx      ← Página de registro
    verify-email/page.tsx ← Página de verificación
  contexts/
    AuthContext.tsx      ← Context global de autenticación
  layout.tsx             ← Include AuthProvider

lib/
  auth/
    helpers.ts           ← Funciones auxiliares
  supabase/
    client.ts            ← Cliente Supabase (browser)
    server.ts            ← Cliente Supabase (server)
```

## 7️⃣ Flow de Autenticación

### Signup
1. Usuario completa formulario en `/auth/signup`
2. Frontend llama `POST /api/auth/signup`
3. Backend:
   - Valida datos con Zod
   - Crea usuario en `auth.users` con `signUp()`
   - Crea perfil en `public.users`
   - Envía email de confirmación
4. Usuario redirigido a `/auth/verify-email`
5. Usuario confirma email haciendo clic en enlace
6. Usuario redirigido a `/auth/signin` para iniciar sesión

### Signin
1. Usuario completa formulario en `/auth/signin`
2. Frontend llama `POST /api/auth/signin`
3. Backend:
   - Valida datos con Zod
   - Autentica con `signInWithPassword()`
   - Obtiene perfil de `public.users`
   - Devuelve datos al cliente
4. Frontend guarda sesión (automaticamente via Supabase)
5. Usuario redirigido a `/ranking`

### Logout
1. Usuario hace clic en botón de logout
2. Frontend llama `POST /api/auth/logout`
3. Backend ejecuta `signOut()`
4. Sesión se limpia (automático)
5. Usuario redirigido a `/auth/signin`

## 8️⃣ Testing en Producción

Después de deployar a producción:

1. Actualiza `.env.production` con URLs de producción
2. Agrega URLs de producción en Supabase > URL Configuration
3. Prueba signup/signin en tu dominio de producción
4. Verifica que los emails se envíen correctamente

## 🚨 Troubleshooting

### "Error 422: Unprocessable Entity"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` sea correcto
- Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea la anon key, no la service key

### Sesión no persiste después de refresh
- Verifica que las cookies se guardan correctamente
- Revisa `/middleware.ts` y su configuración de cookies

### Error CORS
- Asegúrate de que tu dominio esté en Supabase > Project Settings > API
- Verifica que `NEXT_PUBLIC_APP_URL` sea el dominio correcto

## 📚 Recursos Útiles

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentación NextJS + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
