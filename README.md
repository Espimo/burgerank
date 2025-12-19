# BurgeRank - Ranking Nacional de Hamburguesas

Una aplicación web para clasificar, valorar y descubrir las mejores hamburguesas de España.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 + TypeScript + React Hooks
- **Styling**: Tailwind CSS + CSS Variables
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recomendado)

## 📁 Estructura del Proyecto

```
burgerank_project/
├── app/
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # Redirección a /ranking
│   ├── globals.css             # Estilos globales
│   ├── ranking/
│   │   └── page.tsx            # Página de ranking
│   ├── rate/
│   │   └── page.tsx            # Wizard de valoración (5 pasos)
│   ├── profile/
│   │   └── page.tsx            # Perfil de usuario
│   └── about/
│       └── page.tsx            # Página de información
├── components/
│   └── layout/
│       ├── TopBar.tsx          # Barra superior
│       ├── BottomNav.tsx       # Navegación inferior
│       └── Sidebar.tsx         # Menú lateral
├── lib/
│   ├── data/
│   │   └── mockData.ts         # 36+ burgers de ejemplo
│   └── utils/
│       ├── navigation.ts       # Funciones de navegación
│       ├── ui.ts               # Funciones UI
│       └── rate.ts             # Funciones del wizard
├── database/
│   ├── burgerank_schema.sql    # Esquema completo de BD
│   ├── seed_data.sql           # Datos básicos
│   └── seed_data_extended.sql  # 120+ burgers y datos completos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local                  # Variables de entorno
```

## 🛠️ Instalación Local

### Requisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Espimo/burgerank.git
cd burgerank_project
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Autenticación

El sistema de autenticación está completamente implementado con Supabase. 

### ⚡ Setup Rápido (5 minutos)

1. **Ejecutar RLS Policies:**
   - Ve a Supabase > SQL Editor
   - Ejecuta: `database/rls_policies.sql`

2. **Habilitar Email Authentication:**
   - Supabase > Authentication > Providers
   - Email debe estar HABILITADO ✅

3. **Probar:**
   ```bash
   npm run dev
   # Ve a http://localhost:3000/auth/signup
   ```

### 📚 Documentación de Autenticación

- **[INDICE_AUTENTICACION.md](INDICE_AUTENTICACION.md)** ← **START HERE** 📍
- **[EXEC_SUMMARY_AUTH.md](EXEC_SUMMARY_AUTH.md)** - Resumen ejecutivo
- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Guía de configuración en Supabase
- **[AUTENTICACION_COMPLETA.md](AUTENTICACION_COMPLETA.md)** - Documentación técnica completa
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía de testing

### ✨ Características de Autenticación

✅ Registro con email/password
✅ Verificación de email
✅ Inicio de sesión seguro
✅ Cierre de sesión
✅ Protección de rutas privadas
✅ Contexto global de autenticación
✅ RLS Policies para seguridad

## 🗄️ Configuración de Base de Datos

### Opción 1: Usar Supabase (Recomendado)

1. **Crear proyecto en [Supabase](https://supabase.com)**

2. **Ejecutar el esquema**
   - Ve a: SQL Editor
   - Copia y pega el contenido de `database/burgerank_schema.sql`
   - Ejecuta

3. **Ejecutar RLS Policies (IMPORTANTE para autenticación)**
   - Copia y pega el contenido de `database/rls_policies.sql`
   - Ejecuta

4. **Cargar datos de ejemplo (Opcional)**
   - Copia y pega el contenido de `database/seed_data_extended.sql`
   - Ejecuta

5. **Obtener credenciales**
   - Settings → API

   - Copia: Project URL y Project API Key (anon)
   - Actualiza `.env.local`

### Esquema de Base de Datos

**Tablas principales:**
- `users` - Perfiles de usuarios
- `cities` - Ciudades (Madrid, Barcelona, Valencia, Sevilla, Bilbao)
- `restaurants` - Establecimientos de comida
- `burgers` - Catálogo de hamburguesas
- `ratings` - Valoraciones de usuarios
- `badges` - Sistema de logros (7 badges)
- `rewards` - Sistema de recompensas (5 tipos)
- `notifications` - Notificaciones de usuario

**Funciones y Triggers:**
- Auto-cálculo de ratings de burgers
- Auto-cálculo de puntos y categoría de usuarios
- Auto-cálculo de ratings de restaurantes
- Verificación y desbloqueo automático de badges

**RLS Policies:**
- Usuarios pueden ver su perfil o perfiles públicos
- Todos pueden ver burgers, restaurantes y ciudades
- Usuarios pueden crear/editar/eliminar sus propias valoraciones

## 📱 Funcionalidades

### 1. Ranking (🏆)
- Visualizar todas las hamburguesas ordenadas por rating
- Filtrar por ciudad
- Buscar por nombre o restaurante
- Ver detalles: rating, número de valoraciones, tags

### 2. Valorar (⭐)
Wizard de 5 pasos:
- **Paso 0**: Contexto (lugar, aperitivos)
- **Paso 1**: Seleccionar hamburguesa de catálogo
- **Paso 2**: Valorar 4 componentes (pan, carne, toppings, salsa)
- **Paso 3**: Agregar comentario y precio
- **Paso 4**: Pantalla de éxito con puntos ganados

### 3. Perfil (👤)
- Avatar y datos del usuario
- Categoría (Burger Fan, Lover, Obsessed)
- Puntos totales y progreso
- 8 insignias desbloqueables
- Sistema de recompensas (5 tipos)
- Top 3 burgers personales
- Últimas valoraciones
- Configuración (nombre, email, perfil público)

### 4. Acerca de (ℹ️)
- Explicación del sistema de valoración
- Categorías de recompensas
- 5 preguntas frecuentes (acordeones)
- Contacto

## 📊 Datos de Ejemplo

El proyecto incluye **36+ hamburguesas** distribuidas en 5 ciudades:

- **Madrid** (8 burgers): The King Burger, BBQ Master, Premium Gold, etc.
- **Barcelona** (8 burgers): Smoky BBQ, Catalan Burger, The Beast, etc.
- **Valencia** (8 burgers): Clásica Tradicional, Premium Paella Burger, etc.
- **Sevilla** (8 burgers): Giralda Premium, Premium Sevilla Gold, etc.
- **Bilbao** (8 burgers): Basque Excellence, Artisan Bilbao, etc.

**Datos completos incluyen:**
- 40 restaurantes
- 10 usuarios de prueba
- 80+ valoraciones
- Sistema de badges y recompensas

## 🏗️ Compilación y Deploy

### Build
```bash
npm run build
```

### Deploy en Vercel

1. Conectar repo con Vercel
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático en cada push a `main`

## 🔐 Seguridad

- Autenticación: Supabase Auth (OAuth, Email)
- RLS policies para proteger datos sensibles
- Variables de entorno para credenciales
- HTTPS en producción

## 🚦 Rutas Disponibles

| Ruta | Página |
|------|--------|
| `/` | Redirección a `/ranking` |
| `/ranking` | Ranking de hamburguesas |
| `/rate` | Wizard de valoración |
| `/profile` | Perfil de usuario |
| `/about` | Información y FAQs |

## 📦 Dependencias Principales

- `next`: Framework React
- `react`: Biblioteca UI
- `@supabase/supabase-js`: Cliente de BD
- `tailwindcss`: Framework CSS

Ver `package.json` para la lista completa.

## 🤝 Contribución

1. Fork el repo
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Commits semánticos (`git commit -m "feat: mi feature"`)
4. Push a la rama (`git push origin feature/mi-feature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

### Variables Locales para Pruebas

El proyecto usa `mockData.ts` con 36+ burgers para desarrollo. En producción, los datos vendrán de Supabase.

### TypeScript

- Modo estricto habilitado
- Interfaz `Burger` tipada
- Tipos para props de componentes

### Estilos

- CSS Variables para tema (colores, bordes)
- Clases de utilidad de Tailwind
- Responsive design (mobile-first)

## 🐛 Troubleshooting

### Puerto 3000 ocupado
```bash
# Windows
Get-Process node | Stop-Process -Force

# macOS/Linux
pkill -f "node"
```

### Errores de build
```bash
# Limpiar caché
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Contacto

- Email: contacto@burgerank.com
- Issues: [GitHub Issues](https://github.com/Espimo/burgerank/issues)

## 📄 Licencia

MIT © 2024 BurgeRank

---

**Última actualización**: Diciembre 2024
