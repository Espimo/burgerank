# 🔐 Sistema de Autenticación BurgeRank - Guía de Implementación

## ✅ CAMBIOS REALIZADOS

### 1. **Arreglado: Bug en Signup**
   - **Problema**: Estaba usando `.insert(object)` en lugar de `.insert([object])`
   - **Solución**: Ahora usa `.insert([{...}]).select().single()`
   - **Archivo**: [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)

### 2. **Mejorado: Signin con Fallback**
   - **Problema**: Si el usuario existía en auth.users pero no en public.users, fallaba
   - **Solución**: Ahora crea automáticamente el perfil si no existe (PGRST116 error code)
   - **Archivo**: [app/api/auth/signin/route.ts](app/api/auth/signin/route.ts)

### 3. **Creado: AuthContext Global**
   - Contexto de React para manejar estado de autenticación en el cliente
   - Sincronización automática de sesión via `onAuthStateChange()`
   - Métodos: `signin()`, `signup()`, `logout()`, `refreshUser()`
   - **Archivo**: [app/contexts/AuthContext.tsx](app/contexts/AuthContext.tsx)

### 4. **Creado: Auth Helpers (Server)**
   - Funciones de servidor para autenticación
   - `getCurrentUser()`, `isAuthenticated()`, `getUserProfile()`, etc.
   - **Archivo**: [lib/auth/helpers.ts](lib/auth/helpers.ts)

### 5. **Mejorado: Middleware**
   - Protección de rutas más robusta
   - Mejor manejo de rutas públicas vs privadas
   - **Archivo**: [middleware.ts](middleware.ts)

### 6. **Actualizado: Páginas Auth**
   - SignIn: Ahora usa AuthContext
   - SignUp: Ahora usa AuthContext
   - **Archivos**: 
     - [app/auth/signin/page.tsx](app/auth/signin/page.tsx)
     - [app/auth/signup/page.tsx](app/auth/signup/page.tsx)

### 7. **Actualizado: Layout Principal**
   - Ahora envuelve la app con `AuthProvider`
   - **Archivo**: [app/layout.tsx](app/layout.tsx)

### 8. **Creado: RLS Policies SQL**
   - Script completo de Row Level Security
   - Protege datos según permisos del usuario
   - **Archivo**: [database/rls_policies.sql](database/rls_policies.sql)

## 🚀 PASOS PARA ACTIVAR LA AUTENTICACIÓN

### Paso 1: Configurar Variables de Entorno
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 2: Ejecutar Scripts SQL en Supabase
1. Ve a Supabase Dashboard > SQL Editor
2. Crea nueva query
3. Copia y ejecuta el contenido de `database/rls_policies.sql`

### Paso 3: Configurar Email en Supabase
1. Ve a Authentication > Email Templates
2. Configura plantilla de confirmación
3. (Opcional) Configura SMTP para emails reales

### Paso 4: Configurar Redirect URLs
En Supabase > Authentication > URL Configuration, agrega:
```
http://localhost:3000/auth/verify-email
http://localhost:3000/auth/signin
http://localhost:3000/ranking
```

### Paso 5: Probar
```bash
npm run dev
# Ve a http://localhost:3000/auth/signup
# Intenta registrarte
```

## 📊 FLUJO DE AUTENTICACIÓN

```
┌─────────────────────────────────────────────────────────────┐
│                      SIGNUP FLOW                             │
├─────────────────────────────────────────────────────────────┤
│ 1. Usuario va a /auth/signup                                 │
│ 2. Completa: email, password, username                       │
│ 3. POST /api/auth/signup                                     │
│    └─ Supabase crea usuario en auth.users                   │
│    └─ Backend crea perfil en public.users                   │
│    └─ Supabase envía email de confirmación                  │
│ 4. Usuario redirigido a /auth/verify-email                  │
│ 5. Usuario confirma email (clic en enlace)                  │
│ 6. Usuario puede hacer signin                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      SIGNIN FLOW                             │
├─────────────────────────────────────────────────────────────┤
│ 1. Usuario va a /auth/signin                                 │
│ 2. Completa: email, password                                │
│ 3. POST /api/auth/signin                                    │
│    └─ Supabase autentica usuario                           │
│    └─ Backend obtiene perfil de public.users               │
│ 4. Frontend recibe datos del usuario                        │
│ 5. Supabase guarda sesión en cookies automáticamente        │
│ 6. Usuario redirigido a /ranking                           │
│ 7. Middleware valida sesión en cada request               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     LOGOUT FLOW                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Usuario hace clic en "Cerrar Sesión"                    │
│ 2. POST /api/auth/logout                                   │
│    └─ Supabase limpia sesión                              │
│ 3. Frontend limpia contexto                               │
│ 4. Redirige a /auth/signin                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 ESTRUCTURA DE DATOS

### auth.users (Supabase Auth - automático)
```
id (UUID)
email
email_confirmed_at
password_hash
created_at
```

### public.users (nuestra tabla)
```
id (UUID) → referencias auth.users(id)
username (unique)
email
avatar_url
bio
points
category
public_profile
created_at
updated_at
```

## 🛡️ SEGURIDAD

### Row Level Security (RLS) está habilitado en:
- ✅ users: Solo ver propio perfil + perfiles públicos
- ✅ ratings: Ver todas, crear/editar solo las propias
- ✅ user_rewards: Solo ver/crear propios
- ✅ notifications: Solo ver propias
- ✅ Otras tablas: Sin restricciones (público)

### Protección de rutas:
- ✅ Middleware valida autenticación en cada request
- ✅ URLs privadas redirigen a signin si no autenticado
- ✅ URLs públicas redirigen a ranking si autenticado
- ✅ Las cookies se manejan automáticamente con HTTPOnly

## 📱 HOOKS Y UTILITIES

### Usar en componentes cliente:
```tsx
import { useAuth } from '@/app/contexts/AuthContext';

export default function MiComponente() {
  const { authUser, userProfile, signin, signup, logout, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  if (!authUser) return <div>No autenticado</div>;
  
  return (
    <div>
      <p>Bienvenido {userProfile?.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Usar en servidor (Server Components o API):
```tsx
import { getCurrentUser, getUserProfile, isAuthenticated } from '@/lib/auth/helpers';

export default async function MiPagina() {
  const user = await getCurrentUser();
  
  if (!user) return <div>No autenticado</div>;
  
  return <div>Bienvenido {user.profile?.username}</div>;
}
```

## ⚠️ ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| "Usuario no encontrado" | Perfil no existe en public.users | ✅ Ya arreglado en signin |
| "No se puede insertar" | RLS policy incompleta | Ejecuta rls_policies.sql |
| "Email inválido" | Formato de email incorrecto | Usa email válido |
| "Contraseña débil" | < 8 caracteres | Usa 8+ caracteres |
| "Email ya existe" | Email registrado previamente | Usa otro email |
| Sesión no persiste | Cookies bloqueadas | Verifica navegador settings |
| CORS error | Dominio no autorizado | Agrega a Supabase URL config |

## 📝 SIGUIENTES PASOS RECOMENDADOS

1. **Verificación de Email**
   - [ ] Configurar SMTP real (no test) en Supabase
   - [ ] Mejorar plantilla de email
   - [ ] Agregar resend de email

2. **Recuperación de Contraseña**
   - [ ] Crear página reset-password
   - [ ] Implementar ruta /api/auth/reset-password
   - [ ] Plantilla de reset password

3. **OAuth (Google, GitHub, etc)**
   - [ ] Habilitar proveedores en Supabase
   - [ ] Crear botones de social login
   - [ ] Mapeo de usuarios social

4. **Perfil de Usuario**
   - [ ] Página de edición de perfil
   - [ ] Upload de avatar
   - [ ] Cambio de contraseña

5. **Admin**
   - [ ] Panel de usuarios
   - [ ] Bloqueo de usuarios
   - [ ] Auditoría de acciones

## 🔗 ARCHIVOS MODIFICADOS

- ✅ [app/api/auth/signin/route.ts](app/api/auth/signin/route.ts)
- ✅ [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)
- ✅ [app/auth/signin/page.tsx](app/auth/signin/page.tsx)
- ✅ [app/auth/signup/page.tsx](app/auth/signup/page.tsx)
- ✅ [app/layout.tsx](app/layout.tsx)
- ✅ [middleware.ts](middleware.ts)
- ✅ **NUEVO**: [app/contexts/AuthContext.tsx](app/contexts/AuthContext.tsx)
- ✅ **NUEVO**: [lib/auth/helpers.ts](lib/auth/helpers.ts)
- ✅ **NUEVO**: [database/rls_policies.sql](database/rls_policies.sql)
- ✅ **NUEVO**: [AUTH_SETUP.md](AUTH_SETUP.md)

## 💡 TIPS

1. Para desarrollo, puedes deshabilitar verificación de email en Supabase
2. Usa emails de test (test@example.com) para testing rápido
3. Las contraseñas se hashean automáticamente con Bcrypt
4. Las sesiones expiran en 24 horas por defecto (configurable)
5. Usa `useAuth()` siempre en componentes 'use client'

---

**Última actualización**: Diciembre 2025
**Estado**: ✅ Sistema de autenticación completo y funcional
