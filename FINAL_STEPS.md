# 🎯 PASOS FINALES - Como Ejecutar Tus Migraciones

## PASO 1: Elige Tu Método

### Opción A: Python (RECOMENDADO) ⭐

**Ventajas:**
- ✅ Funciona en Windows, Mac y Linux
- ✅ Mejor manejo de errores
- ✅ Muestra progreso detallado
- ✅ Valida base de datos al final

**Instrucciones:**

```bash
# 1. Abre una terminal en tu proyecto
# En VS Code: Terminal > Nueva Terminal

# 2. Instala la dependencia (solo la primera vez)
pip install psycopg2-binary

# 3. Ejecuta el script
python run_migrations.py
```

**Tiempo esperado:** 10-20 segundos

---

### Opción B: PowerShell (Windows) 💻

**Ventajas:**
- ✅ Nativo en Windows
- ✅ Rápido
- ✅ Salida con colores

**Instrucciones:**

```powershell
# 1. Obtén tu contraseña de Supabase:
#    - Ve a https://app.supabase.com
#    - Proyecto → Settings → Database → "Database Password"
#    - Copia la contraseña

# 2. Ejecuta en PowerShell
.\run_migrations.ps1 -Password "tu_contraseña_de_supabase"
```

**Nota:** Asegúrate que `psql` esté en tu PATH

---

### Opción C: Manual (Sin Código) 🖱️

**Instrucciones paso a paso:**

1. Abre https://app.supabase.com en tu navegador
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto "burgerank_project"
4. Ve a **SQL Editor**
5. Haz clic en **Crear nueva query**
6. **COPIA TODO** el contenido de estos archivos **EN ORDEN**:

   **Paso 1:** Abre `supabase/migrations/001_schema.sql`
   - Copia TODO el contenido
   - Pégalo en Supabase SQL Editor
   - Haz clic en **RUN** (botón azul)
   - Espera a que termine (sin errores)

   **Paso 2:** Abre `supabase/migrations/002_functions.sql`
   - Copia TODO el contenido
   - Pégalo en Supabase SQL Editor
   - Haz clic en **RUN**
   - Espera a que termine

   **Paso 3:** Abre `supabase/migrations/003_triggers.sql`
   - Copia TODO
   - Pégalo
   - RUN

   **Paso 4:** Abre `supabase/migrations/004_rls_policies.sql`
   - Copia TODO
   - Pégalo
   - RUN

   **Paso 5:** Abre `supabase/migrations/005_seed_data.sql`
   - Copia TODO
   - Pégalo
   - RUN

   **Paso 6:** Abre `supabase/migrations/006_materialized_views.sql`
   - Copia TODO
   - Pégalo
   - RUN

**Tiempo esperado:** 2-3 minutos

---

## PASO 2: Verifica que Todo Funcionó

Después de ejecutar las migraciones, corre estas queries para verificar:

### Opción 1: En Supabase SQL Editor

Copia y pega cada query debajo y haz clic en RUN:

```sql
-- Query 1: Contar tablas
SELECT 
  COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema='public';
```

**Resultado esperado:** `total_tablas: 12`

---

```sql
-- Query 2: Contar datos iniciales
SELECT 'Rewards' as tipo, COUNT(*) as cantidad FROM rewards
UNION ALL
SELECT 'Restaurants', COUNT(*) FROM restaurants
UNION ALL
SELECT 'Burgers', COUNT(*) FROM burgers
ORDER BY tipo;
```

**Resultado esperado:**
```
Burgers:      9
Restaurants:  5
Rewards:      12
```

---

```sql
-- Query 3: Listar todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema='public'
ORDER BY table_name;
```

**Resultado esperado:** Deberías ver 12 tablas

---

### Opción 2: Usar el verificador Python

```bash
python check_status.py
```

---

## PASO 3: Inicia Tu Aplicación

```bash
# En la terminal del proyecto, ejecuta:
npm run dev
```

**Resultado esperado:**
```
> burgerank_project@0.1.0 dev
> next dev

> Ready in 2.34s
> Local:        http://localhost:3000
> Environments: .env.local
```

---

## PASO 4: Accede a Tu App

1. Abre tu navegador
2. Ve a http://localhost:3000
3. ¡Debería cargar sin errores!

Si ves errores de conexión, verifica:
- ✅ Las variables de entorno en `.env.local` son correctas
- ✅ Las migraciones se ejecutaron sin errores
- ✅ Tienes conexión a internet
- ✅ Tu proyecto Supabase está activo

---

## 🆘 Si Algo Sale Mal

### Error: "psycopg2 not installed"
```bash
pip install psycopg2-binary
```

### Error: "syntax error near ("
Este error ya fue corregido. Asegúrate que estás usando los archivos de este proyecto.

Si aún así ves el error:
1. Ve a Supabase SQL Editor
2. Ejecuta esto para limpiar:
   ```sql
   DROP TABLE IF EXISTS user_rewards CASCADE;
   ```
3. Vuelve a ejecutar `001_schema.sql`

### Error: "Connection refused"
1. Verifica que tu proyecto Supabase esté activo
2. Abre https://app.supabase.com y verifica el estado
3. Si está offline, haz clic en "Start project"

### Error: "relation already exists"
Significa que las tablas ya fueron creadas. Dos opciones:

**Opción 1:** Usa las tablas existentes (solo verifica que estén bien)

**Opción 2:** Reinicia la BD (CUIDADO: borra TODO)
```sql
-- En Supabase SQL Editor:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Luego vuelve a ejecutar todas las migraciones desde 001 a 006.

---

## 📋 Checklist Final

- [ ] Elegí un método (Python, PowerShell, o Manual)
- [ ] Ejecuté las migraciones sin errores
- [ ] Verifiqué que las 12 tablas existen
- [ ] Verifiqué que los datos iniciales están presentes
- [ ] Ejecuté `npm run dev`
- [ ] Mi app carga en http://localhost:3000
- [ ] Mi app conecta a Supabase sin errores

---

## 🎉 ¡Listo!

Si completaste todos los pasos anteriores, ¡tu base de datos está completamente operativa!

Ahora puedes:
1. ✅ Navegar por tu app
2. ✅ Crear usuarios (signup)
3. ✅ Crear reseñas de hamburguesas
4. ✅ Ver rankings
5. ✅ Usar todas las funcionalidades

---

## 📞 Información Útil

**Acceso a Supabase Dashboard:**
- https://app.supabase.com

**SQL Editor en Supabase:**
- Proyecto → SQL Editor

**Logs de tu app:**
- En VS Code → Terminal (verás los logs en tiempo real)

**Documentación oficial:**
- https://supabase.com/docs

---

**¡Buen trabajo! Tu base de datos está lista.** 🚀

Cualquier duda, revisa los archivos de documentación:
- `QUICK_START.md` - Guía rápida
- `SQL_CORRECTIONS.md` - Detalles del error corregido
- `MIGRATION_GUIDE.md` - Documentación técnica completa
