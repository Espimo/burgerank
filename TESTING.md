# 🧪 Guía de Testing - BurgeRank

## Inicio Rápido

```bash
npm run dev
# Luego abre http://localhost:3000
```

## ✅ Checklist de Funcionalidades

### 🏆 Página Ranking

- [ ] **Visualizar burgers**
  - [ ] Se muestran 36+ hamburguesas en la lista
  - [ ] Cada tarjeta muestra: posición, nombre, restaurante, rating, reviews, tags
  
- [ ] **Filtro por ciudad**
  - [ ] Selecciona "Madrid" → Solo muestra 8 burgers
  - [ ] Selecciona "Barcelona" → Solo muestra 8 burgers
  - [ ] Selecciona "Todas las Ciudades" → Muestra 36 burgers

- [ ] **Búsqueda**
  - [ ] Escribe "King" → Muestra solo "The King Burger"
  - [ ] Escribe "BBQ" → Muestra burgers con BBQ
  - [ ] Escribe restaurante "Burger Palace" → Filtra correctamente
  - [ ] Búsqueda vacía → Muestra todos

- [ ] **UI/UX**
  - [ ] Las tarjetas son clickeables (visualmente)
  - [ ] Responsive en mobile
  - [ ] Scroll suave
  - [ ] Sin errores en consola

### ⭐ Página Rate (Valorar)

- [ ] **Paso 0 - Contexto**
  - [ ] Botones "En el Local" / "A Domicilio" funcionan
  - [ ] Puedes seleccionar múltiples aperitivos
  - [ ] Botón "Continuar" avanza a paso 1

- [ ] **Paso 1 - Búsqueda**
  - [ ] Se muestra lista completa de 36 burgers
  - [ ] Campo de búsqueda filtra en tiempo real
  - [ ] Escribe "King" → Solo muestra "The King Burger"
  - [ ] Click en una burger → **Avanza automáticamente a paso 2** ✨
  - [ ] Botón "Atrás" vuelve a paso 0

- [ ] **Paso 2 - Valoración**
  - [ ] Se muestran 4 secciones (Pan, Carne, Toppings, Salsa)
  - [ ] Puedes dar puntuación de 1-3 estrellas en cada sección
  - [ ] Rating general de 1-5 estrellas funciona
  - [ ] Botón "Continuar" avanza a paso 3

- [ ] **Paso 3 - Detalles**
  - [ ] Campo de precio editable
  - [ ] TextArea de comentario funciona
  - [ ] Tipo de consumo seleccionable
  - [ ] Botón "Continuar" avanza a paso 4

- [ ] **Paso 4 - Éxito**
  - [ ] Muestra pantalla de éxito
  - [ ] Muestra puntos ganados
  - [ ] Botón "Comenzar de Nuevo" reinicia el wizard

- [ ] **Botón Crear Nueva**
  - [ ] En paso 1, click en "Crear Nueva Hamburguesa"
  - [ ] Avanza a paso 6 (formulario de creación)

### 👤 Página Profile

- [ ] **Avatar y datos**
  - [ ] Se muestra avatar (initiales)
  - [ ] Nombre de usuario visible
  - [ ] Puntos totales mostrados
  - [ ] Categoría correcta (Burger Fan/Lover/Obsessed)

- [ ] **Insignias (Badges)**
  - [ ] Se muestran 8 espacios para insignias
  - [ ] Algunas están desbloqueadas (✅)
  - [ ] Click en una desbloqueada muestra info

- [ ] **Estadísticas**
  - [ ] Puntos totales correctos
  - [ ] Número de valoraciones
  - [ ] Próxima recompensa con progreso

- [ ] **Recompensas**
  - [ ] Carousel muestra 5 tipos de recompensas
  - [ ] Puedes scrollear horizontalmente
  - [ ] Precios en puntos visibles

- [ ] **Configuración**
  - [ ] Botón de engranaje abre modal
  - [ ] Puedes editar nombre y email
  - [ ] Toggle de "Perfil Público"
  - [ ] Link de perfil público se genera

### ℹ️ Página About

- [ ] **Información**
  - [ ] Título principal visible
  - [ ] 5 acordeones desplegables
  - [ ] Cada acordeón muestra/oculta contenido

- [ ] **Navegación**
  - [ ] Todos los acordeones funcionan
  - [ ] Contenido de ejemplo en cada uno
  - [ ] Smooth animations

### 📱 Navegación

- [ ] **Top Bar**
  - [ ] Logo "🍔 BurgeRank" visible
  - [ ] Botón menú (☰) abre sidebar
  - [ ] Botón "?" muestra sobre (About)

- [ ] **Bottom Nav**
  - [ ] 3 botones: Ranking 🏆, Valorar ⭐, Perfil 👤
  - [ ] Click en cada uno navega correctamente
  - [ ] Indicador de página activa visible

- [ ] **Sidebar**
  - [ ] Se abre con click en menú
  - [ ] 4 opciones: Ranking, Valorar, Perfil, Acerca de
  - [ ] Click en opción navega y cierra sidebar
  - [ ] Click fuera del sidebar lo cierra

## 🎨 Checks de UI

- [ ] Tema oscuro aplicado correctamente
- [ ] Colores: Dorado (#fbbf24) para destacados
- [ ] Bordes y sombras consistentes
- [ ] Tipografía legible en todos los dispositivos
- [ ] Padding y margins consistentes
- [ ] Sin textos cortados en mobile
- [ ] Imágenes/emojis escalados correctamente

## 🔧 Checks Técnicos

- [ ] No hay errores en consola del navegador
- [ ] No hay errores TypeScript en build
- [ ] Página se carga en < 3 segundos
- [ ] Responsivo: prueba en 320px, 768px, 1920px
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Sin memory leaks (abre DevTools, usa 5 min)

## 📊 Datos de Test

### Burgers por Ciudad

**Madrid (8)**
- The King Burger (4.8★)
- Double Stack (4.6★)
- BBQ Master (4.7★)
- Classic Madrid (4.4★)
- Premium Gold (4.9★)
- Truffle Burger (4.8★)
- Smash Classic (4.7★)
- The Inferno (4.5★)

**Barcelona (8)**
- Smoky BBQ (4.7★)
- Green Supreme (4.2★)
- BCN Meat Heaven (4.6★)
- Catalan Burger (4.8★)
- The Beast (4.7★)
- Craft Barcelona (4.6★)
- Gothic Glory (4.4★)
- Barcelona Triple Stack (4.8★)

**Valencia (8)**
- Clásica Tradicional (4.5★)
- Turia Premium (4.6★)
- Beach Special (4.4★)
- Valencia Grill Master (4.7★)
- City Valencia (4.4★)
- Huerta Veggie (4.3★)
- Modern Valencia (4.6★)
- Premium Paella Burger (4.8★)

**Sevilla (8)**
- Andaluz Classic (4.5★)
- Giralda Premium (4.7★)
- Sevilla Signature (4.6★)
- Flamenco Spice (4.4★)
- Triana Soul (4.6★)
- Premium Sevilla Gold (4.8★)
- The Scorcher (4.5★)
- Spain on a Plate (4.6★)

**Bilbao (4+)**
- Basque Country (4.7★)
- Guggenheim (4.6★)
- Bilbao Soul (4.5★)
- Basque Excellence (4.9★)

## 🐛 Bugs Conocidos (Si los encuentras)

Reporta cualquier bug encontrado con:
- [ ] Descripción clara
- [ ] Pasos para reproducir
- [ ] Screenshot/video
- [ ] Navegador y versión
- [ ] Dispositivo (desktop/mobile)

## ✨ Features Pendientes para Fase 2

- [ ] Integración real con Supabase
- [ ] Autenticación (login/registro)
- [ ] Upload de fotos
- [ ] Sistema de puntos dinámico
- [ ] Notificaciones en tiempo real
- [ ] Compartir valoraciones
- [ ] Dark mode toggle
- [ ] Multi-idioma

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Build**: ✅ Sin errores
