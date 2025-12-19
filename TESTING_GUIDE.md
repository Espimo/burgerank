# 🧪 GUÍA RÁPIDA DE TESTING - AUTENTICACIÓN

## ⚡ 5 MINUTOS PARA VERIFICAR QUE TODO FUNCIONA

### Paso 1: Configuración Inicial (1 min)

```bash
# Asegúrate de tener .env.local con:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Inicia el servidor
npm run dev

# Espera a que compile completamente
# Deberías ver: "Local: http://localhost:3000"
```

### Paso 2: Prueba de Signup (2 min)

1. Abre: `http://localhost:3000/auth/signup`

2. Completa el formulario con:
   - **Username:** `testuser123`
   - **Email:** `test@example.com` (o cualquier email)
   - **Password:** `TestPassword123`

3. Verifica que pase:
   - ✅ Botón "Registrarse" funciona
   - ✅ Se redirige a `/auth/verify-email`
   - ✅ Ve un mensaje de éxito

4. **¿Qué sucedió en backend?**
   - Se creó usuario en `auth.users`
   - Se creó perfil en `public.users`
   - Se envió email de confirmación (si SMTP está configurado)

### Paso 3: Prueba de Signin (2 min)

1. Ve a: `http://localhost:3000/auth/signin`

2. Completa con:
   - **Email:** `test@example.com` (el que usaste en signup)
   - **Password:** `TestPassword123`

3. Verifica que pase:
   - ✅ Botón "Iniciar Sesión" funciona
   - ✅ Se redirige a `/ranking`
   - ✅ Ves la página del ranking
   - ✅ El sistema te reconoce como autenticado

4. **¿Qué sucedió en backend?**
   - Supabase autenticó el usuario
   - Backend obtuvo perfil del usuario
   - Sesión se guardó en cookies

### Paso 4: Verificación de Autenticación

1. Abre Developer Tools (F12)
2. Ve a **Application > Cookies**
3. Deberías ver cookies de Supabase:
   - `sb-access-token`
   - `sb-refresh-token`

4. Ve a **Console** y ejecuta:
   ```javascript
   // Verifica que el usuario esté autenticado
   console.log(localStorage.getItem('sb-access-token'));
   // Deberías ver un token JWT largo
   ```

### Paso 5: Prueba de Logout

1. Abre el Sidebar (click en ☰)
2. Deberías ver un botón **"🚪 Cerrar Sesión"**
3. Haz click en él
4. Verifica que pase:
   - ✅ Se redirige a `/auth/signin`
   - ✅ Las cookies se limpian
   - ✅ No puedes acceder a páginas protegidas

### Paso 6: Verificación de Protección de Rutas

1. Después de logout, intenta acceder a:
   - `http://localhost:3000/ranking`
   - `http://localhost:3000/rate`
   - `http://localhost:3000/profile`

2. Deberías ser redirigido a `/auth/signin`
   - ✅ Las rutas están protegidas correctamente

---

## 🔍 CÓMO VERIFICAR LOGS

### En la Terminal (Next.js)

```bash
# Busca líneas como:
# - POST /api/auth/signup 200
# - POST /api/auth/signin 200
# - POST /api/auth/logout 200

# Si hay errores, verás:
# - Error: Cannot insert into users
# - Error: Invalid email format
# - etc.
```

### En Developer Console (F12)

```javascript
// Ver errores de red
// Network tab > Filter by "auth"
// Deberías ver requests exitosos (200)

// Ver errores de JS
// Console tab
// No deberías ver errores rojos

// Ver qué guarda el navegador
// Application > Storage
// - localStorage
// - sessionStorage
// - Cookies
```

---

## ✅ LISTA DE VERIFICACIÓN FINAL

### Autenticación

- [ ] ✅ Puedo registrarme con email/password
- [ ] ✅ Se crea usuario en Supabase
- [ ] ✅ Se crea perfil en tabla users
- [ ] ✅ Puedo iniciar sesión
- [ ] ✅ Se guarda la sesión en cookies
- [ ] ✅ Puedo cerrar sesión
- [ ] ✅ Las cookies se limpian después de logout

### Protección de Rutas

- [ ] ✅ Sin autenticar: `/ranking` redirige a `/auth/signin`
- [ ] ✅ Sin autenticar: `/rate` redirige a `/auth/signin`
- [ ] ✅ Sin autenticar: `/profile` redirige a `/auth/signin`
- [ ] ✅ Autenticado: Puedo acceder a todas las rutas
- [ ] ✅ Autenticado: `/auth/signin` redirige a `/ranking`

### UI/UX

- [ ] ✅ Botón de logout aparece cuando estoy autenticado
- [ ] ✅ Los formularios muestran errores claramente
- [ ] ✅ Los botones se deshabilitan mientras se procesa
- [ ] ✅ Los mensajes de éxito aparecen
- [ ] ✅ Las redirecciones funcionan suavemente

---

## 🐛 PROBLEMAS COMUNES DURANTE TESTING

### "Error: Cannot insert into users"

**Causa:** RLS policies no están configuradas

**Solución:**
1. Ve a Supabase > SQL Editor
2. Ejecuta: `database/rls_policies.sql`

### "Error: Usuario no encontrado"

**Causa:** El perfil no se creó en `public.users`

**Solución:**
- Este error ya está arreglado en el nuevo código
- Si sigue ocurriendo, verifica que `.insert([])` esté correctamente formado

### "Sesión no persiste después de refresh"

**Causa:** Cookies no se guardan o se bloquean

**Solución:**
1. Revisa que no estés en modo Incógnito
2. Verifica Configuración > Privacidad > Cookies (Permitir)
3. Revisa que CORS esté configurado correctamente en Supabase

### "Error: Email already exists"

**Causa:** Ya intentaste registrarte con ese email

**Solución:**
- Usa otro email para testing
- O resetea la base de datos en Supabase

### "Error: Invalid password"

**Causa:** Contraseña < 8 caracteres

**Solución:**
- Usa una contraseña con 8+ caracteres
- Preferiblemente con mayúsculas, números y símbolos

---

## 📊 FLUJO ESPERADO DE TESTING

```
1. SIGNUP
   http://localhost:3000/auth/signup
   ↓
   Completa formulario
   ↓
   POST /api/auth/signup
   ↓
   Usuario creado en auth.users ✅
   Perfil creado en public.users ✅
   Email enviado ✅
   ↓
   Redirige a /auth/verify-email
   ↓
   Ves mensaj"Cuenta creada"

2. SIGNIN
   http://localhost:3000/auth/signin
   ↓
   Completa formulario
   ↓
   POST /api/auth/signin
   ↓
   Usuario autenticado ✅
   Sesión guardada ✅
   ↓
   Redirige a /ranking
   ↓
   Ves el ranking

3. LOGOUT
   Click en "🚪 Cerrar Sesión"
   ↓
   POST /api/auth/logout
   ↓
   Sesión limpiada ✅
   Cookies borradas ✅
   ↓
   Redirige a /auth/signin
```

---

## 🎯 PRÓXIMAS PRUEBAS AVANZADAS

Una vez que lo básico funcione, prueba:

1. **Refresh de página después de login**
   - La sesión debe persistir

2. **Intentar acceder a ruta protegida sin autenticar**
   - Debe redirigir a signin

3. **Intentar acceder a signin siendo autenticado**
   - Debe redirigir a ranking

4. **Mantener sesión abierta 24+ horas**
   - Debe renovarse automáticamente

5. **Usar en diferentes navegadores/pestañas**
   - Sincronización de sesión

6. **En modo Incógnito**
   - Cookies de sesión se limpian al cerrar

---

## 📝 REPORTE DE ERRORES

Si encuentras algún error, registra:

1. **¿Qué intentaste hacer?**
   - Ej: "Registrarme con email y password"

2. **¿Qué sucedió?**
   - Ej: "Botón no responde"

3. **¿Qué se esperaba?**
   - Ej: "Debería crearme la cuenta"

4. **Logs del error:**
   ```
   Console (F12): [copiar error]
   Terminal: [copiar línea de error]
   Network (F12): [status del request]
   ```

5. **Pasos para reproducir:**
   - 1. Abre http://localhost:3000/auth/signup
   - 2. Ingresa...
   - 3. Click en botón...
   - etc.

---

**¡Testing completado!** ✅

Si todo pasó, tu autenticación está lista para producción.
