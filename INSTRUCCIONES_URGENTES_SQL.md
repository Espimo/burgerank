# ⚠️ INSTRUCCIONES URGENTES - Re-ejecutar Migración SQL

## 🔴 PROBLEMA DETECTADO

Los botones de **favoritos** muestran error: `permission denied for table user_favorites` (código 42501)

**Causa:** Las políticas de seguridad RLS (Row Level Security) están bloqueando el acceso. Las políticas anteriores eran demasiado restrictivas.

## ✅ SOLUCIÓN

Debes **RE-EJECUTAR** el script SQL actualizado que tiene políticas RLS corregidas.

## 📝 PASOS A SEGUIR

### 1. Abre Supabase
- Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Selecciona tu proyecto **BurgeRank**

### 2. Abre el SQL Editor
- En el menú lateral izquierdo, haz clic en **"SQL Editor"**
- Haz clic en **"New Query"** (Nueva consulta)

### 3. Copia y pega el script
- Abre el archivo: `database/migration_notifications_favorites.sql`
- **Copia TODO el contenido** del archivo
- **Pégalo** en el editor SQL de Supabase

### 4. Ejecuta el script
- Haz clic en el botón **"Run"** (Ejecutar) o presiona `Ctrl + Enter`
- Deberías ver un mensaje de éxito: **"Success. No rows returned"**

### 5. Verifica que se crearon las tablas
- Ve a **"Table Editor"** en el menú lateral
- Deberías ver estas nuevas tablas:
  - ✅ `notifications`
  - ✅ `user_favorites`

## 🎯 QUÉ HACE ESTE SCRIPT

El script creará:

1. **Tabla `notifications`**: Para almacenar notificaciones de:
   - Nuevas insignias desbloqueadas
   - Cambios de nivel
   - Mensajes del sistema
   - Bienvenida para nuevos usuarios

2. **Tabla `user_favorites`**: Para que los usuarios puedan:
   - Marcar burgers como favoritas (❤️)
   - Ver su lista de favoritos
   - Quitar favoritos

3. **Políticas de seguridad (RLS)**: Para que:
   - Los usuarios solo vean sus propias notificaciones
   - Los usuarios solo vean sus propios favoritos
   - Nadie pueda ver los datos de otros usuarios

4. **Triggers automáticos**: Para que:
   - Se cree una notificación cuando desbloquees una insignia
   - Se cree una notificación cuando subas de nivel
   - Se cree una notificación de bienvenida para usuarios nuevos

## ⚡ DESPUÉS DE EJECUTAR EL SCRIPT

1. **Refresca la página** de BurgeRank en tu navegador (F5)
2. **Prueba el botón de favoritos** (❤️) en cualquier burger
3. **Prueba el botón de compartir** (📤) en tu perfil
4. **Intenta actualizar una valoración** que ya hayas hecho

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
