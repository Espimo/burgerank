# 🔧 Guía de Uso del Panel Admin - Troubleshooting

## 🎯 El Panel Admin Está Disponible, Aquí Te Muestro Cómo Funciona

Acabo de corregir un problema menor con las clases CSS del menú. Ahora todo debería funcionar perfecto. Aquí está la guía completa:

---

## 🚀 Acceso al Panel

### URL
```
http://localhost:3000/admin
ó
https://burgerank.vercel.app/admin
```

### Credenciales
```
Usuario: usuario_admin
Contraseña: admin123
```

---

## 📋 Secciones Disponibles

### 1. 📊 Dashboard
**¿Qué ves?**
- Total de restaurantes
- Total de hamburguesas
- Valoraciones pendientes
- Tickets sin verificar
- Usuarios totales
- Solicitudes pendientes
- Registro de actividad reciente

**Funcionalidad:** Solo lectura (información general)

---

### 2. 🏪 Gestión de Restaurantes

**¿Qué puedes hacer?**

#### Crear Restaurante
```
1. Completa el formulario "Añadir Nuevo Restaurante"
2. Campos obligatorios:
   - Nombre
   - Ciudad (dropdown)
   - Dirección
   - Teléfono
   - Horario
3. Haz clic en "➕ Crear Restaurante"
```

#### Buscar Restaurante
```
1. Usa la barra de búsqueda (🔍)
2. Escribe el nombre o ciudad
3. Los resultados se actualizan instantáneamente
```

#### Editar Restaurante
```
1. Busca el restaurante en la tabla
2. Haz clic en "✏️ Editar"
3. Modifica los campos que necesites
4. Haz clic en "💾 Guardar Cambios" o "❌ Cancelar"
```

#### Ver Detalles
```
1. Haz clic en "👁️ Ver" en la fila del restaurante
2. Se abrirá un modal con toda la información
```

#### Eliminar Restaurante
```
1. Haz clic en "🗑️ Eliminar"
2. Confirma la acción
3. Se eliminará automáticamente
```

**Tabla Mostrará:**
- Nombre
- Ciudad
- Teléfono
- Rating (con ★ estrellas)
- Botones de acción

---

### 3. 🍟 Gestión de Hamburguesas

**¿Qué puedes hacer?**

#### Crear Hamburguesa
```
1. Completa el formulario "Añadir Nueva Hamburguesa"
2. Campos obligatorios:
   - Nombre
   - Restaurante (select)
   - Tipo (Premium, Clásica, Doble, Vegana, Especial)
   - Precio (número)
   - Descripción
3. Añade Tags (escribe y presiona Enter)
4. Haz clic en "➕ Crear Hamburguesa"
```

#### Buscar y Filtrar
```
1. Barra de búsqueda: por nombre o restaurante
2. Filtro de tipo: Premium, Clásica, Doble, Vegana, Especial
3. Los resultados se actualizan en tiempo real
```

#### Editar Hamburguesa
```
1. Busca la hamburguesa
2. Haz clic en "✏️ Editar"
3. Modifica campos (incluyendo tags)
4. Haz clic en "💾 Guardar" o "❌ Cancelar"
```

#### Ver Detalles
```
1. Haz clic en "👁️ Ver"
2. Se abrirá modal con: restaurante, tipo, precio, rating, tags
```

#### Eliminar
```
1. Haz clic en "🗑️ Eliminar"
2. Confirma y se eliminará
```

---

### 4. 📋 Solicitudes de Usuarios

**¿Qué ves?**
- Solicitudes pendientes de aprobación
- Usuario que hizo la solicitud
- Tipo de solicitud
- Detalles
- Fecha
- Estado

**¿Qué puedes hacer?**
- ✅ Aprobar: Marca como aprobada
- ❌ Rechazar: Elimina la solicitud

---

### 5. ⭐ Revisión de Valoraciones

**¿Qué puedes hacer?**

#### Búsqueda y Filtros
```
- Buscar por usuario
- Filtrar por estado: Pendiente / Verificado
```

#### Acciones
```
- ✅ Verificar: Marca valoración como verificada
- ❌ Rechazar: Elimina la valoración
```

**Información Mostrada:**
- Usuario que calificó
- Hamburguesa calificada
- Rating (con ★ estrellas)
- Comentario
- Fecha
- Estado

---

### 6. 🎫 Gestión de Tickets

**¿Qué puedes hacer?**

#### Búsqueda y Filtros
```
- Buscar por usuario
- Filtrar por estado: Pendiente / Verificado
```

#### Acciones
```
- ✅ Verificar: Confirma el ticket
- ❌ Rechazar: Elimina el ticket
```

**Información:**
- Usuario
- Hamburguesa comprada
- Restaurante
- Precio
- Fecha
- Estado

---

### 7. 👥 Gestión de Usuarios

**¿Qué puedes hacer?**

#### Búsqueda y Filtros
```
- Buscar por username o email
- Filtrar usuarios bloqueados
```

#### Acciones
```
- 👁️ Ver: Muestra detalles del usuario
- 🚫 Bloquear: Marca usuario como bloqueado
```

**Información:**
- Username
- Email
- Categoría (o estado Bloqueado)
- Puntos
- Cantidad de valoraciones
- Fecha de registro

---

## 🔑 Funcionalidades Especiales

### Búsqueda Global
```
Disponible en:
✓ Restaurantes
✓ Hamburguesas
✓ Usuarios
✓ Valoraciones
✓ Tickets

Funciona en tiempo real - no necesitas presionar Enter
```

### Filtros Contextuales
```
Restaurantes: Por ciudad
Hamburguesas: Por tipo (Premium, Clásica, etc.)
Usuarios: Por estado (bloqueados)
Valoraciones: Por estado (Pendiente/Verificado)
Tickets: Por estado (Pendiente/Verificado)
```

### Edición de Elementos
```
Disponible para:
✓ Restaurantes (todos los campos)
✓ Hamburguesas (nombre, tipo, precio, descripción, tags)

No disponible para:
✗ Usuarios (solo bloquear)
✗ Valoraciones (solo verificar/rechazar)
✗ Tickets (solo verificar/rechazar)
✗ Solicitudes (solo aprobar/rechazar)
```

### Tags en Hamburguesas
```
Cómo añadir tags:
1. En el formulario de hamburguesa
2. Escribe el tag en el input
3. Presiona Enter
4. El tag aparecerá como una etiqueta dorada

Cómo remover tags:
1. Haz clic en la X dentro del tag
2. Se elimina instantáneamente
```

---

## ⚠️ Validaciones

### Restaurantes
```
✓ Nombre no vacío
✓ Ciudad seleccionada
✓ Dirección no vacía
✓ Teléfono no vacío
✓ No permite duplicar nombres
✓ Muestra error si falta algo
```

### Hamburguesas
```
✓ Nombre no vacío
✓ Precio > 0 (número válido)
✓ Descripción no vacía
✓ No permite duplicar nombres
✓ Muestra error si faltan campos
```

---

## 🎨 Indicadores Visuales

### Estados
```
⏳ Pendiente     - Item esperando aprobación
✅ Aprobado     - Item aprobado
✅ Verificado   - Item verificado
🚫 Bloqueado    - Usuario bloqueado
★ Rating       - Calificación en estrellas
```

### Botones de Acción
```
👁️ Ver           - Ver detalles
✏️ Editar        - Editar elemento
🗑️ Eliminar      - Eliminar elemento
✅ Verificar     - Verificar/Aprobar
❌ Rechazar      - Rechazar/Eliminar
💾 Guardar       - Guardar cambios
❌ Cancelar      - Descartar cambios
🚫 Bloquear      - Bloquear usuario
```

---

## 💾 Guardado de Datos

### Almacenamiento
```
Los datos se guardan en localStorage del navegador
Clave: burgerankAdminData
Se actualiza cada vez que haces un cambio
```

### Persistencia
```
✓ Los datos persisten al cerrar sesión
✓ Los datos persisten al actualizar la página
✓ Los datos se pierden si limpias el localStorage
```

---

## 🔄 Registro de Actividad

### Qué se Registra
```
✓ Crear restaurante
✓ Editar restaurante
✓ Eliminar restaurante
✓ Crear hamburguesa
✓ Editar hamburguesa
✓ Eliminar hamburguesa
✓ Aprobar solicitud
✓ Rechazar solicitud
✓ Bloquear usuario
✓ Verificar valoración
✓ Rechazar valoración
✓ Verificar ticket
✓ Rechazar ticket
✓ Inicios de sesión
✓ Cierres de sesión
```

### Dónde se Ve
```
Dashboard > Actividad Reciente
Muestra últimas 5 acciones con:
- Tipo de acción
- Descripción
- Fecha y hora
- Estado (Completado)
```

---

## ❓ Problemas Comunes

### Problema: No veo los restaurantes en la tabla
**Solución:**
1. Asegúrate de haber iniciado sesión correctamente
2. Verifica que el formulario haya mostrado el mensaje ✅
3. Recarga la página (F5)
4. Intenta crear uno nuevo

### Problema: El formulario de edición no aparece
**Solución:**
1. Haz clic en "✏️ Editar" nuevamente
2. Si no aparece, actualiza la página
3. Intenta con un elemento diferente

### Problema: Los cambios no se guardan
**Solución:**
1. Verifica que haya un mensaje ✅ de confirmación
2. Si no lo hay, revisa que todos los campos sean válidos
3. Comprueba que el precio sea un número válido

### Problema: No puedo bloquear un usuario
**Solución:**
1. El botón 🚫 solo aparece para usuarios no bloqueados
2. Si ya está bloqueado, verá "Bloqueado" en la columna categoría
3. No puedes desbloquear, solo bloquear

---

## 🎯 Flujo de Trabajo Recomendado

### Para Gestionar Restaurantes
```
1. Abre "🏪 Restaurantes"
2. Busca si existe con la barra de búsqueda
3. Si no existe: Llena el formulario y crea uno nuevo
4. Si existe: Haz clic en "✏️ Editar" para actualizar
5. Verifica cambios en el dashboard
```

### Para Moderar Valoraciones
```
1. Abre "⭐ Valoraciones"
2. Filtra por "Pendiente"
3. Revisa cada comentario
4. Haz clic "✅ Verificar" si es apropiado
5. Haz clic "❌ Rechazar" si es inapropiado
```

### Para Gestionar Usuarios
```
1. Abre "👥 Usuarios"
2. Busca el usuario problemático
3. Haz clic "👁️ Ver" para ver detalles
4. Si necesitas: Haz clic "🚫 Bloquear"
5. Verifica en el filtro de bloqueados
```

---

## 📱 Responsividad

### Desktop
```
Ancho: 1920px+
Vista: Completa con sidebar
Tablas: Todas las columnas visibles
```

### Laptop
```
Ancho: 1024px
Vista: Optimizada
Botones: Todos visibles
```

### Tablet
```
Ancho: 768px
Vista: Menú adapta a grid
Tablas: Scroll horizontal si necesario
```

### Mobile
```
Ancho: 480px
Vista: Comprimida
Menú: Grid de botones
Tablas: Scroll horizontal
```

---

## 🚀 Próximos Pasos Recomendados

1. **Conectar a Supabase**: Usar BD real en lugar de localStorage
2. **Exportar Reportes**: Generar CSV/PDF de datos
3. **Paginación**: Para listas de 100+ items
4. **Búsqueda Avanzada**: Por fechas, precios, ratings
5. **Auditoría Detallada**: Quién hizo qué y cuándo
6. **Dark/Light Mode**: Toggle de tema
7. **Bulk Actions**: Operaciones en múltiples items

---

## 💡 Tips & Tricks

### Búsqueda Eficiente
```
- Búsqueda no distingue mayúsculas/minúsculas
- Funciona con búsqueda parcial
- Se actualiza mientras escribes
- Presiona Ctrl+A para limpiar rápido
```

### Edición Rápida
```
- Haz clic en editar cuando veas que necesita cambios
- El formulario se pre-rellena automáticamente
- Puedes dejar campos sin cambiar
- Solo cambia lo que necesites
```

### Organización
```
- Usa nombres descriptivos para restaurantes
- Agrupa hamburguesas por tipo
- Bloquea usuarios spam de inmediato
- Verifica valoraciones al menos 1x por día
```

---

## ✅ Checklist de Verificación

Después de crear elementos, verifica:
```
[ ] Mensaje ✅ de éxito apareció
[ ] Elemento visible en la tabla
[ ] Puede buscarse con la barra de búsqueda
[ ] Puede editarse con el botón ✏️
[ ] Aparece en el dashboard con el contador correcto
[ ] Actividad registrada en el log
```

---

## 📞 Soporte

Si algo no funciona:
1. Verifica credenciales: usuario_admin / admin123
2. Recarga la página (F5 o Ctrl+R)
3. Limpia localStorage: abre DevTools (F12) → Application → localStorage → Delete
4. Intenta nuevamente
5. Si persiste, revisa la consola para errores (F12 → Console)

---

**¡El panel admin está completamente funcional y listo para usar!**

**Estado:** ✅ TODAS LAS FUNCIONALIDADES OPERATIVAS
