'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import {
  initializeAnalytics,
  trackPageView,
  setUserProperties,
  UserProperties,
} from '@/lib/analytics/events'
import {
  startSession,
  endSession,
  recordPageView,
  recordUserEvent,
} from '@/lib/analytics/user-behavior'
import { usePathname } from 'next/navigation'

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  trackPageView: (pageName: string) => void
  setUserProperties: (properties: Partial<UserProperties>) => void
  recordEvent: (eventName: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
)

interface AnalyticsProviderProps {
  children: React.ReactNode
  googleAnalyticsId?: string
  userId?: string
  enableDebug?: boolean
  cookieConsent?: {
    analytics: boolean
    marketing: boolean
  }
}

/**
 * Provider de Analytics con consentimiento de cookies
 */
export function AnalyticsProvider({
  children,
  googleAnalyticsId,
  userId,
  enableDebug = false,
  cookieConsent = { analytics: true, marketing: false },
}: AnalyticsProviderProps) {
  const sessionIdRef = useRef<string>('')
  const pathname = usePathname()
  const prevPathnameRef = useRef<string>('')

  useEffect(() => {
    // Generar session ID único
    sessionIdRef.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Inicializar solo si hay consentimiento de analytics
    if (cookieConsent.analytics) {
      initializeAnalytics(googleAnalyticsId, userId)
      startSession(sessionIdRef.current, userId)

      if (enableDebug) {
        console.log('📊 Analytics Provider initialized')
      }
    }

    // Cleanup al desmontar
    return () => {
      if (cookieConsent.analytics) {
        endSession(sessionIdRef.current)
      }
    }
  }, [googleAnalyticsId, userId, cookieConsent.analytics, enableDebug])

  // Trackear cambios de página
  useEffect(() => {
    if (pathname !== prevPathnameRef.current && cookieConsent.analytics) {
      prevPathnameRef.current = pathname
      recordPageView(sessionIdRef.current, pathname)
      trackPageView(pathname)

      if (enableDebug) {
        console.log(`📄 Page View: ${pathname}`)
      }
    }
  }, [pathname, cookieConsent.analytics, enableDebug])

  const contextValue: AnalyticsContextType = {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      if (cookieConsent.analytics) {
        // Implementar con la función de tracking de eventos
        if (enableDebug) {
          console.log(`📈 Event: ${eventName}`, properties)
        }
      }
    },
    trackPageView: (pageName: string) => {
      if (cookieConsent.analytics) {
        recordPageView(sessionIdRef.current, pageName)
        trackPageView(pageName)
      }
    },
    setUserProperties: (properties: Partial<UserProperties>) => {
      if (cookieConsent.analytics) {
        setUserProperties(properties)
      }
    },
    recordEvent: (eventName: string) => {
      if (cookieConsent.analytics) {
        recordUserEvent(sessionIdRef.current, eventName)
      }
    },
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook para usar Analytics en componentes
 */
export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }

  return context
}

/**
 * Componente para gestionar consentimiento de cookies
 */
interface CookieConsentProps {
  onConsentChange?: (consent: { analytics: boolean; marketing: boolean }) => void
  storageKey?: string
}

export function CookieConsentManager({
  onConsentChange,
  storageKey = 'burgerank_cookie_consent',
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = React.useState(false)
  const [consent, setConsent] = React.useState({
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Verificar consentimiento guardado
    const saved = localStorage.getItem(storageKey)
    if (!saved && typeof window !== 'undefined') {
      setShowBanner(true)
    } else if (saved) {
      setConsent(JSON.parse(saved))
    }
  }, [storageKey])

  const handleAcceptAll = () => {
    const newConsent = { analytics: true, marketing: true }
    setConsent(newConsent)
    localStorage.setItem(storageKey, JSON.stringify(newConsent))
    onConsentChange?.(newConsent)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const newConsent = { analytics: false, marketing: false }
    setConsent(newConsent)
    localStorage.setItem(storageKey, JSON.stringify(newConsent))
    onConsentChange?.(newConsent)
    setShowBanner(false)
  }

  const handleAcceptAnalytics = () => {
    const newConsent = { ...consent, analytics: true }
    setConsent(newConsent)
    localStorage.setItem(storageKey, JSON.stringify(newConsent))
    onConsentChange?.(newConsent)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">🍪 Gestión de Cookies</h3>
          <p className="text-sm text-gray-300">
            Usamos cookies para mejorar tu experiencia. Puedes controlar qué cookies
            aceptas.
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleRejectAll}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Rechazar Todo
          </button>

          <button
            onClick={handleAcceptAnalytics}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Solo Analítica
          </button>

          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 rounded transition"
          >
            Aceptar Todo
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para trackear eventos en componentes
 */
export function useTrackEvent(eventName: string, properties?: Record<string, any>) {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent(eventName, properties)
  }, [eventName, properties, trackEvent])
}

/**
 * HOC para wrappear componentes con tracking automático
 */
export function withAnalyticsTracking<P extends object>(
  Component: React.ComponentType<P>,
  eventName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEvent } = useAnalytics()

    useEffect(() => {
      trackEvent(eventName)
    }, [trackEvent])

    return <Component {...props} />
  }
}
