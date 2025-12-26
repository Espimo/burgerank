# ⚠️ INSTRUCCIONES URGENTES - Ejecutar 2 Scripts SQL

## 🔴 PROBLEMAS DETECTADOS

1. **Favoritos**: Error `permission denied for table user_favorites` (código 42501)
2. **Ratings**: Error `permission denied for table ranking_config` (código 42501)

**Causa:** Las políticas de seguridad RLS (Row Level Security) están bloqueando el acceso a estas tablas.

## ✅ SOLUCIÓN

Debes ejecutar **DOS scripts SQL** en Supabase en este orden:

## 📝 PASOS A SEGUIR

### 1. Abre Supabase
- Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Selecciona tu proyecto **BurgeRank**

### 2. SCRIPT 1: Corregir ranking_config

- En el menú lateral izquierdo, haz clic en **"SQL Editor"**
- Haz clic en **"New Query"** (Nueva consulta)
- Abre el archivo: `database/fix_ranking_config_rls.sql`
- **Copia TODO el contenido** del archivo
- **Pégalo** en el editor SQL de Supabase
- Haz clic en el botón **"Run"** (Ejecutar)
- Deberías ver: **"Success. No rows returned"**

### 3. SCRIPT 2: Corregir user_favorites y notifications

- Haz clic en **"New Query"** de nuevo
- Abre el archivo: `database/migration_notifications_favorites.sql`
- **Copia TODO el contenido** del archivo  
- **Pégalo** en el editor SQL
- Haz clic en **"Run"**
- Deberías ver: **"Success. No rows returned"**

### 4. Verifica que se crearon las tablas correctamente
- Ve a **"Table Editor"** en el menú lateral
- Deberías ver estas tablas:
  - ✅ `notifications`
  - ✅ `user_favorites`
  - ✅ `ranking_config` (ya existía)

## 🎯 QUÉ HACEN ESTOS SCRIPTS

### Script 1: `fix_ranking_config_rls.sql`
- Corrige los permisos de la tabla `ranking_config`
- Permite que las funciones del sistema lean la configuración
- Necesario para que funcione la actualización de ratings

### Script 2: `migration_notifications_favorites.sql`
- Crea la tabla `notifications` para notificaciones del sistema
- Crea la tabla `user_favorites` para favoritos de usuarios
- Configura políticas de seguridad RLS correctas
- Crea triggers automáticos para notificaciones

## ⚡ DESPUÉS DE EJECUTAR LOS SCRIPTS

1. **Refresca la página** de BurgeRank en tu navegador (F5)
2. **Prueba el botón de favoritos** (❤️) en cualquier burger
3. **Prueba actualizar una valoración** que ya hayas hecho
4. **Prueba el botón de compartir** (📤) en tu perfil

Todo debería funcionar correctamente ahora.

## 🐛 SI TODAVÍA HAY ERRORES

Después de ejecutar el script, si ves algún error:

1. Abre la **consola del navegador** (F12)
2. Ve a la pestaña **"Console"**
3. **Copia el mensaje de error** completo
4. **Envíamelo** para que pueda ayudarte

---

## 📄 CONTENIDO DEL SCRIPT

El script completo está en: `database/migration_notifications_favorites.sql`

Si quieres revisarlo antes de ejecutarlo, ábrelo con cualquier editor de texto.

**Tamaño:** 163 líneas  
**Es seguro:** ✅ No borra ningún dato existente  
**Es reversible:** ✅ Usa `CREATE TABLE IF NOT EXISTS`  

---

## ❓ ¿POR QUÉ PASÓ ESTO?

Cuando implementé las nuevas funcionalidades (notificaciones, favoritos, compartir), creé el código de la aplicación y el script SQL, pero **el script SQL no se ejecutó automáticamente** en tu base de datos. 

Por eso la aplicación intenta acceder a tablas que no existen todavía.

---

**¡Una vez ejecutado el script, todas las funcionalidades deberían funcionar correctamente!** 🎉
