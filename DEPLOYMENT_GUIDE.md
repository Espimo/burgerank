# 🚀 Deployment Guide - Página Sobre BurgeRank

## Pre-Deployment Checklist

- [ ] Todos los tests pasan: `npm run build`
- [ ] Variables de entorno configuradas
- [ ] Email service verificado
- [ ] Base de datos migrada
- [ ] SEO meta tags revisados
- [ ] Analytics integrado
- [ ] Legal pages revisadas
- [ ] CDN configurado para assets
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo

---

## 1. Vercel Deployment (Recomendado)

### 1.1 Configuración Inicial

```bash
npm install -g vercel
vercel login
```

### 1.2 Agregar Variables de Entorno

```bash
# Desde la carpeta del proyecto
vercel env add EMAIL_HOST smtp.gmail.com
vercel env add EMAIL_PORT 587
vercel env add EMAIL_SECURE false
vercel env add EMAIL_USER tu-email@gmail.com
vercel env add EMAIL_PASSWORD tu-app-password
vercel env add ADMIN_EMAIL admin@burgerank.com
vercel env add NEXT_PUBLIC_APP_URL https://burgerank.com
```

### 1.3 Deploy

```bash
vercel deploy --prod
```

### 1.4 Configurar Dominio

```bash
vercel domains add burgerank.com
```

---

## 2. Netlify Deployment

### 2.1 Setup

```bash
npm run build
npm install -g netlify-cli
netlify login
```

### 2.2 Crear netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/about"
  to = "/about"
  status = 200

[[redirects]]
  from = "/legal/*"
  to = "/legal/:splat"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2.3 Deploy

```bash
netlify deploy --prod
```

---

## 3. Self-Hosted (AWS, DigitalOcean, etc.)

### 3.1 Build

```bash
npm run build
npm install -g pm2
```

### 3.2 PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'burgerank-about',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      },
    },
  ],
}
```

### 3.3 Nginx Config

```nginx
upstream nextjs {
  server localhost:3000;
}

server {
  listen 80;
  server_name burgerank.com www.burgerank.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name burgerank.com www.burgerank.com;

  ssl_certificate /etc/letsencrypt/live/burgerank.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/burgerank.com/privkey.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Compression
  gzip on;
  gzip_types text/plain text/css text/javascript application/javascript application/json;

  location / {
    proxy_pass http://nextjs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Cache static files
  location /_next/static {
    expires 365d;
    add_header Cache-Control "public, immutable";
    proxy_pass http://nextjs;
  }

  location /public {
    expires 365d;
    add_header Cache-Control "public, immutable";
  }
}
```

### 3.4 SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d burgerank.com -d www.burgerank.com
```

### 3.5 Start Application

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

## 4. Docker Deployment

### 4.1 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
```

### 4.2 Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: always
```

### 4.3 Deploy

```bash
docker-compose up -d
```

---

## 5. Supabase Database Migration

### 5.1 Ejecutar Migraciones

```bash
# Local
supabase migration up

# Production
supabase db push --project-ref <project-id>
```

### 5.2 Verificar Tablas

```bash
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

Debería mostrar:
- `contact_messages`
- `restaurant_inquiries`
- `cookie_preferences`

---

## 6. Email Configuration (Production)

### Opción 1: Resend (Recomendado)

```typescript
// lib/utils/send-email.ts (actualizar)
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(data: EmailData) {
  const result = await resend.emails.send({
    from: `BurgeRank <onboarding@resend.dev>`,
    to: data.to,
    subject: data.subject,
    html: data.html,
  })
  return result
}
```

Variables de entorno:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Opción 2: SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendEmail(data: EmailData) {
  await sgMail.send({
    to: data.to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: data.subject,
    html: data.html,
  })
}
```

Variables de entorno:
```
SENDGRID_API_KEY=SG_xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@burgerank.com
```

---

## 7. CDN Configuration (Cloudflare)

### 7.1 Agregar Sitio

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add site → burgerank.com
3. Cambiar nameservers en registrador

### 7.2 Cache Rules

```
URL: /about/*
Cache level: Cache Everything
Browser TTL: 1 hour

URL: /legal/*
Cache level: Cache Everything
Browser TTL: 24 hours

URL: /api/contact/*
Cache level: Bypass
```

### 7.3 Page Rules

```
Patrón: /about
Minify: ON
Brotli Compression: ON

Patrón: /legal/*
Minify: ON
Cache TTL: 1 day
```

---

## 8. Monitoring & Analytics

### 8.1 Sentry Error Tracking

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 8.2 Google Analytics

Ya incluido en los componentes con `gtag` (si está configurado)

### 8.3 LogRocket (Session Recording)

```bash
npm install logrocket
```

---

## 9. Post-Deployment Verification

### 9.1 Health Checks

```bash
# Verificar página de about
curl -I https://burgerank.com/about

# Verificar API
curl -X POST https://burgerank.com/api/contact/general \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "soporte",
    "message": "Test message"
  }'

# Verificar legal pages
curl -I https://burgerank.com/legal/terms
curl -I https://burgerank.com/legal/privacy
curl -I https://burgerank.com/legal/cookies
```

### 9.2 SEO Check

- [Google Search Console](https://search.google.com/search-console)
- [Google Page Speed Insights](https://pagespeed.web.dev)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### 9.3 Security Check

- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [OWASP Check](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Security Headers](https://securityheaders.com)

---

## 10. Rollback Plan

Si algo falla en producción:

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker-compose down
git revert <commit-hash>
docker-compose up -d
```

### PM2
```bash
pm2 revert <app-name>
```

---

## 11. Performance Optimization

### 11.1 Image Optimization

```tsx
import Image from 'next/image'

<Image
  src="/burger.jpg"
  alt="Hamburguesa"
  width={400}
  height={300}
  quality={80}
  priority={false}
/>
```

### 11.2 Code Splitting

Ya manejado automáticamente por Next.js con dynamic imports

### 11.3 Database Optimization

```sql
-- Crear índices adicionales
CREATE INDEX idx_contact_city ON restaurant_inquiries(city);
CREATE INDEX idx_contact_date_range ON contact_messages(created_at DESC);
```

---

## 12. Maintenance Schedule

- **Daily**: Monitoring de errors y performance
- **Weekly**: Revisar analytics y feedback
- **Monthly**: Update dependencias y security patches
- **Quarterly**: Backup de base de datos
- **Annually**: Security audit y performance review

---

## 📞 Support & Troubleshooting

### Common Issues

**Email no se envía**
- Verificar credenciales en .env
- Revisar logs en Sentry o console
- Testing local con `npm run dev`

**API returns 500**
- Verificar base de datos
- Check email configuration
- Review server logs

**Animaciones lentas**
- Deshabilitar en producción si es necesario
- Usar `initial={false}` en Framer Motion
- Optimizar imágenes

---

## ✅ Final Checklist

- [ ] Build local exitoso: `npm run build`
- [ ] Variables de entorno en producción
- [ ] Base de datos migrada
- [ ] Email service probado
- [ ] SSL certificate activo
- [ ] Dominio apuntando correctamente
- [ ] CDN configurado
- [ ] Monitoring activo
- [ ] Backup automatizado
- [ ] Team notificado del deploy

---

**Deployed successfully! 🎉**
