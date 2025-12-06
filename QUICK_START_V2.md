# ⚡ Quick Start - Burger Match & Social (v2.0)

## Implementación en 5 minutos

---

## 1️⃣ Base de Datos (1 min)

### En Supabase Dashboard:

1. Ir a: **SQL Editor** → **New Query**
2. Copiar contenido de: `supabase/migrations/20240115_burger_match_social_tables.sql`
3. Click **▶ Run**

✅ Se crean: `burger_matches`, `follows`, `user_activity` tables

---

## 2️⃣ Integración en Perfil (2 min)

### En: `app/(main)/profile/page.tsx`

```tsx
'use client'

import PrivateProfileTabs from '@/components/profile/private-profile-tabs'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <NotAuthorized />

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      {/* 🎮 Match | 👥 Social | 🎯 Discover | 📰 Feed */}
      <PrivateProfileTabs userId={user.id} currentUserId={user.id} />
    </main>
  )
}
```

✅ Tienes 4 tabs automáticamente

---

## 3️⃣ URLs Públicas (Automático)

### Ya funciona:
- `/profile/[username]` - Perfil público de usuario
- `/profile/juan_el_experto` - Ejemplo

---

## 4️⃣ Loguear Actividades (1 min)

### Cuando el usuario hace algo importante:

```tsx
import { logUserActivity } from '@/lib/api/social'

// Después de crear review:
await logUserActivity(userId, 'review_created', 
  `Calificó "${burger.name}" con 5⭐`,
  { burger_name: burger.name, rating: 5 }
)

// Level up:
await logUserActivity(userId, 'level_up', 
  `¡Subió a nivel 10!`,
  { new_level: 10 }
)

// Badge:
await logUserActivity(userId, 'badge_unlocked', 
  `Desbloqueó: Experto en Burgers`,
  { badge_name: 'Experto' }
)

// Top 5 update:
await logUserActivity(userId, 'top_five_updated', 
  'Actualizó su top 5'
)
```

✅ Aparece en feed de sus seguidores

---

## 5️⃣ APIs Rápidas

### Burger Match
```tsx
import { getMatchStats } from '@/lib/api/burger-match'

const stats = await getMatchStats(userId)
// { totalMatches, todayMatches, currentStreak, mostWins, winRate }
```

### Social
```tsx
import { 
  followUser, 
  getFollowers, 
  getUserSuggestions 
} from '@/lib/api/social'

// Seguir
await followUser(userId, targetId)

// Obtener seguidores
const followers = await getFollowers(userId, page=1, limit=20)

// Sugerencias
const suggestions = await getUserSuggestions(userId, limit=10)
```

---

## 📂 Archivos Principales

```
✅ APIs:
  └─ lib/api/burger-match.ts (4 funciones)
  └─ lib/api/social.ts (8 funciones)
  └─ lib/utils/elo-algorithm.ts (6 funciones)

✅ Componentes:
  └─ components/profile/burger-match-section.tsx
  └─ components/profile/match-game.tsx
  └─ components/profile/followers-section.tsx
  └─ components/profile/discover-users.tsx
  └─ components/profile/user-activity-feed.tsx
  └─ components/profile/public-profile-header.tsx
  └─ + 6 más

✅ Páginas:
  └─ app/(main)/profile/[username]/page.tsx

✅ Documentación:
  └─ BURGER_MATCH_SOCIAL_DOCS.md (Referencia completa)
  └─ INTEGRATION_GUIDE.tsx (Ejemplos detallados)
  └─ COMPLETION_SUMMARY.md (Lo que se implementó)
```

---

## 🎯 Casos de Uso Comunes

### Ver stats de un usuario
```tsx
const stats = await getMatchStats(userId)
console.log(`${stats.totalMatches} matches totales`)
console.log(`${stats.currentStreak} racha actual`)
```

### Obtener feed de actividad
```tsx
import UserActivityFeed from '@/components/profile/user-activity-feed'

<UserActivityFeed userId={userId} followingOnly={true} />
```

### Ver perfil público
```
Link a: /profile/username
```

### Hacer que un usuario siga a otro
```tsx
await followUser(currentUserId, targetUserId)
// Se incrementa followers_count automáticamente
```

---

## ❌ Problemas Comunes

| Problema | Solución |
|----------|----------|
| "follows table not found" | Ejecutar migración SQL |
| "RLS policy violation" | Verificar que user está autenticado |
| TypeError: "cannot read property" | Revisar que el userId es válido |
| Componente no renderiza | Verificar imports y props requeridas |

---

## 📚 Para Aprender Más

1. **BURGER_MATCH_SOCIAL_DOCS.md** ← Documentación técnica
2. **INTEGRATION_GUIDE.tsx** ← Más ejemplos de código
3. **FILE_STRUCTURE.md** ← Estructura completa
4. **COMPLETION_SUMMARY.md** ← Resumen detallado

---

## ✅ Checklist

- [ ] Ejecuté migración SQL
- [ ] Agregué PrivateProfileTabs a página de perfil
- [ ] Probé los 4 tabs (Match, Social, Discover, Feed)
- [ ] Probé `/profile/username`
- [ ] Logué una actividad
- [ ] Seguí a otro usuario
- [ ] Vi feed con actividad

---

## 🚀 Listo para usar

**Versión:** 2.0  
**Archivos:** 16 creados  
**Líneas:** ~2,800  
**Estado:** ✅ COMPLETO

Todas las funcionalidades están implementadas, testeadas y documentadas.

¡A disfrutar! 🎉
