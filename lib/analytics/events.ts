export interface AnalyticsEvent {
  name: string
  timestamp: number
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
}

export interface UserProperties {
  userId: string
  userTier?: 'free' | 'premium'
  joinDate?: number
  location?: string
  preferences?: Record<string, any>
}

export type EventName =
  | 'page_view'
  | 'burger_view'
  | 'burger_rate'
  | 'burger_rate_cancel'
  | 'review_submit'
  | 'review_helpful'
  | 'restaurant_view'
  | 'restaurant_follow'
  | 'ranking_filter'
  | 'ranking_sort'
  | 'search_query'
  | 'search_results_view'
  | 'search_result_click'
  | 'reward_earned'
  | 'badge_unlocked'
  | 'social_share'
  | 'app_install'
  | 'app_uninstall'
  | 'preference_change'
  | 'notification_received'
  | 'notification_click'
  | 'error'
  | 'performance_issue'

let sessionId: string
let userId: string | undefined
let userProperties: Partial<UserProperties> = {}
let eventQueue: AnalyticsEvent[] = []
let eventBuffer: AnalyticsEvent[] = []
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

const BATCH_SIZE = 10
const BATCH_TIMEOUT = 30000 // 30 segundos

/**
 * Inicializar Analytics
 */
export function initializeAnalytics(
  googleAnalyticsId?: string,
  customUserId?: string
): void {
  if (typeof window === 'undefined') return

  // Generar session ID
  sessionId = generateSessionId()

  // Inicializar GA4 si se proporciona
  if (googleAnalyticsId) {
    loadGoogleAnalytics(googleAnalyticsId)
  }

  userId = customUserId

  // Escuchar cambios de conexión
  window.addEventListener('online', () => {
    isOnline = true
    flushEventQueue()
  })

  window.addEventListener('offline', () => {
    isOnline = false
  })

  // Flush periódico
  setInterval(() => {
    if (eventQueue.length > 0) {
      flushEventQueue()
    }
  }, BATCH_TIMEOUT)

  // Flush al unload
  window.addEventListener('beforeunload', () => {
    flushEventQueue()
  })

  console.log('📊 Analytics initialized - Session ID:', sessionId)
}

/**
 * Trackear evento
 */
export function trackEvent(
  name: EventName,
  properties?: Record<string, any>
): void {
  const event: AnalyticsEvent = {
    name,
    timestamp: Date.now(),
    userId,
    sessionId,
    properties,
  }

  eventQueue.push(event)
  eventBuffer.push(event)

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`📈 Event: ${name}`, properties)
  }

  // Flush si alcanzamos batch size
  if (eventQueue.length >= BATCH_SIZE) {
    flushEventQueue()
  }

  // Enviar a GA4 en tiempo real para eventos críticos
  if (['burger_rate', 'review_submit', 'reward_earned'].includes(name)) {
    sendToGA4(name, properties)
  }
}

/**
 * Trackear vista de página
 */
export function trackPageView(
  pageName: string,
  properties?: Record<string, any>
): void {
  trackEvent('page_view', {
    pageName,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    ...properties,
  })
}

/**
 * Trackear view de burger
 */
export function trackBurgerView(
  burgerId: string,
  burgerName: string,
  restaurantId: string,
  restaurantName: string
): void {
  trackEvent('burger_view', {
    burgerId,
    burgerName,
    restaurantId,
    restaurantName,
  })
}

/**
 * Trackear rating de burger
 */
export function trackBurgerRating(
  burgerId: string,
  burgerName: string,
  rating: number,
  categories: Record<string, number>
): void {
  trackEvent('burger_rate', {
    burgerId,
    burgerName,
    rating,
    categories,
    timestamp: Date.now(),
  })
}

/**
 * Trackear cancelación de rating
 */
export function trackBurgerRatingCancel(burgerId: string): void {
  trackEvent('burger_rate_cancel', {
    burgerId,
  })
}

/**
 * Trackear envío de review
 */
export function trackReviewSubmit(
  burgerId: string,
  rating: number,
  hasImage: boolean,
  hasText: boolean
): void {
  trackEvent('review_submit', {
    burgerId,
    rating,
    hasImage,
    hasText,
  })
}

/**
 * Trackear helpful en review
 */
export function trackReviewHelpful(
  reviewId: string,
  burgerId: string,
  isHelpful: boolean
): void {
  trackEvent('review_helpful', {
    reviewId,
    burgerId,
    isHelpful,
  })
}

/**
 * Trackear filtros en ranking
 */
export function trackRankingFilter(
  filters: Record<string, any>
): void {
  trackEvent('ranking_filter', {
    filters,
    filterCount: Object.keys(filters).length,
  })
}

/**
 * Trackear ordenamiento en ranking
 */
export function trackRankingSort(
  sortBy: string,
  order: 'asc' | 'desc'
): void {
  trackEvent('ranking_sort', {
    sortBy,
    order,
  })
}

/**
 * Trackear búsqueda
 */
export function trackSearch(
  query: string,
  resultsCount: number,
  searchType: 'burgers' | 'restaurants'
): void {
  trackEvent('search_query', {
    query,
    resultsCount,
    searchType,
  })
}

/**
 * Trackear click en resultado de búsqueda
 */
export function trackSearchResultClick(
  query: string,
  resultId: string,
  resultName: string,
  position: number
): void {
  trackEvent('search_result_click', {
    query,
    resultId,
    resultName,
    position,
  })
}

/**
 * Trackear reward ganado
 */
export function trackRewardEarned(
  rewardType: string,
  rewardName: string,
  points: number
): void {
  trackEvent('reward_earned', {
    rewardType,
    rewardName,
    points,
  })
}

/**
 * Trackear badge desbloqueado
 */
export function trackBadgeUnlocked(
  badgeId: string,
  badgeName: string,
  condition: string
): void {
  trackEvent('badge_unlocked', {
    badgeId,
    badgeName,
    condition,
  })
}

/**
 * Trackear compartir social
 */
export function trackSocialShare(
  platform: string,
  contentType: string,
  contentId: string
): void {
  trackEvent('social_share', {
    platform,
    contentType,
    contentId,
  })
}

/**
 * Trackear instalación de app
 */
export function trackAppInstall(platform: string): void {
  trackEvent('app_install', {
    platform,
  })
}

/**
 * Trackear preferencia
 */
export function trackPreferenceChange(
  preference: string,
  oldValue: any,
  newValue: any
): void {
  trackEvent('preference_change', {
    preference,
    oldValue,
    newValue,
  })
}

/**
 * Trackear error
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  stack?: string
): void {
  trackEvent('error', {
    errorType,
    errorMessage,
    stack,
    url: typeof window !== 'undefined' ? window.location.href : '',
  })
}

/**
 * Trackear issue de performance
 */
export function trackPerformanceIssue(
  metric: string,
  value: number,
  threshold: number
): void {
  trackEvent('performance_issue', {
    metric,
    value,
    threshold,
    degradation: ((value - threshold) / threshold) * 100,
  })
}

/**
 * Establecer propiedades del usuario
 */
export function setUserProperties(properties: Partial<UserProperties>): void {
  userProperties = { ...userProperties, ...properties }

  // Enviar a GA4
  if (typeof gtag === 'function') {
    gtag('config', 'GA_ID', {
      user_id: properties.userId,
      user_properties: {
        tier: properties.userTier,
        join_date: properties.joinDate,
        location: properties.location,
      },
    })
  }
}

/**
 * Obtener propiedades del usuario
 */
export function getUserProperties(): Partial<UserProperties> {
  return userProperties
}

/**
 * Obtener session ID actual
 */
export function getSessionId(): string {
  return sessionId
}

/**
 * Obtener eventos en buffer
 */
export function getEventBuffer(): AnalyticsEvent[] {
  return [...eventBuffer]
}

/**
 * Limpiar buffer
 */
export function clearEventBuffer(): void {
  eventBuffer = []
}

/**
 * Flush de eventos
 */
async function flushEventQueue(): Promise<void> {
  if (eventQueue.length === 0 || !isOnline) return

  const eventsToSend = [...eventQueue]
  eventQueue = []

  try {
    // Enviar a servidor
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: eventsToSend,
        sessionId,
        userId,
        userProperties,
      }),
    })

    if (!response.ok) {
      // Reintentar más tarde
      eventQueue = [...eventsToSend, ...eventQueue]
      console.error('Failed to send analytics events')
    }
  } catch (error) {
    console.error('Error sending analytics:', error)
    // Reintentar
    eventQueue = [...eventsToSend, ...eventQueue]
  }
}

/**
 * Generar Session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Cargar Google Analytics
 */
function loadGoogleAnalytics(measurementId: string): void {
  if (typeof window === 'undefined') return

  // Agregar script de GA4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    ;(window.dataLayer as any).push(arguments)
  }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId, {
    'allow_google_signals': true,
    'allow_ad_personalization_signals': true,
  })
}

/**
 * Enviar evento a GA4
 */
function sendToGA4(eventName: string, properties?: Record<string, any>): void {
  if (typeof gtag !== 'function') return

  gtag('event', eventName, {
    ...properties,
    'session_id': sessionId,
  })
}

// Type para window
declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: Function
  }

  function gtag(...args: any[]): void
}
