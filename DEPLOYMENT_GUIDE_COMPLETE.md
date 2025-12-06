# 🚀 DEPLOYMENT GUIDE - BurgeRank

**Estado**: Producción Ready  
**Última Actualización**: 2024  
**Aplicable a**: BurgeRank v1.0

---

## 📋 TABLA DE CONTENIDOS

1. [Pre-Deployment Checklist](#pre-deployment)
2. [Local Setup](#local-setup)
3. [Deployment a Vercel](#vercel)
4. [Deployment a Self-Hosted](#self-hosted)
5. [Configuración de Supabase](#supabase-config)
6. [Variables de Entorno](#env-config)
7. [Database Setup](#database-setup)
8. [Post-Deployment Tests](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🔍 <a name="pre-deployment"></a> Pre-Deployment Checklist

### Antes de Deployar

- [ ] Code review completado
- [ ] Todos los tests pasan
- [ ] No hay console.errors en development
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Imágenes optimizadas
- [ ] Performance audit completado
- [ ] Security review completado
- [ ] Backups de BD realizados
- [ ] SSL certificate listo (si es self-hosted)

### Verificar Archivos Clave

```bash
# Verificar que existen todos los archivos críticos
✅ .env.local (NUNCA incluir en git)
✅ next.config.ts
✅ tsconfig.json
✅ tailwind.config.ts
✅ package.json
✅ middleware.ts
✅ app/layout.tsx
✅ lib/supabase/client.ts
✅ lib/supabase/server.ts
```

---

## 🏠 <a name="local-setup"></a> Local Setup (Primera Vez)

### Paso 1: Clonar Repositorio

```bash
git clone https://github.com/tuusuario/burgerank_project.git
cd burgerank_project
```

### Paso 2: Instalar Dependencias

```bash
# Usar Node 18+ (verificar con `node --version`)
npm install

# O si necesitas clean install:
rm -rf node_modules package-lock.json
npm install
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local

# Editar con tus credenciales Supabase
nano .env.local  # o abre en tu editor favorito
```

**Contenido de `.env.local`**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL (for local dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# (Optional) Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Paso 4: Ejecutar Migraciones de BD

**Opción A: Python (Recomendado)**

```bash
# Instalar dependencias
pip install psycopg2-binary

# Ejecutar script
python run_migrations.py
```

**Opción B: PowerShell (Windows)**

```powershell
# Ejecutar script
.\run_migrations.ps1 -Password "tu_password_super_seguro"
```

**Opción C: Manual (SQL Editor de Supabase)**

1. Ir a https://app.supabase.com
2. Dashboard → SQL Editor
3. Crear query nueva
4. Copiar contenido de `supabase/migrations/001_schema.sql`
5. Ejecutar
6. Repetir para archivos 002-006

### Paso 5: Verificar Setup

```bash
# Opción 1: Script Python
python check_status.py

# Opción 2: Script Bash
bash verify.sh

# Opción 3: Script Batch (Windows)
verify.bat
```

**Resultado esperado**:
```
✅ Node.js version: v18.x.x o superior
✅ npm version: 9.x.x o superior
✅ Database: 12 tablas creadas
✅ .env.local: Configurado
```

### Paso 6: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Acceder a `http://localhost:3000`

---

## 🌐 <a name="vercel"></a> Deployment a Vercel (RECOMENDADO)

### Paso 1: Preparar Repositorio

```bash
# Asegurarse que git está inicializado
git init

# Agregar remote si no existe
git remote add origin https://github.com/tuusuario/burgerank_project.git

# Push a main branch
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Importante**: `.env.local` NO debe estar en git

### Paso 2: Crear Proyecto en Vercel

1. Ir a https://vercel.com
2. Hacer login (o crear cuenta)
3. Hacer click "New Project"
4. Seleccionar repositorio de GitHub
5. Seleccionar `burgerank_project`
6. Hacer click "Import"

### Paso 3: Configurar Variables de Entorno

En Vercel Dashboard:

1. Ir a Project Settings → Environment Variables
2. Agregar variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (opcional)
```

### Paso 4: Configurar Base de Datos

**IMPORTANTE**: Antes de deployar, asegurarse que la BD esté migrada

```bash
# En local, ejecutar:
python run_migrations.py

# O en Supabase SQL Editor:
# Ejecutar los 6 archivos SQL en orden
```

### Paso 5: Deploy

```bash
# Hacer click "Deploy" en Vercel
# O desde terminal:
npm install -g vercel
vercel
```

### Paso 6: Verificar Deployment

```bash
# Vercel te da una URL: https://burgerank-xxx.vercel.app
# Verificar que:
✅ Landing page carga
✅ Login funciona
✅ Puedes crear cuenta
✅ Redirección a /ranking funciona
✅ Búsqueda funciona (si hay datos)
```

### Paso 7: Configurar Dominio Personalizado (Opcional)

En Vercel Dashboard:

1. Project → Settings → Domains
2. Agregar dominio: `burgerank.com`
3. Seguir instrucciones de DNS
4. Vercel maneja SSL automáticamente

---

## 🖥️ <a name="self-hosted"></a> Deployment a Self-Hosted

### Requisitos del Servidor

- Ubuntu 20.04 LTS o similar
- Node.js 18+
- npm 9+
- Docker (opcional)
- Nginx o Apache (reverse proxy)
- SSL certificate (Let's Encrypt)
- 2GB RAM mínimo
- 10GB disk mínimo

### Paso 1: Conectar al Servidor

```bash
ssh user@tu-servidor-ip
```

### Paso 2: Instalar Dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar git
sudo apt install -y git

# Verificar versiones
node --version  # v18.x.x
npm --version   # 9.x.x
```

### Paso 3: Clonar Proyecto

```bash
# Crear carpeta
sudo mkdir -p /var/www/burgerank
sudo chown $USER:$USER /var/www/burgerank
cd /var/www/burgerank

# Clonar
git clone https://github.com/tuusuario/burgerank_project.git .
```

### Paso 4: Configurar Variables de Entorno

```bash
# Crear archivo .env.local
nano .env.local

# Pegar contenido:
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NODE_ENV=production
```

### Paso 5: Build

```bash
cd /var/www/burgerank

# Instalar dependencias
npm install

# Build
npm run build

# Verificar que build fue exitoso
ls -la .next/
```

### Paso 6: Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Iniciar app
pm2 start npm --name "burgerank" -- start

# Hacer que se reinicie con el servidor
pm2 startup
pm2 save
```

### Paso 7: Configurar Nginx

```bash
# Crear config
sudo nano /etc/nginx/sites-available/burgerank
```

Contenido:
```nginx
upstream burgerank {
    server localhost:3000;
}

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://burgerank;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/burgerank /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 8: SSL Certificate (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install -y certbot python3-certbot-nginx

# Generar certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Paso 9: Verificar Deployment

```bash
# Ver estado de la app
pm2 status

# Ver logs
pm2 logs burgerank

# Verificar en navegador:
# https://tu-dominio.com
```

---

## ⚙️ <a name="supabase-config"></a> Configuración de Supabase

### Crear Proyecto Supabase

1. Ir a https://supabase.com
2. Hacer login
3. Crear nuevo proyecto
4. Llenar datos:
   - Project Name: `burgerank`
   - Password: Contraseña fuerte
   - Region: Más cercana a tus usuarios
5. Crear proyecto

### Copiar Credenciales

En Supabase Dashboard:

1. Settings → API
2. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role/secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Configurar Auth

En Supabase Dashboard:

1. Auth → Providers
2. Email habilitado por defecto
3. (Opcional) Agregar OAuth:
   - Google
   - GitHub
   - Discord

### Ejecutar Migraciones

```bash
python run_migrations.py
```

Verificar que 12 tablas existen:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Resultado esperado (12 tablas):
```
 profiles
 restaurants
 burgers
 reviews
 review_tags
 review_images
 user_badges
 rewards
 user_rewards
 burger_matches
 follows
 user_preferences
```

---

## 🔑 <a name="env-config"></a> Variables de Entorno

### Development (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Production

```env
# Supabase (MISMO QUE DEVELOPMENT)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Site
NEXT_PUBLIC_SITE_URL=https://burgerank.com
NODE_ENV=production

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# (Opcional) Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## 🗄️ <a name="database-setup"></a> Database Setup

### Opción 1: Automated (Python)

```bash
python run_migrations.py
```

### Opción 2: Automated (PowerShell)

```powershell
.\run_migrations.ps1 -Password "tu_password"
```

### Opción 3: Manual SQL

En Supabase SQL Editor, ejecutar en orden:

1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_functions.sql`
3. `supabase/migrations/003_triggers.sql`
4. `supabase/migrations/004_rls_policies.sql`
5. `supabase/migrations/005_seed_data.sql`
6. `supabase/migrations/006_materialized_views.sql`

### Verificar Migraciones

```sql
-- Contar tablas
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Debería ser: 12

-- Ver triggers
SELECT COUNT(*) as trigger_count 
FROM information_schema.triggers;

-- Ver funciones
SELECT COUNT(*) as function_count 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

---

## ✅ <a name="testing"></a> Post-Deployment Tests

### Test 1: Landing Page

```bash
curl -I https://burgerank.com
# Esperado: 200 OK
```

### Test 2: Login

1. Ir a https://burgerank.com/login
2. Intentar login (debería fallar sin cuenta)
3. Verificar que formulario valida

### Test 3: Registro

1. Ir a https://burgerank.com/register
2. Crear cuenta: `test@example.com` / `password123` / `testuser` / `Madrid`
3. Verificar que se crea perfil en BD

### Test 4: Autenticación

```sql
-- Verificar que usuario se creó
SELECT id, username, email FROM profiles 
WHERE username = 'testuser';
```

### Test 5: Redirección

1. Loguearse con test@example.com
2. Debería redirigir a /ranking
3. Debería cargar main-layout con header y bottom-nav

### Test 6: Búsqueda

1. Ir a /search
2. Escribir algo (si hay datos seed)
3. Debería mostrar resultados

### Test 7: Rating

1. Ir a /rate
2. Buscar una hamburguesa
3. Llenar formulario
4. Enviar
5. Verificar que se guarda en BD

### Test 8: Perfil

1. Ir a /profile
2. Debería mostrar datos del usuario
3. Puntos, nivel, badges

### Test 9: Performance

```bash
# Usar Lighthouse
npm install -g lighthouse

lighthouse https://burgerank.com --view
```

Objetivos:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Test 10: Seguridad

```bash
# Verificar que .env no está en repo
git log --all --full-history -- .env.local

# Debería estar vacío

# Verificar HTTPS
curl -I https://burgerank.com | grep https

# Debería estar forzado
```

---

## 🐛 <a name="troubleshooting"></a> Troubleshooting

### Problema: "Build fails with dependencies error"

```bash
# Solución
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problema: "Supabase connection error"

```bash
# Verificar variables de entorno
cat .env.local | grep SUPABASE

# Verificar credenciales en Supabase Dashboard
# Settings → API

# Reintentar conexión
npm run dev
```

### Problema: "Tables not found in database"

```bash
# Ejecutar migraciones
python run_migrations.py

# Verificar en Supabase SQL Editor:
SELECT * FROM profiles;
```

### Problema: "Login not working"

```bash
# Verificar que auth está habilitado
# Supabase → Auth → Users

# Verificar middleware:
# middleware.ts debe proteger rutas

# Revisar logs
npm run dev  # Ver console
```

### Problema: "Images not loading"

```bash
# Verificar next.config.ts
# Debe permitir supabase.co como dominio remoto

# Verificar que images están en storage
# Supabase → Storage → avatars / burger-photos
```

### Problema: "Performance issues"

```bash
# Analizan Next.js build
npm run build
npm start

# Usar Next.js Analytics:
# Vercel Dashboard → Analytics

# Optimizar imágenes:
# Use next/image

# Implementar ISR:
# revalidate: 3600 (en pages si es necesario)
```

### Problema: "Build takes too long"

```bash
# Verificar bundle size
npm install -g webpack-bundle-analyzer

# Optimizar dependencias
npm audit fix

# Limpiar cache
rm -rf .next
npm run build
```

---

## 📊 Monitoreo en Producción

### Configurar Alertas en Vercel

1. Dashboard → Settings → Alerts
2. Agregar:
   - Build failed
   - Deployment failed
   - Error rate high

### Configurar Sentry (Opcional)

```bash
npm install @sentry/nextjs

# Crear archivo sentry.client.config.ts
# Crear archivo sentry.server.config.ts

# Configurar en .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx
```

### Logs

**Vercel**: Dashboard → Functions → Logs

**Self-hosted**:
```bash
pm2 logs burgerank
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test (si tienes tests)
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📋 Checklist Final

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada (12 tablas verificadas)
- [ ] Build compila sin errores
- [ ] Tests pasan
- [ ] Performance audit ✓
- [ ] Security review ✓
- [ ] SSL/HTTPS funciona
- [ ] Logs configurados
- [ ] Backups automáticos (Supabase)
- [ ] Monitoreo activo
- [ ] Team notificado del deploy
- [ ] Rollback plan documentado

---

## 🚀 Estás Listo

Tu aplicación BurgeRank está lista para producción.

**Próximos Pasos**:
1. Deploy a Vercel (recomendado) o Self-hosted
2. Monitorear los primeros días
3. Recopilar feedback de usuarios
4. Iterar sobre mejoras

**Soporte**:
- Documentación: Este archivo
- Logs: Vercel Dashboard o `pm2 logs`
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Generado**: 2024  
**Versión**: 1.0  
**Estado**: Listo para Producción
