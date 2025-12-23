# Guía de Prueba - Panel Admin con Imágenes y Aprobaciones

## 🧪 Pasos para Probar las Nuevas Funcionalidades

### Preparación

1. **Ejecutar el script SQL** (si aún no lo has hecho):
   ```sql
   -- Copiar y ejecutar el contenido de:
   database/ADD_IMAGES_AND_APPROVAL.sql
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Iniciar sesión como administrador**:
   - Ir a `/auth/signin`
   - Usar credenciales de admin

---

## ✅ Test 1: Gestión de Imágenes de Burgers

### A) Editar burger existente:
1. Ir a **Panel Admin** (`/admin`)
2. Click en sección **"🍔 Hamburguesas"**
3. Click **"✏️ Editar"** en cualquier burger
4. Pegar en **"🖼️ Imagen URL"**:
   ```
   https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400
   ```
5. Verificar que aparece preview de la imagen
6. Click **"Guardar"**
7. ✅ **Verificar**: La imagen aparece en la tabla de burgers

### B) Crear nueva burger con imagen:
1. Click **"➕ Nueva Hamburguesa"**
2. Llenar campos:
   - Nombre: "Test Burger"
   - Restaurante: (seleccionar cualquiera)
   - Ciudad: (seleccionar cualquiera)
   - Imagen URL:
     ```
     https://images.unsplash.com/photo-1550547660-d9450f859349?w=400
     ```
3. Click **"Guardar"**
4. ✅ **Verificar**: Aparece inmediatamente en la tabla

### C) Ver imagen en página de restaurante:
1. Ir a la página del restaurante donde añadiste la burger
   - URL: `/restaurante/[nombre-del-restaurante]`
2. ✅ **Verificar**: 
   - La burger muestra su imagen (100x100px)
   - Si no tiene imagen, no rompe el layout

---

## ⭐ Test 2: Sistema de Burgers Destacadas

### A) Destacar una burger:
1. En Panel Admin, ir a **"⭐ Destacados"**
2. Scroll hasta **"Hamburguesas disponibles para destacar"**
3. Click **"⭐ Destacar"** en una burger
4. ✅ **Verificar**: 
   - Aparece en la tabla de arriba
   - Se asigna automáticamente orden 1
   - Dashboard muestra "1 burger destacada"

### B) Destacar hasta 3:
1. Repetir proceso con 2 burgers más
2. ✅ **Verificar**: 
   - Dashboard muestra "3 burgers destacadas"
   - Al intentar destacar una 4ta, muestra alerta: "Ya hay 3 hamburguesas destacadas"

### C) Cambiar orden:
1. En tabla de destacadas, cambiar dropdown de orden
2. Ejemplo: Cambiar burger 1 a orden 3
3. ✅ **Verificar**: 
   - Las burgers se reordenan automáticamente
   - No hay duplicados de orden

### D) Quitar de destacadas:
1. Click **"❌ Quitar"** en una burger
2. ✅ **Verificar**:
   - Desaparece de tabla de destacadas
   - Vuelve a aparecer en tabla de disponibles
   - Dashboard actualiza contador

---

## 🏪 Test 3: Gestión de Imágenes de Restaurantes

### A) Agregar banner y logo:
1. Ir a **"🏪 Restaurantes"**
2. Click **"✏️ Editar"** en un restaurante
3. Agregar URLs:
   - **Banner URL**:
     ```
     https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200
     ```
   - **Logo URL**:
     ```
     https://logo.clearbit.com/mcdonalds.com
     ```
4. ✅ **Verificar**: 
   - Ambas imágenes muestran preview
   - Click **"Guardar"**

### B) Ver en página de restaurante:
1. Ir a `/restaurante/[nombre-del-restaurante]`
2. ✅ **Verificar**:
   - **Banner**: 200px alto, full width, hero section
   - **Logo**: 80x80px superpuesto en esquina inferior izquierda del banner
   - Si falta banner, muestra emoji 🏪 en título
   - Si falta logo, no rompe layout

---

## ⏳ Test 4: Sistema de Aprobaciones

### A) Ver dashboard con pendientes:
1. En Dashboard, verificar cards:
   - **Hamburguesas**: Total de burgers aprobadas
   - **⭐ Destacadas**: Contador de burgers destacadas
   - **⏳ Pendientes de Aprobación**: 
     - Debe mostrar 0 si no hay pendientes
     - Card rojo si hay items pendientes

### B) Crear burger pendiente (simulación):
1. Ejecutar en Supabase SQL Editor:
   ```sql
   INSERT INTO burgers (
     name, 
     description, 
     restaurant_id, 
     city_id, 
     status, 
     submitted_by
   ) 
   SELECT 
     'Burger de Prueba Pendiente',
     'Esta burger está pendiente de aprobación',
     (SELECT id FROM restaurants LIMIT 1),
     (SELECT id FROM cities LIMIT 1),
     'pending',
     (SELECT id FROM users WHERE is_admin = true LIMIT 1)
   RETURNING *;
   ```

2. Recargar panel admin
3. ✅ **Verificar**:
   - Dashboard muestra "1 pendiente de aprobación" (card rojo)
   - Sidebar muestra badge "⏳ Pendientes (1)"

### C) Aprobar item pendiente:
1. Click en **"⏳ Pendientes (1)"** en sidebar
2. Ver tabla con:
   - Tipo: 🍔 Burger
   - Nombre: "Burger de Prueba Pendiente"
   - Enviado por: Tu usuario
   - Fecha: Hoy
3. Opciones disponibles:
   - **✏️ Editar**: Abre modal para modificar
   - **✅ Aprobar**: Click aquí
4. ✅ **Verificar**:
   - Item desaparece de Pendientes
   - Aparece en lista de Burgers
   - Dashboard actualiza contador a "0 pendientes"

### D) Rechazar item pendiente:
1. Crear otro item pendiente (repetir query SQL)
2. En sección Pendientes, click **"❌ Rechazar"**
3. ✅ **Verificar**:
   - Item desaparece de Pendientes
   - NO aparece en lista de Burgers
   - Status en BD = 'rejected'

---

## 📱 Test 5: Visualización en Otras Páginas

### A) Mis Valoraciones:
1. Ir a `/profile/ratings`
2. Si has valorado burgers:
   - ✅ **Verificar**: Cada valoración muestra imagen de burger (si existe)
   - Layout: Imagen 100x100px a la izquierda + contenido

### B) Página de restaurante:
1. Visitar cualquier restaurante que tenga:
   - Banner configurado
   - Logo configurado
   - Burgers con imágenes
2. ✅ **Verificar**:
   - Hero section con banner y logo superpuesto
   - Cada burger en el listado muestra su imagen
   - Responsive: En móvil se adapta correctamente

---

## 🐛 Test 6: Casos Edge

### A) URLs de imagen inválidas:
1. En modal de burger, poner URL inválida:
   ```
   https://sitio-que-no-existe.com/imagen.jpg
   ```
2. ✅ **Verificar**: 
   - Preview no se rompe
   - Imagen simplemente no se carga
   - Al guardar, no hay error

### B) Campos vacíos:
1. Crear burger SIN imagen (dejar campo vacío)
2. ✅ **Verificar**:
   - Se guarda correctamente
   - En tablas muestra "-" o "Sin imagen"
   - En páginas públicas no rompe layout

### C) Máximo de destacadas:
1. Ya tener 3 burgers destacadas
2. Intentar destacar una 4ta
3. ✅ **Verificar**: Alert "Ya hay 3 hamburguesas destacadas..."
4. Click OK, no se destaca

### D) Cambio de orden con conflicto:
1. Tener 3 destacadas: orden 1, 2, 3
2. Cambiar burger del orden 3 al orden 1
3. ✅ **Verificar**:
   - Burger anterior en orden 1 pasa a orden 3
   - No hay dos burgers con mismo orden
   - Listado se actualiza automáticamente

---

## 📊 Test 7: Estadísticas

### A) Dashboard actualizado:
1. Desde Dashboard, verificar que todos los números son correctos:
   - Total burgers (aprobadas)
   - Total restaurantes (aprobados)
   - Burgers destacadas (máx 3)
   - Pendientes de aprobación
   - Usuarios totales
   - Valoraciones totales
   - Promociones activas

### B) Navegación:
1. Probar todos los items del sidebar:
   - 📊 Dashboard
   - 🍔 Hamburguesas
   - 🏪 Restaurantes
   - ⭐ Destacados
   - 🎉 Promociones
   - ⏳ Pendientes (badge con contador)
   - 👥 Usuarios
   - ⭐ Valoraciones

2. ✅ **Verificar**: Cada sección carga correctamente

---

## ✅ Checklist Final

- [ ] Imágenes de burgers se muestran correctamente
- [ ] Banner y logo de restaurantes funcionan
- [ ] Sistema de destacados permite max 3 burgers
- [ ] Orden de destacadas se puede cambiar
- [ ] Items pendientes aparecen en sección correspondiente
- [ ] Aprobar mueve item a lista principal
- [ ] Rechazar oculta item
- [ ] Dashboard muestra estadísticas correctas
- [ ] Página de restaurante muestra todas las imágenes
- [ ] Mis valoraciones muestra imágenes de burgers
- [ ] Modal muestra previews de imágenes
- [ ] No hay errores de consola
- [ ] Layout responsive funciona en móvil

---

## 🚨 Problemas Comunes

### Problema: "Cannot read property 'image_url'"
**Solución**: Ejecutar script SQL para agregar campos a BD

### Problema: Imágenes no se ven
**Solución**: Verificar URLs, probar con Unsplash:
```
https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400
```

### Problema: No puedo destacar burger
**Solución**: Verificar que hay menos de 3 destacadas y que burger está aprobada

### Problema: Cambios no se guardan
**Solución**: Verificar que `createAdminClient()` existe en lib/supabase/client.ts

---

## 📸 Screenshots Esperados

### Panel Admin - Destacados:
```
⭐ Hamburguesas Destacadas
┌───────┬──────────────┬──────────┬────────┬────────┬──────────┐
│ Orden │ Hamburguesa  │ Rest.    │ Imagen │ Rating │ Acciones │
├───────┼──────────────┼──────────┼────────┼────────┼──────────┤
│ [1▼]  │ Royal Angus  │ Burger K.│ [IMG]  │ ⭐ 4.8 │ ❌ Quitar│
│ [2▼]  │ Big Tasty    │ McDonalds│ [IMG]  │ ⭐ 4.7 │ ❌ Quitar│
│ [3▼]  │ Whopper      │ Burger K.│ [IMG]  │ ⭐ 4.6 │ ❌ Quitar│
└───────┴──────────────┴──────────┴────────┴────────┴──────────┘
```

### Panel Admin - Pendientes:
```
⏳ Pendientes de Aprobación
┌──────────────┬────────────┬────────────┬──────────┬────────────────────┐
│ Tipo         │ Nombre     │ Enviado por│ Fecha    │ Acciones           │
├──────────────┼────────────┼────────────┼──────────┼────────────────────┤
│ 🍔 Burger    │ Test Burger│ usuario123 │ Hoy      │ ✏️ ✅ ❌          │
│ 🏪 Rest.     │ Test Rest  │ usuario456 │ Ayer     │ ✏️ ✅ ❌          │
└──────────────┴────────────┴────────────┴──────────┴────────────────────┘
```

### Página Restaurante:
```
┌─────────────────────────────────────────┐
│                                         │
│         [BANNER 1200x200]               │
│    ┌────────┐                           │
│    │ LOGO   │                           │
│    └────────┘                           │
└─────────────────────────────────────────┘

🏪 Nombre del Restaurante
📍 Madrid
⭐⭐⭐⭐⭐ 4.8/5 (245 valoraciones)

🍔 Hamburguesas en el Ranking (5)
┌────────┬─────────────────────────────┐
│ [IMG]  │ #1 Royal Angus              │
│ 100x   │ ⭐ 4.8  245 val             │
│ 100    │ Premium, Jugosa, Fresca     │
└────────┴─────────────────────────────┘
```

---

## 🎉 ¡Pruebas Completadas!

Si todos los tests pasan, las mejoras están funcionando correctamente.
