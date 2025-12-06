export interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  endTime?: number
  duration?: number
  pageViews: string[]
  events: string[]
  bounced: boolean
}

export interface UserBehavior {
  sessionId: string
  userId?: string
  sessionDuration: number
  pageViewCount: number
  eventsCount: number
  bounceRate: number
  lastActive: number
  devices: string[]
  locations: string[]
}

export interface ConversionFunnel {
  name: string
  steps: Array<{
    name: string
    count: number
    dropoffRate: number
  }>
  conversionRate: number
}

export interface ABTestVariant {
  name: string
  userCount: number
  conversionRate: number
  avgSessionDuration: number
  bounceRate: number
}

interface SessionData {
  sessionId: string
  userId?: string
  startTime: number
  pages: Set<string>
  events: string[]
  isActive: boolean
  lastActivityTime: number
}

// Almacenamiento de sesiones
const activeSessions = new Map<string, SessionData>()
const sessionMetrics = new Map<string, UserBehavior>()
const conversionFunnels = new Map<string, ConversionFunnel>()
const abTests = new Map<string, Map<string, ABTestVariant>>()

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos
const BOUNCE_THRESHOLD = 10 * 1000 // 10 segundos

/**
 * Iniciar nueva sesión
 */
export function startSession(sessionId: string, userId?: string): void {
  const session: SessionData = {
    sessionId,
    userId,
    startTime: Date.now(),
    pages: new Set(),
    events: [],
    isActive: true,
    lastActivityTime: Date.now(),
  }

  activeSessions.set(sessionId, session)

  // Rastrear duración y bounce
  setTimeout(() => {
    checkSessionBounce(sessionId)
  }, BOUNCE_THRESHOLD)
}

/**
 * Registrar page view
 */
export function recordPageView(sessionId: string, pageName: string): void {
  const session = activeSessions.get(sessionId)
  if (!session) return

  session.pages.add(pageName)
  session.lastActivityTime = Date.now()
}

/**
 * Registrar evento de usuario
 */
export function recordUserEvent(sessionId: string, eventName: string): void {
  const session = activeSessions.get(sessionId)
  if (!session) return

  session.events.push(eventName)
  session.lastActivityTime = Date.now()
}

/**
 * Finalizar sesión
 */
export function endSession(sessionId: string): void {
  const session = activeSessions.get(sessionId)
  if (!session) return

  const endTime = Date.now()
  const duration = endTime - session.startTime
  const bounced = duration < BOUNCE_THRESHOLD && session.pages.size <= 1

  const behavior: UserBehavior = {
    sessionId,
    userId: session.userId,
    sessionDuration: duration,
    pageViewCount: session.pages.size,
    eventsCount: session.events.length,
    bounceRate: bounced ? 1 : 0,
    lastActive: session.lastActivityTime,
    devices: [],
    locations: [],
  }

  sessionMetrics.set(sessionId, behavior)
  activeSessions.delete(sessionId)

  // Enviar métricas
  sendBehaviorMetrics(behavior)
}

/**
 * Verificar bounce
 */
function checkSessionBounce(sessionId: string): void {
  const session = activeSessions.get(sessionId)
  if (!session) return

  const duration = Date.now() - session.startTime
  const isBounce = duration < BOUNCE_THRESHOLD && session.pages.size === 1

  if (isBounce) {
    console.log(`📊 Session ${sessionId} bounced`)
  }
}

/**
 * Definir funnel de conversión
 */
export function defineFunnel(
  funnelName: string,
  steps: string[]
): void {
  const funnel: ConversionFunnel = {
    name: funnelName,
    steps: steps.map((step) => ({
      name: step,
      count: 0,
      dropoffRate: 0,
    })),
    conversionRate: 0,
  }

  conversionFunnels.set(funnelName, funnel)
}

/**
 * Rastrear paso en funnel
 */
export function trackFunnelStep(
  funnelName: string,
  stepIndex: number,
  completed: boolean
): void {
  const funnel = conversionFunnels.get(funnelName)
  if (!funnel || stepIndex >= funnel.steps.length) return

  if (completed) {
    funnel.steps[stepIndex].count++

    // Calcular dropoff rate
    if (stepIndex > 0) {
      const previousCount = funnel.steps[stepIndex - 1].count
      funnel.steps[stepIndex].dropoffRate =
        previousCount > 0 ? 1 - funnel.steps[stepIndex].count / previousCount : 0
    }

    // Calcular conversion rate total
    if (funnel.steps.length > 0) {
      const lastStepCount = funnel.steps[funnel.steps.length - 1].count
      const firstStepCount = funnel.steps[0].count
      funnel.conversionRate =
        firstStepCount > 0 ? lastStepCount / firstStepCount : 0
    }
  }
}

/**
 * Obtener métricas de funnel
 */
export function getFunnelMetrics(funnelName: string): ConversionFunnel | null {
  return conversionFunnels.get(funnelName) || null
}

/**
 * Definir A/B test
 */
export function defineABTest(
  testName: string,
  variants: string[]
): void {
  const test = new Map<string, ABTestVariant>()

  variants.forEach((variant) => {
    test.set(variant, {
      name: variant,
      userCount: 0,
      conversionRate: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
    })
  })

  abTests.set(testName, test)
}

/**
 * Asignar usuario a variante
 */
export function assignVariant(
  testName: string,
  userId: string
): string | null {
  const test = abTests.get(testName)
  if (!test) return null

  const variants = Array.from(test.keys())
  if (variants.length === 0) return null

  // Hash-based assignment para consistencia
  const hashCode = userId.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const variantIndex = Math.abs(hashCode) % variants.length
  return variants[variantIndex]
}

/**
 * Registrar conversión en A/B test
 */
export function recordABTestConversion(
  testName: string,
  variant: string,
  sessionDuration: number,
  bounced: boolean
): void {
  const test = abTests.get(testName)
  if (!test) return

  const variantData = test.get(variant)
  if (!variantData) return

  const totalUsers = variantData.userCount
  variantData.userCount++

  // Actualizar promedios
  variantData.avgSessionDuration =
    (variantData.avgSessionDuration * totalUsers + sessionDuration) /
    variantData.userCount

  variantData.bounceRate =
    (variantData.bounceRate * totalUsers + (bounced ? 1 : 0)) / variantData.userCount

  variantData.conversionRate = variantData.conversionRate + 1 / variantData.userCount
}

/**
 * Obtener métricas de A/B test
 */
export function getABTestMetrics(testName: string): Map<string, ABTestVariant> | null {
  return abTests.get(testName) || null
}

/**
 * Determinar variante ganadora
 */
export function getWinningVariant(
  testName: string
): { variant: string; improvement: number } | null {
  const test = abTests.get(testName)
  if (!test || test.size < 2) return null

  const variants = Array.from(test.values())
  const sorted = variants.sort((a, b) => b.conversionRate - a.conversionRate)

  const winner = sorted[0]
  const runner = sorted[1]

  const improvement = (winner.conversionRate - runner.conversionRate) / runner.conversionRate

  return {
    variant: winner.name,
    improvement: improvement * 100,
  }
}

/**
 * Obtener sesiones activas
 */
export function getActiveSessions(): UserSession[] {
  return Array.from(activeSessions.values()).map((session) => ({
    sessionId: session.sessionId,
    userId: session.userId,
    startTime: session.startTime,
    pageViews: Array.from(session.pages),
    events: session.events,
    bounced: false,
  }))
}

/**
 * Obtener comportamiento de usuario
 */
export function getUserBehavior(sessionId: string): UserBehavior | null {
  return sessionMetrics.get(sessionId) || null
}

/**
 * Calcular estadísticas agregadas
 */
export function calculateAggregateStats(): {
  avgSessionDuration: number
  avgBounceRate: number
  avgPageViews: number
  avgEvents: number
  activeSessionCount: number
} {
  const sessions = Array.from(sessionMetrics.values())

  if (sessions.length === 0) {
    return {
      avgSessionDuration: 0,
      avgBounceRate: 0,
      avgPageViews: 0,
      avgEvents: 0,
      activeSessionCount: activeSessions.size,
    }
  }

  const avgSessionDuration =
    sessions.reduce((sum, s) => sum + s.sessionDuration, 0) / sessions.length

  const avgBounceRate =
    sessions.reduce((sum, s) => sum + s.bounceRate, 0) / sessions.length

  const avgPageViews =
    sessions.reduce((sum, s) => sum + s.pageViewCount, 0) / sessions.length

  const avgEvents = sessions.reduce((sum, s) => sum + s.eventsCount, 0) / sessions.length

  return {
    avgSessionDuration,
    avgBounceRate,
    avgPageViews,
    avgEvents,
    activeSessionCount: activeSessions.size,
  }
}

/**
 * Obtener usuarios más valiosos
 */
export function getTopUsers(limit: number = 10): UserBehavior[] {
  return Array.from(sessionMetrics.values())
    .sort((a, b) => {
      const scoreA = b.sessionDuration * b.eventsCount
      const scoreB = a.sessionDuration * a.eventsCount
      return scoreA - scoreB
    })
    .slice(0, limit)
}

/**
 * Rastrear búsqueda más popular
 */
export function trackPopularSearches(): Map<string, number> {
  // Implementar desde eventos de analytics
  return new Map()
}

/**
 * Rastrear burgers más vistos
 */
export function trackMostViewedBurgers(): Map<string, number> {
  // Implementar desde eventos de analytics
  return new Map()
}

/**
 * Enviar métricas de comportamiento
 */
async function sendBehaviorMetrics(behavior: UserBehavior): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch('/api/analytics/behavior', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(behavior),
    })
  } catch (error) {
    console.error('Failed to send behavior metrics:', error)
  }
}

/**
 * Limpiar sesiones inactivas
 */
export function cleanupInactiveSessions(): number {
  const now = Date.now()
  let removed = 0

  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivityTime > INACTIVITY_TIMEOUT) {
      endSession(sessionId)
      removed++
    }
  }

  return removed
}

// Cleanup automático cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const removed = cleanupInactiveSessions()
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} inactive sessions`)
    }
  }, 5 * 60 * 1000)
}
