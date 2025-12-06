/**
 * Constants for About page
 */

// URLs
export const URLS = {
  HOME: '/',
  ABOUT: '/about',
  APP_BURGERS: '/app/burgers',
  APP_RANKING: '/app/ranking',
  LEGAL_TERMS: '/legal/terms',
  LEGAL_PRIVACY: '/legal/privacy',
  LEGAL_COOKIES: '/legal/cookies',
  CONTACT_EMAIL: 'mailto:contacto@burgerank.com',
  PRESS_EMAIL: 'mailto:press@burgerank.com',
  SUPPORT_EMAIL: 'mailto:support@burgerank.com',
  PRIVACY_EMAIL: 'mailto:privacy@burgerank.com',
}

// Anchor links
export const ANCHORS = {
  ABOUT_US: '#about-us',
  HOW_IT_WORKS: '#how-it-works',
  RANKING_METHODOLOGY: '#ranking-methodology',
  FOR_RESTAURANTS: '#for-restaurants',
  CONTACT: '#contact',
  FAQS: '#faqs',
  PRESS: '#press',
}

// Social media
export const SOCIALS = [
  {
    name: 'Instagram',
    icon: '📷',
    url: 'https://instagram.com/burgerank',
  },
  {
    name: 'Twitter',
    icon: '𝕏',
    url: 'https://twitter.com/burgerank',
  },
  {
    name: 'Facebook',
    icon: '👍',
    url: 'https://facebook.com/burgerank',
  },
  {
    name: 'TikTok',
    icon: '🎵',
    url: 'https://tiktok.com/@burgerank',
  },
  {
    name: 'YouTube',
    icon: '▶️',
    url: 'https://youtube.com/@burgerank',
  },
]

// Text content
export const CONTENT = {
  // Hero
  HERO_TITLE: 'BurgeRank',
  HERO_TAGLINE: 'La comunidad definitiva de amantes de las hamburguesas',
  HERO_DESCRIPTION:
    'Descubre, califica y comparte tus burgers favoritas. Únete a miles de food enthusiasts y ayuda a otros a encontrar la hamburguesa perfecta.',
  HERO_CTA_1: 'Empezar a Calificar',
  HERO_CTA_2: 'Ver Ranking',

  // About
  ABOUT_TITLE: 'Sobre BurgeRank',
  ABOUT_HISTORY: 'Una comunidad nacida del amor por las hamburguesas',
  MISSION:
    'Ayudar a descubrir y compartir las mejores hamburguesas del mundo, fomentando la comunidad y la honestidad.',
  VISION: 'Ser la referencia global en rankings de comida, con transparencia y pasión.',

  // FAQ
  FAQ_TITLE: 'Preguntas Frecuentes',
  FAQ_SUBTITLE: 'Encuentra respuestas a las preguntas más comunes sobre BurgeRank',
  FAQ_SEARCH_PLACEHOLDER: 'Busca una pregunta...',
  FAQ_NO_RESULTS: 'No se encontraron preguntas que coincidan con',
  FAQ_CONTACT_PROMPT: '¿No encontraste la respuesta que buscas?',
  FAQ_CONTACT_CTA: 'Contacta al Equipo',

  // Contact
  CONTACT_TITLE: '¿Preguntas o Sugerencias?',
  CONTACT_DESCRIPTION:
    'Nos encantaría escucharte. Contacta con nuestro equipo y responderemos en las próximas 24 horas.',
  CONTACT_PRIVACY_NOTE:
    'Respetamos tu privacidad. Lee nuestra política de privacidad',

  // Press
  PRESS_TITLE: 'En la Prensa',
  PRESS_SUBTITLE: 'Descubre qué dicen los medios sobre BurgeRank',
  PRESS_KIT_TITLE: 'Press Kit',
  PRESS_KIT_DESCRIPTION:
    'Descarga nuestro kit de prensa completo con logos, screenshots y datos sobre la empresa.',
  PRESS_CONTACT: '¿Eres periodista o trabajas en un medio? Nos encantaría hablar contigo.',

  // Cookies
  COOKIES_TITLE: '🍪 Cookies y Privacidad',
  COOKIES_DESCRIPTION:
    'Usamos cookies para mejorar tu experiencia en BurgeRank. Algunos datos se usan para análisis y marketing personalizado.',

  // Footer
  FOOTER_TAGLINE: 'La comunidad definitiva de amantes de las hamburguesas',
  FOOTER_COPYRIGHT: '© 2024 BurgeRank. Todos los derechos reservados.',
}

// Email templates
export const EMAIL_SUBJECTS = {
  RESTAURANT_CONTACT: 'Nueva solicitud de restaurante',
  GENERAL_CONTACT: 'Nuevo mensaje de contacto',
  CONFIRMATION: 'Solicitud recibida - BurgeRank',
}

// Form validation
export const FORM_VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 255,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_MIN: 10,
  ADDRESS_MIN: 5,
  CITY_MIN: 2,
  MESSAGE_MIN: 10,
  RESTAURANT_NAME_MIN: 3,
}

// Stats
export const STATS = [
  { value: '10K+', label: 'Hamburguesas Calificadas' },
  { value: '50K+', label: 'Usuarios Activos' },
  { value: '500K+', label: 'Reviews Verificadas' },
  { value: '150+', label: 'Ciudades' },
]

// Values
export const VALUES = [
  {
    title: 'Comunidad',
    icon: 'Heart',
    description: 'Juntos somos más fuertes',
  },
  {
    title: 'Pasión',
    icon: 'Zap',
    description: 'Amamos lo que hacemos',
  },
  {
    title: 'Transparencia',
    icon: 'Shield',
    description: 'Honestidad ante todo',
  },
  {
    title: 'Honestidad',
    icon: 'Target',
    description: 'Imparcial y justa',
  },
]

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    emoji: '🍔',
    title: 'Comes una Burger',
    description: 'Encuentra y prueba hamburguesas en tu ciudad',
  },
  {
    number: 2,
    emoji: '⭐',
    title: 'La Calificas',
    description: 'Comparte tu opinión honesta con la comunidad',
  },
  {
    number: 3,
    emoji: '🎁',
    title: 'Ganas Premios',
    description: 'Acumula puntos y canjea recompensas',
  },
  {
    number: 4,
    emoji: '🗺️',
    title: 'Descubres Nuevas',
    description: 'Explora nuevas hamburguesas y restaurantes',
  },
]

// Ranking factors
export const RANKING_FACTORS = [
  {
    id: 1,
    emoji: '📊',
    name: 'Promedio Ponderado',
    weight: '40%',
    description: 'Calificación promedio de todas las reviews verificadas',
  },
  {
    id: 2,
    emoji: '✅',
    name: 'Reviews Verificadas',
    weight: '25%',
    description: 'Valoración doble para usuarios verificados',
  },
  {
    id: 3,
    emoji: '⭐',
    name: 'Nivel del Usuario',
    weight: '20%',
    description: 'Multiplicador según experiencia del usuario',
  },
  {
    id: 4,
    emoji: '🔢',
    name: 'Cantidad de Reviews',
    weight: '10%',
    description: 'Penalización si tiene menos de 5 reviews',
  },
  {
    id: 5,
    emoji: '⚡',
    name: 'Boost Temporal',
    weight: '3%',
    description: 'Impulso para nuevas hamburguesas en primeros 30 días',
  },
  {
    id: 6,
    emoji: '🎮',
    name: 'Match Score ELO',
    weight: '2%',
    description: 'Score personalizado según tus preferencias',
  },
]

// Benefits for restaurants
export const RESTAURANT_BENEFITS = [
  {
    icon: 'TrendingUp',
    title: 'Visibilidad',
    description: 'Llega a miles de amantes de hamburguesas',
  },
  {
    icon: 'MessageSquare',
    title: 'Feedback Valioso',
    description: 'Recibe opiniones reales de tus clientes',
  },
  {
    icon: 'Gift',
    title: 'Programa de Premios',
    description: 'Crea ofertas y promociones exclusivas',
  },
  {
    icon: 'BarChart3',
    title: 'Analytics Avanzados',
    description: 'Datos detallados sobre tu desempeño',
  },
]

// Cookie types
export const COOKIE_TYPES = [
  {
    id: 'essential',
    emoji: '🔒',
    title: 'Cookies Esenciales',
    description: 'Necesarias para que el sitio funcione',
    toggleable: false,
  },
  {
    id: 'analytics',
    emoji: '📊',
    title: 'Cookies de Análisis',
    description: 'Para entender cómo usas BurgeRank',
    toggleable: true,
  },
  {
    id: 'marketing',
    emoji: '📢',
    title: 'Cookies de Marketing',
    description: 'Para mostrarte contenido personalizado',
    toggleable: true,
  },
]

// Animation defaults
export const ANIMATION_DEFAULTS = {
  DURATION: 0.5,
  DELAY: 0.1,
  STAGGER: 0.2,
  TRANSITION: {
    type: 'tween',
    ease: 'easeOut',
  },
} as const
