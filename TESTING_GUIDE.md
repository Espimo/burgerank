# 🧪 Guía de Testing Rápido - Correcciones Implementadas

## Quick Checklist de Verificación

### ✓ Test 1: Clasificación de Hamburguesas Visible
**URL**: `/app/burgers`
**Steps**:
1. Abre la página de ranking de hamburguesas
2. Busca cualquier tarjeta de burger
3. **Verifica**: Debería haber un badge de color amber en la esquina superior-izquierda
4. **Ejemplos de tipos**: "Clasica", "Premium", "Vegana", "Pollo", "Doble"

**Resultado esperado**: ✅ Badge visible con el tipo de hamburguesa

---

### ✓ Test 2: Enviar Hamburguesa para Revisión
**URL**: `/app/rate`
**Steps**:
1. Navega a la página de calificar
2. Crea una nueva hamburguesa (botón "Crear Nueva Burger")
3. Completa el formulario:
   - Nombre del restaurante: "Test Burger"
   - Nombre de la burger: "Test Burger"
   - Ciudad: "Madrid"
   - Tipo: cualquiera
   - Precio: 10
4. Haz clic en "Enviar para revisión"

**Resultado esperado**: 
- ✅ Mensaje: "Burger enviada para revisión. Aparecerá en 24-48 horas"
- ✅ Modal se cierra
- ✅ No hay errores en consola

---

### ✓ Test 3: Cargar Perfil de Usuario
**URL**: `/app/profile`
**Steps**:
1. Asegúrate de estar autenticado
2. Haz clic en tu nombre de usuario en el menú superior
3. O navega directamente a `/app/profile`

**Resultado esperado**:
- ✅ Se carga el perfil sin errores
- ✅ Se muestra tu nombre de usuario
- ✅ Se muestran tus estadísticas (puntos, reviews, badges)
- ✅ No hay mensaje "Error cargando perfil"

---

### ✓ Test 4: Página "Sobre Nosotros"
**URL**: `/about`
**Steps**:
1. Navega a la página About
2. Desplázate hacia la sección "Metodología de Ranking"
3. Haz clic en cualquiera de los 6 factores de ranking

**Resultado esperado**:
- ✅ Página carga sin errores de React
- ✅ Los factores se expanden/contraen al hacer clic
- ✅ No hay error "Minified React Error #321" en consola
- ✅ Las animaciones funcionan suavemente

---

## 📱 Testing Cross-Browser (Opcional)

Prueba en:
- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (si está disponible)
- ✅ Mobile (Responsive)

---

## 🔍 Debugging Console

Si encuentras problemas, abre la consola del navegador (F12) y busca:

### ✅ Errores que NO deberían aparecer:
- `Error loading profile`
- `Minified React error #321`
- `Webhook error` (excepto si no está configurada la URL)
- `burger_type is undefined`

### ✅ Mensajes que SÍ deberían aparecer:
- Cuando creas una burger: Success message (sin errores)
- Cuando cargas perfil: Carga completa sin errores

---

## 🚀 Performance Check

Verifica en DevTools → Network:
- Las llamadas API a endpoints de burger se completan
- Las imágenes de burger cargan correctamente
- No hay requests fallidas (404, 500, etc.)

---

## 📊 Checklist Final

- [ ] Test 1: Clasificación visible en tarjetas ✓
- [ ] Test 2: Enviar burger funciona ✓
- [ ] Test 3: Perfil carga sin errores ✓
- [ ] Test 4: Página About funciona ✓
- [ ] Sin errores en consola del navegador ✓
- [ ] Performance aceptable ✓

---

## 💡 Tips Adicionales

1. **Limpiar cache**: Si algo no funciona, prueba Ctrl+F5 (fuerza refresh sin cache)
2. **DevTools**: Abre con F12 y revisa Console y Network
3. **Log de datos**: Abre `/app/profile` y verifica que muestre un userId válido en la consola

---

## 📞 Contacto/Soporte

Si encuentras un problema:
1. Verifica que estés ejecutando la versión más reciente del código
2. Revisa los logs en la consola del navegador
3. Consulta el archivo `FIXES_IMPLEMENTED.md` para detalles técnicos
