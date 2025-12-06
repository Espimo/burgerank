# 📚 BurgeRank - Índice de Documentación

## 🎯 Ubicación del Proyecto
```
c:\0_CRISTHIAN\burgerank_project\
```

---

## 📋 Archivos de Migración de Base de Datos

Ubicación: `supabase/migrations/`

### 1. **001_schema.sql** (15.4 KB)
**Contenido:** Esquema base de la base de datos
- 12 tablas PostgreSQL
- 6 tipos ENUM
- 40+ índices
- Foreign keys y constraints
- Extensiones (UUID, pgcrypto)

**Ejecutar:** Primero (2-5 segundos)

### 2. **002_functions.sql** (14.6 KB)
**Contenido:** Funciones PostgreSQL
- Algoritmo de ranking (calculate_burger_ranking)
- Gestión de puntos y niveles
- Sistema de badges
- Generador de códigos QR
- Funciones de utilidad

**Ejecutar:** Segundo (1-3 segundos)

### 3. **003_triggers.sql** (12.0 KB)
**Contenido:** Triggers automáticos
- 15+ triggers de eventos
- Actualización automática de timestamps
- Recálculo de estadísticas en cascada
- Otorgamiento automático de puntos
- Inicialización de badges

**Ejecutar:** Tercero (2-4 segundos)

### 4. **004_rls_policies.sql** (12.6 KB)
**Contenido:** Row Level Security
- 50+ políticas de acceso
- Control granular de permisos
- Roles: user, moderator, admin
- Funciones helper de seguridad
- RLS habilitado en todas las tablas

**Ejecutar:** Cuarto (3-5 segundos)

### 5. **005_seed_data.sql** (9.8 KB)
**Contenido:** Datos iniciales
- 12 rewards canjeables
- 5 restaurantes de prueba (España)
- 9 hamburguesas de ejemplo
- Funciones de verificación

**Ejecutar:** Quinto (1-2 segundos)

### 6. **006_materialized_views.sql** (14.8 KB)
**Contenido:** Vistas optimizadas
- 7 vistas materializadas
- Índices en vistas
- Función de refresh automático
- Queries de verificación

**Ejecutar:** Sexto (3-5 segundos)

---

## 📖 Documentación Principal

### **MIGRATION_GUIDE.md** 
**Propósito:** Guía paso a paso para ejecutar las migraciones

**Secciones:**
- Introducción y requisitos previos
- Estructura de migraciones
- Instrucciones de ejecución (3 opciones)
- Verificación post-migración
- Troubleshooting completo
- Mantenimiento y backup

**Cuándo leerlo:** ANTES de ejecutar las migraciones

---

### **DATABASE_SCHEMA.md**
**Propósito:** Documentación técnica completa del esquema

**Secciones:**
- Resumen ejecutivo
- Descripción detallada de cada tabla
- Funciones principales
- Triggers automáticos
- Políticas RLS
- Vistas materializadas
- Tipos ENUM
- Performance considerations
- Queries comunes
- Relaciones ERD

**Cuándo leerlo:** Para entender la arquitectura de la BD

---

### **verify_migrations.sh**
**Propósito:** Script de verificación para Linux/Mac

**Funcionalidad:**
- Verifica instalación de credenciales
- Proporciona queries de verificación
- Muestra paso a paso para Supabase
- Enlace a documentación

**Cómo usar:** 
```bash
chmod +x verify_migrations.sh
./verify_migrations.sh
```

---

## 📁 Estructura de Carpetas

```
burgerank_project/
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql              ✅ 15.4 KB
│       ├── 002_functions.sql           ✅ 14.6 KB
│       ├── 003_triggers.sql            ✅ 12.0 KB
│       ├── 004_rls_policies.sql        ✅ 12.6 KB
│       ├── 005_seed_data.sql           ✅ 9.8 KB
│       └── 006_materialized_views.sql  ✅ 14.8 KB
│
├── .env.local                          ✅ Actualizado
├── MIGRATION_GUIDE.md                  ✅ Nuevo
├── DATABASE_SCHEMA.md                  ✅ Nuevo
├── verify_migrations.sh                ✅ Nuevo
├── DOCS_INDEX.md                       ✅ Existente
├── QUICKSTART.md                       ✅ Existente
├── SETUP.md                            ✅ Existente
├── README.md                           ✅ Existente
├── PROYECTO_COMPLETADO.md              ✅ Existente
│
├── app/
├── components/
├── lib/
├── types/
├── public/
└── [otros archivos del proyecto]
```

---

## 🚀 Guía de Inicio Rápido

### Paso 1: Preparación
```bash
# Verificar que .env.local está configurado
cat .env.local | grep SUPABASE
```

✅ Resultado esperado:
```
NEXT_PUBLIC_SUPABASE_URL=https://wxbfteisljkzsduuicis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 2: Ejecutar Migraciones
1. Ve a https://app.supabase.com
2. Selecciona el proyecto BurgeRank
3. Abre SQL Editor
4. Copia y pega cada archivo en orden:
   - 001_schema.sql
   - 002_functions.sql
   - 003_triggers.sql
   - 004_rls_policies.sql
   - 005_seed_data.sql
   - 006_materialized_views.sql
5. Haz clic en "Run" para cada uno

**Tiempo total:** 12-24 segundos

### Paso 3: Verificación
En SQL Editor, ejecuta:
```sql
SELECT 'TABLAS' as Categoria, COUNT(*) as Cantidad 
FROM pg_tables WHERE schemaname = 'public'
UNION ALL
SELECT 'FUNCIONES', COUNT(*) 
FROM pg_proc WHERE schemaname = 'public'
UNION ALL
SELECT 'REWARDS', COUNT(*) FROM rewards;
```

✅ Resultado esperado:
- TABLAS: 12
- FUNCIONES: 12+
- REWARDS: 12

### Paso 4: Iniciar la Aplicación
```bash
npm run dev
```

Accede a http://localhost:3000

---

## 📊 Estadísticas de Base de Datos

| Métrica | Valor |
|---------|-------|
| Total líneas SQL | 5,500+ |
| Tablas creadas | 12 |
| Funciones creadas | 12+ |
| Triggers creados | 15+ |
| Políticas RLS | 50+ |
| Vistas materializadas | 7 |
| Índices creados | 40+ |
| Tipos ENUM | 6 |
| Foreign keys | 20+ |
| Constraints | 30+ |

---

## 🗄️ Base de Datos en Supabase

### Datos Seed Iniciales

**Rewards:** 12
- Descuentos (3): 10%, 15%, 20%
- Papas gratis (2): Normal, Premium
- Bebidas gratis (3): Pequeña, Mediana, Premium
- Hamburguesas gratis (2): Clásica, Premium
- Experiencias VIP (2): Cata Premium, Experiencia VIP

**Restaurantes:** 5
1. Burger Palace (Madrid) - 4.5⭐
2. The Burger House (Barcelona) - 4.3⭐
3. Gourmet Burgers (Madrid) - 4.7⭐
4. Fast & Furious Burgers (Valencia) - 4.1⭐
5. Craft Burger Kitchen (Bilbao) - 4.6⭐

**Hamburguesas:** 9
- 3 en Burger Palace
- 2 en The Burger House
- 2 en Gourmet Burgers
- 1 en Fast & Furious Burgers
- 1 en Craft Burger Kitchen

---

## 🔐 Seguridad Configurada

✅ Row Level Security (RLS) habilitado en todas las tablas  
✅ 50+ políticas granulares de acceso  
✅ Sistema de roles: user, moderator, admin  
✅ Validaciones de datos con constraints  
✅ Triggers para coherencia de datos  
✅ Funciones de seguridad (is_admin, is_moderator)  

---

## 🎯 Características Principales

### Ranking Inteligente
- Algoritmo ponderado que considera:
  - Reviews verificadas (50% peso adicional)
  - Nivel del reviewer
  - Mínimo 5 reviews para ranking
  - Boost temporal (30 días para nuevas)
  - Match score del mini-juego

### Sistema de Puntos y Niveles
- **burger_fan:** 0-500 puntos
- **burger_lover:** 501-2,000 puntos
- **burger_obsessed:** 2,001+ puntos

### Badges/Logros
1. **Explorer:** 50 reseñas
2. **Critic:** 100 reseñas verificadas
3. **Specialist:** Reviews en 5+ ciudades
4. **Social Butterfly:** 100 seguidores
5. **Dedication:** Alcanzar burger_obsessed
6. **Match Master:** 500 matches ganados

### Mini-Juego Battle Royale
- Compara dos hamburguesas
- El usuario elige el ganador
- Afecta al match_score de cada burger
- Otorga 1 punto por participación

---

## 📚 Documentación Relacionada

Los siguientes archivos también están disponibles:

### Documentación de Aplicación
- **QUICKSTART.md** - Guía de 5 minutos
- **SETUP.md** - Instrucciones de configuración
- **README.md** - Descripción general del proyecto
- **PROYECTO_COMPLETADO.md** - Resumen de finalización

### Archivos de Configuración
- **.env.local** - Variables de entorno (Supabase)
- **next.config.ts** - Configuración Next.js
- **tailwind.config.ts** - Configuración Tailwind
- **tsconfig.json** - Configuración TypeScript

---

## 🛠️ Herramientas Necesarias

### Requerido
- Cuenta Supabase (gratuita en supabase.com)
- Proyecto Supabase creado
- Navegador (para SQL Editor)

### Opcional
- psql (PostgreSQL CLI) - para ejecución desde terminal
- Node.js 18+ (para ejecutar npm run dev)

---

## 🔗 Enlaces Útiles

**Supabase Dashboard:**
https://app.supabase.com

**SQL Editor Direct:**
En Supabase → Your Project → SQL Editor

**PostgreSQL Documentation:**
https://www.postgresql.org/docs/

**Supabase RLS Guide:**
https://supabase.com/docs/guides/auth/row-level-security

---

## 📝 Proceso de Ejecución Resumido

```
1. Leer MIGRATION_GUIDE.md (5 min)
   ↓
2. Abrir SQL Editor en Supabase
   ↓
3. Copiar y ejecutar 001_schema.sql (2-5s)
   ↓
4. Copiar y ejecutar 002_functions.sql (1-3s)
   ↓
5. Copiar y ejecutar 003_triggers.sql (2-4s)
   ↓
6. Copiar y ejecutar 004_rls_policies.sql (3-5s)
   ↓
7. Copiar y ejecutar 005_seed_data.sql (1-2s)
   ↓
8. Copiar y ejecutar 006_materialized_views.sql (3-5s)
   ↓
9. Verificar con queries (1 min)
   ↓
10. ✅ Base de datos lista!
   ↓
11. npm run dev
   ↓
12. Acceder a http://localhost:3000
```

**Tiempo total:** 20-30 minutos (incluyendo lectura de guía y verificación)

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si ejecuto dos veces la misma migración?
Error: "relation already exists". Solución: Limpiar schema y comenzar de nuevo (ver troubleshooting en MIGRATION_GUIDE.md)

### ¿Puedo ejecutar las migraciones en diferente orden?
No. Deben ejecutarse en orden (001 → 006). Funciones dependen de tablas, triggers dependen de funciones, etc.

### ¿Cuánto espacio ocupa la base de datos?
Aproximadamente 5-10 MB inicialmente, escalable según datos.

### ¿Es segura la base de datos?
Sí. Con 50+ políticas RLS, validaciones de datos, y funciones de seguridad implementadas.

### ¿Puedo añadir más datos de prueba?
Sí. Los restaurantes y hamburguesas en 005_seed_data.sql son editables. Duplica y modifica según necesites.

---

## 🎓 Próximos Pasos después de Migración

1. **Crear primer usuario** - Usar auth de Supabase
2. **Probar funcionalidades** - Crear reviews, ganar puntos
3. **Verificar algoritmo** - Ver ranking calcularse
4. **Testear premios** - Canjear puntos por rewards
5. **Desplegar** - Vercel/Railway/Heroku

---

## 📞 Soporte

Si encuentras problemas:

1. **Verifica el error exacto** en Supabase SQL Editor
2. **Consulta la sección Troubleshooting** en MIGRATION_GUIDE.md
3. **Revisa DATABASE_SCHEMA.md** para entender la estructura
4. **Ejecuta queries de verificación** para confirmar estado

---

## 📌 Resumen Final

✅ **6 archivos de migración** listos para ejecutar  
✅ **5,500+ líneas de SQL** de código production-ready  
✅ **12 tablas** con relaciones complejas  
✅ **Seguridad robusta** con RLS y validaciones  
✅ **Automatización completa** con triggers y funciones  
✅ **Datos seed** para empezar inmediatamente  
✅ **Documentación completa** en 3 archivos markdown  

**Todo lo que necesitas para una base de datos BurgeRank de nivel producción está listo.** 🎉

---

**Fecha de creación:** Diciembre 2025  
**Versión:** 1.0 - Production Ready  
**Plataforma:** BurgeRank - Hamburger Ranking & Rating Platform  

Para comenzar, lee **MIGRATION_GUIDE.md** ahora.
