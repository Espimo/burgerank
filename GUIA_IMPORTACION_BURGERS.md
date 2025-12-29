# 📋 GUÍA COMPLETA: IMPORTACIÓN DE TOP 50 BURGERS DE MADRID

## ⚡ OPCIÓN RÁPIDA: UPLOAD DIRECTO EN ADMIN

A partir de ahora, **NO necesitas poner URLs de imágenes en el CSV**. Puedes:

### Opción A: Upload directo en el panel admin
```
1. Ve a /admin → Crear Hamburguesa
2. Rellena: Nombre, Restaurante, Descripción
3. En "🖼️ Imagen de Hamburguesa":
   → Arrastra imagen O click para seleccionar
   → Se sube automáticamente a Supabase Storage
   → Se obtiene URL pública automáticamente
4. Click "Crear Hamburguesa" ✅
5. ¡Listo!
```

**Ventajas:**
- ✅ No necesitas servicio externo de imágenes
- ✅ Imágenes se guardan en tu BD (Supabase)
- ✅ URLs permanentes y seguras
- ✅ Más rápido que buscar URLs
- ✅ Control total

### Opción B: Upload directo de restaurante
```
1. Ve a /admin → Crear Restaurante
2. Rellena: Nombre, Dirección, Teléfono
3. En "🖼️ Banner":
   → Arrastra imagen
   → Se sube automáticamente
4. En "🖼️ Logo":
   → Arrastra imagen
   → Se sube automáticamente
5. Click "Crear Restaurante" ✅
6. ¡Listo!
```

### Opción C: Importar desde CSV + URLs externas (Legacy)
Si aún prefieres usar URLs externas (Imgur, Cloudinary, etc.), sigue la guía de abajo.

---

## 1. ESTRUCTURA DE DATOS REQUERIDA

### 📊 ESQUEMA DE DATOS (En orden de importación)

#### PASO 1: CIUDADES
```csv
name,country
Madrid,España
Barcelona,España
Valencia,España
Sevilla,España
Bilbao,España
```

#### PASO 2: RESTAURANTES
```csv
name,city,address,phone,hours,website,delivery_url,reservation_url,banner_url,logo_url
```

**Campos obligatorios:**
- `name` (VARCHAR 255): Nombre del restaurante
- `city` (VARCHAR): Nombre de la ciudad EXACTAMENTE como aparece en tabla cities
- `address` (TEXT): Dirección completa
- `phone` (VARCHAR 20): Teléfono (ej: +34 123 45 67 89)
- `hours` (VARCHAR 100): Horario (ej: 12:00-23:00 o Lun-Jue 12:00-23:00)
- `website` (TEXT): URL del sitio web
- `delivery_url` (TEXT): URL de Uber Eats / Glovo / JustEat
- `reservation_url` (TEXT): URL de El Tenedor / TheFork
- `banner_url` (TEXT): URL imagen banner (Ver especificaciones más abajo)
- `logo_url` (TEXT): URL logo del restaurante (Ver especificaciones más abajo)

**Ejemplo:**
```csv
name,city,address,phone,hours,website,delivery_url,reservation_url,banner_url,logo_url
Goiko Grill,Madrid,Calle Gran Vía 15 Madrid,+34 912 34 56 78,12:00-23:00,https://goikogrill.com,https://ubereats.com/store/goiko,https://thefork.com/goiko,https://images.example.com/goiko-banner.jpg,https://images.example.com/goiko-logo.png
TGB - The Good Burger,Madrid,Passeig de Gràcia 20 Madrid,+34 934 56 78 90,12:00-23:30,https://tgbburger.com,https://glovo.es/tgb,https://thefork.com/tgb,https://images.example.com/tgb-banner.jpg,https://images.example.com/tgb-logo.png
```

#### PASO 3: HAMBURGUESAS
```csv
name,restaurant,city,description,type,tags,imagen_principal
```

**Campos obligatorios:**
- `name` (VARCHAR 255): Nombre de la hamburguesa
- `restaurant` (VARCHAR): Nombre del restaurante EXACTAMENTE como aparece en tabla restaurants
- `city` (VARCHAR): Nombre de la ciudad
- `description` (TEXT): Descripción detallada de ingredientes
- `type` (VARCHAR 50): Uno de: `premium` | `clásica` | `doble` | `vegana` | `gourmet` | `smash`
- `tags` (TEXT): Separados por comas. Ej: `jugosa,carne premium,bacon,queso cheddar,salsa bbq`
- `imagen_principal` (TEXT): URL de la imagen (Ver especificaciones más abajo)

**Ejemplo:**
```csv
name,restaurant,city,description,type,tags,imagen_principal
Kevin Bacon,Goiko Grill,Madrid,Hamburguesa con carne de ternera premium y bacon crujiente,smash,jugosa,bacon,queso,cebolla,https://images.example.com/kevin-bacon.jpg
La Vegana,TGB - The Good Burger,Madrid,Hamburguesa 100% vegana con patty de tofu y verduras,vegana,vegana,tofu,lechuga,queso vegano,https://images.example.com/la-vegana.jpg
```

---

## 2. ESPECIFICACIONES DE IMÁGENES

### 🖼️ BANNER DEL RESTAURANTE (Hero Image)
- **Tamaño recomendado:** 1920 x 1080 px (o múltiplo 16:9)
- **Tamaño mínimo:** 800 x 450 px
- **Peso máximo:** 500 KB
- **Formato:** JPG, PNG, WebP
- **Contenido:** Foto del restaurante, interior, exterior o composición de comidas
- **URL:** HTTPS obligatorio

### 🍔 IMAGEN DE LA HAMBURGUESA
- **Tamaño recomendado:** 600 x 600 px (cuadrado)
- **Tamaño mínimo:** 300 x 300 px
- **Peso máximo:** 300 KB
- **Formato:** JPG, PNG, WebP
- **Contenido:** Foto de la hamburguesa en el plato, bien iluminada, con ingredientes visibles
- **URL:** HTTPS obligatorio
- **Calidad:** Alta (mínimo 72 DPI para web)

### 🏢 LOGO DEL RESTAURANTE
- **Tamaño recomendado:** 500 x 500 px
- **Tamaño mínimo:** 200 x 200 px
- **Peso máximo:** 150 KB
- **Formato:** PNG con transparencia (recomendado) o JPG
- **Contenido:** Logo único del restaurante
- **URL:** HTTPS obligatorio

### ✅ Servicios para alojar imágenes gratis:
1. **Imgur** (imgur.com) - Mejor para individuos
2. **Cloudinary** (cloudinary.com) - Free tier robusto
3. **imgbb** (imgbb.com) - Rápido y simple
4. **Firebase Storage** - Si tienes proyecto Google
5. **Supabase Storage** - Integrado con tu BD

**Ejemplo de URL correcta:**
```
https://images.example.com/restaurants/goiko-banner.jpg
https://imgur.com/a1b2c3d.jpg
https://images.imgbb.com/burgers/kevin-bacon.jpg
```

---

## 3. GUÍA DE TAGS PARA HAMBURGUESAS

### Ingredientes principales:
```
carne,ternera,pollo,wagyu,carne-picada,smash,vegana,tofu
```

### Texturas:
```
jugosa,crujiente,tierna,derretida,sabrosa,suculenta
```

### Ingredientes especiales:
```
bacon,queso-cheddar,queso-brie,queso-azul,huevo,aguacate,setas,trufa
```

### Salsas:
```
bbq,mayonesa,alioli,chimichurri,picante,worcester,casera,trufa
```

### Preparación:
```
a-la-parrilla,a-la-plancha,ahumada,artesanal,hecha-a-mano,receta-secreta
```

### Dietética:
```
sin-gluten,sin-lactosa,vegana,vegetariana,paleo,keto,halal,kosher
```

### Categoría de precio:
```
premium,gourmet,casual,budget,lujo
```

**Formato correcto en CSV:**
```
tags: bacon,queso,cebolla,salsa-bbq,crujiente,artesanal
```

---

## 4. BÚSQUEDA: TOP 50 BURGERS MADRID

### 📌 Restaurantes y burgers conocidos en Madrid:

#### Tier 1 - Premium/Gourmet:
1. **Goiko Grill** - Kevin Bacon, Carne Wagyu, Trufada
2. **TGB (The Good Burger)** - Clásica, Doble Kevin, La Vegana
3. **Punto MX** - Hamburguesa de la Casa
4. **Álbora** - Burger Premium
5. **DSTAgE** - Burger Experimental

#### Tier 2 - Casual Premium:
6. **Barbounia**
7. **El Club Allard** - Burger Fusion
8. **Coque**
9. **Punto Bar Madrid**
10. **La Boca** - Burger House

#### Tier 3 - Burger Especializado:
11. **Foster's Hollywood** - Clásicas, Dobles
12. **Telepizza** - Burgers
13. **Burger King** - Whopper, etc
14. **McDonald's** - Big Mac, etc
15. **Santceloni** - Premium Burger
16. **CajaNegra**
17. **Bálamo**
18. **OME**
19. **El Club de la Hamburguesa**
20. **Smash Burgers Madrid**

### 🔍 Dónde buscar datos:
1. **Google Maps** - Info, fotos, teléfono, horarios
2. **TripAdvisor** - Descripciones y comentarios
3. **Michelin Guide** - Restaurantes premium
4. **TheFork (El Tenedor)** - Menus y especialidades
5. **Instagram** - Fotos de platos (usan hashtags: #hamburguesaMadrid)
6. **Websites de restaurantes** - Descripción oficial
7. **ReviewsRestaurantes.com** - Críticas locales
8. **MadridEats.com** - Guía gastronómica

---

## 5. DATOS MÍNIMOS REQUERIDOS POR BURGER

```
Nombre de la Burger: ❌ NO DEJAR VACÍO
Restaurante: ❌ DEBE EXISTIR EN BD
Ciudad: ✅ Madrid (o la elegida)
Descripción: ✅ Mínimo 20 caracteres
Tipo: ✅ Elegir uno: premium|clásica|doble|vegana|gourmet
Tags: ✅ Mínimo 3, máximo 10
Imagen: ❌ RECOMENDADO (sin ella funciona, pero se ve feo)
```

---

## 6. PLANTILLA CSV LISTA PARA COPIAR

### Restaurantes (Paso 2):
```csv
name,city,address,phone,hours,website,delivery_url,reservation_url,banner_url,logo_url
Goiko Grill,Madrid,Calle Gran Vía 15 28013 Madrid,+34 912 123 456,12:00-23:00,https://goikogrill.es,https://ubereats.com/es/store/goiko-grill-gran-via-madrid,https://www.thefork.es/restaurante/goiko-grill,https://images.example.com/goiko-banner.jpg,https://images.example.com/goiko-logo.png
```

### Hamburguesas (Paso 3):
```csv
name,restaurant,city,description,type,tags,imagen_principal
Kevin Bacon,Goiko Grill,Madrid,Carne de ternera premium con bacon crujiente y queso fundido,premium,bacon,queso,cebolla,salsa-bbq,crujiente,https://images.example.com/kevin-bacon.jpg
```

---

## 7. PASOS DE IMPORTACIÓN EN EL ADMIN

### Orden RECOMENDADO:
1. **Primero:** Importar Ciudades (si no existen)
2. **Segundo:** Importar Restaurantes
3. **Tercero:** Importar Hamburguesas

### En Panel Admin (`/admin`):
1. Click en "📥 Importar CSV"
2. Seleccionar tipo de datos
3. Pegar CSV o subir archivo
4. Revisar preview
5. Click en "Importar"
6. Ver resultados (errores y éxitos)

---

## 8. CAMPOS ESPECIALES Y VALIDACIONES

### Validaciones automáticas en BD:

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| name | VARCHAR(255) | NO NULL | "Kevin Bacon" |
| city | VARCHAR | DEBE EXISTIR | "Madrid" |
| restaurant | VARCHAR | DEBE EXISTIR | "Goiko Grill" |
| type | VARCHAR(50) | 6 opciones | "premium" |
| tags | TEXT[] | Array de strings | "bacon,queso,cebolla" |
| phone | VARCHAR(20) | Formato libre | "+34 912 123 456" |
| hours | VARCHAR(100) | Formato libre | "12:00-23:00" |
| imagen_principal | TEXT | URL HTTPS | "https://..." |

---

## 9. ESTRUCTURA FINAL EN BASE DE DATOS

Después de importar, tendrás:

```
CITIES:
├── Madrid (id: uuid-1)
├── Barcelona (id: uuid-2)
└── ...

RESTAURANTS (en Madrid):
├── Goiko Grill (id: uuid-3, city_id: uuid-1)
├── TGB (id: uuid-4, city_id: uuid-1)
└── ...

BURGERS (en restaurantes de Madrid):
├── Kevin Bacon (restaurant_id: uuid-3, city_id: uuid-1)
├── La Vegana (restaurant_id: uuid-4, city_id: uuid-1)
└── ...
```

---

## 10. CHECKLIST PRE-IMPORTACIÓN

- [ ] Tengo mínimo 10 restaurantes (recomendado 15-20)
- [ ] Cada restaurante tiene descripción y ubicación
- [ ] Tengo mínimo 50 burgers (recomendado 80-100)
- [ ] Cada burger tiene:
  - [ ] Nombre único
  - [ ] Restaurante que existe
  - [ ] Descripción de ingredientes
  - [ ] Tipo válido
  - [ ] 3-10 tags relevantes
- [ ] URLs de imágenes están en HTTPS
- [ ] Imágenes pesan menos de límites (500KB banner, 300KB burger, 150KB logo)
- [ ] CSV está bien formado (sin saltos de línea extras, comas en lugar de separadores)
- [ ] Primero importar Ciudades → Restaurantes → Burgers

---

## 11. EJEMPLOS COMPLETOS LISTOS PARA USAR

### CSV CIUDADES:
```
name,country
Madrid,España
Barcelona,España
Valencia,España
Sevilla,España
Bilbao,España
```

### CSV RESTAURANTES (3 ejemplos):
```
name,city,address,phone,hours,website,delivery_url,reservation_url,banner_url,logo_url
Goiko Grill,Madrid,Gran Vía 15 28013 Madrid,+34 912 123 456,12:00-23:00,https://goikogrill.es,https://ubereats.com/es/store/goiko,https://thefork.es/restaurante/goiko,https://images.example.com/goiko-banner.jpg,https://images.example.com/goiko-logo.png
TGB Madrid,Madrid,Calle Velázquez 90 28006 Madrid,+34 914 567 890,11:30-23:30,https://tgbburger.com,https://glovo.es/tgb-madrid,https://thefork.es/restaurante/tgb,https://images.example.com/tgb-banner.jpg,https://images.example.com/tgb-logo.png
Punto MX,Madrid,Calle Paseo de la Castellana 120 28046 Madrid,+34 915 678 901,12:00-23:00,https://puntomx.es,https://ubereats.com/es/store/punto-mx,https://thefork.es/punto-mx,https://images.example.com/punto-banner.jpg,https://images.example.com/punto-logo.png
```

### CSV HAMBURGUESAS (5 ejemplos):
```
name,restaurant,city,description,type,tags,imagen_principal
Kevin Bacon,Goiko Grill,Madrid,Carne 100% ternera con bacon ahumado y queso cheddar fundido,premium,bacon,queso,jugosa,smash,crujiente,https://images.example.com/kevin-bacon.jpg
La Wagyu,Goiko Grill,Madrid,Carne wagyu premium con foie gras y trufa negra,gourmet,wagyu,foie,trufa,lujo,https://images.example.com/wagyu.jpg
La Vegana,TGB Madrid,Madrid,Patty vegano de garbanzos y setas con veganesa casera,vegana,vegano,tofu,setas,veganesa,sin-lactosa,https://images.example.com/vegana.jpg
Doble Kevin,TGB Madrid,Madrid,Dos carnes smash con doble queso y bacon doble,doble,bacon,queso,jugosa,doble-carne,smash,https://images.example.com/doble-kevin.jpg
Clásica Punto,Punto MX,Madrid,Hamburguesa clásica con carne fresca y salsa casera,clásica,carne-fresca,salsa-casera,queso,lechuga,tomate,https://images.example.com/clasica-punto.jpg
```

---

## 12. TROUBLESHOOTING

### ❌ Error: "Restaurant not found"
**Solución:** El nombre en CSV debe ser EXACTAMENTE igual al de la tabla restaurants

### ❌ Error: "City not found"
**Solución:** La ciudad debe estar creada primero. Importa primero Ciudades.

### ❌ Error: "CSV format invalid"
**Solución:** Revisa que:
- Primera línea sea los headers
- Separador sea coma (,)
- No haya saltos de línea extra
- URLs estén completas

### ❌ Las imágenes no se cargan
**Solución:**
- URL debe ser HTTPS (no HTTP)
- URL debe ser válida y accesible
- Imagen no puede estar bloqueada por CORS
- Peso debe ser menor al límite

### ✅ Ver logs de importación
En `/admin` → "📥 Importar CSV" → Resultados mostrarán errores específicos

---

**¡Listo! Con esta guía tienes todo lo necesario para importar el top 50 burgers de Madrid. 🍔**

