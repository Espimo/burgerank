# 🔍 Verificar Estado de Admin

## Paso 1: Verificar en Supabase

Ve a tu proyecto Supabase → **Table Editor** → Tabla `users`

Busca tu usuario y verifica que la columna `is_admin` tenga el valor `true`.

**Si no ves la columna `is_admin`:**
- Ve al **SQL Editor** y ejecuta:
```sql
SELECT * FROM public.users WHERE email = 'TU_EMAIL_AQUI';
```

**Si `is_admin` es `NULL` o `false`:**
- Ejecuta esto en el SQL Editor:
```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'TU_EMAIL_AQUI';

-- Verifica que funcionó:
SELECT id, username, email, is_admin FROM public.users WHERE email = 'TU_EMAIL_AQUI';
```

## Paso 2: Verificar en la App

1. Ve a https://burgerank.vercel.app
2. Abre la **Consola de Desarrollador** (F12)
3. Ve a la pestaña **Console**
4. Pega este código:

```javascript
// Verificar usuario autenticado
const checkAdmin = async () => {
  const supabase = window.supabase || (await import('@supabase/supabase-js')).createClient(
    'TU_SUPABASE_URL',
    'TU_SUPABASE_ANON_KEY'
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Usuario autenticado:', user?.id, user?.email);
  
  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, is_admin')
      .eq('id', user.id)
      .single();
    
    console.log('Datos del usuario:', data);
    console.log('Error (si hay):', error);
  }
};

checkAdmin();
```

## Paso 3: Verificar las Políticas RLS

En Supabase, ve a **Authentication** → **Policies** → Tabla `users`

Deberías ver estas políticas:
- ✅ `Admins can read all users` (SELECT)
- ✅ `Admins can update users` (UPDATE)

**Si NO están activas o NO existen**, ejecuta este SQL:

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política de lectura para admins
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Política de actualización para admins
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );
```

## Paso 4: Limpiar Caché

Después de hacer cambios:

1. Cierra sesión en BurgeRank
2. Limpia el caché del navegador (Ctrl + Shift + Delete)
3. Inicia sesión nuevamente
4. Ve a `/admin`

## Solución Alternativa: Deshabilitar Temporalmente RLS

Si nada funciona, temporalmente puedes verificar sin RLS:

```sql
-- SOLO PARA DIAGNÓSTICO - NO DEJAR ASÍ EN PRODUCCIÓN
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verifica que puedas leer el campo
SELECT id, username, email, is_admin 
FROM public.users 
WHERE email = 'TU_EMAIL';

-- Si funciona, el problema es RLS
-- RE-HABILÍTALO INMEDIATAMENTE:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## ¿Qué información necesito?

Por favor, dime:
1. ¿Ves la columna `is_admin` en la tabla users?
2. ¿Cuál es el valor de `is_admin` para tu usuario? (true/false/null)
3. ¿Qué aparece en la consola del navegador cuando vas a `/admin`?
4. ¿Ves algún error en la consola?
