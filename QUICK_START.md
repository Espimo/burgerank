# 🚀 GUÍA RÁPIDA DE EJECUCIÓN - BurgeRank Database

## Estado Actual ✅
- ✅ Todas las correcciones SQL aplicadas
- ✅ Scripts de automatización listos
- ✅ Documentación completa
- ✅ Variables de entorno configuradas

---

## PASO 1: Verifica Todo Esté Correcto

```powershell
# Ejecuta el verificador
python verify_setup.py
```

**Esperado:** Todos los checks deben pasar (✅ verde)

---

## PASO 2: Elige un Método de Ejecución

### 🐍 OPCIÓN A: Python (RECOMENDADO - Windows/Mac/Linux)

```bash
# 1. Instala dependencias
pip install psycopg2-binary python-dotenv

# 2. Obtén tu contraseña de Supabase:
#    - Ve a https://app.supabase.com
#    - Proyecto → Configuración → Database
#    - Busca "Connection string" o "Database Password"
#    - Copia la contraseña

# 3. Actualiza .env.local con:
#    SUPABASE_DB_PASSWORD=tu_contraseña_aqui

# 4. Ejecuta
python run_migrations.py
```

**Tiempo esperado:** 10-20 segundos

**Ventajas:**
- ✅ Multiplataforma
- ✅ Mejor manejo de errores
- ✅ Validación automática
- ✅ Log detallado

---

### 💻 OPCIÓN B: PowerShell (Windows)

```powershell
# 1. Asegúrate que psql esté en tu PATH
#    (Supabase CLI o PostgreSQL instalado)

# 2. Ejecuta con tu contraseña de Supabase
.\run_migrations.ps1 -Password "tu_contraseña_aqui"
```

**Ventajas:**
- ✅ Nativo en Windows
- ✅ Salida con colores
- ✅ Rápido

---

### 🖱️ OPCIÓN C: Manual en Supabase (Sin código)

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Crea una nueva query
5. Copia **TODO** el contenido de cada archivo en orden:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_functions.sql`
   - `supabase/migrations/003_triggers.sql`
   - `supabase/migrations/004_rls_policies.sql`
   - `supabase/migrations/005_seed_data.sql`
   - `supabase/migrations/006_materialized_views.sql`
6. Haz clic en **Run** para cada uno
7. ¡Listo! 

**Tiempo esperado:** 2-3 minutos manual

---

## PASO 3: Verifica la Base de Datos

Después de ejecutar las migraciones, corre estas queries en Supabase SQL Editor:

```sql
-- Contar objetos creados
SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public') as tablas,
  (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema='public') as funciones,
  (SELECT COUNT(*) FROM information_schema.triggers) as triggers;

-- Datos iniciales
SELECT 'Rewards' as tipo, COUNT(*) FROM rewards
UNION ALL
SELECT 'Restaurants', COUNT(*) FROM restaurants
UNION ALL
SELECT 'Burgers', COUNT(*) FROM burgers;
```

**Resultado esperado:**
```
Tablas: 12
Funciones: 12+
Triggers: 15+
Rewards: 12
Restaurants: 5
Burgers: 9
```

---

## PASO 4: Inicia tu Aplicación

```bash
npm run dev
```

Abre http://localhost:3000

**Debería funcionar sin errores de conexión a BD**

---

## 🆘 Si Algo Falla

### Error: "psycopg2 not installed"
```bash
pip install psycopg2-binary
```

### Error: "Connection refused"
- ✅ Verifica SUPABASE_URL y credenciales en .env.local
- ✅ Verifica que el proyecto Supabase esté activo
- ✅ Verifica que SUPABASE_DB_PASSWORD esté correcta

### Error: "syntax error near ("
- ✅ Verifica que usaste el archivo `001_schema.sql` **corregido**
- ✅ Borra las tablas creadas y vuelve a intentar

### Error: "relation already exists"
```sql
-- Reinicia la BD (CUIDADO: borra TODO)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Luego vuelve a ejecutar las migraciones
```

---

## 📊 Archivos Involucrados

| Archivo | Propósito | Tamaño |
|---------|-----------|--------|
| `001_schema.sql` | Tablas, índices, ENUMs | 15.4 KB |
| `002_functions.sql` | Funciones PostgreSQL | 14.6 KB |
| `003_triggers.sql` | Triggers automáticos | 12.0 KB |
| `004_rls_policies.sql` | Seguridad con RLS | 12.6 KB |
| `005_seed_data.sql` | Datos iniciales | 9.8 KB |
| `006_materialized_views.sql` | Vistas optimizadas | 14.8 KB |
| `run_migrations.py` | Script Python | 280+ líneas |
| `run_migrations.ps1` | Script PowerShell | 200+ líneas |
| `verify_setup.py` | Verificador | 300+ líneas |
| `.env.local` | Configuración Supabase | Actualizado ✅ |

---

## 📋 Checklist Final

- [ ] Verificar con `python verify_setup.py`
- [ ] Elegir método de ejecución (A, B o C)
- [ ] Ejecutar migraciones
- [ ] Verificar BD con queries
- [ ] Iniciar app con `npm run dev`
- [ ] Probar que BD está conectada

---

## 🎯 Resumen Rápido

**Lo que hicimos:**
1. ✅ Identificamos el error SQL (FK circular)
2. ✅ Corregimos todos los archivos
3. ✅ Creamos scripts de automatización
4. ✅ Documentamos todo

**Ahora solo tienes que:**
1. Ejecutar `python run_migrations.py` (o tu método preferido)
2. Verificar con las queries
3. Lanzar `npm run dev`

**¡Eso es todo! 🎉**

---

**Versión:** 1.0  
**Última actualización:** Diciembre 5, 2025  
**Estado:** Listo para Producción ✅
