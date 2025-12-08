# 🔧 SETUP COMPLETO DE SUPABASE - INSTRUCCIONES PASO A PASO

## ⚠️ IMPORTANTE

Tu base de datos actual NO tiene las tablas ni tipos configurados. El error `type "user_level" does not exist` confirma que las migraciones no se ejecutaron.

## 📋 SOLUCIÓN

### Paso 1: Ejecutar Setup Completo

1. Abre Supabase: https://app.supabase.com
2. Selecciona tu proyecto **burgerank**
3. Ve a **SQL Editor** (lado izquierdo)
4. Copia TODO el contenido de `SUPABASE_SETUP_COMPLETE.sql`
5. Pégalo en la ventana de SQL Editor
6. Haz clic en **"RUN"** (botón azul arriba)
7. **Espera a que termine** (tardará 30-60 segundos)

### Paso 2: Verificar Creación Exitosa

Después de ejecutar el SQL, ve a **Database > Tables** y verifica que existan:

✅ profiles
✅ restaurants
✅ burgers
✅ reviews
✅ review_images
✅ review_tags
✅ user_preferences
✅ follows
✅ rewards
✅ user_rewards
✅ user_badges
✅ burger_matches

Si ves todas las tablas, ¡el setup fue exitoso! ✅

### Paso 3: Crear Usuario Demo

1. Ve a **Authentication > Users**
2. Haz clic en **"Add user"**
3. Rellena:
   - **Email**: demo@burgerank.com
   - **Password**: Demo123456!
4. Haz clic en **"Save user"**

✅ El perfil se creará automáticamente via trigger

### Paso 4: Verificar Usuario Demo

1. Ve a **Database > Tables > profiles**
2. Busca un registro con email `demo@burgerank.com`
3. Debería tener:
   - username: "demo"
   - city: "Unknown"
   - level: "burger_fan"
   - total_points: 0

Si existe, ¡está funcionando! ✅

---

## 🚀 Próximos Pasos en la Web

Una vez confirmado el setup:

1. Abre https://burgerank.vercel.app/register
2. Prueba registrarte con:
   - Email: test@email.com
   - Password: Test123456!
   - Username: test_user
   - City: Madrid

3. O usa la cuenta demo:
   - Email: demo@burgerank.com
   - Password: Demo123456!

---

## ✅ Checklist de Verificación

- [ ] Ejecuté `SUPABASE_SETUP_COMPLETE.sql` sin errores
- [ ] Veo 12 tablas en Database > Tables
- [ ] Creé usuario demo (demo@burgerank.com)
- [ ] El perfil aparece en profiles table
- [ ] Puedo registrarme desde la web sin errores
- [ ] El trigger crea el perfil automáticamente

---

## 🐛 Si Algo Falla

### Error: "Type user_level already exists"

Significa que el setup ya se ejecutó parcialmente. Opción:

1. **Opción A (Recomendado)**: Copia y ejecuta `CLEANUP_AND_RESET.sql` primero
2. **Opción B**: Borra el proyecto y crea uno nuevo

### Error: "Relation profiles does not exist"

Ejecuta el SQL setup nuevamente, completo.

### El trigger no crea el perfil

Verifica que hayas ejecutado `handle_new_user()` trigger correctamente.

---

¿Necesitas ayuda? Avísame cuando hayas ejecutado el SQL y te diré qué hacer next.
