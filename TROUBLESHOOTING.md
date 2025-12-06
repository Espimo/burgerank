# 🛠️ Troubleshooting & FAQ

## ❌ Problemas Comunes

### 1. "Table 'burger_matches' does not exist"

**Problema:** La migración SQL no se ejecutó.

**Solución:**
```sql
-- En Supabase Dashboard > SQL Editor
-- Copiar TODO el contenido de:
-- supabase/migrations/20240115_burger_match_social_tables.sql
-- Pegar y ejecutar
```

**Verificar:**
```sql
SELECT * FROM burger_matches LIMIT 1; -- Debe devolver 0 filas, no error
```

---

### 2. "RLS policy violation - insert row violates row level security policy"

**Problema:** El usuario no está autenticado o la policy no es correcta.

**Solución:**
```tsx
// Verificar que el usuario está autenticado
const { data: { session } } = await supabase.auth.getSession()
console.log('Authenticated:', !!session)

// Si null, redirigir a login
if (!session) {
  router.push('/auth/login')
}
```

**En Supabase:**
```
Database > Authentication > Users > Verificar que el usuario existe
Database > RLS > burger_matches > Verificar policies
```

---

### 3. "TypeError: Cannot read property 'id' of undefined"

**Problema:** El userId no se pasó correctamente.

**Solución:**
```tsx
// ❌ Incorrecto
<BurgerMatchSection userId={undefined} />

// ✅ Correcto
const { user } = useAuth()
if (!user) return <NotLoggedIn />

<BurgerMatchSection userId={user.id} />
```

---

### 4. "Componente no renderiza / Pantalla en blanco"

**Problema:** Import incorrecto o falta componente.

**Solución:**
```tsx
// ✅ Verificar paths
import BurgerMatchSection from '@/components/profile/burger-match-section'
// No: import BurgerMatchSection from './burger-match-section'

// ✅ Verificar que los archivos existen
ls -la components/profile/burger-match-section.tsx

// ✅ Verificar imports dentro del componente
grep "from '@/components" components/profile/burger-match-section.tsx
```

---

### 5. "API returns 401 Unauthorized"

**Problema:** Supabase client no está configurado correctamente.

**Solución:**
```tsx
// Verificar env variables
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Debe haber valores, no undefined
```

**.env.local:**
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

### 6. "getMatchStats returns empty object"

**Problema:** El usuario no tiene datos en burger_matches.

**Solución:**
```tsx
// Esperar a que el usuario juegue matches
// O crear datos de prueba

import { submitMatch } from '@/lib/api/burger-match'

await submitMatch(
  userId,
  burger1Id,
  burger2Id,
  burger1Id // winner
)

// Ahora getMatchStats debe devolver datos
```

---

### 7. "Mobile layout looks wrong"

**Problema:** Las animaciones o breakpoints no funcionan.

**Solución:**
```tsx
// Verificar que Tailwind está compilado
npm run build

// Verificar en DevTools (F12 > Toggle device toolbar)
// Responsive design debe cambiar en 768px

// Si sigue mal, revisar media queries
```

---

### 8. "Confetti no aparece"

**Problema:** Confetti solo se muestra cada 10 matches.

**Solución:**
```tsx
// Confetti es intencional solo en milestones
// Para probar, cambia en match-feedback.tsx:

// ❌ Original
if (matchCount % 10 === 0) showConfetti()

// ✅ Para testing (muestra siempre)
if (true) showConfetti()

// ✅ Vuelve a original después
if (matchCount % 10 === 0) showConfetti()
```

---

### 9. "Follow button no actualiza el contador"

**Problema:** followers_count no se actualiza.

**Solución:**
```tsx
// Verificar que la operación se completa
const { data, error } = await followUser(userId, targetId)
console.log(error) // Debe ser null

// Refrescar la página o hacer refetch
// El contador debe actualizar automáticamente
```

---

### 10. "TypeScript error: Property 'X' does not exist"

**Problema:** Type mismatch en props.

**Solución:**
```tsx
// Verificar tipos de props
interface BurgerMatchSectionProps {
  userId: string  // ← Debe ser string, no number
  onClose?: () => void
}

// Pasar tipo correcto
<BurgerMatchSection userId={userId} /> // ✅ string
<BurgerMatchSection userId={userId.id} /> // ✅ si userId es object
```

---

## ⚠️ Warnings Comunes

### Warning: "Each child in a list should have a unique 'key' prop"

**Solución:**
```tsx
// Siempre incluir key en arrays
{items.map((item) => (
  <Component key={item.id} data={item} />  // ← Key siempre
))}
```

---

### Warning: "Found multiple instances of React"

**Solución:**
```bash
npm ls react  # Verificar versiones
npm install react@latest react-dom@latest  # Actualizar
```

---

### Warning: "Can't call useState inside useEffect"

**Solución:**
```tsx
// ✅ Correcto
useEffect(() => {
  const [state, setState] = useState() // ✅ NO hacer esto
  // ...
}, [])

// ✅ Correcto
const [state, setState] = useState()

useEffect(() => {
  // Usar state aquí
}, [])
```

---

## 🔍 Debugging Tips

### Ver logs de Supabase
```tsx
// En componente
const { data, error } = await getMatchStats(userId)
console.log('Stats:', data)
console.log('Error:', error)
```

### Ver RLS policies en acción
```sql
-- En Supabase SQL Editor
SELECT * FROM burger_matches WHERE user_id = 'your_uuid'
```

### Ver network requests
```
F12 > Network > Fetch/XHR
```

---

## 📋 Checklist de Setup

- [ ] Migración SQL ejecutada (0 errores)
- [ ] Supabase URL en .env.local
- [ ] Supabase Key en .env.local
- [ ] npm run build (sin errores)
- [ ] Componentes importados correctamente
- [ ] Usuario autenticado
- [ ] Database RLS habilitado
- [ ] Seeds o datos de prueba si needed

---

## 🧪 Testing

### Test básico
```tsx
// app/test/page.tsx
'use client'

import { useState } from 'react'
import { getMatchStats } from '@/lib/api/burger-match'

export default function TestPage() {
  const [stats, setStats] = useState(null)

  const handleTest = async () => {
    const result = await getMatchStats('test-user-id')
    setStats(result)
    console.log('Result:', result)
  }

  return (
    <div className="p-8">
      <button onClick={handleTest} className="px-4 py-2 bg-blue-500 text-white rounded">
        Test API
      </button>
      <pre className="mt-4">{JSON.stringify(stats, null, 2)}</pre>
    </div>
  )
}
```

---

## 🆘 Si Nada Funciona

### Paso 1: Verificar Migraciones
```sql
-- En Supabase
SELECT * FROM information_schema.tables WHERE table_schema = 'public'
-- Debe mostrar: burger_matches, follows, user_activity
```

### Paso 2: Verificar Auth
```tsx
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
// Debe tener user object con id
```

### Paso 3: Test API
```tsx
const result = await getMatchStats(session.user.id)
console.log('Result:', result)
// Debe retornar objeto, no error
```

### Paso 4: Test Component
```tsx
<BurgerMatchSection userId={session.user.id} />
// Debe renderizar sin errores
```

### Paso 5: Contact
Si aún no funciona, revisar:
- BURGER_MATCH_SOCIAL_DOCS.md
- INTEGRATION_GUIDE.tsx
- Console logs (F12)

---

## 📞 Recursos

| Recurso | Ubicación |
|---------|-----------|
| Documentación | BURGER_MATCH_SOCIAL_DOCS.md |
| Ejemplos | INTEGRATION_GUIDE.tsx |
| Quick Start | QUICK_START_V2.md |
| Estructura | FILE_STRUCTURE.md |
| APIs | lib/api/\*.ts |

---

## ✅ Verificación Final

```tsx
// Ejecutar este código para verificar todo

import { getMatchStats } from '@/lib/api/burger-match'
import { getFollowers } from '@/lib/api/social'
import { useAuth } from '@/hooks/useAuth'

export function VerifySetup() {
  const { user } = useAuth()

  if (!user) {
    return <div>❌ User not authenticated</div>
  }

  return (
    <div className="p-8 space-y-4">
      <div>✅ User authenticated: {user.id}</div>
      
      <TestAPI endpoint="getMatchStats" fn={() => getMatchStats(user.id)} />
      <TestAPI endpoint="getFollowers" fn={() => getFollowers(user.id)} />
    </div>
  )
}

function TestAPI({ endpoint, fn }: { endpoint: string; fn: () => Promise<any> }) {
  const [status, setStatus] = useState('pending')
  
  useEffect(() => {
    fn()
      .then(() => setStatus('✅ OK'))
      .catch(() => setStatus('❌ ERROR'))
  }, [])

  return <div>{endpoint}: {status}</div>
}
```

---

**¿Problemas? Revisa BURGER_MATCH_SOCIAL_DOCS.md para más detalles** 📖
