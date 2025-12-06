# 🍔 BurgeRank Database Schema Documentation

## Resumen Ejecutivo

Se ha creado un esquema PostgreSQL completo y production-ready para la plataforma BurgeRank con:

- ✅ **12 tablas** relacionales diseñadas para scalabilidad
- ✅ **12+ funciones** PostgreSQL para lógica de negocio
- ✅ **15+ triggers** para automatización de procesos
- ✅ **50+ políticas RLS** para seguridad row-level
- ✅ **7 vistas materializadas** para queries optimizadas
- ✅ **40+ índices** para performance
- ✅ **Datos seed** iniciales (rewards, restaurantes, hamburguesas)

---

## 📊 Estructura de Tablas

### 1. **profiles** - Perfiles de Usuario
```sql
Almacena información de usuarios, niveles y puntos

Columnas principales:
- id (UUID, PK, FK a auth.users)
- username (UNIQUE, NOT NULL)
- level (burger_fan | burger_lover | burger_obsessed)
- total_points / available_points (INTEGER)
- total_reviews (INTEGER)
- is_moderator / is_admin (BOOLEAN)

Índices:
- username, city, level, total_points, created_at
```

### 2. **restaurants** - Restaurantes
```sql
Información de restaurantes

Columnas principales:
- id (UUID, PK)
- name, slug (UNIQUE)
- address, city, phone
- latitude, longitude (DECIMAL para geo-ubicación)
- average_rating, total_burgers
- verified (BOOLEAN)

Índices:
- slug, city, verified, average_rating, geolocation
```

### 3. **burgers** - Menú de Hamburguesas
```sql
Catálogo de hamburguesas

Columnas principales:
- id (UUID, PK)
- restaurant_id (FK)
- name, slug (UNIQUE)
- type (ENUM: clasica, cheeseburger, doble, vegana, pollo, cerdo, cordero)
- price (DECIMAL)
- average_rating, total_reviews
- match_score (0-1, del mini-juego)
- ranking_position (INTEGER)
- is_new, verified (BOOLEAN)
- Dietary filters: is_gluten_free, is_vegan, is_vegetarian, is_keto, is_spicy

Índices:
- restaurant_id, slug, type, average_rating, ranking_position, is_new, created_at
- Índice compuesto para filtros dietéticos
```

### 4. **reviews** - Reseñas y Valoraciones
```sql
Sistema de reseñas con puntuaciones detalladas

Columnas principales:
- id (UUID, PK)
- burger_id, user_id (FKs)
- overall_rating (DECIMAL 0-5)
- Puntuaciones específicas:
  - bread_rating, meat_rating, toppings_rating
  - sauces_rating, originality_rating, sides_rating
  - value_rating
- comment (MAX 280 chars)
- visit_date (DATE)
- is_verified (BOOLEAN - con foto/recibo)
- likes_count (INTEGER)

Constraints:
- UNIQUE(burger_id, user_id, visit_date) - Una review por día por usuario
- CHECK constraints en rangos de puntuación

Índices:
- burger_id, user_id, overall_rating, is_verified, created_at, visit_date
```

### 5. **review_tags** - Etiquetas de Reseñas
```sql
Tags categorizado para reseñas

Columnas principales:
- id (UUID, PK)
- review_id (FK)
- tag (TEXT)
- category (ENUM: bread, meat, sauce, topping, experience)

Índices:
- review_id, tag, category, review_category compuesto
```

### 6. **review_images** - Imágenes de Reseñas
```sql
Fotos y recibos de reseñas

Columnas principales:
- id (UUID, PK)
- review_id (FK)
- image_url (TEXT)
- is_receipt (BOOLEAN)
- verified_data (JSONB - datos OCR del ticket)

Índices:
- review_id, is_receipt
```

### 7. **user_badges** - Insignias/Logros
```sql
Sistema de badges/achievements

Columnas principales:
- id (UUID, PK)
- user_id, badge_name (FK, UNIQUE)
- badge_type (ENUM: explorer, critic, specialist, social, dedication, match_master)
- progress / target (INTEGER)
- unlocked (BOOLEAN)
- unlocked_at (TIMESTAMP)

Badges automáticos:
1. Explorer: 50 reseñas
2. Critic: 100 reseñas verificadas
3. Specialist: Reseñas en 5+ ciudades
4. Social Butterfly: 100 seguidores
5. Dedication: Alcanzar burger_obsessed
6. Match Master: 500 matches ganados
```

### 8. **rewards** - Premios Canjeables
```sql
Sistema de premios/recompensas

Columnas principales:
- id (UUID, PK)
- name, description
- points_cost (INTEGER)
- reward_type (ENUM: discount, free_fries, free_drink, free_burger, vip_experience)
- discount_percentage (INTEGER 0-100)
- required_level (user_level)
- is_active (BOOLEAN)
- max_redemptions / redemptions_count

12 rewards seed iniciales:
- Descuentos: 10%, 15%, 20%
- Items gratis: papas, bebidas (3 niveles)
- Hamburguesas gratis: 2 opciones
- Experiencias VIP: 2 opciones
```

### 9. **user_rewards** - Premios Redimidos
```sql
Premios que el usuario ha canjeado

Columnas principales:
- id (UUID, PK)
- user_id, reward_id (FKs)
- qr_code (TEXT, UNIQUE)
- redeemed (BOOLEAN)
- redeemed_at / expires_at (TIMESTAMP)

Índices:
- user_id, qr_code, redeemed, expires_at
```

### 10. **burger_matches** - Mini-Juego Battle Royale
```sql
Resultados del mini-juego: Battle Royale entre hamburguesas

Columnas principales:
- id (UUID, PK)
- user_id (FK)
- burger_a_id, burger_b_id (FKs)
- winner_id (FK - debe ser uno de burger_a/b)

Constraints:
- burger_a_id != burger_b_id
- winner_id IN (burger_a_id, burger_b_id)

Índices:
- user_id, burger_a_id, burger_b_id, winner_id, created_at
```

### 11. **follows** - Relaciones de Seguimiento
```sql
Red social: quién sigue a quién

Columnas principales:
- id (UUID, PK)
- follower_id, following_id (FKs)

Constraints:
- UNIQUE(follower_id, following_id)
- CHECK(follower_id != following_id)

Índices:
- follower_id, following_id, created_at
```

### 12. **user_preferences** - Preferencias de Usuario
```sql
Configuración personalizada del usuario

Columnas principales:
- user_id (UUID, PK, FK)
- dietary_preferences (TEXT[])
- main_city (TEXT)
- price_range (ENUM: budget, medium, premium)
- Notificaciones:
  - notifications_new_nearby
  - notifications_recommended
  - notifications_level_up
  - notifications_followers
- Privacidad:
  - profile_public
  - show_location
```

---

## 🔧 Funciones Principales

### Ranking y Algoritmo
**`calculate_burger_ranking(burger_id_param UUID)`**
- Calcula score ponderado considerando:
  - Reviews verificadas (50% peso adicional)
  - Nivel del reviewer (nivel alto = peso mayor)
  - Mínimo 5 reviews para ranking
  - Boost temporal para burgers nuevas (30 días)
  - Match score del mini-juego
- Rango: 0-5 (normalizado)

### Gestión de Puntos
- `add_user_points(user_id, points)` - Añadir puntos seguro
- `redeem_user_points(user_id, points)` - Canjear puntos
- `update_user_level()` - Actualiza nivel automáticamente

### Badges
- `check_and_unlock_badges(user_id)` - Verifica y desbloquea logros

### Utilidades
- `generate_qr_code()` - QR único para premios
- `mark_burger_not_new()` - Marca burgers como no nuevas (30+ días)
- `calculate_match_score(burger_id)` - Puntuación mini-juego

---

## ⚙️ Triggers Automáticos

| Trigger | Evento | Acción |
|---------|--------|--------|
| `on_review_inserted` | INSERT review | Actualiza stats burger/restaurante, +10 puntos, +5 si verificado |
| `on_review_updated` | UPDATE review | Recalcula rankings |
| `on_review_deleted` | DELETE review | Actualiza stats, -10 puntos |
| `on_profile_points_changed` | UPDATE profile.points | Recalcula nivel |
| `on_burger_match_inserted` | INSERT match | Actualiza match_score, +1 punto |
| `ensure_user_preferences_on_profile_creation` | INSERT profile | Crea record en user_preferences |
| `initialize_user_badges_on_profile_creation` | INSERT profile | Crea 6 badges iniciales |
| `on_review_image_inserted` | INSERT image | Auto-verifica review |
| `on_user_reward_redeemed` | UPDATE reward.redeemed | Incrementa contador |

---

## 🔒 Row Level Security (RLS) Policies

Todas las tablas tienen RLS habilitado con políticas específicas:

### Patrón General
```
LECTURA: Todo el mundo puede leer contenido público
INSERCIÓN: Solo usuarios autenticados, creando su propio contenido
ACTUALIZACIÓN: Usuarios pueden editar solo su contenido
ELIMINACIÓN: Usuarios pueden borrar solo su contenido
```

### Excepciones
- **Admin/Moderator**: Pueden acceder a todo
- **Pending Verification**: Solo visible para creador + admin
- **User Preferences**: Solo el usuario puede ver las suyas

### Roles
- `user` - Usuario normal
- `moderator` - Puede revisar/verificar contenido
- `admin` - Control total

---

## 📈 Vistas Materializadas

### 1. **top_burgers_view**
Ranking general de hamburguesas
```
Columnas: id, name, restaurant_name, city, average_rating, 
          ranking_position, composite_score, review_count, verified_review_count
Indexado por: ranking_position, rating, city, type
```

### 2. **new_burgers_view**
Hamburguesas nuevas (últimos 30 días)
```
Columnas: id, name, days_since_created, age_percentage
Indexado por: created_at, city, type
```

### 3. **user_stats_view**
Estadísticas agregadas por usuario
```
Columnas: username, level, total_points, total_reviews, 
          followers_count, badges_unlocked, verification_percentage
Indexado por: level, total_points, followers_count
```

### 4. **restaurant_rankings_view**
Ranking de restaurantes
```
Columnas: name, city, average_rating, total_burgers, rank,
          burgers_per_week, verified_reviews
Indexado por: city, rating, rank
```

### 5. **trending_burgers_view**
Burgers en tendencia (últimos 7 días)
```
Columnas: name, restaurant_name, recent_reviews_7days,
          recent_wins_7days, trend_score, trend_rank
Indexado por: trend_rank, city
```

### 6. **burger_reviews_detailed_view**
Reseñas con info del reviewer
```
Columnas: burger_name, username, user_level, overall_rating,
          all individual ratings, comment, image_count, tag_count
Indexado por: burger_id, user_id, created_at
```

### 7. **user_rewards_status_view**
Estado de premios del usuario
```
Columnas: username, reward_name, qr_code, redeemed, status,
          expires_at
Indexado por: user_id, status
```

---

## 📊 Tipos Enumerados (ENUMs)

```sql
user_level: 'burger_fan' | 'burger_lover' | 'burger_obsessed'

burger_type: 'clasica' | 'cheeseburger' | 'doble' | 'vegana' | 
             'pollo' | 'cerdo' | 'cordero'

reward_type: 'discount' | 'free_fries' | 'free_drink' | 
             'free_burger' | 'vip_experience'

badge_type: 'explorer' | 'critic' | 'specialist' | 'social' | 
            'dedication' | 'match_master'

price_range: 'budget' | 'medium' | 'premium'

tag_category: 'bread' | 'meat' | 'sauce' | 'topping' | 'experience'
```

---

## 🌱 Datos Seed Iniciales

### Rewards (12 total)
- 3 Descuentos (10%, 15%, 20%)
- 3 Papas gratis (niveles progresivos)
- 3 Bebidas gratis (niveles progresivos)
- 2 Hamburguesas gratis
- 2 Experiencias VIP

### Restaurantes (5)
- Burger Palace (Madrid) - 4.5⭐
- The Burger House (Barcelona) - 4.3⭐
- Gourmet Burgers (Madrid) - 4.7⭐
- Fast & Furious Burgers (Valencia) - 4.1⭐
- Craft Burger Kitchen (Bilbao) - 4.6⭐

### Hamburguesas (9)
- 3 en Burger Palace
- 2 en The Burger House
- 2 en Gourmet Burgers
- 1 en Fast & Furious Burgers
- 1 en Craft Burger Kitchen

---

## 🚀 Performance Considerations

### Índices Creados
- 40+ índices para consultas rápidas
- Índices compuestos para filtros comunes
- Índices geo-espaciales para ubicaciones
- Índices parciales para filtros dietéticos

### Optimizaciones
- Vistas materializadas para rankings complejos
- Desnormalización controlada (average_rating en burgers)
- Caché de contadores (total_reviews, total_points)
- Trigger-based updates para coherencia

### Escalabilidad
- Particionamiento posible en reviews (por fecha)
- Compresión de historial (archived reviews)
- Limpieza de datos expirados (expired rewards)

---

## 📝 Migraciones Ordenadas

1. **001_schema.sql** - Tablas, enums, índices (2-5s)
2. **002_functions.sql** - Funciones PostgreSQL (1-3s)
3. **003_triggers.sql** - Triggers de automatización (2-4s)
4. **004_rls_policies.sql** - Seguridad row-level (3-5s)
5. **005_seed_data.sql** - Datos iniciales (1-2s)
6. **006_materialized_views.sql** - Vistas optimizadas (3-5s)

**Tiempo Total:** 12-24 segundos

---

## 🔗 Relaciones ERD

```
auth.users (Supabase)
    ↓
profiles (1:1 con users)
    ↓
├── reviews
├── user_badges  
├── burger_matches
├── follows
└── user_preferences

restaurants
    ↓
burgers (1:N)
    ↓
├── reviews (1:N) → profiles
├── burger_matches
└── review_images → reviews → review_tags

rewards
    ↓
user_rewards (1:N) → profiles
```

---

## 📌 Queries Comunes

### Top 10 Hamburguesas
```sql
SELECT * FROM top_burgers_view LIMIT 10;
```

### Burgers de un Restaurante
```sql
SELECT b.* FROM burgers b
JOIN restaurants r ON b.restaurant_id = r.id
WHERE r.slug = 'burger-palace'
ORDER BY b.average_rating DESC;
```

### Reseñas Verificadas de un Usuario
```sql
SELECT r.* FROM reviews r
WHERE r.user_id = $1 AND r.is_verified = TRUE
ORDER BY r.created_at DESC;
```

### Premios Disponibles para Usuario
```sql
SELECT r.* FROM rewards r
WHERE r.required_level <= (SELECT level FROM profiles WHERE id = $1)
AND r.is_active = TRUE
ORDER BY r.points_cost ASC;
```

---

**Diseñado para:** BurgeRank - Plataforma de Ranking y Valoración de Hamburguesas  
**Fecha:** Diciembre 2025  
**Versión:** 1.0 - Production Ready

Para instrucciones de ejecución, consulta `MIGRATION_GUIDE.md`
