# 🍔 BurgeRank Database Migration Guide

## Índice de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Estructura de Migraciones](#estructura-de-migraciones)
4. [Instrucciones de Ejecución](#instrucciones-de-ejecución)
5. [Verificación Post-Migración](#verificación-post-migración)
6. [Troubleshooting](#troubleshooting)
7. [Mantenimiento](#mantenimiento)

---

## Introducción

Esta guía describe cómo ejecutar las migraciones de base de datos PostgreSQL para BurgeRank en Supabase. Las migraciones están organizadas en orden secuencial y cada una cumple un propósito específico.

### Archivo de Credenciales

✅ **COMPLETADO**: Las credenciales de Supabase ya están configuradas en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Requisitos Previos

Antes de ejecutar las migraciones, asegúrate de:

✅ Tener acceso a tu proyecto Supabase en https://app.supabase.com  
✅ Ser un usuario con rol `admin` en el proyecto  
✅ Tener acceso a la base de datos PostgreSQL  
✅ Haber confirmado la conexión a través del SQL Editor de Supabase  

### Acceder al SQL Editor

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto BurgeRank
3. En el menú izquierdo, haz clic en **SQL Editor**
4. Verás una ventana para escribir/pegar SQL

---

## Estructura de Migraciones

Las migraciones están organizadas en el directorio `supabase/migrations/`:

```
supabase/migrations/
├── 001_schema.sql          # Esquema base: tablas, enums, índices
├── 002_functions.sql       # Funciones PostgreSQL: cálculos, lógica de negocio
├── 003_triggers.sql        # Triggers: automatización, actualizaciones en cascada
├── 004_rls_policies.sql    # Row Level Security: control de acceso
├── 005_seed_data.sql       # Datos iniciales: rewards, badges, restaurantes
└── 006_materialized_views.sql # Vistas optimizadas para queries complejas
```

### Descripción de Cada Migración

#### 1. **001_schema.sql** - Esquema Base
**Contenido:**
- Extensiones PostgreSQL (UUID, pgcrypto)
- 6 tipos ENUM (user_level, burger_type, reward_type, badge_type, price_range, tag_category)
- 12 tablas principales:
  - `profiles` - Perfiles de usuario
  - `restaurants` - Restaurantes
  - `burgers` - Menú de hamburguesas
  - `reviews` - Valoraciones y reseñas
  - `review_tags` - Etiquetas de reseñas
  - `review_images` - Imágenes de reseñas
  - `user_badges` - Insignias de usuario
  - `rewards` - Premios canjeables
  - `user_rewards` - Premios redimidos por usuarios
  - `burger_matches` - Resultados del mini-juego
  - `follows` - Relaciones de seguimiento
  - `user_preferences` - Preferencias de usuario
- Índices para optimización de queries
- Constraints y validaciones de datos

**Tiempo estimado:** 2-5 segundos

#### 2. **002_functions.sql** - Funciones PostgreSQL
**Contenido:**
- `update_updated_at()` - Función genérica para timestamps
- `calculate_burger_ranking()` - Algoritmo de ranking ponderado
- `update_burger_stats()` - Actualiza ratings y estadísticas
- `update_restaurant_stats()` - Estadísticas de restaurantes
- `update_user_stats()` - Estadísticas de usuarios
- `update_user_level()` - Cálculo de nivel según puntos (burger_fan → burger_lover → burger_obsessed)
- `add_user_points()` - Añadir puntos de forma segura
- `redeem_user_points()` - Canjear puntos de forma segura
- `check_and_unlock_badges()` - Sistema de logros
- `generate_qr_code()` - Generador de códigos QR únicos
- `mark_burger_not_new()` - Marcas burgers como no nuevas después de 30 días
- `calculate_match_score()` - Puntuación del mini-juego

**Tiempo estimado:** 1-3 segundos

#### 3. **003_triggers.sql** - Triggers y Automatización
**Contenido:**
- Triggers de `updated_at` en 6 tablas
- Trigger `on_review_inserted` - Actualiza stats + otorga puntos (10 + 5 bonus)
- Trigger `on_review_updated` - Recalcula rankings
- Trigger `on_review_deleted` - Actualiza stats + retira puntos
- Trigger `on_profile_points_changed` - Actualiza nivel de usuario
- Trigger `on_burger_match_inserted` - Actualiza match scores
- Triggers de inicialización (badges, preferencias)
- Trigger `on_review_image_inserted` - Auto-verifica reseñas con imágenes

**Tiempo estimado:** 2-4 segundos

#### 4. **004_rls_policies.sql** - Row Level Security
**Contenido:**
- Funciones helper: `is_admin()`, `is_moderator()`
- 50+ políticas de seguridad para todas las tablas
- Políticas de lectura, inserción, actualización y eliminación
- Política principal: "Usuarios pueden leer todo contenido público, pero solo modificar el suyo"
- Políticas para roles: user, moderator, admin

**Tiempo estimado:** 3-5 segundos

#### 5. **005_seed_data.sql** - Datos Iniciales
**Contenido:**
- 12 rewards diferentes (descuentos, items gratis, experiencias VIP)
- 5 restaurantes de ejemplo con ubicaciones en España
- 9 hamburguesas de prueba con distintos tipos
- Funciones de verificación de seed data
- Consultas de verificación comentadas

**Tiempo estimado:** 1-2 segundos

#### 6. **006_materialized_views.sql** - Vistas Optimizadas
**Contenido:**
- `top_burgers_view` - Ranking general de hamburguesas
- `new_burgers_view` - Hamburguesas nuevas (últimas 30 días)
- `user_stats_view` - Estadísticas agregadas por usuario
- `restaurant_rankings_view` - Ranking de restaurantes
- `trending_burgers_view` - Hamburguesas en tendencia (últimos 7 días)
- `burger_reviews_detailed_view` - Reseñas con info del reviewer
- `user_rewards_status_view` - Estado de premios del usuario
- Función `refresh_all_materialized_views()`

**Tiempo estimado:** 3-5 segundos

---

## Instrucciones de Ejecución

### Opción A: Ejecución Manual (Recomendado para Primera Vez)

1. **Abre Supabase SQL Editor**
   - Ve a https://app.supabase.com
   - Selecciona tu proyecto
   - Click en "SQL Editor" (menú izquierdo)

2. **Ejecuta cada migración en orden:**

   **Paso 1 - Copia el contenido de `001_schema.sql`:**
   ```sql
   -- Copia TODO el contenido de 001_schema.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

   **Paso 2 - Copia el contenido de `002_functions.sql`:**
   ```sql
   -- Copia TODO el contenido de 002_functions.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

   **Paso 3 - Copia el contenido de `003_triggers.sql`:**
   ```sql
   -- Copia TODO el contenido de 003_triggers.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

   **Paso 4 - Copia el contenido de `004_rls_policies.sql`:**
   ```sql
   -- Copia TODO el contenido de 004_rls_policies.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

   **Paso 5 - Copia el contenido de `005_seed_data.sql`:**
   ```sql
   -- Copia TODO el contenido de 005_seed_data.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

   **Paso 6 - Copia el contenido de `006_materialized_views.sql`:**
   ```sql
   -- Copia TODO el contenido de 006_materialized_views.sql
   -- Pégalo en el SQL Editor
   -- Haz clic en "Run"
   ```

3. **Tiempo total aproximado:** 15-25 segundos

### Opción B: Con psql (CLI - Para Usuarios Avanzados)

Si tienes instalado `psql` (cliente PostgreSQL):

```bash
# 1. Obtén tu connection string de Supabase
# En Supabase: Settings → Database → Connection string → psql

# 2. Conecta a tu base de datos
psql "postgresql://[usuario]:[password]@[host]:5432/[database]"

# 3. Ejecuta cada migración en orden
\i supabase/migrations/001_schema.sql
\i supabase/migrations/002_functions.sql
\i supabase/migrations/003_triggers.sql
\i supabase/migrations/004_rls_policies.sql
\i supabase/migrations/005_seed_data.sql
\i supabase/migrations/006_materialized_views.sql

# 4. Verifica la instalación
\dt  -- Lista todas las tablas
```

### Opción C: Script Automatizado (Python)

```python
# install_migrations.py
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Conecta a Supabase
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password=os.getenv("SUPABASE_DB_PASSWORD"),
    host=os.getenv("SUPABASE_DB_HOST"),
    port=5432
)
cursor = conn.cursor()

# Ejecuta migraciones en orden
migrations = [
    "supabase/migrations/001_schema.sql",
    "supabase/migrations/002_functions.sql",
    "supabase/migrations/003_triggers.sql",
    "supabase/migrations/004_rls_policies.sql",
    "supabase/migrations/005_seed_data.sql",
    "supabase/migrations/006_materialized_views.sql"
]

for migration in migrations:
    with open(migration, 'r') as f:
        sql = f.read()
        cursor.execute(sql)
        print(f"✅ Ejecutada: {migration}")

conn.commit()
cursor.close()
conn.close()
print("✅ Todas las migraciones completadas!")
```

---

## Verificación Post-Migración

Después de ejecutar todas las migraciones, verifica que todo esté correctamente instalado:

### 1. Verifica Tablas Creadas

En el SQL Editor, ejecuta:

```sql
-- Debería devolver 12 tablas
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Esperado:** 12 tablas
- burgers
- burger_matches
- follows
- profiles
- restaurants
- review_images
- review_tags
- reviews
- rewards
- user_badges
- user_preferences
- user_rewards

### 2. Verifica Funciones Creadas

```sql
-- Debería devolver 12+ funciones
SELECT schemaname, proname 
FROM pg_proc 
WHERE schemaname = 'public' 
ORDER BY proname;
```

**Esperado:** Mínimo 12 funciones (update_updated_at, calculate_burger_ranking, etc.)

### 3. Verifica Triggers Creados

```sql
-- Debería devolver 15+ triggers
SELECT trigger_schema, trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
```

### 4. Verifica Rewards Insertados

```sql
-- Debería devolver 12 rewards
SELECT COUNT(*) as rewards_count FROM rewards;
```

**Esperado:** 12

### 5. Verifica Restaurantes de Prueba

```sql
-- Debería devolver 5 restaurantes
SELECT COUNT(*) as restaurants_count FROM restaurants;
```

**Esperado:** 5

### 6. Verifica Hamburguesas de Prueba

```sql
-- Debería devolver 9 hamburguesas
SELECT COUNT(*) as burgers_count FROM burgers;
```

**Esperado:** 9

### 7. Verifica Vistas Materializadas Creadas

```sql
-- Debería devolver 7 vistas materializadas
SELECT schemaname, matviewname 
FROM pg_matviews 
WHERE schemaname = 'public' 
ORDER BY matviewname;
```

**Esperado:** 7 vistas
- burger_reviews_detailed_view
- new_burgers_view
- restaurant_rankings_view
- top_burgers_view
- trending_burgers_view
- user_rewards_status_view
- user_stats_view

### Script de Verificación Completo

Ejecuta esto en el SQL Editor para verificar todo:

```sql
-- ============================================================================
-- VERIFICACIÓN COMPLETA DE MIGRACIONES BurgeRank
-- ============================================================================

-- 1. Contar tablas
SELECT 'TABLAS' as categoria, COUNT(*) as cantidad 
FROM pg_tables WHERE schemaname = 'public'
UNION ALL
-- 2. Contar funciones
SELECT 'FUNCIONES', COUNT(*) 
FROM pg_proc WHERE schemaname = 'public'
UNION ALL
-- 3. Contar triggers
SELECT 'TRIGGERS', COUNT(*) 
FROM information_schema.triggers WHERE trigger_schema = 'public'
UNION ALL
-- 4. Contar políticas RLS
SELECT 'POLITICAS RLS', COUNT(*) 
FROM pg_policies WHERE schemaname = 'public'
UNION ALL
-- 5. Contar vistas materializadas
SELECT 'VISTAS MATERIALIZADAS', COUNT(*) 
FROM pg_matviews WHERE schemaname = 'public'
UNION ALL
-- 6. Datos de rewards
SELECT 'REWARDS', COUNT(*) FROM rewards
UNION ALL
-- 7. Datos de restaurantes
SELECT 'RESTAURANTES', COUNT(*) FROM restaurants
UNION ALL
-- 8. Datos de hamburguesas
SELECT 'HAMBURGUESAS', COUNT(*) FROM burgers
ORDER BY categoria;

-- También lista los rewards disponibles:
SELECT '=== REWARDS DISPONIBLES ===' as info;
SELECT name, points_cost, reward_type, required_level FROM rewards ORDER BY points_cost;

-- Y lista los restaurantes:
SELECT '=== RESTAURANTES ===' as info;
SELECT name, city, average_rating FROM restaurants ORDER BY average_rating DESC;
```

---

## Troubleshooting

### Error: "relation "profiles" already exists"

**Problema:** Intentaste ejecutar las migraciones dos veces.

**Solución:**
1. Ve a Supabase → SQL Editor
2. Ejecuta este script para limpiar:
```sql
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
3. Luego vuelve a ejecutar las migraciones desde el paso 1

### Error: "CREATE EXTENSION IF NOT EXISTS failed"

**Problema:** Las extensiones no se pueden crear.

**Solución:**
En Supabase, las extensiones `uuid-ossp` y `pgcrypto` ya están disponibles. Si ves este error, ignóralo y continúa con la siguiente migración.

### Error: "role "anon" does not exist"

**Problema:** Las políticas RLS referencian roles de Supabase que no existen.

**Solución:**
Esto es normal en Supabase. Los roles `authenticated` y `anon` se crean automáticamente. Ignora este error.

### Error: "function "uuid_generate_v4" does not exist"

**Problema:** La extensión uuid no se instaló correctamente.

**Solución:**
En el SQL Editor de Supabase, ejecuta:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Las Vistas Materializadas no cargan datos

**Problema:** Las vistas están vacías o lentas.

**Solución:**
Primero inserta algunos datos:
```sql
-- Ejecuta 005_seed_data.sql si no lo has hecho
-- Luego refresca las vistas:
SELECT refresh_all_materialized_views();
```

---

## Mantenimiento

### Refrescar Vistas Materializadas

Las vistas materializadas necesitan ser refrescadas periódicamente para mantener datos actualizados:

```sql
-- Refrescar todas las vistas
SELECT refresh_all_materialized_views();

-- O refrescar una específica
REFRESH MATERIALIZED VIEW CONCURRENTLY top_burgers_view;
```

**Recomendación:** Usa un cron job en Supabase para ejecutar esto diariamente:

```sql
-- En Supabase, crea una función que se ejecute diariamente
CREATE OR REPLACE FUNCTION scheduled_refresh_views()
RETURNS VOID AS $$
BEGIN
  -- Esto se ejecutará automáticamente cada día
  PERFORM refresh_all_materialized_views();
  PERFORM mark_burger_not_new();
END;
$$ LANGUAGE plpgsql;
```

### Monitorear Performance

```sql
-- Ver índices que no se usan
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Ver tablas más grandes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Hacer Backup

En Supabase:
1. Ve a Project Settings
2. Backups
3. Haz clic en "Back up now"

---

## Configuración de la Aplicación Next.js

Una vez que las migraciones estén completas, tu aplicación Next.js está lista para conectar:

### 1. Las credenciales ya están en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Inicia tu aplicación:

```bash
npm run dev
```

### 3. Accede a http://localhost:3000

¡Tu aplicación BurgeRank completa con base de datos configurada! 🍔

---

## Resumen de Cambios en la Base de Datos

| Aspecto | Detalles |
|--------|----------|
| **Tablas Creadas** | 12 |
| **Funciones Creadas** | 12+ |
| **Triggers Creados** | 15+ |
| **Políticas RLS** | 50+ |
| **Vistas Materializadas** | 7 |
| **Tipos Enumerados** | 6 |
| **Índices Creados** | 40+ |
| **Rewards Iniciales** | 12 |
| **Restaurantes de Prueba** | 5 |
| **Hamburguesas de Prueba** | 9 |

---

## Siguiente Paso

Una vez completadas las migraciones, lee `QUICKSTART.md` para:
1. Crear tu primer usuario
2. Cargar datos iniciales
3. Testear toda la aplicación

---

## Soporte

Si encuentras problemas:

1. **Verifica el error en el SQL Editor de Supabase**
2. **Consulta la sección Troubleshooting arriba**
3. **Revisa los logs en Supabase → Logs**
4. **Intenta ejecutar queries de verificación**

---

**¡Felicidades! 🎉 Tu base de datos BurgeRank está configurada y lista para usarse.**

Para más información, consulta los archivos SQL individuales en `supabase/migrations/`.
