# GUÍA: Permisos Admin Globales en BurgeRank

## 📋 Descripción General

El sistema de **Permisos Admin Globales** permite que los administradores, cuando están autenticados en el panel admin (`/admin`), puedan editar restaurantes y hamburguesas directamente desde las páginas públicas de la aplicación, sin necesidad de regresar al panel de administración.

### ✨ Características Principales

- ✅ **Autenticación Global**: Una vez logueado en `/admin`, el admin puede acceder a funciones especiales en toda la aplicación
- ✅ **Indicador Visual**: Badge dorado en la esquina superior derecha muestra "👑 Modo Admin Activo"
- ✅ **Edición desde Cualquier Página**: Botones de edición aparecen en:
  - `/rankings` - En cada burger del ranking
  - `/restaurante/[nombre]` - En la información del restaurante
  - `/ranking` - En la página principal
- ✅ **Modales de Edición**: Interfaces limpias para editar restaurantes y hamburguesas
- ✅ **Persistencia de Sesión**: La sesión admin se guarda en localStorage (válida 24 horas)

---

## 🔧 Componentes Técnicos

### 1. **AdminContext** (`app/contexts/AdminContext.tsx`)

Centro neurálgico del sistema de autenticación admin.

```typescript
// Usar en cualquier componente:
import { useAdmin } from '@/app/contexts/AdminContext';

export function MiComponente() {
  const { 
    isAdmin,              // boolean: ¿Es admin?
    adminUsername,        // string: Nombre del admin
    loginAdmin,           // (username) => guardar sesión
    logoutAdmin           // () => cerrar sesión
  } = useAdmin();

  if (isAdmin) {
    return <div>👑 {adminUsername}</div>
  }
}
```

**Características**:
- Gestiona estado global de autenticación
- Persiste en `localStorage` bajo `burgerankAdminSession`
- Validación automática de expiración (24 horas)
- Disponible en toda la app vía `AdminProvider` en `layout.tsx`

---

### 2. **AdminBadge** (`app/components/AdminBadge.tsx`)

Indicador visual de modo admin activo.

```tsx
import { AdminBadge } from '@/app/components/AdminBadge';

// En el JSX:
<AdminBadge />
```

**Apariencia**:
- Ubicación: Esquina superior derecha (fixed)
- Color: Gradiente dorado (#fbbf24 → #f59e0b)
- Texto: "👑 Modo Admin Activo"
- Botón de logout integrado
- Responsive en dispositivos móviles

---

### 3. **AdminEditButton** (`app/components/AdminEditButton.tsx`)

Botón reutilizable para acciones de edición (solo visible para admins).

```tsx
import { AdminEditButton } from '@/app/components/AdminEditButton';
import { useAdmin } from '@/app/contexts/AdminContext';

export function MiComponente() {
  const { isAdmin } = useAdmin();
  
  return (
    <AdminEditButton
      label="Editar Restaurante"
      icon="✏️"
      onClick={() => setModalOpen(true)}
    />
  );
}
```

**Características**:
- Solo se renderiza si `isAdmin === true`
- Estilo: Botón dorado con hover effects
- Personalizable: label e icon

---

### 4. **AdminEditRestaurantModal** (`app/components/AdminEditRestaurantModal.tsx`)

Modal para editar información del restaurante.

```tsx
import { AdminEditRestaurantModal } from '@/app/components/AdminEditRestaurantModal';
import { useAdminData } from '@/app/hooks/useAdminData';

export function DetallePage() {
  const { data } = useAdminData();
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AdminEditRestaurantModal
        restaurant={editingRestaurant}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => console.log('Guardado!')}
      />
    </>
  );
}
```

**Campos Editables**:
- Nombre
- Ciudad
- Teléfono
- Dirección
- Horario de apertura
- Sitio web
- Descripción

---

### 5. **AdminEditBurgerModal** (`app/components/AdminEditBurgerModal.tsx`)

Modal para editar información de hamburguesas.

```tsx
import { AdminEditBurgerModal } from '@/app/components/AdminEditBurgerModal';

return (
  <AdminEditBurgerModal
    burger={selectedBurger}
    restaurantId={restaurant.id}
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    onSave={() => refreshData()}
  />
);
```

**Campos Editables**:
- Nombre
- Descripción
- Tipo (premium, clásica, vegana...)
- Calificación (1-5)
- Tags

---

### 6. **useAdminData** (`app/hooks/useAdminData.ts`)

Hook personalizado para acceder y manipular datos de admin desde cualquier componente.

```typescript
import { useAdminData } from '@/app/hooks/useAdminData';

export function MiComponente() {
  const { 
    data,                    // { restaurants[], burgers[], activityLog[] }
    loading,                 // boolean
    loadData,                // () => cargar datos
    saveData,                // (newData) => guardar todo
    updateRestaurant,        // (restaurant) => actualizar restaurante
    updateBurger,            // (burger) => actualizar burger
    getRestaurantById,       // (id) => obtener restaurante
    getBurgersByRestaurant   // (restaurantId) => obtener burgers
  } = useAdminData();

  // Ejemplos de uso
  const changeRestaurant = () => {
    updateRestaurant({
      id: 1,
      name: 'Nuevo Nombre',
      city: 'Madrid',
      // ... más campos
    });
  };

  const addBurger = () => {
    updateBurger({
      id: 100,
      name: 'Nueva Burger',
      restaurant: 'Mi Restaurante',
      rating: 4.5,
      // ... más campos
    });
  };
}
```

**Datos Almacenados**:
```typescript
interface Restaurant {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  website?: string;
  description?: string;
  rating: number;
  reviews: number;
}

interface Burger {
  id: number;
  name: string;
  restaurant: string;
  description: string;
  rating: number;
  reviews: number;
  type: string;
  tags: string[];
  city: string;
}
```

---

## 🚀 Cómo Usar el Sistema

### Paso 1: Acceder al Panel Admin

1. Navega a `http://localhost:3000/admin` (o tu URL de producción)
2. Ingresa las credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
3. Haz clic en "Inicia Sesión"

### Paso 2: Observa el Badge de Admin

Una vez autenticado, verás un badge dorado ("👑 Modo Admin Activo") en la esquina superior derecha de TODAS las páginas.

### Paso 3: Edita desde Páginas Públicas

#### En `/rankings`:
- Ve a cualquier burger en el ranking
- Haz clic en el botón "✏️ Editar" (lado derecho)
- Se abre un modal para editar el restaurante
- Modifica los datos y haz clic en "💾 Guardar Cambios"

#### En `/restaurante/[nombre]`:
- Ve a la sección "ℹ️ Información"
- Haz clic en el botón "✏️ Editar" (esquina superior derecha)
- Edita los detalles del restaurante
- Los cambios se guardan en localStorage

#### En `/ranking` (Página Principal):
- El badge dorado aparece en la parte superior
- Puedes navegar a otros lugares sabiendo que estás en modo admin

### Paso 4: Cerrar Sesión

Haz clic en el botón "🚪 Logout" del badge dorado para cerrar sesión admin.

---

## 💾 Almacenamiento de Datos

Todos los cambios se guardan en **localStorage** bajo estas claves:

```javascript
// Sesión del admin (24 horas de validez)
localStorage.getItem('burgerankAdminSession')
// Resultado: { username: 'admin', timestamp: 1702748400000 }

// Datos de restaurantes y burgers
localStorage.getItem('burgerankAdminData')
// Resultado: { 
//   restaurants: [...],
//   burgers: [...],
//   activityLog: [...]
// }
```

**Nota**: Los datos se persisten entre sesiones del navegador. Si limpias localStorage, se perderán los cambios.

---

## 🎨 Personalización de Estilos

### AdminBadge (AdminBadge.css)

```css
.admin-badge {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}
```

Modifica estos valores para cambiar:
- Posición
- Color
- Tamaño

### Edit Modals (AdminEditRestaurantModal.css)

```css
.admin-modal-content {
  max-width: 600px;
  border-radius: 10px;
}
```

---

## 🔒 Seguridad

### Consideraciones Actuales:
- ✅ Sesión almacenada en localStorage (no en cookies)
- ✅ Expiración automática (24 horas)
- ✅ Validación en el contexto

### Recomendaciones para Producción:
- 🔐 Implementar autenticación con JWT
- 🔐 Usar httpOnly cookies en lugar de localStorage
- 🔐 Agregar validación de sesión en el servidor
- 🔐 Implementar rate limiting en API
- 🔐 Encriptar datos sensibles

---

## 📝 Ejemplo Completo: Integrar Admin en Nueva Página

```tsx
'use client';

import { useState } from 'react';
import { useAdmin } from '@/app/contexts/AdminContext';
import { AdminBadge } from '@/app/components/AdminBadge';
import { AdminEditButton } from '@/app/components/AdminEditButton';
import { AdminEditRestaurantModal } from '@/app/components/AdminEditRestaurantModal';
import { useAdminData, Restaurant } from '@/app/hooks/useAdminData';

export default function MiPagina() {
  const { isAdmin } = useAdmin();
  const { data } = useAdminData();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Badge de admin */}
      {isAdmin && <AdminBadge />}

      {/* Mi contenido */}
      <div>
        <h1>Mis Restaurantes</h1>
        
        {data.restaurants.map(restaurant => (
          <div key={restaurant.id}>
            <h2>{restaurant.name}</h2>
            
            {/* Botón de edición solo para admins */}
            {isAdmin && (
              <AdminEditButton
                label="Editar"
                onClick={() => {
                  setEditingRestaurant(restaurant);
                  setModalOpen(true);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingRestaurant && (
        <AdminEditRestaurantModal
          restaurant={editingRestaurant}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingRestaurant(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Problema: El badge no aparece
**Solución**: 
- Verifica que estés autenticado en `/admin`
- Comprueba que `isAdmin` sea `true` en useAdmin()
- Limpia localStorage y vuelve a autenticarte

### Problema: Los cambios no se guardan
**Solución**:
- Verifica que localStorage no esté deshabilitado
- Comprueba la consola del navegador para errores
- Asegúrate de usar `updateRestaurant()` o `updateBurger()`

### Problema: El modal no abre
**Solución**:
- Verifica que `modalOpen` esté en `true`
- Comprueba que `editingRestaurant` tenga datos
- Revisa la consola para errores de React

---

## 📞 Soporte

Para más información, consulta:
- [GUIA_USO_PANEL_ADMIN.md](./GUIA_USO_PANEL_ADMIN.md) - Guía del panel admin
- [AdminContext.tsx](./app/contexts/AdminContext.tsx) - Implementación del contexto
- [useAdminData.ts](./app/hooks/useAdminData.ts) - Documentación del hook

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Desarrollador**: BurgeRank Team
