# 📊 BURGERANK - DOCUMENTO 360° DEL PROYECTO

## 🎯 RESUMEN EJECUTIVO

**BurgeRank** es una plataforma web comunitaria de ranking y valoración de hamburguesas que conecta a entusiastas de la comida con los mejores restaurantes, mientras genera ingresos mediante enlaces de afiliación y descuentos exclusivos.

---

## 1. VISIÓN GENERAL DEL NEGOCIO

### 1.1 Propuesta de Valor

BurgeRank resuelve tres problemas clave:

1. **Para Consumidores**: Imposibilidad de encontrar hamburguesas de calidad basándose en opiniones fiables y criterios objetivos
2. **Para Restaurantes**: Falta de visibilidad y capacidad de atraer clientes cualificados
3. **Para la Plataforma**: Monetización sin comprometer la experiencia del usuario

### 1.2 Misión

Crear la comunidad definitiva de amantes de las hamburguesas en España, proporcionando un ranking transparente, basado en algoritmos avanzados y opiniones verificadas, mientras generamos valor para usuarios, restaurantes y la plataforma.

---

## 2. BUSINESS MODEL CANVAS

### 📦 SEGMENTOS DE CLIENTES

**Usuarios Finales (B2C)**
- **Burger Fans**: Consumidores casuales que buscan recomendaciones (0-100 puntos)
- **Burger Lovers**: Entusiastas activos que valoran regularmente (101-300 puntos)
- **Burger Obsessed**: Críticos expertos con alto compromiso (+300 puntos)

**Restaurantes (B2B)**
- Restaurantes independientes de hamburguesas
- Cadenas pequeñas/medianas buscando visibilidad
- Nuevos establecimientos que necesitan tracción inicial

**Plataformas de Delivery (B2B2C)**
- Uber Eats, Glovo, Just Eat, Deliveroo
- Plataformas de reservas (El Tenedor)

### 💰 FUENTES DE INGRESOS

**Fase 1 - Monetización Actual (Implementada)**
1. **Afiliación por Click**: 
   - Comisiones por cada pedido generado via enlaces de afiliación
   - Estimado: €0.50 - €3.00 por conversión
   - Proyección: 10,000 clicks/mes → €5,000-€15,000/mes

2. **Descuentos Patrocinados**:
   - Restaurantes pagan por destacar descuentos exclusivos
   - €50-€200/mes por restaurante
   - Proyección: 20 restaurantes → €1,000-€4,000/mes

**Fase 2 - Futuro (No implementada)**
3. **Membresía Premium** (€4.99/mes):
   - Sin publicidad
   - Acceso anticipado a nuevos restaurantes
   - Descuentos exclusivos adicionales
   - Análisis avanzado de preferencias

4. **Perfiles Premium para Restaurantes** (€99-€299/mes):
   - Posición destacada en búsquedas
   - Estadísticas avanzadas
   - Gestión de promociones
   - Respuesta a valoraciones

5. **Publicidad Display**:
   - Banners nativos (futuro)
   - Contenido patrocinado

### 🎁 PROPUESTAS DE VALOR

**Para Usuarios**
- ✅ Ranking algorítmico avanzado (Bayesian + Wilson Score)
- ✅ Carousel de burgers destacadas (lo mejor curado manualmente)
- ✅ Sistema de gamificación (puntos, badges, categorías)
- ✅ Valoraciones granulares (pan, carne, toppings, salsa)
- ✅ Descuentos exclusivos de la comunidad
- ✅ Historial personal y top 3 hamburguesas

**Para Restaurantes**
- 🔗 Tráfico cualificado de comensales interesados
- 🌟 Posibilidad de aparecer en carousel de destacados (máxima visibilidad)
- 📊 Visibilidad basada en calidad real, no en pago
- 🎯 Segmentación por ciudad y preferencias
- 💬 Feedback directo de clientes

**Para Plataformas de Delivery**
- 🚀 Conversiones de alta intención
- 📈 Tráfico orgánico desde una comunidad comprometida

### 🤝 CANALES

**Adquisición de Usuarios**
1. **Orgánico**: SEO en búsquedas locales ("mejores hamburguesas Madrid")
2. **Redes Sociales**: Instagram, TikTok (contenido de hamburguesas)
3. **Referidos**: Sistema de compartir (implementado con ShareButton)
4. **Partnerships**: Colaboraciones con foodbloggers e influencers

**Distribución**
- Web responsive (mobile-first)
- PWA (Progressive Web App) - futuro

### 👥 RELACIONES CON CLIENTES

**Usuarios**
- Comunidad self-service
- Notificaciones push de nuevas hamburguesas/logros
- Gamificación para retención (badges, niveles)

**Restaurantes**
- Onboarding asistido (panel de admin)
- Dashboard de estadísticas
- Soporte directo

### 💪 RECURSOS CLAVE

**Tecnológicos**
- Next.js 16 + React 19 (frontend)
- Supabase + PostgreSQL (backend/BDD)
- Vercel (hosting y CI/CD)
- Sistema de algoritmos de ranking propietario

**Humanos**
- Desarrollador full-stack (tú)
- Moderadores de contenido (futuro)
- Community manager (futuro)

**Datos**
- Base de datos de 120+ hamburguesas
- Múltiples ciudades (Madrid, Barcelona, Valencia, Sevilla, Bilbao)
- Valoraciones verificadas con tickets

### 🔧 ACTIVIDADES CLAVE

1. **Desarrollo y Mantenimiento**: Mejora continua de la plataforma
2. **Curación de Contenido**: Aprobación de restaurantes y hamburguesas
3. **Gestión de Afiliaciones**: Negociación con plataformas de delivery
4. **Growth Marketing**: Adquisición de usuarios y restaurantes
5. **Moderación**: Control de calidad de valoraciones

### 🤝 SOCIOS CLAVE

**Actuales**
- Uber Eats, Glovo, Just Eat, Deliveroo (afiliación)
- El Tenedor (reservas)

**Futuros**
- Foodbloggers e influencers gastronómicos
- Asociaciones de restauradores
- Medios gastronómicos

### 💸 ESTRUCTURA DE COSTES

**Costes Fijos**
- Hosting Vercel: €0-€20/mes (escala con uso)
- Supabase: €0-€25/mes (escala con uso)
- Dominio: €12/año

**Costes Variables**
- Comisiones de afiliación pagadas: 0% (cobras comisión, no pagas)
- Marketing digital: Variable según fase de crecimiento
- Soporte al cliente: Escala con usuarios

**Costes Futuros**
- Equipo de moderación
- Marketing y publicidad
- Infraestructura adicional

---

## 3. ARQUITECTURA TÉCNICA

### 3.1 Stack Tecnológico

```
Frontend:
├── Next.js 16 (App Router)
├── React 19 (Server Components)
├── TypeScript 5
├── Tailwind CSS 4
├── Framer Motion (animaciones)
└── Radix UI (componentes accesibles)

Backend:
├── Supabase
│   ├── PostgreSQL (base de datos)
│   ├── Auth (autenticación)
│   ├── RLS (Row Level Security)
│   └── Edge Functions
└── Next.js API Routes

Deployment:
├── Vercel (hosting + CI/CD automático)
├── GitHub (control de versiones)
└── Supabase Cloud (BaaS)

Libraries Clave:
├── @supabase/supabase-js (cliente)
├── zustand (gestión de estado global)
├── react-hook-form + zod (formularios + validación)
├── recharts (gráficos)
└── date-fns (manejo de fechas)
```

### 3.2 Modelo de Datos

```sql
TABLAS PRINCIPALES:

users (Usuarios)
├── id (UUID, PK)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── points (INT) → puntos acumulados
├── category (VARCHAR) → Burger Fan | Lover | Obsessed
├── is_admin (BOOLEAN)
└── public_profile (BOOLEAN)

cities (Ciudades)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
└── country (VARCHAR)

restaurants (Restaurantes)
├── id (UUID, PK)
├── name (VARCHAR)
├── city_id (UUID, FK → cities)
├── address, phone, hours
├── average_rating (DECIMAL)
├── total_ratings (INT)
├── status (VARCHAR) → pending | approved | rejected
├── delivery_url, reservation_url, website
└── banner_url, logo_url

burgers (Hamburguesas)
├── id (UUID, PK)
├── name (VARCHAR)
├── restaurant_id (UUID, FK → restaurants)
├── city_id (UUID, FK → cities)
├── description (TEXT)
├── image_url (TEXT)
├── average_rating (DECIMAL)
├── total_ratings (INT)
├── ranking_position (INT) → posición en el ranking
├── ranking_score (DECIMAL) → puntuación calculada
├── bayesian_score (DECIMAL) → Bayesian Average
├── wilson_score (DECIMAL) → Wilson Score Lower Bound
├── is_in_ranking (BOOLEAN)
├── is_featured (BOOLEAN) → si está en el carousel destacado (máximo 3)
├── featured_order (INT) → posición en carousel (1, 2, 3 | NULL si no featured)
├── tags (TEXT[]) → array de etiquetas
├── type (VARCHAR) → premium | clásica | doble | vegana
└── status (VARCHAR) → pending | approved | rejected

ratings (Valoraciones)
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── burger_id (UUID, FK → burgers)
├── overall_rating (INT 1-5) → calificación general
├── pan_rating (INT 1-3)
├── carne_rating (INT 1-3)
├── toppings_rating (INT 1-3)
├── salsa_rating (INT 1-3)
├── price (DECIMAL)
├── comment (TEXT)
├── has_ticket (BOOLEAN) → valoración verificada
├── ticket_url (TEXT)
├── consumption_type (VARCHAR) → local | delivery
├── appetizers (TEXT[]) → fries, nachos, chicken, rings
├── points_awarded (INT) → puntos ganados por esta valoración
└── UNIQUE(user_id, burger_id) → 1 valoración por usuario/burger

badges (Insignias)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── description (TEXT)
├── emoji (VARCHAR)
├── requirement_type (VARCHAR) → first_rating | total_ratings | cities_visited | average_rating
└── requirement_value (INT)

user_badges (Insignias desbloqueadas)
├── user_id (UUID, FK → users)
├── badge_id (UUID, FK → badges)
├── unlocked_at (TIMESTAMP)
└── UNIQUE(user_id, badge_id)

rewards (Recompensas canjeables)
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── emoji (VARCHAR)
└── cost_points (INT) → puntos necesarios

user_rewards (Recompensas canjeadas)
├── user_id (UUID, FK → users)
├── reward_id (UUID, FK → rewards)
├── redeemed_at (TIMESTAMP)
└── created_at (TIMESTAMP)

notifications (Notificaciones)
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── title (VARCHAR)
├── description (TEXT)
├── type (VARCHAR) → level_up | badge_unlocked | new_burger
├── icon_emoji (VARCHAR)
└── is_read (BOOLEAN)

-- MONETIZACIÓN (Fase 1)

affiliate_platforms (Plataformas de afiliación)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE) → uber_eats | glovo | just_eat
├── display_name (VARCHAR) → "Uber Eats"
├── type (VARCHAR) → delivery | reservation | direct
├── icon_emoji (VARCHAR)
├── default_priority (INT) → menor = mayor prioridad
├── cta_text (VARCHAR) → "Pedir en Uber Eats"
├── color (VARCHAR) → color del botón
└── is_active (BOOLEAN)

restaurant_affiliate_links (Links de afiliación)
├── id (UUID, PK)
├── restaurant_id (UUID, FK → restaurants)
├── platform_id (UUID, FK → affiliate_platforms)
├── affiliate_url (TEXT) → URL con parámetros de tracking
├── custom_priority (INT) → sobrescribe default_priority
├── custom_cta_text (VARCHAR)
├── is_active (BOOLEAN)
├── commission_rate (DECIMAL)
└── UNIQUE(restaurant_id, platform_id)

restaurant_discounts (Descuentos activos)
├── id (UUID, PK)
├── restaurant_id (UUID, FK → restaurants)
├── title (VARCHAR) → "10% exclusivo BurgeRank"
├── description (TEXT)
├── discount_code (VARCHAR) → "BURGERANK10"
├── discount_type (VARCHAR) → percentage | fixed_amount | free_delivery
├── discount_value (DECIMAL)
├── valid_from (TIMESTAMP)
├── valid_until (TIMESTAMP)
├── platform_id (UUID, FK → affiliate_platforms)
├── is_active (BOOLEAN)
└── is_exclusive (BOOLEAN) → exclusivo de BurgeRank

affiliate_clicks (Tracking de clicks)
├── id (UUID, PK)
├── restaurant_id (UUID, FK → restaurants)
├── platform_id (UUID, FK → affiliate_platforms)
├── affiliate_link_id (UUID, FK → restaurant_affiliate_links)
├── discount_id (UUID, FK → restaurant_discounts)
├── user_id (UUID, FK → users, NULLABLE)
├── source_page (VARCHAR) → ranking | restaurant | burger_detail
├── source_burger_id (UUID, FK → burgers, NULLABLE)
├── session_id (VARCHAR) → para agrupar clicks de misma sesión
└── clicked_at (TIMESTAMP)
```

### 3.3 Algoritmo de Ranking Avanzado

El sistema de ranking utiliza una combinación ponderada de tres algoritmos:

```typescript
Ranking Score = (Bayesian × 0.50) + (Wilson × 0.30) + (Average × 0.20)

// 1. Bayesian Average (evita burgers con pocas valoraciones)
Bayesian = (C × m + n × R) / (C + n)
donde:
  C = confidence threshold (25 valoraciones)
  m = rating promedio global (ej: 4.2)
  n = número de valoraciones de esta burger
  R = rating promedio de esta burger

// 2. Wilson Score Lower Bound (confianza estadística 95%)
Wilson = límite inferior del intervalo de confianza
  - Considera % de ratings positivos (4-5 estrellas)
  - Penaliza inconsistencia
  - Fórmula matemática compleja (ver ADD_RANKING_SYSTEM.sql)

// 3. Average Rating (peso menor, 20%)
Average = promedio simple de overall_rating

FACTORES ADICIONALES:
- Verification Factor: +10% si >50% tienen ticket
- Novelty Boost: +10% si es nueva (< 30 días)
- Anti-gaming: detecta patrones sospechosos
```

**Ventajas del sistema**:
- ✅ Las burgers con pocas valoraciones no dominan el ranking
- ✅ Premia consistencia, no solo valoraciones altas
- ✅ Protege contra manipulación y fake reviews
- ✅ Promueve nuevas hamburguesas temporalmente
- ✅ Totalmente transparente y replicable

---

## 4. WORKFLOW DE USUARIO

### 4.1 Flujo de Registro y Gamificación

```
1. Usuario Nuevo (No Registrado)
   ├── Ve ranking completo (lectura)
   ├── Intenta valorar → Modal "Regístrate para valorar"
   └── Click "Valorar" → Redirección a /auth/signup

2. Registro
   ├── Email + Password + Username
   ├── Verificación de email (link en email)
   ├── Auto-creación de perfil en tabla users
   └── Asignación de categoría inicial: "Burger Fan" (0 puntos)

3. Primera Valoración
   ├── Wizard de 5 pasos
   ├── Puntos ganados: 10-15 base + bonos
   │   ├── +5 si sube ticket (verificada)
   │   ├── +3 si añade foto
   │   └── +2 si escribe comentario >50 caracteres
   ├── Desbloqueo de Badge "Primer Rating" ⭐
   └── Notificación: "¡Has ganado 15 puntos!"

4. Progresión de Categoría
   ├── 0-100 puntos: "Burger Fan" 🍔
   ├── 101-300 puntos: "Burger Lover" ❤️
   └── 301+: "Burger Obsessed" 🔥

5. Sistema de Badges (7 disponibles)
   ├── Primer Rating (1 valoración)
   ├── Crítico Ardiente (10 valoraciones)
   ├── Maestro de Sabores (25 valoraciones)
   ├── Coleccionista (50 valoraciones)
   ├── Explorador de Ciudades (5 ciudades)
   ├── Paladar Exigente (promedio 4.5+)
   └── Crítico Leyenda (100 valoraciones)

6. Sistema de Recompensas (5 tipos)
   ├── 10% Descuento (50 puntos)
   ├── Bebida Gratis (75 puntos)
   ├── Aperitivo Gratis (100 puntos)
   ├── Hamburguesa Gratis (150 puntos)
   └── 50% Descuento (200 puntos)
```

### 4.2 Wizard de Valoración (5 Pasos)

```
/rate

PASO 0: CONTEXTO
├── ¿Dónde comiste? → local | delivery
├── ¿Qué pediste de aperitivo?
│   └── Checkboxes: Papas | Nachos | Alitas | Aros de cebolla | Nada
└── [Siguiente →]

PASO 1: SELECCIONAR HAMBURGUESA
├── Buscador inteligente (SmartSearch)
│   ├── Filtro por nombre de burger
│   ├── Filtro por restaurante
│   └── Filtro por ciudad
├── Grid de cards de burgers
│   ├── Imagen (si existe)
│   ├── Nombre
│   ├── Restaurante
│   ├── Rating actual
│   └── [Seleccionar]
├── Botón "No encuentro mi burger"
│   └── Modal para añadir nueva burger (pending → admin approval)
└── [Siguiente →]

PASO 2: VALORAR COMPONENTES (granular)
├── Overall Rating (1-5 estrellas) → grande, principal
├── Pan (1-3 estrellas) → 🥖
├── Carne (1-3 estrellas) → 🥩
├── Toppings (1-3 estrellas) → 🧀🥓🥬
├── Salsa (1-3 estrellas) → 🍯
└── [Siguiente →]

PASO 3: DETALLES ADICIONALES
├── Precio (€) → input numérico
├── Comentario (opcional) → textarea
├── ¿Tienes el ticket?
│   ├── Checkbox "Sí, tengo ticket"
│   └── Si sí → +5 puntos bonus (verificación)
└── [Siguiente →]

PASO 4: CONFIRMACIÓN Y ÉXITO
├── Resumen visual de la valoración
├── Animación de éxito
├── Mostrar puntos ganados: "+15 puntos 🎉"
├── Mostrar badges desbloqueados (si hay)
├── Botones:
│   ├── [Ver en Ranking]
│   ├── [Valorar Otra]
│   └── [Ir a Perfil]
└── Auto-redirección a /ranking después de 5 segundos
```

### 4.3 Navegación Principal (5 secciones)

```
TOP BAR (Todas las páginas)
├── Logo "BurgeRank" (link a /ranking)
├── Notificaciones (campana) → Panel lateral
├── Perfil (avatar) → Menu dropdown
└── Hamburger Menu → Sidebar

BOTTOM NAV (Mobile)
├── 🏆 Ranking → /ranking
├── ⭐ Valorar → /rate
├── 👤 Perfil → /profile
└── ℹ️ Info → /about

SIDEBAR (Desktop/Tablet)
├── Perfil rápido (avatar, nombre, puntos)
├── 🏆 Ver Ranking
├── ⭐ Valorar Burger
├── 👤 Mi Perfil
├── ℹ️ Acerca de
├── ⚙️ Configuración
├── (Si admin) 🔧 Panel Admin
└── 🚪 Cerrar Sesión
```

---

## 5. PÁGINAS PRINCIPALES

### 5.1 `/ranking` - Ranking Principal

**Propósito**: Mostrar todas las hamburguesas ordenadas por ranking_score

**Componentes**:

#### 🌟 Carousel de Destacados (Featured)
- **Ubicación**: Parte superior de la página, antes del ranking
- **Contenido**: 3 hamburguesas destacadas seleccionadas manualmente desde el panel admin
- **Características**:
  - Slider automático con rotación cada 5 segundos
  - Navegación manual (flechas izq/der o dots)
  - Cards grandes con:
    - Imagen principal de la burger
    - Badge especial "DESTACADA" 🌟
    - Nombre de la burger
    - Restaurante
    - Rating con estrellas
    - Botón CTA "Ver más"
  - Animaciones suaves de transición
  - Responsive (1 slide en mobile, 3 en desktop)
- **Gestión**: Controlado desde panel admin (ver sección 5.6)
- **Criterio de selección**: Administrador elige manualmente las 3 burgers más interesantes (nuevas, populares, promociones especiales)
- **Order**: Campo `featured_order` determina la posición (1, 2, 3)

#### 🔍 Filtros:
  - Ciudad (dropdown: Madrid, Barcelona, Valencia, Sevilla, Bilbao, Todas)
  - Tipo (dropdown: Premium, Clásica, Doble, Vegana)
  - Búsqueda por texto (SmartSearch)
  - Ordenamiento: Ranking | Nuevas | Tendencias
  - Filtros avanzados (desplegable)
- **Grid de Burgers** (3 columnas desktop, 1 mobile):
  - Card por burger con imagen, posición, rating, tags, botón "Pedir"
- **Paginación**: Load more / Infinite scroll

**Estado Actual**: ✅ Totalmente funcional

### 5.2 `/rate` - Wizard de Valoración

**Propósito**: Proceso guiado de 5 pasos para valorar una hamburguesa

**Flujo**: Ver sección 4.2

**Características**:
- Progress bar y navegación
- Validación por paso
- Guardado automático en borrador
- Animaciones entre pasos
- Responsive (mobile-first)

**Estado Actual**: ✅ Totalmente funcional

### 5.3 `/profile` - Perfil de Usuario

**Propósito**: Dashboard personal del usuario

**Secciones**:
- Header del perfil
- Stats card (puntos, categoría, badges)
- Badges (8 slots)
- Recompensas canjeables
- Top 3 personal
- Últimas valoraciones
- Configuración

**Estado Actual**: ✅ Totalmente funcional

### 5.4 `/restaurante/[nombre]` - Página de Restaurante

**Propósito**: Página de detalle de un restaurante con todas sus hamburguesas

**Secciones**:
- Hero banner
- Información de contacto
- CTA de afiliación sticky (AffiliateCTA)
- Hamburguesas del restaurante
- Promociones activas
- Valoraciones recientes

**Estado Actual**: ✅ Totalmente funcional con monetización

### 5.5 `/about` - Acerca de

**Propósito**: Información sobre la plataforma y FAQs

**Estado Actual**: ✅ Totalmente funcional

### 5.6 `/admin` - Panel de Administración

**Propósito**: Gestión completa de la plataforma (solo admins)

**Secciones**:

1. **Dashboard**
   - Stats generales (total burgers, restaurantes, usuarios, valoraciones)
   - Promociones activas
   - Aprobaciones pendientes
   - Widget de preview del carousel featured actual

2. **Gestión de Burgers**
   - CRUD completo de hamburguesas
   - Aprobación de burgers pendientes
   - Edición de is_in_ranking

3. **Gestión de Restaurantes**
   - CRUD completo de restaurantes
   - Gestión de ubicaciones
   - Configuración de affiliate links

4. **Gestión de Usuarios**
   - Lista de usuarios
   - Cambiar roles (admin/user)
   - Gestión de puntos y badges

5. **Gestión de Promociones**
   - CRUD de promociones
   - Configurar descuentos por restaurante

6. **Revisión de Valoraciones**
   - Moderar valoraciones reportadas
   - Eliminar valoraciones fraudulentas

7. **Featured Burgers** ⭐ (Carousel del Ranking)
   - **Propósito**: Gestionar las 3 burgers destacadas del carousel principal
   - **Interfaz**:
     - Vista previa en tiempo real del carousel
     - 3 slots numerados (Posición 1, 2, 3)
     - Cada slot muestra:
       - Miniatura de la burger actual
       - Nombre y restaurante
       - Rating
       - Botones "Cambiar" / "Quitar"
   - **Funcionalidades**:
     - **Selector de burgers**: Modal con búsqueda y filtros
     - **Drag & drop**: Reordenar las 3 posiciones arrastrando
     - **Vista previa en tiempo real**: Ver cómo se verá en el carousel público
     - **Toggle activar/desactivar**: Mostrar/ocultar el carousel completo
   - **Lógica**:
     - Al seleccionar burger → `is_featured = true`, asignar `featured_order` (1, 2 o 3)
     - Al quitar → `is_featured = false`, `featured_order = null`
     - Si hay menos de 3, el carousel se adapta automáticamente
   - **Recomendaciones del sistema**:
     - Burgers populares sin destacar
     - Burgers nuevas (últimos 7 días)
     - Burgers con promociones activas
     - Burgers con mayor crecimiento en ratings

8. **Pendientes de aprobación**
   - Burgers nuevas añadidas por usuarios
   - Restaurantes nuevos
   - Valoraciones reportadas

**Estado Actual**: ✅ Totalmente funcional

### 5.7 `/auth/*` - Autenticación

**Páginas**:
- `/auth/signin` - Inicio de sesión
- `/auth/signup` - Registro
- `/auth/verify-email` - Verificación de email
- `/auth/reset-password` - Recuperar contraseña

**Estado Actual**: ✅ Totalmente funcional con Supabase Auth

---

## 6. MONETIZACIÓN - FASE 1 (IMPLEMENTADA)

### 6.1 Sistema de Afiliación

**Tablas Involucradas**:
- `affiliate_platforms`: 7 plataformas (Uber Eats, Glovo, Just Eat, Deliveroo, El Tenedor, Reserva Directa, Pedido Directo)
- `restaurant_affiliate_links`: Links de afiliación por restaurante
- `restaurant_discounts`: Descuentos activos con vigencia
- `affiliate_clicks`: Tracking completo de clicks

**Flujo de Monetización**:

1. **Admin configura afiliación**:
   ```sql
   -- Añadir link de Uber Eats para un restaurante
   INSERT INTO restaurant_affiliate_links 
     (restaurant_id, platform_id, affiliate_url, custom_priority)
   VALUES 
     ('uuid-restaurante', 'uuid-ubereats', 
      'https://ubereats.com/store/restaurante?ref=burgerank123', 10);
   
   -- Añadir descuento exclusivo
   INSERT INTO restaurant_discounts 
     (restaurant_id, title, discount_type, discount_value, discount_code, is_exclusive)
   VALUES 
     ('uuid-restaurante', '15% exclusivo BurgeRank', 'percentage', 15, 'BURGERANK15', true);
   ```

2. **Usuario ve el CTA**:
   - Component `<AffiliateCTA restaurantId="..." />`
   - Muestra botón principal (plataforma con mayor prioridad)
   - Muestra badge de descuento (si existe)
   - Muestra links alternativos

3. **Usuario hace click**:
   - Tracking automático registra click
   - Redirección a affiliate_url
   - Request non-blocking (no afecta UX)

4. **Conversión en plataforma**:
   - Usuario completa pedido en Uber Eats
   - Plataforma paga comisión a BurgeRank (€1-€3)

**Optimizaciones**:
- Prioridad configurable
- CTA customizable por restaurante
- Tracking sin login
- Descuentos con fecha de caducidad automática

**Proyección de Ingresos**:
```
Escenario Conservador:
- 10,000 usuarios/mes
- 30% hacen click en CTA = 3,000 clicks
- 5% conversión = 150 pedidos
- €2 comisión promedio = €300/mes

Escenario Optimista:
- 50,000 usuarios/mes
- 40% clicks = 20,000 clicks
- 8% conversión = 1,600 pedidos
- €2.50 promedio = €4,000/mes
```

### 6.2 Componentes de Monetización

**`<AffiliateCTA />`**: Sticky CTA en página de restaurante
- Mobile-first, sticky bottom
- Botón principal grande + links secundarios
- Badge de descuento si existe
- Tracking automático

**`<AffiliateCTAInline />`**: Botón compacto en cards de ranking
- Botón pequeño "Pedir"
- Solo se muestra si hay afiliación
- Tracking con source_burger_id

**Helpers** (`lib/affiliate/helpers.ts`):
- `getAffiliateCTAData(restaurantId)`: obtiene datos procesados
- `trackAffiliateClick(payload)`: registra click
- `generateSessionId()`: genera ID de sesión único

**APIs**:
- `GET /api/affiliate?restaurantId=X`: obtener datos
- `POST /api/affiliate/track`: registrar click (non-blocking)

---

## 7. SEGURIDAD Y AUTENTICACIÓN

### 7.1 Sistema de Autenticación

**Provider**: Supabase Auth

**Flujo**:
1. Registro → `supabase.auth.signUp({ email, password })`
2. Verificación → Email con magic link
3. Login → `supabase.auth.signInWithPassword({ email, password })`
4. Sesión → JWT almacenado en cookie httpOnly
5. Auto-creación de perfil → Trigger en Supabase crea row en `users`

**Context**: `AuthContext` (app/contexts/AuthContext.tsx)
- Provee: authUser, userProfile, loading, signin(), signup(), logout()
- Utilizado en todas las páginas

### 7.2 Row Level Security (RLS)

**Políticas implementadas**:

```sql
-- Users: ver propio perfil o perfiles públicos
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can view public profiles" ON users
  FOR SELECT USING (public_profile = TRUE);

-- Ratings: todos pueden ver, solo propietario puede editar/eliminar
CREATE POLICY "Anyone can view ratings" ON ratings
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Users can create ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Burgers y Restaurants: lectura pública
CREATE POLICY "Anyone can view burgers" ON burgers FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view restaurants" ON restaurants FOR SELECT USING (TRUE);
```

### 7.3 Middleware de Protección

**Archivo**: `middleware.ts`

**Rutas Protegidas**:
- `/profile/*` → requiere autenticación
- `/rate/*` → requiere autenticación
- `/admin/*` → requiere autenticación + is_admin = true

**Lógica**:
```typescript
if (!session && isProtectedRoute) {
  return NextResponse.redirect('/auth/signin');
}

if (isAdminRoute && !user.is_admin) {
  return NextResponse.redirect('/');
}
```

### 7.4 Protección contra Gaming

**Sistema Anti-Gaming**:

1. **Detección de Patrones Sospechosos**:
   - Múltiples valoraciones del mismo usuario en poco tiempo
   - Ratings extremos sin comentario
   - IPs duplicadas
   - Cuentas creadas muy recientemente

2. **Weight de Valoraciones**:
   - Valoración verificada (con ticket): weight = 1.5
   - Valoración con foto: weight = 1.3
   - Valoración normal: weight = 1.0
   - Valoración sospechosa: weight = 0.5

3. **Revisión Manual**:
   - Admin puede revisar y resolver

4. **Límite de Valoraciones**:
   - 1 valoración por burger por usuario (UNIQUE constraint)

---

## 8. MÉTRICAS Y ANALYTICS (FUTURO)

### 8.1 KPIs de Producto

**Adquisición**:
- Nuevos usuarios/mes
- Fuente de tráfico
- Tasa de conversión signup

**Engagement**:
- DAU / MAU
- Valoraciones por usuario
- Tiempo en sitio
- Retention Rate (D1, D7, D30)

**Monetización**:
- CTR de affiliate links
- Tasa de conversión (click → pedido)
- Revenue per user (RPU)

**Contenido**:
- Burgers más valoradas
- Restaurantes más populares
- Ciudades más activas

### 8.2 Herramientas a Integrar

- Google Analytics 4
- Mixpanel/Amplitude
- Hotjar
- Sentry

---

## 9. ROADMAP

### ✅ Fase 0 - MVP (COMPLETADA)
- [x] Autenticación completa
- [x] Sistema de ranking con algoritmo avanzado
- [x] Wizard de valoración (5 pasos)
- [x] Sistema de puntos, badges y recompensas
- [x] Panel de admin completo
- [x] Carousel de burgers destacadas (Featured)
- [x] Gestión de 3 burgers destacadas desde panel admin
- [x] Responsive design (mobile-first)
- [x] Deployment en Vercel + Supabase

### ✅ Fase 1 - Monetización Básica (COMPLETADA)
- [x] Sistema de afiliación (7 plataformas)
- [x] Descuentos exclusivos con vigencia
- [x] Tracking de clicks
- [x] CTAs sticky en restaurantes
- [x] CTAs inline en ranking

### 🚧 Fase 2 - Growth (Q1 2026)
- [ ] SEO avanzado (meta tags dinámicos, sitemap, schema.org)
- [ ] Compartir en redes sociales (Open Graph, Twitter Cards)
- [ ] Sistema de referidos (invita amigos → puntos bonus)
- [ ] Notificaciones push (nuevas burgers en tu ciudad)
- [ ] Email marketing (newsletter semanal)
- [ ] Blog integrado (SEO content)

### 📅 Fase 3 - Monetización Avanzada (Q2 2026)
- [ ] Membresía Premium (€4.99/mes)
  - Sin publicidad
  - Descuentos exclusivos adicionales
  - Acceso anticipado a nuevas burgers
  - Badge especial "Premium Member"
- [ ] Perfiles Premium para Restaurantes (€99-€299/mes)
  - Posición destacada en búsquedas
  - Dashboard de analytics
  - Gestión de promociones
  - Respuesta a valoraciones
- [ ] Publicidad Display (native ads)
- [ ] Sponsored content

### 📅 Fase 4 - Expansión (Q3 2026)
- [ ] App móvil nativa (React Native)
- [ ] Internacionalización (Portugal, Francia, Italia)
- [ ] Integración con Google Maps
- [ ] Sistema de reservas directo
- [ ] Marketplace de recompensas

### 📅 Fase 5 - Comunidad (Q4 2026)
- [ ] Perfiles públicos con followers
- [ ] Feed social (estilo Instagram)
- [ ] Listas personalizadas
- [ ] Challenges comunitarios
- [ ] Eventos y meetups de burgers

---

## 10. VENTAJAS COMPETITIVAS

### 10.1 vs Google Maps / TripAdvisor
- ✅ **Especialización**: Solo hamburguesas
- ✅ **Ranking algorítmico**: No manipulable, matemáticamente justo
- ✅ **Valoración granular**: 5 componentes (pan, carne, toppings, salsa, general)
- ✅ **Gamificación**: Puntos, badges, categorías → mayor engagement
- ✅ **Comunidad**: Identidad compartida de "burger lovers"

### 10.2 vs Redes Sociales (Instagram/TikTok)
- ✅ **Organización**: Ranking estructurado vs contenido disperso
- ✅ **Objetividad**: Algoritmo vs influencers pagados
- ✅ **Búsqueda**: Filtros avanzados vs hashtags imprecisos
- ✅ **Permanencia**: Base de datos persistente vs feed efímero

### 10.3 vs Blogs de Comida
- ✅ **Actualización**: Valoraciones en tiempo real vs artículos desactualizados
- ✅ **Colaborativo**: Múltiples opiniones vs 1 autor
- ✅ **Interactividad**: Usuarios pueden valorar vs lectura pasiva
- ✅ **Cobertura**: 120+ burgers vs 10-20 por blog

---

## 11. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Fake reviews / gaming** | Media | Alto | Sistema anti-gaming, verificación con tickets, revisión manual |
| **Dependencia de afiliados** | Media | Medio | Diversificar fuentes de ingreso (Premium, ads) |
| **Competencia de apps grandes** | Baja | Alto | Nicho específico, comunidad fuerte, especialización |
| **Escalabilidad técnica** | Baja | Medio | Supabase y Vercel escalan automáticamente |
| **Costes de adquisición altos** | Media | Medio | Growth orgánico (SEO, social), sistema de referidos |
| **Regulación GDPR** | Baja | Medio | RLS, consentimiento explícito, política de privacidad |
| **Cambios en APIs de afiliados** | Media | Bajo | Abstracción en código, URLs configurables por admin |

---

## 12. EQUIPO Y RECURSOS NECESARIOS

### Actual (Fundador Solo)
- ✅ Desarrollador Full-Stack (tú)

### Escala Inicial (0-10k usuarios)
- Community Manager (part-time)
- Moderador de contenido (part-time)

### Escala Media (10k-100k usuarios)
- CTO/Lead Developer (full-time)
- Marketing Manager (full-time)
- Community Manager (full-time)
- 2 Moderadores (part-time)
- Diseñador UI/UX (freelance)

### Escala Grande (100k+ usuarios)
- Equipo de desarrollo (4-6 devs)
- Equipo de marketing (3-4 personas)
- Equipo de operaciones (2-3 personas)
- Data Analyst
- Legal/Compliance

---

## 13. CONCLUSIÓN

**BurgeRank** es una plataforma técnicamente sólida, con un modelo de negocio escalable y una propuesta de valor clara. La Fase 1 de monetización está implementada y lista para generar ingresos desde el día 1.

**Fortalezas clave**:
- ✅ Producto funcional y completo
- ✅ Stack moderno y escalable
- ✅ Algoritmo de ranking justo y transparente
- ✅ Gamificación para retención
- ✅ Monetización sin comprometer UX
- ✅ Nicho específico con poca competencia directa

**Próximos pasos inmediatos**:
1. Lanzar y obtener primeros 100 usuarios
2. Negociar programas de afiliación con plataformas
3. Contactar 10-20 restaurantes para onboarding
4. SEO básico (meta tags, sitemap)
5. Campaña inicial en redes sociales

**Viabilidad**: Alta. El proyecto está listo para producción y puede comenzar a generar ingresos en el primer mes de operación.

---

**Documento generado**: 27 de diciembre de 2025  
**Versión**: 1.0  
**Autor**: Análisis completo del proyecto BurgeRank
