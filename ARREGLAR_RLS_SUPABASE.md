# 🔧 CÓMO ARREGLAR LOS ERRORES DE RLS EN SUPABASE

## 📋 ERRORES ACTUALES
- ❌ 401 - No puedes insertar usuario durante signup
- ❌ 403 - No puedes leer tu propio perfil
- ❌ permission denied for schema public

**CAUSA:** Las RLS policies no están correctamente configuradas.

---

## ✅ SOLUCIÓN: Ejecutar SQL en Supabase

### PASO 1: Accede a Supabase SQL Editor
1. Ve a https://app.supabase.com/
2. Selecciona tu proyecto `burgerank`
3. En el menú izquierdo → **SQL Editor**
4. Click en **+ New Query**

### PASO 2: Copia y pega este SQL (VERSIÓN SIMPLIFICADA PRIMERO)

```sql
-- STEP 1: LIMPIAR POLÍTICAS ANTIGUAS
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- STEP 2: HABILITAR RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 3: POLÍTICA PARA LEER PROPIO PERFIL
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- STEP 4: POLÍTICA PARA VER PERFILES PÚBLICOS
CREATE POLICY "Anyone can view public profiles"
  ON public.users
  FOR SELECT
  USING (public_profile = true);

-- STEP 5: POLÍTICA PARA ACTUALIZAR PROPIO PERFIL
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- STEP 6: POLÍTICA PARA INSERTAR PROPIO PERFIL (SIGNUP)
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### PASO 3: Dale RUN

Si todo sale bien, verás: **"Query executed successfully"**

---

## 🧪 VERIFICAR QUE FUNCIONÓ

1. Regresa a la página de signup: https://burgerank.vercel.app/auth/signup
2. Intenta registrarte con:
   - Email: `test@example.com`
   - Usuario: `testuser`
   - Contraseña: `Test123456`

3. Si aún hay errores, ejecuta ESTA QUERY para ver las políticas:

```sql
SELECT tablename, policyname, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';
```

---

## 🆘 SI SIGUE SIN FUNCIONAR

Ejecuta esta versión alternativa que es más permisiva:

```sql
-- Deshabilita RLS temporalmente para probar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Luego intenta registrarte
```

Si funciona sin RLS, entonces el problema es la configuración de RLS. En ese caso necesitaremos:
- Usar un service_role_key en el backend
- O crear una función SQL personalizada
- O usar Supabase Auth hooks

---

## 📝 NOTAS IMPORTANTES

1. **El signup ocurre en el servidor** (app/api/auth/signup/route.ts)
   - Usa el ANON_KEY de Supabase
   - Por eso necesita permisos específicos en RLS

2. **Las políticas que necesitas:**
   - `INSERT` - Para crear el usuario durante signup
   - `SELECT` - Para leer el propio perfil después
   - `UPDATE` - Para modificar el perfil

3. **Los errores 401/403/42501** todos indican:
   - RLS está denegando el acceso
   - Necesitas crear las políticas correctas

---

## ✨ PRÓXIMOS PASOS

Una vez que el signup funcione:
1. Prueba el login
2. Verifica que ves el modal de bienvenida
3. Prueba calificar una hamburguesa
4. Verifica que los rankings se actualizan
