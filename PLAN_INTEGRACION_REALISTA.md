# PLAN DE INTEGRACIÓN REALISTA Y COMPLETA - BurgeRank

## ANÁLISIS ACTUAL

### ✅ Lo Que Ya Existe
1. **Base de Datos**: Schema completo en Supabase con:
   - Tablas: users, cities, restaurants, burgers, ratings, badges, rewards, notifications
   - Relaciones y constraints
   - RLS policies

2. **Admin System**: Sistema de permisos globales implementado

3. **Frontend**: Páginas básicas (rankings, restaurante, perfil)

### ❌ Lo Que Falta (Integración Real)

1. **Autenticación Real**
   - No hay sign up/sign in
   - No hay verificación de email
   - No hay manejo de sesión auth

2. **Perfil de Usuario**
   - No está conectado a DB
   - No muestra datos reales

3. **Valoración**
   - No guarda en DB
   - No calcula ratings promedio

4. **Ranking**
   - Datos mock, no de DB
   - No refleja valoraciones reales

5. **Crear Burgers**
   - No hay formulario
   - No guarda en DB

6. **Gestión de Puntos/Badges**
   - No hay sistema de puntos
   - No hay logros

---

## PLAN DE IMPLEMENTACIÓN

### FASE 1: AUTENTICACIÓN (2-3 horas)
```
1. Crear páginas:
   - /auth/signup - Registro
   - /auth/signin - Login
   - /auth/verify-email - Verificación email
   - /auth/reset-password - Recuperar contraseña

2. API Routes:
   - POST /api/auth/signup
   - POST /api/auth/signin
   - POST /api/auth/verify-email
   - POST /api/auth/logout

3. Middleware:
   - Proteger rutas privadas
   - Validar sesión
```

### FASE 2: PERFIL DE USUARIO (1-2 horas)
```
1. Componentes:
   - ProfileHeader - Mostrar datos usuario
   - MyRatings - Mis valoraciones
   - MyBadges - Mis logros
   - MyRewards - Mis premios

2. Funcionalidad:
   - Editar perfil
   - Ver burgers valoradas
   - Ver puntos
```

### FASE 3: SISTEMA DE VALORACIÓN REAL (2-3 horas)
```
1. Formulario de Valoración:
   - Pan: 1-3 estrellas
   - Carne: 1-3 estrellas
   - Toppings: 1-3 estrellas
   - Salsa: 1-3 estrellas
   - Precio: campo
   - Comentario: texto
   - Ticket: upload foto

2. API:
   - POST /api/ratings/create
   - GET /api/ratings/user/{userId}
   - PUT /api/ratings/{ratingId}
   - DELETE /api/ratings/{ratingId}

3. Lógica:
   - Calcular rating promedio burger
   - Actualizar posición en ranking
   - Asignar puntos
   - Verificar badges
```

### FASE 4: RANKING DINÁMICO (1 hora)
```
1. Cambiar de mock a:
   - SELECT burgers FROM DB
   - ORDER BY average_rating DESC

2. Mostrar:
   - Rating real
   - Número de valoraciones
   - Tendencias
```

### FASE 5: CREAR BURGERS (1-2 horas)
```
1. Página:
   - /burgers/create

2. Formulario:
   - Nombre
   - Restaurante (select)
   - Descripción
   - Tipo
   - Tags
   - Foto (upload)

3. API:
   - POST /api/burgers/create
   - Validación
   - Guardar en DB
```

### FASE 6: PUNTOS Y BADGES (1-2 horas)
```
1. Sistema de Puntos:
   - +1 punto por rating
   - +5 puntos si nota es 5 estrellas
   - Mostrar en perfil

2. Badges:
   - Verificar condiciones
   - Otorgar automáticamente
   - Mostrar en perfil
```

---

## ARQUITECTURA DE DATOS

### Flujo Completo Usuario

```
1. REGISTRO
   signup (email, password, username)
   ↓
   Enviar email verificación
   ↓
   Usuario verifica email
   ↓
   Crear en users table
   ↓
   Crear row en profiles
   ↓
   Redirigir a /profile

2. VER RANKING
   GET /api/burgers/ranking
   ↓
   SELECT burgers ORDER BY average_rating
   ↓
   Mostrar en página

3. VALORAR
   Usuario hace clic en valorar
   ↓
   Rellenar formulario
   ↓
   POST /api/ratings
   ↓
   Guardar en DB
   ↓
   Calcular nuevo promedio
   ↓
   Actualizar puntos
   ↓
   Verificar badges
   ↓
   Mostrar éxito

4. VER PERFIL
   GET /api/profile/{userId}
   ↓
   Obtener user data
   ↓
   Obtener ratings del usuario
   ↓
   Obtener badges
   ↓
   Obtener puntos
   ↓
   Mostrar todo en perfil
```

---

## ESTRUCTURA DE CARPETAS (Nueva)

```
app/
├── auth/
│   ├── signup/
│   │   └── page.tsx
│   ├── signin/
│   │   └── page.tsx
│   ├── verify-email/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── api/
│   ├── auth/
│   │   ├── signup/
│   │   │   └── route.ts
│   │   ├── signin/
│   │   │   └── route.ts
│   │   ├── verify-email/
│   │   │   └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   │
│   ├── ratings/
│   │   ├── create/
│   │   │   └── route.ts
│   │   ├── user/
│   │   │   └── route.ts
│   │   └── [id]/
│   │       ├── route.ts (GET, PUT, DELETE)
│   │
│   ├── burgers/
│   │   ├── create/
│   │   │   └── route.ts
│   │   ├── ranking/
│   │   │   └── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   │
│   ├── profile/
│   │   ├── [userId]/
│   │   │   └── route.ts
│   │   └── update/
│   │       └── route.ts
│   │
│   ├── badges/
│   │   └── check/
│   │       └── route.ts
│   │
│   └── email/
│       └── send/
│           └── route.ts
│
├── burgers/
│   ├── create/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── profile/
│   └── [username]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
│
├── middleware.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries.ts
│   ├── auth/
│   │   ├── validate.ts
│   │   └── tokens.ts
│   ├── email/
│   │   ├── templates.ts
│   │   └── send.ts
│   └── utils/
│       ├── db.ts
│       ├── validators.ts
│       └── helpers.ts
│
└── components/
    ├── auth/
    │   ├── SignupForm.tsx
    │   ├── SigninForm.tsx
    │   └── AuthGuard.tsx
    ├── profile/
    │   ├── ProfileCard.tsx
    │   ├── MyRatings.tsx
    │   ├── MyBadges.tsx
    │   └── MyRewards.tsx
    ├── rating/
    │   ├── RatingForm.tsx
    │   └── RatingCard.tsx
    └── burger/
        ├── BurgerForm.tsx
        └── BurgerCard.tsx
```

---

## CASOS DE USO (Flujos Reales)

### Caso 1: Nuevo Usuario Se Registra
```
1. User va a /auth/signup
2. Ingresa email, password, username
3. Click "Registrarse"
4. Validar campos (cliente + servidor)
5. Crear en auth.users (Supabase)
6. Crear en users table
7. Enviar email verificación
8. Mostrar "Verifica tu email"
9. Usuario clica link en email
10. Validar token
11. Marcar como verified
12. Redirigir a /profile/{username}
```

### Caso 2: Usuario Valora una Burger
```
1. User logueado ve /rankings
2. Hace clic en "Valorar" de una burger
3. Se abre modal/página con formulario
4. Ingresa ratings parciales (pan, carne, etc)
5. Ingresa precio
6. Escribe comentario
7. Opcionalmente sube ticket
8. Click "Guardar"
9. API valida datos
10. INSERT en ratings table
11. Calcular nuevo average_rating de burger
12. UPDATE burger average_rating
13. Asignar puntos al usuario
14. Verificar si desbloqueó badges
15. UPDATE user points
16. Si nueva badge, INSERT en user_badges
17. Crear notificación
18. Mostrar "Valoración guardada ✅"
```

### Caso 3: Usuario Ve Su Perfil
```
1. User va a /profile/{username}
2. GET /api/profile/{userId}
3. Retorna: datos usuario, puntos, badges, rewards
4. GET /api/ratings/user/{userId}
5. Retorna: todas las valoraciones del usuario
6. Renderizar:
   - Avatar, username, bio
   - Puntos totales
   - Badges obtenidos
   - Últimas 10 ratings
   - Promedio de ratings
   - Ciudades visitadas
```

### Caso 4: Usuario Crea una Burger Nueva
```
1. User va a /burgers/create
2. Rellenar formulario:
   - Nombre: "The Inferno"
   - Restaurante: Select (query DB)
   - Descripción: "Picante con..."
   - Tipo: select (premium, clásica, etc)
   - Tags: input multiple
   - Foto: file upload
3. Click "Crear"
4. Validar datos
5. Upload foto a Supabase Storage
6. INSERT en burgers table
7. Setear position como MAX(position)+1
8. Setear average_rating = 0
9. Redirigir a /burgers/{burgerId}
10. Mostrar burger creado
```

---

## TECNOLOGÍAS

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + JWT
- **Email**: Nodemailer
- **Almacenamiento**: Supabase Storage
- **Validación**: Zod
- **Formularios**: React Hook Form

---

## TIMELINE ESTIMADO

- **FASE 1** (Autenticación): 3-4 horas
- **FASE 2** (Perfil): 2 horas
- **FASE 3** (Valoración): 3-4 horas
- **FASE 4** (Ranking): 1 hora
- **FASE 5** (Crear Burgers): 2-3 horas
- **FASE 6** (Puntos/Badges): 2-3 horas
- **Testing**: 2 horas

**TOTAL: 15-20 horas**

---

## ESTADO FINAL DESEADO

Una web completamente funcional donde:
- ✅ Usuarios se registran y verifican email
- ✅ Acceden a su perfil vacío (primero)
- ✅ Ven ranking actualizado en tiempo real
- ✅ Valoran burgers y se guarda en DB
- ✅ Ven sus valoraciones en perfil
- ✅ Ganan puntos y badges
- ✅ Pueden crear burgers nuevas
- ✅ El ranking se actualiza automáticamente
- ✅ Todo es realista y funcional

