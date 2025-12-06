export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint (ms)
  fid?: number // First Input Delay (ms)
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint (ms)
  ttfb?: number // Time to First Byte (ms)

  // Additional metrics
  dcl?: number // DOMContentLoaded (ms)
  tti?: number // Time to Interactive (ms)
  longTasks: number
  layoutShifts: number
}

export interface PerformanceThresholds {
  lcp: number // Good: <2500ms
  fid: number // Good: <100ms
  cls: number // Good: <0.1
  fcp: number // Good: <1800ms
  ttfb: number // Good: <600ms
}

const defaultThresholds: PerformanceThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
}

let metrics: PerformanceMetrics = {
  longTasks: 0,
  layoutShifts: 0,
}

let thresholds: PerformanceThresholds = { ...defaultThresholds }
let metricsCallback: ((metrics: PerformanceMetrics) => void) | null = null
let degradationCallback: ((metric: string) => void) | null = null

/**
 * Inicializar monitoreo de performance
 */
export function initializePerformanceMonitoring(
  customThresholds?: Partial<PerformanceThresholds>,
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void,
  onDegradation?: (metric: string) => void
): void {
  if (typeof window === 'undefined') return

  // Actualizar thresholds personalizados
  if (customThresholds) {
    thresholds = { ...defaultThresholds, ...customThresholds }
  }

  metricsCallback = onMetricsUpdate || null
  degradationCallback = onDegradation || null

  // Observar Core Web Vitals usando web-vitals API si está disponible
  observeCoreWebVitals()

  // Observar Long Tasks
  observeLongTasks()

  // Observar Layout Shifts
  observeLayoutShifts()

  // Enviar métricas al hacer unload
  window.addEventListener('beforeunload', () => {
    sendMetricsToAnalytics(metrics)
  })
}

/**
 * Observar Core Web Vitals
 */
function observeCoreWebVitals(): void {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]

        if (lastEntry.name === 'largest-contentful-paint') {
          const value = (lastEntry as any).renderTime || (lastEntry as any).loadTime
          metrics.lcp = value
          checkThreshold('lcp', value)
          metricsCallback?.(metrics)
        }
      })

      paintObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.debug('LCP observer not supported')
    }
  }

  // First Contentful Paint (FCP)
  if (performance.getEntriesByName) {
    const fcpEntry = performance
      .getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint')

    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime
      checkThreshold('fcp', fcpEntry.startTime)
    }
  }

  // Time to First Byte (TTFB)
  if (performance.getEntriesByType) {
    const navigationTiming = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming

    if (navigationTiming) {
      const ttfb = navigationTiming.responseStart - navigationTiming.fetchStart
      metrics.ttfb = ttfb
      checkThreshold('ttfb', ttfb)
    }

    // DOMContentLoaded
    const dcl = navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart
    metrics.dcl = dcl

    // Time to Interactive (TTI) - estimado
    const tti = navigationTiming.loadEventEnd - navigationTiming.fetchStart
    metrics.tti = tti
  }

  // First Input Delay (FID) - deprecado en favor de INP
  if ('PerformanceObserver' in window) {
    try {
      const inputObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        entries.forEach((entry: any) => {
          if (entry.name === 'first-input' && !metrics.fid) {
            const fid = entry.processingEnd - entry.startTime
            metrics.fid = fid
            checkThreshold('fid', fid)
            metricsCallback?.(metrics)
          }
        })
      })

      inputObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.debug('FID observer not supported')
    }
  }
}

/**
 * Observar Long Tasks (tareas que bloquean el main thread > 50ms)
 */
function observeLongTasks(): void {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(() => {
          metrics.longTasks++
          metricsCallback?.(metrics)

          // Alerta si hay muchas long tasks
          if (metrics.longTasks > 5) {
            console.warn('⚠️ Multiple long tasks detected')
            degradationCallback?.('long_tasks')
          }
        })
      })

      // Long Task API requiere opt-in
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      console.debug('Long Task observer not supported')
    }
  }
}

/**
 * Observar Layout Shifts (Cumulative Layout Shift)
 */
function observeLayoutShifts(): void {
  if (typeof window === 'undefined') return

  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0

      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          // Solo contar layout shifts no causados por user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            metrics.cls = clsValue
            checkThreshold('cls', clsValue)
            metricsCallback?.(metrics)
          }
        })
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.debug('Layout Shift observer not supported')
    }
  }
}

/**
 * Verificar si métrica está bajo el threshold
 */
function checkThreshold(metric: string, value: number): void {
  const threshold = thresholds[metric as keyof PerformanceThresholds]

  if (threshold && value > threshold) {
    console.warn(`⚠️ ${metric.toUpperCase()} degradation: ${value}ms > ${threshold}ms`)
    degradationCallback?.(metric)

    // Enviar a Sentry o analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      gtag('event', 'performance_degradation', {
        metric,
        value,
        threshold,
      })
    }
  }
}

/**
 * Obtener métricas actuales
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics }
}

/**
 * Resetear métricas
 */
export function resetPerformanceMetrics(): void {
  metrics = {
    longTasks: 0,
    layoutShifts: 0,
  }
}

/**
 * Enviar métricas a analytics
 */
export function sendMetricsToAnalytics(performanceMetrics: PerformanceMetrics): void {
  if (typeof window === 'undefined' || typeof gtag !== 'function') return

  gtag('event', 'page_view_metrics', {
    lcp: performanceMetrics.lcp,
    fid: performanceMetrics.fid,
    cls: performanceMetrics.cls,
    fcp: performanceMetrics.fcp,
    ttfb: performanceMetrics.ttfb,
    dcl: performanceMetrics.dcl,
    tti: performanceMetrics.tti,
    long_tasks: performanceMetrics.longTasks,
    layout_shifts: performanceMetrics.layoutShifts,
  })
}

/**
 * Medir duración de operación
 */
export function measureOperation(operationName: string): {
  end: () => number
} {
  const startTime = performance.now()

  return {
    end: () => {
      const duration = performance.now() - startTime
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`)

      // Registrar en performance timeline
      if ('measure' in performance) {
        try {
          performance.measure(operationName, {
            start: startTime,
            duration,
          })
        } catch (e) {
          console.debug('Could not measure operation:', e)
        }
      }

      return duration
    },
  }
}

/**
 * Detectar memory leaks observando memory usage
 */
export function monitorMemoryUsage(): {
  initialMemory: number
  getCurrentMemory: () => number
  getGrowth: () => number
} {
  const initialMemory =
    (performance as any).memory?.usedJSHeapSize || 0

  return {
    initialMemory,
    getCurrentMemory: () => (performance as any).memory?.usedJSHeapSize || 0,
    getGrowth: () => {
      const current = (performance as any).memory?.usedJSHeapSize || 0
      return current - initialMemory
    },
  }
}

/**
 * Analizar recursos cargados
 */
export function analyzeResources(): {
  count: number
  totalSize: number
  byType: Record<string, number>
  slowestResources: Array<{
    name: string
    duration: number
    size: number
  }>
} {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  const byType: Record<string, number> = {}
  let totalSize = 0

  resources.forEach((resource) => {
    const type = resource.initiatorType || 'unknown'
    byType[type] = (byType[type] || 0) + (resource.transferSize || 0)
    totalSize += resource.transferSize || 0
  })

  const slowestResources = resources
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
    .map((r) => ({
      name: r.name.split('/').pop() || r.name,
      duration: r.duration,
      size: r.transferSize || 0,
    }))

  return {
    count: resources.length,
    totalSize,
    byType,
    slowestResources,
  }
}

/**
 * Obtener reporteSummary
 */
export function generatePerformanceReport(): {
  summary: string
  metrics: PerformanceMetrics
  recommendations: string[]
} {
  const recommendations: string[] = []

  if (metrics.lcp && metrics.lcp > 2500) {
    recommendations.push('Optimizar Largest Contentful Paint (LCP): considere lazy loading de imágenes')
  }

  if (metrics.fid && metrics.fid > 100) {
    recommendations.push('Mejorar First Input Delay (FID): reducir JavaScript que bloquea')
  }

  if (metrics.cls && metrics.cls > 0.1) {
    recommendations.push(
      'Reducir Cumulative Layout Shift (CLS): evitar cambios de layout durante la carga'
    )
  }

  if (metrics.longTasks > 5) {
    recommendations.push('Dividir long tasks: usar web workers o async operations')
  }

  const summary = `
    Performance Report
    ==================
    LCP: ${metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}
    FID: ${metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A'}
    CLS: ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
    FCP: ${metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}
    TTFB: ${metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}
    Long Tasks: ${metrics.longTasks}
  `.trim()

  return {
    summary,
    metrics,
    recommendations,
  }
}
