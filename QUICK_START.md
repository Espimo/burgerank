#!/bin/bash
# 🍔 BurgeRank - Quick Start Guide

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### Paso 1: Inicia el servidor
```powershell
cd c:\0_CRISTHIAN\burgerank_project
python -m http.server 8888
```

### Paso 2: Abre BurgeRank-Complete.html
```
http://localhost:8888/BurgeRank-Complete.html
```

### Paso 3: Prueba los enlaces nuevos
✅ Click "Ver Todo →" en "Mi Top 3" → rankings.html
✅ Click "Ver Todo →" en "Últimas" → calificaciones.html
✅ Click "🏪 Restaurante" → restaurante.html?nombre=...
✅ Click "⭐ Valorar" → rate.html

---

## 📁 ARCHIVOS ENTREGADOS

### BurgeRank-Complete.html (Modificado)
```
✅ Enlaces a nuevas páginas
✅ Función fetchData() asíncrona
✅ simulación de latencia 1000ms
```

### Nuevas Páginas
```
✅ rankings.html - Ranking Global
✅ calificaciones.html - Mis Calificaciones
✅ restaurante.html - Detalles del Restaurante (con parámetro URL)
✅ rate.html - Formulario de Calificación (funcional)
```

### Documentación
```
✅ ENTREGA_TECNICA.md - Documentación técnica completa
✅ README_ENTREGA.md - Guía de uso detallada
✅ RESUMEN_EJECUTIVO.md - Resumen de entregas
✅ QUICK_START.md - Este archivo
```

---

## ✨ CARACTERÍSTICAS PRINCIPALES

### rate.html (Formulario Funcional)
- 📝 Nombre de Hamburguesa
- 🏪 Nombre del Restaurante
- 📍 Ciudad/Ubicación
- ⭐ Puntuación 1-10 (input numérico + 10 botones estrella)
- 💾 Botón Guardar con validación completa
- ✓ Mensaje de éxito emergente
- ✓ Reset automático de formulario

### restaurante.html (Dinámico)
- 🔗 Extrae nombre de: ?nombre=RESTAURANTE
- 🏪 Título dinámico
- 📍 Información del restaurante
- 🗺️ Mapa simulado
- 📊 Estadísticas
- 🍔 Lista de hamburguesas
- 💬 Sección de calificaciones

### Navegación Uniforme
- 🏠 Bottom navigation en todas las páginas
- ← Botones de retorno en todas las páginas
- 📱 Responsive en mobile, tablet, desktop

---

## 🧪 PRUEBAS RÁPIDAS

### Test 1: Enlace Dinámico
```
1. Abre BurgeRank-Complete.html
2. Baja hasta encontrar una hamburguesa
3. Click en botón "🏪 Restaurante"
4. ✅ Debería abrir restaurante.html?nombre=[RESTAURANTE]
5. ✅ El título debe mostrar el nombre del restaurante
```

### Test 2: Formulario Funcional
```
1. Click en "⭐ Valorar" en el bottom nav
2. Rellena: "The King", "Burger Palace", "Madrid", "9"
3. ✅ Las estrellas se destacan
4. Click "Guardar Calificación"
5. ✅ Ves mensaje de éxito
6. ✅ Formulario está limpio
```

### Test 3: Navegación
```
1. Desde BurgeRank-Complete.html
2. Click "Ver Todo →" en "Mi Top 3"
3. ✅ Abre rankings.html
4. Click botón "Volver"
5. ✅ Regresa a BurgeRank-Complete.html
```

---

## 📊 ESTRUCTURA DE ARCHIVOS

```
burgerank_project/
│
├── BurgeRank-Complete.html        ✅ Principal (modificado)
├── rankings.html                   ✅ Nuevo
├── calificaciones.html             ✅ Nuevo
├── restaurante.html                ✅ Nuevo
├── rate.html                       ✅ Nuevo
│
└── Documentación/
    ├── ENTREGA_TECNICA.md
    ├── README_ENTREGA.md
    ├── RESUMEN_EJECUTIVO.md
    └── QUICK_START.md (este archivo)
```

---

## 🎨 DISEÑO UNIFORME

Todos los archivos tienen:
- ✅ Colores consistentes (#fbbf24 primario)
- ✅ Tipografía idéntica
- ✅ Estructura de grid similar
- ✅ Bottom nav en todas las páginas
- ✅ Estilos CSS completos (no externos)

---

## 🔍 CAMBIOS EN BurgeRank-Complete.html

### Cambio 1: Enlaces de navegación
```javascript
// ANTES
onclick="loadMyRanking(); showPage('myranking')"

// DESPUÉS
onclick="window.location.href='rankings.html'"
```

### Cambio 2: Enlaces dinámicos
```javascript
// ANTES
onclick="viewRestaurant(${burger.id})"

// DESPUÉS
onclick="window.location.href='restaurante.html?nombre=' + encodeURIComponent('${burger.restaurant}')"
```

### Cambio 3: Función asíncrona
```javascript
// NUEVA FUNCIÓN
async function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ userData, burgers });
        }, 1000);
    });
}

// USO
(async () => {
    await fetchData();
    loadRanking();
})();
```

---

## 💡 TIPS ÚTILES

### Abrir Console (F12)
Verás logs detallados de:
- fetchData() inicializándose
- Datos cargados
- Calificaciones guardadas
- Errores (si los hay)

### Test en Mobile
Abre DevTools → Toggle device toolbar (Ctrl+Shift+M)
Prueba en ancho 375px, 768px, 1920px

### Verificar Formulario
Prueba llenar incompleto:
- ✅ Muestra alerta si falta algún campo
- ✅ Bloquea puntuación fuera de 1-10
- ✅ Valida después de guardar

---

## ⚠️ REQUISITOS

- Python 3.6+ instalado
- Browser moderno (Chrome, Firefox, Safari, Edge)
- Terminal/PowerShell con acceso a cd

---

## 🚀 COMANDO PARA INICIAR

```powershell
# En PowerShell
cd c:\0_CRISTHIAN\burgerank_project
python -m http.server 8888

# El servidor estará en:
# http://localhost:8888/BurgeRank-Complete.html
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Servidor http.server corriendo en puerto 8888
- [ ] BurgeRank-Complete.html abre sin errores
- [ ] Click "Ver Todo →" (Mi Top 3) → rankings.html
- [ ] Click "Ver Todo →" (Últimas) → calificaciones.html
- [ ] Click "Restaurante" → restaurante.html?nombre=...
- [ ] Click "Valorar" → rate.html
- [ ] Formulario valida campos requeridos
- [ ] Selector de estrellas funciona
- [ ] Click "Guardar" muestra éxito
- [ ] Botones "Volver" funcionan
- [ ] Bottom nav visible en todas las páginas
- [ ] Diseño responsive en mobile

---

## 📞 SOPORTE

### El formulario no guarda datos
✅ Es normal. Los datos se loguean en console solo.
Para persistencia, necesitas un backend.

### Los enlaces no funcionan
✅ Verifica que todos los .html estén en el mismo directorio
✅ Asegúrate que el servidor esté corriendo

### Las estrellas no se sincronizan
✅ Actualiza la página (Ctrl+F5)
✅ Verifica que no tengas JavaScript deshabilitado

---

## 🎓 PRÓXIMOS PASOS

1. **Conectar a Backend:**
   - Crear API REST (Node.js, Django, etc.)
   - Guardar datos en base de datos

2. **Agregar Funcionalidad Real:**
   - Autenticación de usuarios
   - Búsqueda y filtros
   - Carga de imágenes

3. **Mejorar UX:**
   - Mapas interactivos
   - Paginar resultados
   - Agregar reviews

---

**Versión:** 1.0  
**Fecha:** 2025-12-16  
**Estado:** ✅ Listo para usar  

¡Disfruta BurgeRank! 🍔
