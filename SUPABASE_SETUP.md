# 🔐 Configuración Completa de Supabase en Next.js

## ✅ Lo Que Se Ha Configurado

### 1. **Types TypeScript** (`/types/`)
- ✅ `database.types.ts` - Types generados desde el esquema de Supabase
- ✅ `index.ts` - Interfaces principales (Profile, Burger, Review, etc.)

### 2. **Clientes de Supabase** (`/lib/supabase/`)
- ✅ `client.ts` - Cliente para Client Components (useClient)
- ✅ `server.ts` - Clientes para Server Components y API routes
- ✅ `auth-helpers.ts` - Funciones de autenticación (signUp, signIn, signOut, etc.)
- ✅ `storage.ts` - Funciones para subir/descargar imágenes

### 3. **Stores de Zustand** (`/lib/stores/`)
- ✅ `auth-store.ts` - Gestión de estado de autenticación
- ✅ `app-store.ts` - Gestión de estado global de la app

### 4. **Middleware** 
- ✅ `/middleware.ts` - Protección de rutas y manejo de sesiones

### 5. **Páginas de Auth** (`/app/(auth)/`)
- ✅ `/login/page.tsx` - Página de login con formulario
- ✅ `/register/page.tsx` - Página de registro con validación
- ✅ `/layout.tsx` - Layout para páginas de auth

### 6. **API Routes** (`/app/api/auth/`)
- ✅ `/auth/me/route.ts` - Obtener usuario actual
- ✅ `/auth/logout/route.ts` - Cerrar sesión

---

## 🚀 Como Usar

### En Client Components

```tsx
"use client"

import { useAuthUser, useAuthActions } from "@/lib/stores/auth-store"
import { signOut } from "@/lib/supabase/auth-helpers"

export default function Profile() {
  const { user, profile, isAuthenticated } = useAuthUser()
  const { clearAuth } = useAuthActions()

  const handleLogout = async () => {
    const result = await signOut()
    if (result.success) {
      clearAuth()
      // Redirigir a login
    }
  }

  return (
    <div>
      <h1>{profile?.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### En Server Components

```tsx
import { getCurrentUser } from "@/lib/supabase/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export default async function Page() {
  const user = await getCurrentUser()
  const supabase = getSupabaseServer()

  if (!user) {
    return <p>Not authenticated</p>
  }

  // Usar supabase para queries
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)

  return <div>{/* ... */}</div>
}
```

### En API Routes

```tsx
import { getSupabaseRoute } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = getSupabaseRoute()

  const { data, error } = await supabase
    .from("reviews")
    .insert([{ /* data */ }])

  if (error) return NextResponse.json({ error })
  return NextResponse.json({ data })
}
```

### Subir Imágenes

```tsx
"use client"

import { uploadImage } from "@/lib/supabase/storage"

export default function Upload() {
  const handleUpload = async (file: File) => {
    const { url, error } = await uploadImage(
      file,
      "burger-photos",
      "uploads"
    )

    if (error) {
      console.error(error.message)
      return
    }

    console.log("Uploaded to:", url)
  }

  return (
    <input
      type="file"
      onChange={(e) => handleUpload(e.target.files?.[0]!)}
    />
  )
}
```

---

## 📁 Estructura del Proyecto

```
lib/
├── supabase/
│   ├── client.ts           # Cliente para Client Components
│   ├── server.ts           # Clientes para Server Components
│   ├── auth-helpers.ts     # Funciones de auth
│   └── storage.ts          # Funciones de storage
├── stores/
│   ├── auth-store.ts       # Zustand auth store
│   └── app-store.ts        # Zustand app store

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
└── api/
    └── auth/
        ├── me/
        │   └── route.ts
        └── logout/
            └── route.ts

types/
├── database.types.ts       # Types del esquema
└── index.ts               # Interfaces personalizadas

middleware.ts              # Middleware de rutas
```

---

## 🔒 Protección de Rutas

El middleware en `/middleware.ts` protege automáticamente estas rutas:
- **Rutas privadas**: `/ranking`, `/rate`, `/rewards`, `/profile`, `/messages`, `/follows`
- **Rutas públicas**: `/`, `/login`, `/register`, `/about`, `/forgot-password`

Un usuario autenticado que intente acceder a `/login` será redirigido a `/ranking`.

---

## 🔄 Flujo de Autenticación

1. **Usuario entra a `/login` o `/register`**
2. **Llena el formulario** con email, password, username, city
3. **Se crea la cuenta** en Supabase Auth + perfil en la tabla `profiles`
4. **Se redirige a `/ranking`**
5. **El middleware verifica la sesión** en cada request
6. **El state se sincroniza** con Zustand store

---

## 📦 Funciones Disponibles

### Auth Helpers

```tsx
// Autenticación
signUp(email, password, username, city)
signIn(email, password)
signOut()
resetPassword(email)
updatePassword(newPassword)
getCurrentUser()
updateProfile(userId, data)
checkUsernameAvailability(username)
```

### Storage Helpers

```tsx
// Storage
uploadImage(file, bucket, path)
deleteImage(path, bucket)
getPublicUrl(path, bucket)
uploadImages(files, bucket, path)
validateFile(file, bucket)
```

### Store Hooks

```tsx
// Auth Store
useAuthUser()         // { user, profile, isAuthenticated, isLoading }
useUser()            // Obtener solo user
useProfile()         // Obtener solo profile
useAuthActions()     // Obtener acciones

// App Store
useIsOnline()
useCurrentLocation()
useBurgerFilters()
useRestaurantFilters()
useDarkMode()
useAppActions()
```

---

## ⚙️ Configuración Requerida

### 1. Instalar Dependencias

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js zustand
npm install -D @types/zustand
```

### 2. Variables de Entorno

Asegúrate que `.env.local` tiene:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. next.config.ts

Si tienes problemas con imports, asegúrate que tu `next.config.ts` tiene:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

---

## 🔍 Verificar que Todo Funciona

1. **Ejecuta la app**
   ```bash
   npm run dev
   ```

2. **Accede a http://localhost:3000**

3. **Intenta registrarte en `/register`**

4. **Verifica que se crea la cuenta en Supabase**

5. **Intenta login en `/login`**

6. **Verifica que redirige a `/ranking`**

---

## ⚠️ Errores Comunes y Soluciones

### Error: "createClientComponentClient is not defined"
```bash
npm install @supabase/auth-helpers-nextjs
```

### Error: "Cannot find module '@/types'"
Verifica que tu `tsconfig.json` tiene:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Session not found"
El middleware está verificando la sesión. Si ves este error en desarrollo, asegúrate que:
1. Las cookies están habilitadas en el navegador
2. Estás usando `http://localhost:3000` (no IP)
3. La variable `NEXT_PUBLIC_SUPABASE_URL` es correcta

### Error: "Username already taken"
El sistema verifica automáticamente disponibilidad de usernames. Usa otro diferente.

---

## 📚 Documentación Adicional

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

---

**¡Tu integración de Supabase está completamente configurada!** 🎉

Ahora puedes:
1. ✅ Registrar usuarios
2. ✅ Autenticar usuarios
3. ✅ Proteger rutas
4. ✅ Subir imágenes
5. ✅ Gestionar estado con Zustand
6. ✅ Consultar la base de datos desde Server Components
