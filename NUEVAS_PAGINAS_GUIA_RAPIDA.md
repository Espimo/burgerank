# 🍔 BurgeRank - Nuevas Páginas Migradas a Next.js

## 📍 Rutas Disponibles

### 🏆 Ranking Global
**Ruta**: `/rankings`
- Top 10 hamburguesas por puntuación
- Medallas para los 3 primeros
- Enlaces a restaurantes
- Datos de ejemplo: 10 hamburguesas (9.7 a 7.9 rating)

### ⭐ Mis Calificaciones  
**Ruta**: `/calificaciones`
- Historial de mis valoraciones
- Timeline cronológico
- Estadísticas: total, promedio, puntos
- Datos de ejemplo: 10 calificaciones con comentarios

### 🏪 Detalles de Restaurante
**Ruta**: `/restaurante/[nombre]`
- Información del restaurante
- Lista de hamburguesas
- Reseñas de usuarios
- Detalles: dirección, teléfono, web, horario
- Datos de ejemplo para 3 restaurantes principales

## 🚀 Cómo Usar

### En Desarrollo
```bash
npm run dev
```
Luego accede a:
- http://localhost:3000/rankings
- http://localhost:3000/calificaciones
- http://localhost:3000/restaurante/Burger Palace

### En Producción (Vercel)
```
https://burgerank.vercel.app/rankings
https://burgerank.vercel.app/calificaciones
https://burgerank.vercel.app/restaurante/Burger Palace
```

## 🔗 Navegación

Las nuevas páginas están conectadas entre sí:

1. **Desde `/ranking`**: 
   - Botón "🏪 Restaurante" → `/restaurante/[nombre]`
   - Botón "⭐ Valorar" → `/rate`

2. **Desde `/rankings`**:
   - Click en nombre restaurante → `/restaurante/[nombre]`

3. **Desde `/restaurante`**:
   - Botón "← Volver" → `/rankings`

4. **Bottom Navigation** (presente en todas):
   - 🏆 Inicio
   - ⭐ Valorar
   - 👤 Perfil

## 📊 Datos de Ejemplo

### Incluidos en `database/seed.sql`:
- **10 Restaurantes** con información completa
- **30 Hamburguesas** (3-5 por restaurante)
- **Etiquetas/Tags** para cada hamburguesa
- **10 Calificaciones** con comentarios

### Para Cargar en Supabase:
```sql
-- En Supabase SQL Editor:
1. Copiar contenido de database/seed.sql
2. Ejecutar el script
3. Datos estarán listos para usar
```

## 💾 Estructura de Archivos

```
app/
├── rankings/
│   └── page.tsx           # Top 10 global
├── calificaciones/
│   └── page.tsx           # Mis valoraciones
├── restaurante/
│   └── [nombre]/
│       └── page.tsx       # Detalles restaurante (ruta dinámica)
└── ranking/
    └── page.tsx           # Actualizado con enlaces

database/
└── seed.sql               # Datos de ejemplo SQL
```

## 🎨 Diseño

✨ **Características de UI**:
- Tema oscuro (gradiente gris-negro)
- Medallas animadas (🥇🥈🥉)
- Colores codificados por puntuación
- Responsive design (móvil, tablet, desktop)
- Transiciones suaves
- Emojis temáticos

## 🔧 Configuración Técnica

### URLs Dinámicas
Las URLs con espacios se manejan automáticamente:
- `/restaurante/Burger Palace` ✅
- `/restaurante/The Smokehouse` ✅
- `/restaurante/Gourmet Burgers Co.` ✅

### TypeScript
Todas las páginas incluyen:
- Interfaces tipadas
- Props validados
- Error handling

## 📈 Próximos Pasos

### Conectar Base de Datos
```typescript
// Reemplazar datos hardcoded con consultas:
const { data } = await supabase.from('hamburgers').select('*')
```

### Funcionalidades Dinámicas
- [ ] Guardar valoraciones en BD
- [ ] Actualizar rankings en tiempo real
- [ ] Cargar datos de restaurantes desde API
- [ ] Filtros dinámicos

### Optimizaciones
- [ ] Lazy loading de imágenes
- [ ] Caché ISR
- [ ] Analytics
- [ ] SEO improvements

## ✅ Verificación

Para verificar que todo funciona:

1. **Desarrollo**: `npm run dev`
   ```bash
   # Prueba cada ruta:
   curl http://localhost:3000/rankings
   curl http://localhost:3000/calificaciones
   curl "http://localhost:3000/restaurante/Burger%20Palace"
   ```

2. **Producción**: Verifica en Vercel dashboard
   - Build status: ✅ Success
   - Deployment: ✅ Active
   - Preview URLs funcionales

## 🐛 Troubleshooting

### "Restaurante no encontrado"
- Verifica que el nombre del restaurante sea exacto
- Usa URL encoding para espacios: `%20`
- O usa: `encodeURIComponent('Nombre Restaurant')`

### Estilos no cargan
- Verifica que Tailwind CSS esté configurado
- Limpia caché: `npm run build`
- Reinicia servidor: `npm run dev`

### Links no funcionan
- Asegúrate de usar `<Link>` de Next.js
- Verifica rutas relativas vs absolutas
- Console debería mostrar errores

## 📞 Git History

```
Commit: 1f3cc05
Branch: main
Message: Migrate new BurgeRank pages from HTML to Next.js
Files Changed: 5
Insertions: 1,023
```

## 🎯 Estado Actual

| Componente | Estado |
|-----------|--------|
| `/rankings` | ✅ Funcional |
| `/calificaciones` | ✅ Funcional |
| `/restaurante/[nombre]` | ✅ Funcional |
| `database/seed.sql` | ✅ Listo |
| Enlace a restaurante | ✅ Funcional |
| GitHub push | ✅ Completado |
| Vercel deploy | ⏳ Auto-deploy activo |

---

**Última actualización**: Migración completada exitosamente ✨
**Rama**: main
**GitHub**: https://github.com/Espimo/burgerank.git
