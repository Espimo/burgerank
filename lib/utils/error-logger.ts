export interface ErrorContext {
  userId?: string
  sessionId?: string
  url: string
  userAgent: string
  timestamp: number
  breadcrumbs?: string[]
}

export interface ErrorLog {
  type: string
  message: string
  stack?: string
  context: ErrorContext
  severity: 'info' | 'warning' | 'error' | 'critical'
}

const errorLogs: ErrorLog[] = []
const MAX_ERROR_LOGS = 100

let errorReportingCallback: ((error: ErrorLog) => void) | null = null
let isSentryEnabled = false

/**
 * Inicializar error logging
 */
export function initializeErrorLogging(
  sentryDsn?: string,
  userId?: string,
  sessionId?: string,
  onError?: (error: ErrorLog) => void
): void {
  if (typeof window === 'undefined') return

  errorReportingCallback = onError || null

  // Inicializar Sentry si DSN está disponible
  if (sentryDsn) {
    initializeSentry(sentryDsn, userId, sessionId)
  }

  // Capturar errores sin manejo
  window.addEventListener('error', (event) => {
    logError(
      'UncaughtError',
      event.message,
      event.error?.stack,
      'error'
    )
  })

  // Capturar promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      'UnhandledRejection',
      event.reason?.message || String(event.reason),
      event.reason?.stack,
      'error'
    )
  })

  console.log('🛡️ Error logging initialized')
}

/**
 * Logging de errores
 */
export function logError(
  type: string,
  message: string,
  stack?: string,
  severity: 'info' | 'warning' | 'error' | 'critical' = 'error',
  breadcrumbs?: string[]
): void {
  const errorLog: ErrorLog = {
    type,
    message,
    stack,
    severity,
    context: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      breadcrumbs,
    },
  }

  errorLogs.push(errorLog)

  // Mantener límite de logs
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.shift()
  }

  // Llamar callback personalizado
  errorReportingCallback?.(errorLog)

  // Enviar a Sentry
  if (isSentryEnabled && typeof Sentry !== 'undefined') {
    sendToSentry(errorLog)
  }

  // Enviar a servidor en producción
  if (process.env.NODE_ENV === 'production') {
    sendErrorToServer(errorLog)
  }

  // Log en consola en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${type}] ${message}`, stack || '')
  }
}

/**
 * Logging de warning
 */
export function logWarning(
  type: string,
  message: string,
  context?: Record<string, any>
): void {
  logError(type, message, '', 'warning')
}

/**
 * Logging de info
 */
export function logInfo(
  type: string,
  message: string,
  context?: Record<string, any>
): void {
  logError(type, message, '', 'info')
}

/**
 * Logging de errores críticos
 */
export function logCriticalError(
  type: string,
  message: string,
  stack?: string
): void {
  logError(type, message, stack, 'critical')

  // Alertar al equipo
  notifyAlertChannel(type, message)
}

/**
 * Obtener últimos logs de error
 */
export function getErrorLogs(limit: number = 50): ErrorLog[] {
  return errorLogs.slice(-limit)
}

/**
 * Limpiar logs de error
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0
}

/**
 * Inicializar Sentry
 */
function initializeSentry(dsn: string, userId?: string, sessionId?: string): void {
  if (typeof window === 'undefined') return

  // Cargar script de Sentry
  const script = document.createElement('script')
  script.src = 'https://browser.sentry-cdn.com/7.99.0/bundle.min.js'
  script.integrity =
    'sha384-....' // Reemplazar con hash actual
  script.crossOrigin = 'anonymous'

  script.onload = () => {
    if (typeof Sentry !== 'undefined') {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
        integrations: [
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })

      if (userId) {
        Sentry.setUser({ id: userId })
      }

      if (sessionId) {
        Sentry.setTag('session_id', sessionId)
      }

      isSentryEnabled = true
      console.log('✅ Sentry initialized')
    }
  }

  document.head.appendChild(script)
}

/**
 * Enviar error a Sentry
 */
function sendToSentry(errorLog: ErrorLog): void {
  if (typeof Sentry === 'undefined') return

  const level = errorLog.severity === 'critical' ? 'fatal' : errorLog.severity

  Sentry.captureException(new Error(errorLog.message), {
    level: level as any,
    tags: {
      type: errorLog.type,
    },
    contexts: {
      error: {
        ...errorLog.context,
      },
    },
  })
}

/**
 * Enviar error al servidor
 */
async function sendErrorToServer(errorLog: ErrorLog): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorLog),
    })
  } catch (error) {
    console.error('Failed to send error log:', error)
  }
}

/**
 * Notificar a canal de alertas
 */
async function notifyAlertChannel(
  type: string,
  message: string
): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    await fetch('/api/alerts/critical', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        message,
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to send alert:', error)
  }
}

/**
 * Decorador para wrappear funciones con error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  errorType: string = 'FunctionError'
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args)

      // Si es Promise, agregar catch
      if (result instanceof Promise) {
        return result.catch((error: Error) => {
          logError(errorType, error.message, error.stack)
          throw error
        })
      }

      return result
    } catch (error) {
      const err = error as Error
      logError(errorType, err.message, err.stack)
      throw error
    }
  }) as T
}

/**
 * Error Boundary para React
 */
export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    fallback?: React.ReactNode
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(
      'ReactBoundaryError',
      error.message,
      errorInfo.componentStack,
      'error'
    )

    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                Algo salió mal
              </h1>
              <p className="text-red-700 mb-4">{this.state.error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Recargar Página
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

// Global type declarations
declare global {
  interface Window {
    Sentry?: any
  }

  var Sentry: any
}

// Exportar React para usar en ErrorBoundary
import React from 'react'
