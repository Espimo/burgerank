# BurgeRank - Burger Match & Social System

Sistema completo de gamificación y social networking para la plataforma BurgeRank.

## 📋 Índice

1. [Burger Match (Minijuego)](#burger-match-minijuego)
2. [Sistema Social](#sistema-social)
3. [Perfiles Públicos](#perfiles-públicos)
4. [APIs](#apis)
5. [Base de Datos](#base-de-datos)
6. [Configuración](#configuración)

---

## 🎮 Burger Match (Minijuego)

### Descripción
Sistema competitivo donde los usuarios comparan dos hamburguesas y votan por su favorita. Las puntuaciones se calculan usando el algoritmo ELO (usado en ajedrez).

### Características

- **Algoritmo ELO**: Sistema justo de ranking basado en el nivel de los competidores
- **Sistema de Puntos**: +5 puntos cada 10 matches jugados (evita inflación)
- **Racha de Victorias**: Contador de matches consecutivos
- **Confetti Celebrations**: Animaciones en hitos cada 10 matches
- **Estadísticas en Tiempo Real**: Total, hoy, racha actual, MVP
- **Mobile-First**: Interfaz responsiva (lado a lado en desktop, apilado en móvil)

### Componentes

```
burger-match-section.tsx (Contenedor principal)
├── match-stats.tsx (4 estadísticas: Total, Hoy, Racha, MVP)
├── match-game.tsx (Interfaz del juego)
│   ├── match-burger-card.tsx x2 (Tarjetas de hamburguesas)
│   └── match-feedback.tsx (Feedback con confetti)
```

### Flujo del Juego

1. Usuario presiona "Jugar Match"
2. Se cargan 2 hamburguesas aleatorias (con scores similares)
3. Usuario hace tap en su favorita
4. Se calcula ELO y se actualiza la puntuación
5. Se muestra feedback (+1 Match, +5 Puntos cada 10 matches)
6. Se carga automáticamente el siguiente par

### Uso

```tsx
import BurgerMatchSection from '@/components/profile/burger-match-section'

<BurgerMatchSection userId={userId} />
```

---

## 👥 Sistema Social

### Descripción
Sistema de seguimiento con recomendaciones personalizadas, feed de actividad y descubrimiento de usuarios.

### Características

- **Follow/Unfollow**: Sistema bidireccional con contadores de seguidores
- **Feed de Actividad**: Línea de tiempo de usuarios seguidos
- **Recomendaciones**: Basadas en:
  - Usuarios con gustos similares
  - Top reviewers de la plataforma
  - Amigos de amigos (friends-of-friends)
- **Buscar Usuarios**: Dentro de followers/following
- **Scroll Infinito**: Carga automática de más usuarios

### Componentes

```
followers-section.tsx (Tabs: Followers | Following)
├── followers-tab (Lista de seguidores)
│   └── user-follow-card.tsx x N (Tarjetas individuales)
└── following-tab (Lista de seguidos)
    └── user-follow-card.tsx x N (Tarjetas individuales)

discover-users.tsx (Carrusel de sugerencias)
└── user-follow-card.tsx x 10

user-activity-feed.tsx (Feed de actividad)
└── activity-items (Revisar, insignias, level up, top 5)
```

### User Follow Card

Muestra un usuario individual con:
- Avatar + Nombre + Nivel
- Contador de reviews
- Botón Ver Perfil
- Botón Seguir/Dejar de Seguir (con hover "Unfollow" en rojo)

### Activity Feed

Tipos de actividad:
- `review_created`: "Calificó 'Burger Name' con 5⭐"
- `badge_unlocked`: "Desbloqueó insignia: Crítico"
- `level_up`: "¡Subió a nivel 10!"
- `top_five_updated`: "Actualizó su top 5"

### Uso

```tsx
// Followers
import FollowersSection from '@/components/profile/followers-section'
<FollowersSection userId={userId} currentUserId={currentUserId} />

// Descubrir
import DiscoverUsers from '@/components/profile/discover-users'
<DiscoverUsers userId={userId} />

// Feed
import UserActivityFeed from '@/components/profile/user-activity-feed'
<UserActivityFeed userId={userId} followingOnly={true} />
```

---

## 🌐 Perfiles Públicos

### Descripción
Perfiles públicos de usuarios con su top 5 y últimas reviews.

### URL
```
/profile/[username]
```

### Componentes

```
public-profile-header.tsx
├── Avatar + Nombre + Nivel
├── Bio del usuario
├── Estadísticas (Reviews, Seguidores, Siguiendo, Año de unión)
└── Botones (Seguir/Siguiendo, Mensaje - si no es propio perfil)

public-top-five.tsx
└── Ranking de las 5 mejores hamburguesas (🥇 🥈 🥉 4️⃣ 5️⃣)

public-reviews.tsx
└── Últimas 10 reviews con scroll infinito
    ├── Imagen de hamburguesa
    ├── Nombre + Restaurante
    ├── Rating con emoji (🤩 😊 😐 😞)
    ├── Comentario (máximo 2 líneas)
    └── Meta (tiempo relativo, likes)
```

### Características

- **Vista Solo Lectura**: No se pueden editar reviews de otros
- **Botón Seguir Integrado**: Directamente desde el header
- **Privacy Setting**: Top 5 puede ser privado
- **Tabs**: Top 5 | Reviews para mejor UX

### Uso

```tsx
// Page - servidor
import PublicProfilePage from '@/app/(main)/profile/[username]/page'

// Componentes individuales
import PublicProfileHeader from '@/components/profile/public-profile-header'
import PublicTopFive from '@/components/profile/public-top-five'
import PublicReviews from '@/components/profile/public-reviews'
```

---

## 🔌 APIs

### Burger Match API (`lib/api/burger-match.ts`)

#### `getMatchPair(userId: string)`
Obtiene un par de hamburguesas para comparar.

```typescript
const pair = await getMatchPair(userId)
// {
//   burger_a: { id, name, image_url, restaurant, user_rating },
//   burger_b: { id, name, image_url, restaurant, user_rating }
// }
```

**Lógica:**
- Excluye últimos 20 matches del usuario
- Prioriza hamburguesas con scores similares
- Evita repeticiones recientes

#### `submitMatch(userId, burgerAId, burgerBId, winnerId)`
Registra un match y actualiza ELO.

```typescript
const result = await submitMatch(userId, burgerAId, burgerBId, winnerId)
// {
//   id: string,
//   elo_before_a: 1250,
//   elo_after_a: 1260,
//   elo_before_b: 1200,
//   elo_after_b: 1190,
//   points_earned: 5 // si matchCount % 10 === 0
// }
```

**Actualizaciones en cascada:**
- ✅ Insertar en `burger_matches`
- ✅ Actualizar `match_score`, `match_count`, `match_wins` en burgers
- ✅ Sumar puntos al usuario cada 10 matches
- ✅ Registrar actividad si fue milestone

#### `getMatchStats(userId: string)`
Obtiene estadísticas del usuario en Burger Match.

```typescript
const stats = await getMatchStats(userId)
// {
//   totalMatches: 150,
//   todayMatches: 8,
//   mostWins: 'Burger Name',
//   winRate: 52.3,
//   currentStreak: 5
// }
```

#### `getMatchHistory(userId: string, limit?: number)`
Obtiene histórico paginado de matches.

```typescript
const history = await getMatchHistory(userId, 20)
// Array de matches con scores antes/después
```

---

### Social API (`lib/api/social.ts`)

#### `followUser(followerId: string, followingId: string)`
Crea una relación de seguimiento.

```typescript
await followUser(currentUserId, targetUserId)
```

**Actualizaciones en cascada:**
- ✅ Crear en `follows` table
- ✅ Incrementar `followers_count` del target
- ✅ Incrementar `following_count` del follower
- ✅ Registrar actividad en el timeline
- ✅ Crear notificación (future)

#### `unfollowUser(followerId: string, followingId: string)`
Elimina una relación de seguimiento.

```typescript
await unfollowUser(currentUserId, targetUserId)
```

**Actualizaciones en cascada:**
- ✅ Eliminar de `follows` table
- ✅ Decrementar ambos contadores
- ✅ Registrar actividad

#### `getFollowers(userId: string, page?: number, pageSize?: number)`
Obtiene lista paginada de seguidores.

```typescript
const followers = await getFollowers(userId, 1, 20)
// Array de { id, username, avatar_url, level, total_reviews, bio }
```

#### `getFollowing(userId: string, page?: number, pageSize?: number)`
Obtiene lista paginada de usuarios que sigue.

```typescript
const following = await getFollowing(userId, 1, 20)
```

#### `isFollowing(followerId: string, followingId: string)`
Verifica si A sigue a B.

```typescript
const isFol = await isFollowing(userId, targetUserId) // true | false
```

#### `getUserSuggestions(userId: string, limit?: number)`
Obtiene sugerencias personalizadas.

```typescript
const suggestions = await getUserSuggestions(userId, 10)
// Algoritmo:
// 1. Usuarios con burgers similares en su top 5
// 2. Usuarios con mayor número de reviews
// 3. Amigos de amigos (second-degree connections)
```

#### `getUserActivity(userId: string, followingOnly?: boolean, limit?: number)`
Obtiene timeline de actividad.

```typescript
const activity = await getUserActivity(userId, true, 20)
// {
//   id, user_id, username, avatar_url,
//   activity_type: 'review_created' | 'badge_unlocked' | 'level_up' | 'top_five_updated',
//   description, data, created_at
// }
```

#### `logUserActivity(userId: string, type: string, description: string, data?: object)`
Registra una actividad del usuario.

```typescript
await logUserActivity(userId, 'review_created', 'Calificó una hamburguesa', {
  burger_name: 'Classic Burger',
  rating: 5
})
```

---

### ELO Algorithm (`lib/utils/elo-algorithm.ts`)

#### `calculateELO(ratingA: number, ratingB: number, winner: 'A' | 'B')`
Calcula nuevos ratings usando ELO (K-factor: 32).

```typescript
const { newRatingA, newRatingB } = calculateELO(1250, 1200, 'A')
```

**Fórmula ELO:**
- Expected score: `1 / (1 + 10^((opponent - self) / 400))`
- New Rating: `old + K * (result - expected)`
- K-factor: 32 (para movimiento equilibrado)

#### `getInitialELO(userRating: 0-5)`
Mapea el rating del usuario (0-5) al rango ELO (1200-1600).

```typescript
const eloRating = getInitialELO(4.5) // ~1500
```

#### `getWinProbability(ratingA: number, ratingB: number)`
Calcula probabilidad de que A gane contra B.

```typescript
const probability = getWinProbability(1250, 1200) // 60.5
```

#### `getRatingDescription(rating: number)`
Retorna el nivel/descripción del rating.

```typescript
getRatingDescription(1200) // "Novato"
getRatingDescription(1500) // "Experto"
getRatingDescription(1700) // "Maestro"
```

---

## 🗄️ Base de Datos

### Tablas Nuevas

#### `burger_matches`
```sql
{
  id: UUID (PK),
  user_id: UUID (FK profiles),
  burger_a_id: UUID (FK burgers),
  burger_b_id: UUID (FK burgers),
  winner_id: UUID (FK burgers),
  elo_before_a: FLOAT,
  elo_after_a: FLOAT,
  elo_before_b: FLOAT,
  elo_after_b: FLOAT,
  points_earned: INTEGER,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### `follows`
```sql
{
  id: UUID (PK),
  follower_id: UUID (FK profiles),
  following_id: UUID (FK profiles),
  created_at: TIMESTAMP,
  UNIQUE(follower_id, following_id)
}
```

#### `user_activity`
```sql
{
  id: UUID (PK),
  user_id: UUID (FK profiles),
  activity_type: VARCHAR('review_created' | 'badge_unlocked' | 'level_up' | 'top_five_updated'),
  description: TEXT,
  data: JSONB,
  created_at: TIMESTAMP
}
```

### Columnas Agregadas

#### `profiles`
```sql
followers_count: INTEGER (DEFAULT 0)
following_count: INTEGER (DEFAULT 0)
```

#### `burgers`
```sql
match_score: FLOAT (DEFAULT 1200) -- ELO rating
match_count: INTEGER (DEFAULT 0)
match_wins: INTEGER (DEFAULT 0)
```

### Índices

```sql
-- burger_matches
idx_burger_matches_user_id
idx_burger_matches_created_at
idx_burger_matches_user_created

-- follows
idx_follows_follower_id
idx_follows_following_id
idx_follows_created_at

-- user_activity
idx_user_activity_user_id
idx_user_activity_created_at
idx_user_activity_type

-- burgers
idx_burgers_match_score
```

### RLS Policies

✅ Burger Matches: Todos pueden ver, solo el propietario puede crear
✅ Follows: Todos pueden ver, solo el follower puede crear/eliminar
✅ User Activity: Puedes ver tu actividad o la de usuarios que sigues

---

## ⚙️ Configuración

### Instalación de Migraciones

1. **Copiar archivo SQL**
```bash
cp supabase/migrations/20240115_burger_match_social_tables.sql
```

2. **Ejecutar en Supabase**
```sql
-- Copiar y pegar en SQL Editor de Supabase Dashboard
-- Ir a: Database > SQL Editor > New Query
```

3. **O usar Supabase CLI**
```bash
supabase migration up
```

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Dependencias

```json
{
  "framer-motion": "^11.0.0",
  "date-fns": "^3.0.0",
  "lucide-react": "^latest",
  "@radix-ui/react-tabs": "^latest"
}
```

---

## 🎨 Estilos y Animaciones

### Animaciones Principales

- **Burger Match**: Scale/hover 1.05, tap 0.95
- **Level Up**: Confetti 30 partículas cada 10 matches
- **Followers**: Stagger 0.1s entre items
- **Activity Feed**: Entrada desde izquierda, salida hacia derecha
- **Racha de Victorias**: Pulso continuo (y: [-4, 0, -4])

### Colores Brand

- Primary: Amber-500 / Orange-500
- Secondary: Gray-900 (text)
- Success: Green
- Warning: Orange / Yellow
- Danger: Red

---

## 📱 Mobile Responsiveness

- **Match Game**: Stacked vertical en móvil, lado-a-lado en desktop
- **Cards**: Ajustadas para pantallas pequeñas
- **Buttons**: Touch-friendly (min 44px height)
- **Feed**: Full-width con padding responsivo

---

## 🚀 Próximas Mejoras

- [ ] Notificaciones push para follows
- [ ] Direct messaging entre usuarios
- [ ] Badges/Achievements personalizados
- [ ] Leaderboard global
- [ ] Match tournaments
- [ ] Real-time Supabase subscriptions para actividad
- [ ] Share results en redes sociales

---

## 📝 Notas de Desarrollo

- Todos los componentes son `React.memo` para performance
- APIs manejan errores con fallback a console.error
- Cascadas de actualización para mantener consistencia
- Type-safe con TypeScript (no 'any' types)
- RLS habilitado para seguridad
- Infinite scroll implementado donde aplica

---

**Última actualización:** 15 de Enero, 2024
**Versión:** 2.0 - Burger Match & Social System
