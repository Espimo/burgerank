# 🍔 BurgeRank - Plataforma de Ranking y Valoración de Hamburguesas

Una aplicación web mobile-first construida con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Supabase** para calificar y valorar las mejores hamburguesas.

## 🚀 Características

- ✨ **Interfaz Mobile-First**: Optimizada para pantallas de 375px a 428px
- 🍔 **Ranking Dinámico**: Top hamburguesas ordenadas por calificaciones
- 🔍 **Búsqueda Avanzada**: Filtros por ciudad, precio, calificación
- ⭐ **Sistema de Valoración**: Evaluación detallada (sabor, textura, presentación, valor)
- 🎁 **Sistema de Recompensas**: Insignias y puntos por actividad
- 👤 **Perfil de Usuario**: Estadísticas y valoraciones personales
- 🔐 **Autenticación**: Con Supabase Auth
- 🎨 **Tema Personalizado**: Colores burger (naranja/rojo, amarillo, verde)
- 📱 **Navegación Inferior**: Acceso rápido a todas las secciones
- 🎬 **Animaciones**: Con Framer Motion para mejor UX

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI reutilizables
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Zustand** - Estado global
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos SVG
- **Sonner** - Notificaciones toast

### Backend
- **Supabase** - PostgreSQL + Auth + Storage
- **Next.js API Routes** - Endpoints API

## 📂 Estructura del Proyecto

```
burgerank_project/
├── app/
│   ├── (auth)/               # Rutas de autenticación
│   ├── (main)/               # Rutas principales con layout
│   │   ├── ranking/          # Top hamburguesas
│   │   ├── search/           # Búsqueda y filtrado
│   │   ├── rate/             # Calificar hamburguesas
│   │   ├── rewards/          # Sistema de recompensas
│   │   ├── profile/          # Perfil de usuario
│   │   └── layout.tsx        # Layout con Header y BottomNav
│   ├── api/
│   │   ├── burgers/          # Operaciones de hamburguesas
│   │   ├── ratings/          # Sistema de valoraciones
│   │   ├── auth/             # Autenticación
│   │   └── users/            # Usuarios
│   ├── layout.tsx            # Layout raíz
│   └── page.tsx              # Página inicial (redirige)
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── layout/               # Header, BottomNav
│   ├── burger/               # BurgerCard, RatingItem
│   ├── user/                 # Componentes de usuario
│   └── shared/               # Componentes reutilizables (FilterPanel)
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Cliente Supabase
│   │   └── queries.ts        # Funciones de base de datos
│   ├── stores/               # Zustand stores
│   │   ├── auth.ts
│   │   ├── burger.ts
│   │   └── user.ts
│   ├── validations/          # Esquemas Zod
│   │   └── schemas.ts
│   └── utils/
│       ├── cn.ts             # Función cn (ya creada por shadcn)
│       └── format.ts         # Funciones de formato
├── types/
│   └── index.ts              # Tipos TypeScript
├── public/
│   ├── images/               # Imágenes
│   └── icons/                # Iconos
├── .env.local                # Variables de entorno
├── next.config.ts            # Configuración Next.js
├── tailwind.config.ts        # Configuración Tailwind
└── tsconfig.json             # Configuración TypeScript
```

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Base de Datos (Supabase)

Crea las siguientes tablas en Supabase:

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  total_ratings INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `restaurants`
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `burgers`
```sql
CREATE TABLE burgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  restaurant_id UUID REFERENCES restaurants(id),
  image_url TEXT,
  price DECIMAL(10, 2),
  ingredients TEXT[] DEFAULT '{}',
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `ratings`
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  burger_id UUID REFERENCES burgers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  taste_score INTEGER CHECK (taste_score >= 1 AND taste_score <= 5),
  texture_score INTEGER CHECK (texture_score >= 1 AND texture_score <= 5),
  presentation_score INTEGER CHECK (presentation_score >= 1 AND presentation_score <= 5),
  value_score INTEGER CHECK (value_score >= 1 AND value_score <= 5),
  comment TEXT,
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `rewards`
```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER,
  badge_icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_rewards`
```sql
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  unlocked_at TIMESTAMP DEFAULT NOW()
);
```

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🎨 Personalizaciones

### Colores del Tema

El tema está configurado en `tailwind.config.ts` con variables CSS personalizadas:

- **Primary**: Naranja/Rojo (Burger)
- **Secondary**: Amarillo (Queso)
- **Accent**: Verde (Lechuga)

Ajusta en `app/globals.css` las variables `--primary`, `--secondary`, y `--accent`.

### Breakpoints Mobile-First

```css
xs: 375px   /* iPhone SE */
sm: 428px   /* iPhone 14 Pro Max */
```

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Conectar repositorio en Vercel
# Las variables de entorno se configuran en el dashboard
```

### Docker

```bash
# Crear imagen
docker build -t burgerank .

# Ejecutar contenedor
docker run -p 3000:3000 burgerank
```

## 📱 Uso

1. **Acceder a Rankings**: Página principal con top hamburguesas
2. **Buscar**: Filtrar por nombre, ciudad, precio
3. **Calificar**: Sistema detallado de 4 criterios
4. **Ganar Premios**: Recompensas por actividad
5. **Ver Perfil**: Estadísticas y valoraciones personales

## 🔐 Seguridad

- ✅ TypeScript strict mode
- ✅ Validación con Zod
- ✅ Autenticación Supabase
- ✅ Row Level Security (RLS) en BD
- ✅ Validación en servidor y cliente

## 📊 API Endpoints

### Burgers
- `GET /api/burgers/[id]` - Obtener hamburguesa
- `GET /api/burgers/search?q=...` - Buscar

### Ratings
- `GET /api/ratings?burger_id=...` - Obtener valoraciones
- `POST /api/ratings` - Crear valoración

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Users
- `GET /api/users/[id]` - Obtener perfil
- `PATCH /api/users/[id]` - Actualizar perfil

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🎯 Roadmap

- [ ] Autenticación con Google/GitHub
- [ ] Carga de fotos de usuario
- [ ] Sistema de comentarios en ratings
- [ ] Lista de favoritos
- [ ] Notificaciones push
- [ ] Estadísticas avanzadas
- [ ] Dark mode mejorado
- [ ] Internacionalización (i18n)

## 📞 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio.

---

**Made with ❤️ for burger lovers** 🍔

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
