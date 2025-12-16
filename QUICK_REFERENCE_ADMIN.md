# QUICK REFERENCE: Sistema Admin Global - BurgeRank

## 🚀 Inicio Rápido (5 minutos)

### 1. Autenticarse
```
URL: http://localhost:3000/admin
Usuario: admin
Contraseña: admin123
```

### 2. Ver Indicador
- ✅ Badge dorado aparece en esquina superior derecha: "👑 Modo Admin Activo"

### 3. Editar Restaurantes
```
/rankings
- Haz clic en "✏️ Editar" en cualquier burger
- Modifica datos
- Haz clic en "💾 Guardar Cambios"
```

### 4. Editar Detalles Restaurante
```
/restaurante/[nombre]
- Haz clic en "✏️ Editar" en sección "ℹ️ Información"
- Edita dirección, teléfono, etc.
- Haz clic en "💾 Guardar Cambios"
```

---

## 📚 Archivos Principales

| Archivo | Función | Ubicación |
|---------|---------|-----------|
| **AdminContext.tsx** | Autenticación global | `app/contexts/` |
| **AdminBadge.tsx** | Indicador visual | `app/components/` |
| **AdminEditButton.tsx** | Botón de edición | `app/components/` |
| **AdminEditRestaurantModal.tsx** | Modal restaurante | `app/components/` |
| **AdminEditBurgerModal.tsx** | Modal hamburguesa | `app/components/` |
| **useAdminData.ts** | Acceso a datos | `app/hooks/` |

---

## 🎯 Importes Necesarios

### Contexto Admin
```typescript
import { useAdmin } from '@/app/contexts/AdminContext';

const { isAdmin, adminUsername, loginAdmin, logoutAdmin } = useAdmin();
```

### Componentes UI
```typescript
import { AdminBadge } from '@/app/components/AdminBadge';
import { AdminEditButton } from '@/app/components/AdminEditButton';
import { AdminEditRestaurantModal } from '@/app/components/AdminEditRestaurantModal';
import { AdminEditBurgerModal } from '@/app/components/AdminEditBurgerModal';
```

### Hook de Datos
```typescript
import { useAdminData } from '@/app/hooks/useAdminData';

const { data, updateRestaurant, updateBurger } = useAdminData();
```

---

## 💡 Ejemplos Prácticos

### Mostrar Badge
```tsx
import { AdminBadge } from '@/app/components/AdminBadge';

export function MiPagina() {
  return (
    <div>
      <AdminBadge />
    </div>
  );
}
```

### Botón Condicional
```tsx
import { useAdmin } from '@/app/contexts/AdminContext';
import { AdminEditButton } from '@/app/components/AdminEditButton';

export function MiComponente() {
  const { isAdmin } = useAdmin();
  
  return isAdmin ? (
    <AdminEditButton 
      label="Editar" 
      onClick={() => console.log('Editando...')}
    />
  ) : null;
}
```

### Usar Hook de Datos
```tsx
import { useAdminData } from '@/app/hooks/useAdminData';

export function ListaRestaurantes() {
  const { data, updateRestaurant } = useAdminData();
  
  const cambiarNombre = (id) => {
    const restaurant = data.restaurants.find(r => r.id === id);
    updateRestaurant({
      ...restaurant,
      name: 'Nuevo Nombre'
    });
  };
}
```

---

## 🔑 Estados Admin

### Autenticado
```javascript
// localStorage
burgerankAdminSession = {
  username: "admin",
  timestamp: 1702748400000
}

// useAdmin()
{
  isAdmin: true,
  adminUsername: "admin",
  loginAdmin: fn,
  logoutAdmin: fn
}
```

### No Autenticado
```javascript
burgerankAdminSession = null

// useAdmin()
{
  isAdmin: false,
  adminUsername: null
}
```

---

## 🎨 Personalización Rápida

### Cambiar Color del Badge
Editar en `AdminBadge.css`:
```css
.admin-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  /* Cambiar #fbbf24 y #f59e0b por otros colores */
}
```

### Cambiar Posición del Badge
```css
.admin-badge {
  top: 20px;      /* Distancia desde arriba */
  right: 20px;    /* Distancia desde derecha */
}
```

### Cambiar Tamaño Modal
Editar en `AdminEditRestaurantModal.css`:
```css
.admin-modal-content {
  max-width: 600px;  /* Cambiar ancho máximo */
}
```

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Badge no aparece | Verifica `isAdmin === true` |
| Botones no clickean | Revisa z-index de otros elementos |
| Modal no guarda | Limpia localStorage y reautentica |
| Cambios se pierden | Los datos son locales (localStorage) |

---

## 📊 Datos en localStorage

```javascript
// Ver sesión admin
localStorage.getItem('burgerankAdminSession')

// Ver datos de restaurantes
localStorage.getItem('burgerankAdminData')

// Limpiar todo
localStorage.clear()
```

---

## ✅ Checklist - Verificar Instalación

- [ ] Archivo `AdminContext.tsx` existe
- [ ] Archivo `AdminBadge.tsx` existe
- [ ] `app/layout.tsx` contiene `<AdminProvider>`
- [ ] Build compila sin errores
- [ ] Badge aparece después de autenticarse
- [ ] Botones de edición aparecen para admin
- [ ] Modal se abre al hacer clic
- [ ] Datos se guardan en localStorage

---

## 🔗 Enlaces Rápidos

- 📖 [Guía Completa](./GUIA_ADMIN_PERMISOS_GLOBALES.md)
- 📋 [Resumen Implementación](./RESUMEN_ADMIN_GLOBALES.md)
- 🛠️ [AdminContext Code](./app/contexts/AdminContext.tsx)
- 🎣 [useAdminData Code](./app/hooks/useAdminData.ts)

---

## 🚀 Comandos Útiles

```bash
# Build
npm run build

# Desarrollo
npm run dev

# Ver logs de TypeScript
npm run build 2>&1

# Ver localStorage en consola
console.log(localStorage)

# Limpiar localStorage
localStorage.clear()
```

---

**Última Actualización**: 2024  
**Versión**: 1.0  
**Estado**: ✅ Producción
