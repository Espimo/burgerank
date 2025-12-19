# ⚡ QUICK REFERENCE - AUTENTICACIÓN

## 📍 COMIENZA AQUÍ

Lee primero: **[INDICE_AUTENTICACION.md](INDICE_AUTENTICACION.md)**

---

## 🔑 VARIABLES DE ENTORNO

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ⚙️ SETUP EN SUPABASE (3 PASOS)

### 1. Ejecutar SQL
```sql
-- Ve a: SQL Editor
-- Copia y ejecuta: database/rls_policies.sql
```

### 2. Habilitar Email
```
Authentication > Providers > Email > ON ✅
```

### 3. Configurar Redirect URLs
```
Authentication > URL Configuration > Add:
- http://localhost:3000/auth/verify-email
- http://localhost:3000/auth/signin
- http://localhost:3000/ranking
```

---

## 🚀 TEST (60 segundos)

```bash
npm run dev
# http://localhost:3000/auth/signup
# Crea cuenta → ✅ FUNCIONA
```

---

## 💻 CÓDIGO - CLIENTE

### Obtener Usuario

```tsx
'use client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function App() {
  const { authUser, userProfile, logout } = useAuth();
  
  return (
    <div>
      {authUser ? (
        <>
          <p>Hola {userProfile?.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

### Login

```tsx
const { signin } = useAuth();

await signin('email@example.com', 'password123');
// Redirige a /ranking automáticamente
```

### Registro

```tsx
const { signup } = useAuth();

await signup('email@example.com', 'password123', 'username');
// Redirige a /auth/verify-email automáticamente
```

---

## 💻 CÓDIGO - SERVIDOR

### Obtener Usuario

```tsx
import { getCurrentUser } from '@/lib/auth/helpers';

export default async function Page() {
  const user = await getCurrentUser();
  
  if (!user?.auth) return <p>No auth</p>;
  
  return <p>Hola {user.profile?.username}</p>;
}
```

### Verificar Autenticación

```tsx
import { isAuthenticated } from '@/lib/auth/helpers';

const authenticated = await isAuthenticated();
if (!authenticated) {
  // Redirigir a login
}
```

---

## 🛡️ PROTEGER RUTAS

Automático con middleware. Ver: `middleware.ts`

Rutas protegidas:
- `/ranking`
- `/rate`
- `/profile`
- `/admin`

Rutas públicas:
- `/auth/signin`
- `/auth/signup`
- `/`

---

## 🐛 PROBLEMAS RÁPIDOS

### "No se puede insertar"
```sql
-- Ejecuta en Supabase SQL Editor:
database/rls_policies.sql
```

### "Usuario no encontrado"
✅ Ya está arreglado en el código

### "Sesión no persiste"
- Revisa que cookies estén habilitadas
- Abre navegador normal (no incógnito)

### "Botón logout no funciona"
- Verifica que `AuthProvider` esté en `app/layout.tsx`

---

## 📊 RUTAS API

| Ruta | Método | Función |
|------|--------|---------|
| `/api/auth/signup` | POST | Crear cuenta |
| `/api/auth/signin` | POST | Login |
| `/api/auth/logout` | POST | Logout |

```typescript
// Ejemplo: POST /api/auth/signin
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// { success: true, user: {...} }
```

---

## 📁 ARCHIVOS CLAVE

```
app/
  api/auth/signin/route.ts      ← POST /api/auth/signin
  api/auth/signup/route.ts      ← POST /api/auth/signup
  api/auth/logout/route.ts      ← POST /api/auth/logout
  auth/signin/page.tsx          ← Página login
  auth/signup/page.tsx          ← Página registro
  contexts/AuthContext.tsx      ← Context (NUEVO)
  layout.tsx                    ← Agregar AuthProvider

lib/
  auth/helpers.ts               ← Helpers servidor (NUEVO)
  supabase/client.ts            ← Cliente browser
  supabase/server.ts            ← Cliente server

database/
  rls_policies.sql              ← Seguridad (NUEVO)
  burgerank_schema.sql          ← Schema

middleware.ts                   ← Protección rutas
```

---

## 🔐 FLUJO AUTENTICACIÓN

```
SIGNUP
└─ POST /api/auth/signup
   ├─ Validar datos
   ├─ Crear en auth.users
   ├─ Crear en public.users
   └─ Email enviado

SIGNIN
└─ POST /api/auth/signin
   ├─ Validar datos
   ├─ Autenticar
   ├─ Obtener perfil
   └─ Sesión guardada

LOGOUT
└─ POST /api/auth/logout
   ├─ Limpiar sesión
   └─ Cookies borradas
```

---

## ✅ CHECKLIST

- [ ] `.env.local` configurado
- [ ] `rls_policies.sql` ejecutado
- [ ] Email habilitado en Supabase
- [ ] Redirect URLs configuradas
- [ ] `npm run dev`
- [ ] Signup funciona
- [ ] Signin funciona
- [ ] Logout funciona

---

## 🎯 RESÚMENES

| Documento | Tiempo | Contenido |
|-----------|--------|----------|
| [EXEC_SUMMARY_AUTH.md](EXEC_SUMMARY_AUTH.md) | 5 min | Overview rápido |
| [AUTH_SETUP.md](AUTH_SETUP.md) | 10 min | Setup Supabase |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | 5 min | Testing |
| [AUTENTICACION_COMPLETA.md](AUTENTICACION_COMPLETA.md) | 20 min | Referencia técnica |
| [RESUMEN_AUTENTICACION.md](RESUMEN_AUTENTICACION.md) | 15 min | Cambios realizados |

---

## 🆘 AYUDA

1. Error? → [RESUMEN_AUTENTICACION.md - Troubleshooting](RESUMEN_AUTENTICACION.md#️⚠️-errores-comunes)
2. Setup? → [AUTH_SETUP.md](AUTH_SETUP.md)
3. Testing? → [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. Técnico? → [AUTENTICACION_COMPLETA.md](AUTENTICACION_COMPLETA.md)

---

## 🚀 DEPLOY A PRODUCCIÓN

```bash
# 1. Variables en .env.production
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://tu-dominio.com

# 2. En Supabase > URL Configuration, agrega:
# https://tu-dominio.com/auth/verify-email
# https://tu-dominio.com/auth/signin
# https://tu-dominio.com/ranking

# 3. Deploy con Vercel
npm run build
git push origin main  # Si usas Vercel + GitHub
```

---

**¿Necesitas ayuda?** Lee [INDICE_AUTENTICACION.md](INDICE_AUTENTICACION.md)

**Status:** ✅ Listo para producción
