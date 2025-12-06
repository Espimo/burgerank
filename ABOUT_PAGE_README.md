# Página "Sobre el Proyecto" - BurgeRank

## 📋 Descripción

Implementación completa de la página institucional "Sobre el Proyecto" para BurgeRank con 11 secciones, formularios de contacto, FAQs, prensa, y cumplimiento legal.

## 🗂️ Estructura de Archivos

### Componentes Principales
```
components/about/
├── hero-section.tsx                 # Sección hero con CTA (119 líneas)
├── about-us-section.tsx             # Misión, visión, valores (189 líneas)
├── how-it-works-section.tsx         # Proceso 4-step (155 líneas)
├── ranking-methodology-section.tsx  # Accordion metodología (203 líneas)
├── for-restaurants-section.tsx      # Beneficios para restaurantes (167 líneas)
├── restaurant-contact-form.tsx      # Formulario de restaurantes (186 líneas)
├── contact-section.tsx              # Formulario de contacto general (170 líneas)
├── social-links.tsx                 # Enlaces redes sociales (60 líneas)
├── faqs-section.tsx                 # FAQs con búsqueda y schema (220 líneas)
├── press-section.tsx                # Sección de prensa (230 líneas)
└── cookie-banner.tsx                # Banner GDPR compliant (270 líneas)
```

### Páginas Legales
```
app/legal/
├── terms/page.tsx                   # Términos y condiciones
├── privacy/page.tsx                 # Política de privacidad
└── cookies/page.tsx                 # Política de cookies
```

### Página Principal
```
app/about/page.tsx                   # Página principal con metadata (128 líneas)
```

### API Routes
```
app/api/contact/
├── general/route.ts                 # API para contacto general
└── restaurant/route.ts              # API para contacto de restaurantes
```

### Utilidades
```
lib/utils/send-email.ts              # Email service con templates (350+ líneas)
```

## ✨ Características Implementadas

### 1. **Hero Section** 🎯
- Animación de fondo con emoji de hamburguesa
- Gradiente overlay dinámico
- 2 CTA botones principales
- Grid de estadísticas
- Indicador de scroll animado
- Responsive design

### 2. **Sección Sobre Nosotros** 📖
- Historia y background
- Misión y visión con gradientes
- 4 valores principales con iconos
- Estadísticas clave
- Animaciones staggered

### 3. **Cómo Funciona** 🔄
- Proceso 4-step visual
- Flechas animadas entre pasos
- Sección de características
- Tarjetas con hover effects

### 4. **Metodología de Ranking** 📊
- Fórmula visual en estilo código
- Accordion expandible con 6 factores
- Detalles de cada factor
- Sección anti-manipulación
- Nota de transparencia

### 5. **Para Restaurantes** 🏪
- Lista de beneficios
- 4 tarjetas de estadísticas
- Formulario integrado (toggle)
- CTA destacado

### 6. **Formulario de Contacto General** 💬
- 4 campos (nombre, email, asunto, mensaje)
- Validación Zod + React Hook Form
- Estados de envío (idle, loading, success, error)
- Diseño responsive
- Honeypot anti-spam

### 7. **Formulario de Restaurantes** 🍔
- 7 campos (nombre restaurante, contacto, email, etc.)
- Validación Zod + honeypot
- Feedback visual inmediato
- Modal con información

### 8. **FAQs Section** ❓
- 10 preguntas pre-cargadas
- Búsqueda en tiempo real
- Accordion expandible
- JSON-LD Schema markup (para SEO)
- Categorías de preguntas

### 9. **Sección de Prensa** 📰
- Logos de medios
- 4 artículos destacados
- Press kit descargable
- Contacto para periodistas

### 10. **Cookie Banner** 🍪
- Compliant GDPR
- 3 tipos de cookies (esencial, analytics, marketing)
- Personalización de preferencias
- localStorage persistence
- Animaciones smooth

### 11. **Páginas Legales** ⚖️
- **Términos y Condiciones**: Derechos, responsabilidades, terminación
- **Política de Privacidad**: GDPR/CCPA compliant, derechos del usuario
- **Política de Cookies**: Detalles de cookies, control, retención

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego configura:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-app

ADMIN_EMAIL=admin@burgerank.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configuración de Email (Gmail)

1. Habilita autenticación de dos factores en tu cuenta de Google
2. Genera una [contraseña de aplicación](https://support.google.com/accounts/answer/185833)
3. Usa esa contraseña en `EMAIL_PASSWORD`

### 3. Instalación de Dependencias

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 📲 Uso de Componentes

### Importar en Otras Páginas

```tsx
import ContactSection from '@/components/about/contact-section'
import FAQsSection from '@/components/about/faqs-section'
import CookieBanner from '@/components/about/cookie-banner'

export default function MyPage() {
  return (
    <>
      <ContactSection />
      <FAQsSection />
      <CookieBanner />
    </>
  )
}
```

### Usar el Servicio de Email

```tsx
import { sendGeneralContactEmail, sendRestaurantContactEmail } from '@/lib/utils/send-email'

// Enviar email de contacto general
await sendGeneralContactEmail({
  name: 'Juan',
  email: 'juan@example.com',
  subject: 'soporte',
  message: 'Tengo una pregunta...'
})

// Enviar email de restaurante
await sendRestaurantContactEmail({
  restaurantName: 'Burger King',
  contactName: 'María',
  email: 'maria@burger.com',
  phone: '1234567890',
  address: 'Calle 1, 123',
  city: 'Madrid',
  message: 'Queremos registrarnos'
})
```

## 🎨 Estilos y Temas

### Colores Principales
- **Primario**: `amber-500` / `amber-600`
- **Secundario**: `orange-500` / `orange-600`
- **Neutrals**: `gray-*`
- **Acentos**: `blue-*`, `green-*`, `red-*`

### Animaciones Framer Motion
- **Stagger**: 0.2s entre elementos
- **Duraciones**: 0.3s - 0.5s
- **Easing**: ease-out por defecto

## 📱 Responsive Design

- **Mobile**: 375px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

Breakpoint principal: `md:` (768px)

## 🔍 SEO

### Meta Tags
- ✅ Title, Description
- ✅ OpenGraph (OG) tags
- ✅ Twitter Card
- ✅ Canonical URL
- ✅ Keywords

### Schema Markup
- ✅ FAQPage JSON-LD
- ✅ Organization schema (en footer)
- ✅ Structured data ready

### Sitemap
Agrega a `sitemap.ts`:
```
/about
/legal/terms
/legal/privacy
/legal/cookies
```

## 🛡️ Seguridad

### Validación
- ✅ Zod schemas en todas las formas
- ✅ Validación server-side en API routes
- ✅ Honeypot fields anti-spam

### Protección
- ✅ Rate limiting (implementar en producción)
- ✅ CSRF tokens (Next.js default)
- ✅ HTML encoding en emails
- ✅ XSS prevention (React default)

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_SECURE
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add ADMIN_EMAIL
vercel deploy
```

### Variables Críticas
Asegúrate de que estas variables estén configuradas:
- `EMAIL_USER` (requerido)
- `EMAIL_PASSWORD` (requerido)
- `ADMIN_EMAIL` (requerido)

## 📊 Analytics

### Tracking de Formularios
Agrega a tus eventos de analytics:
```typescript
// Al enviar formulario
gtag.event('contact_submitted', {
  type: 'general' | 'restaurant',
  subject: string,
})

// Al aceptar cookies
gtag.event('cookie_consent', {
  analytics: boolean,
  marketing: boolean,
})
```

## 🔗 Enlaces Internos

- Hero → `/app/burgers` (calificaciones)
- Hero → `/app/ranking` (ranking)
- Legal → `/legal/terms`, `/legal/privacy`, `/legal/cookies`
- Contact section → `#contact`
- Press → `press@burgerank.com`

## 📝 Checklist de Implementación

- [x] Hero section con animaciones
- [x] About us con misión/visión/valores
- [x] How it works 4-step
- [x] Ranking methodology accordion
- [x] For restaurants section
- [x] Formulario de contacto general
- [x] Formulario de restaurantes
- [x] Social links
- [x] FAQs con búsqueda
- [x] Prensa y media kit
- [x] Cookie banner GDPR
- [x] Página de términos
- [x] Página de privacidad
- [x] Página de cookies
- [x] Email service con templates
- [x] API routes para formularios
- [x] Schema markup JSON-LD
- [x] Responsive design completo

## 🐛 Troubleshooting

### Los emails no se envían
1. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` son correctos
2. Comprueba que `ADMIN_EMAIL` está configurado
3. En Gmail, habilita contraseñas de aplicación
4. Verifica los logs en console.error()

### Formularios no validan
1. Asegúrate que Zod está instalado
2. Verifica los mensajes de error en el navegador
3. Revisa que los schemas coincidan con los datos enviados

### Cookies no se persisten
1. Verifica que localStorage está habilitado
2. Comprueba que el banner se abre en primera visita
3. Revisa la tab "Application" en DevTools

### Animaciones lentas
1. Reduce `duration` en Framer Motion
2. Desactiva `whileInView` si hay muchos elementos
3. Usa `initial={false}` cuando no necesites animación inicial

## 📚 Documentación

- [Next.js App Router](https://nextjs.org/docs/app)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Soporte

Para preguntas o problemas:
- Email: support@burgerank.com
- Contacto: `/about#contact`
