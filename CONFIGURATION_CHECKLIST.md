# ⚙️ CONFIGURATION CHECKLIST - BurgeRank

**Objetivo**: Lista completa de configuración necesaria antes de ir a producción  
**Estado**: Pre-Deployment  
**Duración Estimada**: 2-3 horas

---

## 📋 TABLA DE CONTENIDOS

1. [Pre-Requirements](#requirements)
2. [Configuración Local](#local-config)
3. [Configuración Supabase](#supabase-config)
4. [Configuración de Autenticación](#auth-config)
5. [Configuración de Datos](#data-config)
6. [Configuración de Seguridad](#security-config)
7. [Configuración de Performance](#performance-config)
8. [Configuración de Deployment](#deployment-config)
9. [Verificación Final](#final-verification)

---

## ✅ <a name="requirements"></a> Pre-Requirements

### Sistema Operativo

- [ ] Windows 10+, macOS 11+, o Ubuntu 20.04+
- [ ] 4GB RAM mínimo
- [ ] 20GB disco disponible

### Software Instalado

- [ ] Node.js 18.x o superior
  ```bash
  node --version  # v18.x.x
  ```

- [ ] npm 9.x o superior
  ```bash
  npm --version   # 9.x.x
  ```

- [ ] Git
  ```bash
  git --version   # 2.x.x
  ```

- [ ] (Opcional) Python 3.8+ para scripts
  ```bash
  python --version  # 3.8+
  ```

### Cuentas Requeridas

- [ ] Cuenta GitHub (para repository)
- [ ] Cuenta Supabase (para BD)
- [ ] Cuenta Vercel (para deployment)
- [ ] Email profesional

---

## 🏠 <a name="local-config"></a> Configuración Local

### 1. Proyecto Node

- [ ] `.gitignore` contiene `.env.local`
  ```
  # Verificar:
  cat .gitignore | grep ".env"
  # Debería mostrar: .env.local
  ```

- [ ] `package.json` con todos los scripts
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "eslint"
    }
  }
  ```

- [ ] Todos los `devDependencies` instalados
  ```bash
  npm install
  ```

### 2. TypeScript

- [ ] `tsconfig.json` configurado correctamente
  ```bash
  cat tsconfig.json | grep '"strict": true'
  # Debe tener strict: true
  ```

- [ ] Paths alias configurados
  ```bash
  cat tsconfig.json | grep '"@/\*"'
  # Debe mostrar: "@/*": ["./*"]
  ```

### 3. Next.js

- [ ] `next.config.ts` existe
  ```bash
  ls -la next.config.ts
  ```

- [ ] Imagen remote patterns configurados
  ```typescript
  // En next.config.ts debe existir:
  remotePatterns: [
    { protocol: "https", hostname: "**.supabase.co" }
  ]
  ```

### 4. Tailwind CSS

- [ ] `tailwind.config.ts` existe
  ```bash
  ls -la tailwind.config.ts
  ```

- [ ] Tailwind CSS 4.x instalado
  ```bash
  npm list tailwindcss
  ```

- [ ] PostCSS 4.x instalado
  ```bash
  npm list postcss
  ```

### 5. Directorio Público

- [ ] `/public` existe con assets
  ```bash
  ls -la public/
  ```

- [ ] Favicons presentes (opcional)
  ```bash
  ls -la public/favicon*
  ```

### 6. Verificación

- [ ] El proyecto compila sin errores
  ```bash
  npm run build
  # Debería finalizar sin errores
  ```

- [ ] ESLint no reporta errores críticos
  ```bash
  npm run lint
  ```

---

## 🔐 <a name="supabase-config"></a> Configuración Supabase

### 1. Crear Proyecto

- [ ] Proyecto Supabase creado en https://supabase.com

- [ ] Proyecto está activo (no pausado)

- [ ] Región seleccionada es la más cercana a tu audiencia

### 2. Credenciales

- [ ] `NEXT_PUBLIC_SUPABASE_URL` disponible
  ```bash
  # En Supabase Dashboard: Settings → API → Project URL
  ```

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` disponible
  ```bash
  # En Supabase Dashboard: Settings → API → anon/public
  ```

- [ ] `SUPABASE_SERVICE_ROLE_KEY` disponible
  ```bash
  # En Supabase Dashboard: Settings → API → service_role/secret
  ```

### 3. Autenticación

- [ ] Email Provider habilitado
  - [ ] Supabase Dashboard → Auth → Providers → Email
  - [ ] Debe estar ON

- [ ] (Opcional) OAuth Providers
  - [ ] Google OAuth (si deseas integración)
  - [ ] GitHub OAuth (si deseas integración)

### 4. Database

- [ ] 12 tablas están creadas
  ```sql
  SELECT COUNT(*) FROM information_schema.tables 
  WHERE table_schema = 'public';
  -- Debería retornar: 12
  ```

- [ ] RLS (Row-Level Security) está habilitado
  ```bash
  # Supabase Dashboard → Database → Replication
  # Debe mostrar: RLS Enabled
  ```

- [ ] Backups automáticos están habilitados
  ```bash
  # Supabase Dashboard → Settings → Backups
  ```

### 5. Storage

- [ ] Buckets creados
  - [ ] `avatars` → para fotos de perfil
  - [ ] `burger-photos` → para fotos de burgers
  - [ ] `receipts` → para comprobantes

- [ ] Storage policies configuradas
  ```sql
  -- Verificar que existen políticas
  SELECT * FROM storage.buckets;
  ```

### 6. Verificación

- [ ] Conexión a Supabase funciona
  ```bash
  npm run dev
  # No debe reportar "Supabase connection error"
  ```

---

## 🔑 <a name="auth-config"></a> Configuración de Autenticación

### 1. Environment Variables

- [ ] `.env.local` creado (NUNCA en git)
  ```bash
  cat .env.local
  ```

- [ ] Variables Supabase en `.env.local`
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```

- [ ] `.env.local` NO está en git
  ```bash
  git status | grep ".env"
  # No debería mostrar .env.local
  ```

### 2. Middleware

- [ ] `/middleware.ts` existe
  ```bash
  ls -la middleware.ts
  ```

- [ ] Rutas públicas correctas
  ```typescript
  // En middleware.ts debe estar:
  const publicRoutes = ["/", "/login", "/register", "/about"]
  ```

- [ ] Rutas protegidas correctas
  ```typescript
  // En middleware.ts debe estar:
  const protectedRoutes = ["/ranking", "/rate", "/rewards", "/profile"]
  ```

### 3. Supabase Client

- [ ] `/lib/supabase/client.ts` existe
  ```bash
  ls -la lib/supabase/client.ts
  ```

- [ ] `/lib/supabase/server.ts` existe
  ```bash
  ls -la lib/supabase/server.ts
  ```

- [ ] Auth helpers en lugar correcto
  ```bash
  ls -la lib/supabase/auth-helpers.ts
  ```

### 4. Auth Store

- [ ] Zustand auth store existe
  ```bash
  ls -la lib/stores/auth-store.ts
  ```

- [ ] useAuthStore hook funciona
  ```bash
  grep -n "export const useAuthStore" lib/stores/auth-store.ts
  ```

### 5. Páginas de Auth

- [ ] Login page en `/app/(auth)/login/page.tsx`
- [ ] Register page en `/app/(auth)/register/page.tsx`
- [ ] Forgot password page en `/app/(auth)/forgot-password/page.tsx`

### 6. Verificación

- [ ] Puedes crear cuenta en `/register`
- [ ] Puedes iniciar sesión en `/login`
- [ ] Auth redirige correctamente a `/ranking`
- [ ] Cerrar sesión funciona

---

## 📊 <a name="data-config"></a> Configuración de Datos

### 1. Database Migrations

- [ ] Archivos SQL existen
  ```bash
  ls -la supabase/migrations/
  # Debería haber 001_schema.sql hasta 006_materialized_views.sql
  ```

- [ ] Migraciones ejecutadas
  ```bash
  # Opción 1: Python
  python run_migrations.py
  
  # Opción 2: PowerShell
  .\run_migrations.ps1 -Password "tu_password"
  
  # Opción 3: Manual en Supabase SQL Editor
  ```

- [ ] 12 Tablas creadas
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
  -- Debe mostrar 12 tablas
  ```

- [ ] Funciones PostgreSQL creadas
  ```sql
  SELECT routine_name FROM information_schema.routines 
  WHERE routine_schema = 'public';
  -- Debe mostrar 13+ funciones
  ```

- [ ] Triggers creados
  ```sql
  SELECT trigger_name FROM information_schema.triggers;
  -- Debe mostrar 17+ triggers
  ```

### 2. Seed Data (Datos Iniciales)

- [ ] (Opcional) Restaurants seed data cargado
  ```sql
  SELECT COUNT(*) FROM restaurants;
  ```

- [ ] (Opcional) Rewards seed data cargado
  ```sql
  SELECT COUNT(*) FROM rewards;
  ```

- [ ] (Opcional) Sample burgers cargados
  ```sql
  SELECT COUNT(*) FROM burgers;
  ```

### 3. RLS Policies

- [ ] RLS habilitado en todas las tablas
  ```bash
  # Supabase Dashboard → Database → Tables
  # Cada tabla debe mostrar "RLS" badge
  ```

- [ ] Políticas de seguridad aplicadas
  ```bash
  # Verificar que NO pueda leer datos de otros usuarios
  ```

### 4. Backups

- [ ] Backup automático habilitado
  - [ ] Supabase Dashboard → Settings → Backups
  - [ ] Frecuencia: Diaria o por cada día crítico

- [ ] (Opcional) Backup manual realizado
  ```bash
  # Para estar seguro antes de ir a producción
  ```

### 5. Verificación

- [ ] Datos se guardan correctamente
  - [ ] Crea un usuario test
  - [ ] Verifica que aparece en `profiles` table
  - [ ] Crea una reseña
  - [ ] Verifica que aparece en `reviews` table

---

## 🔒 <a name="security-config"></a> Configuración de Seguridad

### 1. Environment Variables

- [ ] `.env.local` NO está en git
- [ ] `.env.local` NO está en `.gitignore` comentado
- [ ] Credenciales NO están en código
- [ ] No hay secrets en commits anteriores

### 2. Supabase Security

- [ ] RLS habilitado en todas las tablas
- [ ] RLS policies están correctas
- [ ] Storage policies están configuradas
- [ ] No hay acceso público a datos sensibles

### 3. Next.js Security

- [ ] CORS está configurado si es necesario
- [ ] CSRF protection activo (Next.js automático)
- [ ] XSS protection activo (React automático)
- [ ] Helmet o similar para headers seguros (opcional)

### 4. Validación de Input

- [ ] Zod schemas configurados
  ```bash
  ls -la lib/validations/
  # Debería haber: review-schema.ts, new-burger-schema.ts, schemas.ts
  ```

- [ ] Todos los formularios validan input
- [ ] Backend valida datos (no solo frontend)
- [ ] SQL injection imposible (usando Supabase queries)

### 5. Authentication

- [ ] Contraseñas son salted y hashed
- [ ] JWT tokens tienen expiración
- [ ] Sesiones se limpian al logout
- [ ] Cookies son httpOnly

### 6. SSL/TLS

- [ ] Dominio tiene certificado SSL (si es producción)
- [ ] Redirige HTTP → HTTPS
- [ ] HTTPS está forzado en todos lados

### 7. Monitoreo de Seguridad

- [ ] Error logging está habilitado
- [ ] Errores no revelan información sensible
- [ ] Logs se guardan de forma segura

### 8. Verificación

- [ ] No hay console.log con datos sensibles
- [ ] No hay comentarios con secrets
- [ ] npm audit no reporta vulnerabilidades críticas
  ```bash
  npm audit --audit-level=moderate
  ```

---

## ⚡ <a name="performance-config"></a> Configuración de Performance

### 1. Image Optimization

- [ ] Next/Image está configurado
  ```bash
  grep -n "Image from 'next/image'" app/layout.tsx
  ```

- [ ] Remote patterns en next.config.ts
- [ ] Imágenes estáticas tienen dimensiones
- [ ] Lazy loading habilitado donde corresponde

### 2. Code Splitting

- [ ] Dynamic imports para componentes grandes
  ```typescript
  const LargeComponent = dynamic(() => import('./Component'))
  ```

- [ ] Route-based code splitting automático (Next.js)

### 3. Caching

- [ ] Headers de cache configurados
  ```typescript
  // En API routes
  res.setHeader('Cache-Control', 'public, max-age=3600')
  ```

- [ ] SWR o React Query si es necesario
- [ ] ISR (Incremental Static Regeneration) donde sea aplicable

### 4. Bundle Size

- [ ] Bundle size es < 500KB
  ```bash
  npm run build  # Ver "Route (pages)" al final
  ```

- [ ] No hay dependencias no utilizadas
  ```bash
  npm audit --audit-level=moderate
  ```

### 5. Fonts

- [ ] Fonts optimizados (Next.js Font)
  ```bash
  grep -n "next/font" app/layout.tsx
  ```

- [ ] Font-display: swap configurado
- [ ] Web fonts no bloquean rendering

### 6. Core Web Vitals

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

Verificar con Lighthouse:
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### 7. Database Performance

- [ ] Índices en queries frecuentes
- [ ] Queries usan select específico (no *)
- [ ] N+1 queries evitadas

### 8. Monitoreo

- [ ] Analytics habilitado (Google Analytics)
  ```env
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
  ```

- [ ] Real User Metrics configurado
- [ ] Alertas para performance degradation

---

## 🚀 <a name="deployment-config"></a> Configuración de Deployment

### 1. Vercel (Si Deployando a Vercel)

- [ ] Proyecto Vercel creado
- [ ] Repository conectado
- [ ] Environment variables configuradas
- [ ] Build settings correctos

### 2. Self-Hosted (Si Auto-alojado)

- [ ] Server preparado (Node 18+, npm 9+)
- [ ] PM2 instalado (process manager)
- [ ] Nginx/Apache configurado (reverse proxy)
- [ ] SSL certificate generado (Let's Encrypt)

### 3. Git Repository

- [ ] Repository público o privado en GitHub
- [ ] Main branch protegida
- [ ] `.gitignore` correcto
- [ ] Commits están limpios (sin secrets)

### 4. CI/CD (Opcional)

- [ ] GitHub Actions configurado
- [ ] Tests pasan en CI
- [ ] Build pasa en CI
- [ ] Auto-deploy configurado

### 5. Dominio

- [ ] Dominio registrado
- [ ] DNS apunta a servidor/Vercel
- [ ] SSL certificate válido
- [ ] Email en dominio (para soporte)

### 6. Monitoreo

- [ ] Error tracking (Sentry, Rollbar, etc.)
- [ ] Uptime monitoring configurado
- [ ] Alertas configuradas para errores
- [ ] Logs centralizados

---

## ✅ <a name="final-verification"></a> Verificación Final

### Checklist Final Pre-Deployment

- [ ] **Backend**
  - [ ] Base de datos 12 tablas ✓
  - [ ] Migraciones ejecutadas ✓
  - [ ] RLS políticas activas ✓
  - [ ] Triggers funcionando ✓

- [ ] **Frontend**
  - [ ] Build sin errores: `npm run build` ✓
  - [ ] ESLint sin errores críticos: `npm run lint` ✓
  - [ ] TypeScript sin errores ✓
  - [ ] Todas las rutas accesibles ✓

- [ ] **Autenticación**
  - [ ] Login funciona ✓
  - [ ] Registro funciona ✓
  - [ ] Middleware protege rutas ✓
  - [ ] Logout funciona ✓

- [ ] **Data**
  - [ ] Datos persisten en BD ✓
  - [ ] Queries retornan datos correctos ✓
  - [ ] Updates funcionan ✓
  - [ ] Deletes funcionan ✓

- [ ] **Performance**
  - [ ] Lighthouse score > 90 ✓
  - [ ] Tiempos de carga < 3s ✓
  - [ ] Images optimizadas ✓

- [ ] **Seguridad**
  - [ ] npm audit sin críticos ✓
  - [ ] No hay secrets en git ✓
  - [ ] RLS habilitado ✓
  - [ ] Input validado ✓

- [ ] **Configuration**
  - [ ] `.env.local` configurado ✓
  - [ ] Vercel/Server listo ✓
  - [ ] SSL certificate listo ✓
  - [ ] Monitoreo configurado ✓

### Test Rápido de Funcionalidad

```bash
# 1. Iniciar servidor
npm run dev

# 2. Ir a http://localhost:3000
# Debería ver landing page

# 3. Click en "Registrarse"
# Debería abrir /register

# 4. Llenar formulario y crear cuenta
# Debería redirigir a /ranking

# 5. Ver que header y bottom-nav cargan
# Debería tener logo, búsqueda, menú

# 6. Click en "Perfil"
# Debería mostrar datos del usuario

# 7. Click "Cerrar Sesión"
# Debería redirigir a /login

# 8. Intentar acceder a /ranking sin login
# Debería redirigir a /login
```

Si todo funciona → ¡LISTO PARA DEPLOYMENT!

---

## 📞 Soporte

### Si Algo Falla

1. Revisar `DEPLOYMENT_GUIDE_COMPLETE.md`
2. Revisar `COMPREHENSIVE_AUDIT.md`
3. Revisar logs: `npm run dev` output
4. Revisar errores del navegador (F12)
5. Revisar errores de Supabase (Dashboard)

### Recursos Útiles

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- Vercel: https://vercel.com/docs

---

## 📝 Notas Finales

**Recuerda**:
- ✅ Nunca pushear `.env.local` a git
- ✅ Siempre usar `npm install` después de git pull
- ✅ Testing antes de deployment
- ✅ Monitorear después de deployment

**¡Tu proyecto está listo para producción!**

---

**Fecha**: 2024  
**Versión**: 1.0  
**Estado**: Checklist Completo
