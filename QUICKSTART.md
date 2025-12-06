# ⚡ Quick Start Guide - BurgeRank

## 🚀 Comienza en 5 minutos

### Paso 1: Configurar .env.local (2 min)

```bash
# En la raíz del proyecto, edita .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**¿Dónde obtengo estos valores?**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia los valores

### Paso 2: Crear tablas en Supabase (2 min)

1. En Supabase, ve a **SQL Editor**
2. Copia todo el SQL de `SETUP.md` sección "Paso 2"
3. Pega y ejecuta
4. ✅ Tablas creadas

### Paso 3: Ejecutar en desarrollo (1 min)

```bash
npm run dev
```

Abre: **http://localhost:3000** 🎉

---

## ✨ Lo que puedes hacer ahora

- ✅ Ver página de ranking (vacía inicialmente)
- ✅ Acceder a búsqueda
- ✅ Ver formulario de calificación
- ✅ Explorar panel de recompensas
- ✅ Ver perfil de usuario

---

## 📊 Insertar datos de prueba (Opcional)

En Supabase SQL Editor, ejecuta:

```sql
-- Insertar restaurante
INSERT INTO restaurants (name, city, address) VALUES
('Burger King Centro', 'Madrid', 'Calle Principal 123');

-- Insertar hamburguesa
INSERT INTO burgers (name, description, restaurant_id, price, ingredients)
VALUES (
  'Burger King Clásica',
  'La icónica hamburguesa con pan de sésamo',
  (SELECT id FROM restaurants LIMIT 1),
  6.50,
  ARRAY['Pan', 'Carne', 'Lechuga', 'Tomate']
);
```

Ahora verás datos en la app! 🍔

---

## 🐛 Problemas comunes

### "SUPABASE_URL is required"
- [ ] Verifica que `.env.local` existe
- [ ] Recarga la página (Ctrl+Shift+R)

### "Cannot read property 'from'"
- [ ] Las credenciales son inválidas
- [ ] Copia de nuevo desde Supabase

### "No se ven las hamburguesas"
- [ ] Asegúrate de insertar datos de prueba
- [ ] Revisa la consola del navegador (F12)

---

## 📚 Documentos importantes

1. **README.md** - Descripción general
2. **SETUP.md** - Guía completa paso a paso
3. **PROYECTO_COMPLETADO.md** - Lo que se creó

---

## 🎯 Próximos pasos

### Después de verificar que funciona:

1. **Personaliza colores**
   - Edita: `app/globals.css`
   - Variables: `--primary`, `--secondary`, `--accent`

2. **Añade más datos**
   - Más restaurantes y hamburguesas en Supabase

3. **Implementa autenticación real**
   - Los endpoints ya existen en `/api/auth/`

4. **Deploy**
   - Vercel: `vercel`
   - Docker: Usa el Dockerfile
   - Servidor propio: `npm run build && npm start`

---

## 💡 Tips

- **Hot reload**: La app se actualiza automáticamente
- **TypeScript**: Aprovecha IntelliSense (Ctrl+Space)
- **Components**: Reutiliza componentes de `components/`
- **API**: Todos los endpoints están documentados

---

## 🆘 Necesitas ayuda?

1. Revisa **SETUP.md** → "Solución de problemas"
2. Consulta docs:
   - [Next.js](https://nextjs.org/docs)
   - [Supabase](https://supabase.com/docs)
   - [Tailwind](https://tailwindcss.com/docs)
3. Revisa console (F12) para ver errores

---

## ✅ Checklist de verificación

- [ ] .env.local configurado
- [ ] Tablas creadas en Supabase
- [ ] `npm run dev` ejecutándose
- [ ] App visible en http://localhost:3000
- [ ] BottomNav con 5 opciones visible
- [ ] Puedes navegar entre páginas

**¡Si todo esto funciona, estás listo!** 🎉

---

## 📞 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Start producción
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build + verificar
npm run build && npm start
```

---

**Happy burger ranking! 🍔🚀**
