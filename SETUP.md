# 🔧 Guía de Configuración - BurgeRank

Esta guía te ayudará a configurar BurgeRank completamente desde cero.

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (opcional, para deploy)

## 1️⃣ Configuración Local

### Paso 1: Clonar o descargar el proyecto

```bash
cd burgerank_project
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se inicialice (puede tomar 1-2 minutos)

### Paso 4: Configurar variables de entorno

1. En el dashboard de Supabase, ve a **Settings > API**
2. Copia los valores de:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

3. Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 2️⃣ Configurar Base de Datos

### Paso 1: Acceder a SQL Editor

En Supabase, ve a **SQL Editor** en el sidebar izquierdo.

### Paso 2: Crear Tablas

Ejecuta el siguiente SQL para crear todas las tablas:

```sql
-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
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

-- Tabla: restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: burgers
CREATE TABLE IF NOT EXISTS burgers (
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

-- Tabla: ratings
CREATE TABLE IF NOT EXISTS ratings (
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

-- Tabla: rewards
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER,
  badge_icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: user_rewards
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_ratings_burger_id ON ratings(burger_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_burgers_restaurant_id ON burgers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
```

### Paso 3: Habilitar RLS (Row Level Security)

En Supabase, ve a **Authentication > Policies** y configura RLS para cada tabla.

Para desarrollo, puedes habilitar públicamente con:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE burgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Crear políticas (desarrollo - permitir todo)
CREATE POLICY "Anyone can read" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can read" ON burgers FOR SELECT USING (true);
CREATE POLICY "Anyone can read" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Paso 4: Insertar Datos de Prueba

```sql
-- Insertar restaurantes de ejemplo
INSERT INTO restaurants (name, city, address) VALUES
  ('Burger King Centro', 'Madrid', 'Calle Principal 123'),
  ('Smash Burgers', 'Barcelona', 'Avenida Diagonal 456'),
  ('Fat Burger', 'Valencia', 'Plaza Mayor 789');

-- Insertar hamburguesas de ejemplo
INSERT INTO burgers (name, description, restaurant_id, price, ingredients, rating_average, rating_count) VALUES
  (
    'Burger King Clásica',
    'La icónica hamburguesa de Burger King con su característico pan de sésamo',
    (SELECT id FROM restaurants WHERE name = 'Burger King Centro' LIMIT 1),
    6.50,
    ARRAY['Pan', 'Carne', 'Lechuga', 'Tomate', 'Salsa Especial'],
    4.2,
    15
  ),
  (
    'Smash Burger Premium',
    'Smash burger con dos carnes aplastadas y queso fundido',
    (SELECT id FROM restaurants WHERE name = 'Smash Burgers' LIMIT 1),
    8.99,
    ARRAY['Pan de mantequilla', 'Dos carnes aplastadas', 'Queso americano', 'Cebolla crujiente'],
    4.8,
    42
  );
```

## 3️⃣ Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 4️⃣ Verificar Instalación

Comprueba que todo funciona:

- [ ] Página de Ranking carga sin errores
- [ ] Puedes buscar hamburguesas
- [ ] El formulario de calificación valida correctamente
- [ ] Las animaciones funcionan suavemente
- [ ] El footer con navegación aparece

## 5️⃣ Configuración Avanzada (Opcional)

### Autenticación Social

1. Ve a **Authentication > Providers** en Supabase
2. Habilita Google, GitHub, etc.
3. Añade las claves en las variables de entorno

### Storage para Imágenes

1. En Supabase, ve a **Storage**
2. Crea un nuevo bucket llamado `burger-images`
3. Haz público el bucket
4. Configura CORS si es necesario

### Edge Functions (Funciones Serverless)

Supabase permite crear funciones Edge:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Crear función
supabase functions new my-function
```

## 6️⃣ Desplegar en Producción

### Con Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Configura las variables de entorno en el dashboard de Vercel.

### Con Docker

```bash
# Crear Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Construir imagen
docker build -t burgerank .

# Ejecutar
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  burgerank
```

## ⚠️ Solución de Problemas

### Error: "NEXT_PUBLIC_SUPABASE_URL is required"
- Verifica que `.env.local` existe en la raíz del proyecto
- Comprueba que has copiado correctamente las keys de Supabase

### Error: "Cannot connect to Supabase"
- Verifica que la URL de Supabase es correcta (sin espacios)
- Comprueba tu conexión a internet
- Verifica que el proyecto en Supabase está activo

### Las imágenes no se cargan
- Ve a **Storage > burger-images** en Supabase
- Asegúrate de que el bucket es público
- Comprueba la URL de la imagen en CORS settings

### Componentes UI no se renderizan
- Ejecuta `npm run dev` nuevamente
- Limpia cache: `rm -rf .next`
- Reinstala dependencias: `rm -rf node_modules && npm install`

## 📚 Recursos Útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎓 Próximos Pasos

1. Personaliza los colores en `app/globals.css`
2. Añade más hamburguesas a la base de datos
3. Configura autenticación social
4. Implementa carga de imágenes
5. Configura notificaciones push

---

¿Necesitas ayuda? Revisa el [README.md](./README.md) o abre un issue.
