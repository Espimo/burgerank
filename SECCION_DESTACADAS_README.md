# Sección Destacadas - Guía de Configuración

## 📍 Ubicación

La sección **Destacadas** ahora aparece en la página de **Ranking**, posicionada exactamente entre:
- ✅ Los filtros (ciudad + filtros avanzados)
- ✅ El listado principal del ranking

## 🔧 Configuración Requerida

### Paso 1: Ejecutar Script SQL

Para que la sección aparezca, necesitas marcar algunas burgers como "destacadas" en Supabase:

1. Abre Supabase SQL Editor
2. Ejecuta el script: `database/INIT_FEATURED_BURGERS.sql`

Este script:
- ✅ Limpia cualquier burger destacada anterior
- ✅ Marca automáticamente las 3 burgers con mejor `ranking_score` como destacadas
- ✅ Asigna orden 1, 2, 3 automáticamente
- ✅ Verifica que estén aprobadas (`is_approved = true`) y en el ranking (`is_in_ranking = true`)

### Paso 2: Verificar en Desarrollo

Después de ejecutar el script:

```bash
npm run dev
```

Navega a `/ranking` y deberías ver:

**Si hay burgers destacadas:**
- 🌟 Sección "Destacadas" con carrusel dorado
- 3 burgers con imágenes, ratings y badges
- Navegación automática cada 5 segundos
- Controles manuales (< y >)
- Indicadores de posición (•••)

**Si NO hay burgers destacadas:**
- En desarrollo: Mensaje amarillo explicando cómo configurarlas
- En producción: No se muestra nada (null)

## 🎨 Características del Carrusel

### Diseño Mobile-First
- ✅ Optimizado para 320-430px (móviles)
- ✅ Altura adaptada: 14rem (mobile) vs 18rem (desktop)
- ✅ Touch-friendly: controles grandes, fáciles de tocar
- ✅ Gradientes dorados que destacan sobre fondo oscuro

### Funcionalidades
- 🔄 **Auto-rotate**: Cambia cada 5 segundos
- 👆 **Controles manuales**: Botones < y > pausan el auto-rotate por 10s
- 🎯 **Indicadores**: Click directo en cualquier posición
- 🖼️ **Imágenes**: Lazy loading con Next.js Image
- ⭐ **Ratings**: Muestra promedio y total de reviews
- 🏆 **Badges**: Indicadores de "Top 3", "Tendencia", "Nueva"
- 🔗 **Links**: Click lleva al perfil del restaurante

### Información Mostrada
Cada burger destacada muestra:
- Nombre de la burger
- Restaurante y ciudad
- Imagen principal (o placeholder si no hay)
- Rating promedio (⭐ X.X)
- Número de reviews (#XX reviews)
- Badges especiales si aplican

## 🛠️ Gestión Manual (Panel Admin)

También puedes gestionar las burgers destacadas desde el panel de admin:

1. Ve a `/admin/featured`
2. Verás 3 slots para destacadas
3. Click en "Seleccionar burger" en cada slot
4. Busca y selecciona burgers del ranking
5. Reordena arrastrando los slots
6. Click "Guardar Cambios"

## 🔍 Debugging

### El carrusel no aparece

**Causa 1:** No hay burgers marcadas como destacadas
- Solución: Ejecuta `database/INIT_FEATURED_BURGERS.sql`

**Causa 2:** Las burgers destacadas no están aprobadas
- Verifica en Supabase: `SELECT * FROM burgers WHERE is_featured = true`
- Asegura que `is_approved = true` y `is_in_ranking = true`

**Causa 3:** Error en API
- Abre DevTools Console
- Busca errores de fetch a `/api/featured`
- Verifica Supabase connection

### El carrusel aparece vacío

- Verifica que las burgers tengan `imagen_principal`
- Si no tienen imagen, se mostrará un placeholder gris

### El carrusel se ve mal en móvil

- Verifica en DevTools móvil (320-430px)
- Debe verse con altura 14rem y controles grandes
- Si se ve cortado, revisa los estilos responsive

## 📊 Query de Verificación

Para ver las burgers destacadas actuales:

```sql
SELECT 
  b.id,
  b.name,
  r.name as restaurant_name,
  r.city,
  b.is_featured,
  b.featured_order,
  b.ranking_score,
  b.imagen_principal
FROM burgers b
INNER JOIN restaurants r ON b.restaurant_id = r.id
WHERE b.is_featured = true
ORDER BY b.featured_order ASC;
```

## 🚀 Deploy

Después de configurar todo:

1. Ejecuta el script SQL en producción (Supabase)
2. Haz push del código
3. Vercel desplegará automáticamente
4. Verifica en producción que se vean las destacadas

## 📂 Archivos Relacionados

- **Componente**: `app/components/FeaturedCarousel.tsx`
- **API**: `app/api/featured/route.ts`
- **Página**: `app/ranking/page.tsx` (línea ~525)
- **Admin**: `app/admin/featured/page.tsx`
- **SQL Schema**: `database/ADD_FEATURED_COLUMNS.sql`
- **SQL Init**: `database/INIT_FEATURED_BURGERS.sql` ⭐

## ✅ Checklist Final

- [ ] Ejecutar `database/INIT_FEATURED_BURGERS.sql` en Supabase
- [ ] Verificar en DevTools que `/api/featured` retorna 3 burgers
- [ ] Comprobar en `/ranking` que aparece la sección dorada
- [ ] Probar en móvil (320px) que se ve correctamente
- [ ] Verificar auto-rotate funciona (5 segundos)
- [ ] Probar controles manuales pausan el auto-rotate
- [ ] Build exitoso: `npm run build`
- [ ] Push a producción
