# 📋 PROXIMOS PASOS - Integración de Supabase Completada

## ✅ Lo Que Está Listo

Tu proyecto **BurgeRank** ahora tiene:

### Base de Datos ✅
- ✅ 12 tablas PostgreSQL en Supabase
- ✅ 13 funciones, 17 triggers, 43 políticas RLS
- ✅ 7 vistas materializadas
- ✅ Datos iniciales (12 rewards, 5 restaurants, 9 burgers)

### Integración de Supabase ✅
- ✅ Clientes de Supabase (client, server, route)
- ✅ Autenticación completa (signup, signin, signout, password reset)
- ✅ Gestión de estado con Zustand (auth-store, app-store)
- ✅ Storage para imágenes (avatars, burger-photos, receipts)
- ✅ Middleware para protección de rutas
- ✅ Páginas de login y registro
- ✅ API routes para autenticación

### Tipos TypeScript ✅
- ✅ Types del esquema Supabase
- ✅ Interfaces personalizadas
- ✅ Validación con Zod

---

## 🚀 PASO 1: Verificar la Configuración

```bash
# 1. Asegúrate que las dependencias están instaladas
npm list @supabase/auth-helpers-nextjs zustand react-hook-form zod

# 2. Si falta algo, instala:
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js zustand react-hook-form zod
npm install -D @types/zustand

# 3. Verifica que .env.local tiene todas las variables
cat .env.local
```

**Debería tener:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚀 PASO 2: Iniciar la Aplicación

```bash
# Desde la carpeta del proyecto:
npm run dev

# Verás:
# > burgerank_project@0.1.0 dev
# > next dev
# > Ready in X.XXs
# > Local: http://localhost:3000
```

---

## 🚀 PASO 3: Probar el Flujo de Autenticación

### 3.1 Página de Registro
1. Abre http://localhost:3000/register
2. Llena el formulario:
   - Email: `test@example.com`
   - Username: `burger_lover` (el sistema verifica disponibilidad)
   - Password: `BurgerPassword123!` (debe tener mayúscula, número)
   - Confirm Password: `BurgerPassword123!`
   - City: `Madrid`
3. Haz clic en "Sign Up"
4. **Deberías ver:** Redirección a `/login`

### 3.2 Página de Login
1. Abre http://localhost:3000/login
2. Llena el formulario:
   - Email: `test@example.com`
   - Password: `BurgerPassword123!`
3. Haz clic en "Sign In"
4. **Deberías ver:** Redirección a `/ranking`

### 3.3 Protección de Rutas
1. Una vez en `/ranking`, abre DevTools (F12)
2. Abre Application → Cookies → `localhost:3000`
3. Verifica que existe `sb-wxbfteisljkzsduuicis-auth-token`
4. Intenta acceder a `/login`
5. **Deberías ver:** Redirección automática a `/ranking`

---

## 📊 PASO 4: Verificar en Supabase

1. Abre https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Authentication → Users**
4. **Deberías ver:** El usuario `test@example.com` creado
5. Ve a **Editor SQL** y ejecuta:

```sql
-- Verifica que se creó el perfil
SELECT id, email, username, city, level, points 
FROM profiles 
WHERE email = 'test@example.com';

-- Resultado esperado: 1 fila con los datos del usuario
```

---

## 🎨 PASO 5: Próximas Páginas a Crear

### Rutas Públicas (no necesitan auth)
- [ ] `/` - Home / Landing page
- [ ] `/about` - Información sobre la app

### Rutas Protegidas (necesitan auth)
- [ ] `/ranking` - Página principal de rankings
- [ ] `/rate/[burgerId]` - Crear review de hamburguesa
- [ ] `/rewards` - Ver recompensas disponibles
- [ ] `/profile` - Perfil del usuario
- [ ] `/profile/edit` - Editar perfil
- [ ] `/messages` - Mensajes entre usuarios
- [ ] `/follows` - Seguimientos

---

## 💾 PASO 6: Crear Nueva Página (Ejemplo: /ranking)

Crea el archivo `/app/ranking/page.tsx`:

```tsx
"use client"

import { useAuthUser } from "@/lib/stores/auth-store"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function RankingPage() {
  const { user, profile, isLoading } = useAuthUser()
  const [burgers, setBurgers] = useState([])

  useEffect(() => {
    const fetchBurgers = async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from("burgers")
        .select("*, restaurant:restaurants(*)")
        .order("average_rating", { ascending: false })
        .limit(10)

      setBurgers(data || [])
    }

    fetchBurgers()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (!profile) return <div>Not authenticated</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {profile.username}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {burgers.map((burger) => (
          <div
            key={burger.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-bold">{burger.name}</h2>
            <p className="text-gray-600">{burger.restaurant.name}</p>
            <p className="text-orange-600 font-bold mt-4">
              Rating: {burger.average_rating}/5
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 📸 PASO 7: Subir Imágenes (Ejemplo)

```tsx
"use client"

import { uploadImage } from "@/lib/supabase/storage"
import { useState } from "react"

export default function UploadAvatar() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    const { url, error } = await uploadImage(
      file,
      "avatars",
      "user-avatars"
    )

    if (error) {
      console.error("Upload failed:", error.message)
    } else {
      console.log("Uploaded to:", url)
    }

    setUploading(false)
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleUpload(e.target.files?.[0]!)}
      disabled={uploading}
    />
  )
}
```

---

## 🧪 PASO 8: Testing en Diferentes Escenarios

### Test 1: Usuario No Autenticado
```bash
# En incógnita o nueva sesión
1. Abre http://localhost:3000/ranking
2. Deberías ser redirigido a /login
```

### Test 2: Usuario Autenticado
```bash
# Después de login
1. Abre http://localhost:3000/login
2. Deberías ser redirigido a /ranking
```

### Test 3: Cerrar Sesión
```tsx
// En cualquier página protegida
import { signOut } from "@/lib/supabase/auth-helpers"

const handleLogout = async () => {
  await signOut()
  window.location.href = "/login"
}
```

### Test 4: Verificar Database Queries
```bash
# Abre DevTools → Console y ejecuta:
const supabase = getSupabaseClient()
const { data } = await supabase.from('profiles').select('*')
console.log(data)
```

---

## 📝 Checklist de Verificación

- [ ] npm install ejecutado correctamente
- [ ] .env.local tiene todas las variables
- [ ] npm run dev funciona sin errores
- [ ] Página de registro funciona
- [ ] Página de login funciona
- [ ] Redirecciones funcionan correctamente
- [ ] Middleware protege rutas
- [ ] Usuario se crea en Supabase
- [ ] Perfil se crea en tabla profiles
- [ ] Cookie de sesión se guarda

---

## ⚠️ Si Tienes Problemas

### Error: "Module not found: @supabase/auth-helpers-nextjs"
```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

### Error: "Cannot find module zustand"
```bash
npm install zustand
```

### Error: "ZodError when validating form"
Verifica que la contraseña:
- Tiene al menos 8 caracteres
- Tiene al menos una mayúscula
- Tiene al menos un número

### Error: "Username already taken"
El error es correcto. Usa un username diferente.

### Error: "Cookies not set"
Asegúrate que:
1. Estás en `localhost:3000` (no 127.0.0.1)
2. Las cookies están habilitadas en el navegador
3. No estás en incógnita

---

## 🎯 Próximos Pasos Después de Testing

1. **Crear más páginas** (ranking, profile, rewards, etc.)
2. **Añadir componentes** (header, footer, navigation)
3. **Crear páginas de detalles** (burger detail, restaurant detail)
4. **Añadir formularios** (crear review, editar perfil)
5. **Implementar búsqueda** y filtros
6. **Publicar a producción** (Vercel, Railway, etc.)

---

## 📚 Documentación Referencia

- 📖 `SUPABASE_SETUP.md` - Cómo usar la integración
- 📖 `MIGRATION_GUIDE.md` - Esquema de base de datos
- 📖 `DATABASE_SCHEMA.md` - Tablas y relaciones

---

**¡Tu integración de Supabase está lista para usar!** 🎉

Próximo paso: Crea tu primera página protegida en `/app/ranking/page.tsx`

---

*Generado: Diciembre 5, 2025*
*Status: ✅ Integración Completa*
