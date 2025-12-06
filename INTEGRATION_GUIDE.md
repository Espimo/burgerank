/**
 * INTEGRATION GUIDE - Funcionalidades Avanzadas
 * 
 * Este archivo demuestra cómo integrar todas las funcionalidades avanzadas
 * en tu aplicación BurgeRank.
 */

// ============================================================================
// 1. CONFIGURAR EN app/layout.tsx
// ============================================================================

import { RootLayout } from '@/app/layout'
import {
  AnalyticsProvider,
  CookieConsentManager,
  SkipToContent,
  InstallPrompt,
  ErrorBoundary,
  initializeAccessibility,
  initializeErrorLogging,
} from '@/lib/advanced-features'
import { useEffect } from 'react'

/**
 * Configuración en RootLayout
 */
export function IntegrateInRootLayout() {
  useEffect(() => {
    // Inicializar sistemas globales
    initializeAccessibility()
    initializeErrorLogging(
      process.env.NEXT_PUBLIC_SENTRY_DSN,
      undefined, // userId se pasa cuando está disponible
      undefined, // sessionId
      (errorLog) => {
        // Callback personalizado si es necesario
        console.error('📋 Error logged:', errorLog)
      }
    )
  }, [])

  return (
    <ErrorBoundary>
      <AnalyticsProvider
        googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
        userId={undefined} // Pasar userId cuando esté disponible
        enableDebug={process.env.NODE_ENV === 'development'}
        cookieConsent={{ analytics: true, marketing: false }}
      >
        <SkipToContent mainContentId="main-content" />
        <InstallPrompt />
        <CookieConsentManager />
        {/* Contenido de la app */}
      </AnalyticsProvider>
    </ErrorBoundary>
  )
}

// ============================================================================
// 2. USAR GEOLOCALIZACIÓN EN COMPONENTES
// ============================================================================

import { useGeolocationAdvanced } from '@/lib/advanced-features'
import { LocationPermissionModal } from '@/components/shared/location-permission-modal'
import { useState, useEffect } from 'react'

export function BurgerMapExample() {
  const {
    coordinates,
    error,
    loading,
    getNearbyBurgers,
    requestPermission,
  } = useGeolocationAdvanced()
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [nearbyBurgers, setNearbyBurgers] = useState([])

  const handleGetNearby = async () => {
    if (!coordinates) {
      setShowPermissionModal(true)
      return
    }

    const burgers = await getNearbyBurgers(5, {
      minRating: 8,
    })
    setNearbyBurgers(burgers)
  }

  return (
    <>
      <button onClick={handleGetNearby} disabled={loading}>
        {loading ? '⏳ Buscando...' : '📍 Burgers Cercanas'}
      </button>

      {error && <p>Error: {error}</p>}

      {showPermissionModal && (
        <LocationPermissionModal
          onAllow={requestPermission}
          onDismiss={() => setShowPermissionModal(false)}
        />
      )}

      <div>
        {nearbyBurgers.map((burger) => (
          <div key={burger.id}>
            {burger.name} - {burger.distance.toFixed(1)}km
          </div>
        ))}
      </div>
    </>
  )
}

// ============================================================================
// 3. OPTIMIZAR IMÁGENES
// ============================================================================

import { OptimizedImage, LazyImage, ImageGallery } from '@/lib/advanced-features'

export function BurgerImageExample() {
  return (
    <>
      {/* Imagen optimizada con blur placeholder */}
      <OptimizedImage
        src="/burgers/amazing-burger.jpg"
        alt="Hamburguesa increíble"
        width={400}
        height={300}
        priority={false}
        quality={80}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      />

      {/* Lazy load cuando entra en viewport */}
      <LazyImage
        src="/burgers/lazy-burger.jpg"
        alt="Lazy burger"
        width={400}
        height={300}
        threshold={0.1}
      />

      {/* Galería automática */}
      <ImageGallery
        images={[
          { src: '/burgers/1.jpg', alt: 'Burger 1' },
          { src: '/burgers/2.jpg', alt: 'Burger 2' },
          { src: '/burgers/3.jpg', alt: 'Burger 3' },
        ]}
        width={300}
        height={300}
        columns={3}
      />
    </>
  )
}

// ============================================================================
// 4. TRACKEAR EVENTOS
// ============================================================================

import {
  trackBurgerRating,
  trackSearch,
  trackReviewSubmit,
  trackBadgeUnlocked,
  useAnalytics,
} from '@/lib/advanced-features'

export function BurgerRatingExample() {
  const { trackEvent, recordEvent } = useAnalytics()

  const handleRateBurger = (burgerId: string, rating: number) => {
    trackBurgerRating(burgerId, 'Delicious Burger', rating, {
      taste: rating,
      presentation: rating - 1,
      texture: rating,
    })
  }

  const handleReviewSubmit = (burgerId: string, hasImage: boolean) => {
    trackReviewSubmit(burgerId, 9, hasImage, true)
  }

  const handleSearchBurgers = (query: string, resultsCount: number) => {
    trackSearch(query, resultsCount, 'burgers')
  }

  const handleBadgeUnlock = () => {
    trackBadgeUnlocked('burger_master', 'Burger Master', 'Calificar 100 burgers')
  }

  return (
    <div>
      <button onClick={() => handleRateBurger('burger-1', 9)}>⭐ Calificar</button>
      <button onClick={() => handleReviewSubmit('burger-1', true)}>💬 Review</button>
      <button onClick={() => handleSearchBurgers('delicious', 42)}>🔍 Buscar</button>
      <button onClick={handleBadgeUnlock}>🏆 Unlock Badge</button>
    </div>
  )
}

// ============================================================================
// 5. PERFORMANCE MONITORING
// ============================================================================

import {
  PerformanceObserver,
  usePerformanceMonitoring,
} from '@/lib/advanced-features'

export function PerformanceExample() {
  return (
    <>
      {/* Monitoreo global en layout */}
      <PerformanceObserver
        enableLogging={true}
        reportInterval={30000}
        onDegradation={(metric) => {
          console.warn(`⚠️ Performance degradation: ${metric}`)
        }}
      />
    </>
  )
}

export function ComponentWithPerformanceTracking() {
  // En componente individual
  usePerformanceMonitoring({
    customThresholds: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
    enableLogging: true,
  })

  return <div>Mi componente optimizado</div>
}

// ============================================================================
// 6. CACHE STRATEGY
// ============================================================================

import {
  cacheRankingData,
  getRankingData,
  useSWR,
  dedupeRequest,
} from '@/lib/advanced-features'

export async function CacheExample() {
  // Cachear datos de ranking
  const rankingData = { burgers: [...], restaurants: [...] }
  cacheRankingData('ranking-page', rankingData)

  // Recuperar del cache
  const cached = getRankingData('ranking-page')

  // Usar SWR pattern
  const data = await useSWR(
    'top-burgers',
    () => fetch('/api/burgers/top').then((r) => r.json()),
    { ttl: 5 * 60 * 1000 }
  )

  // Deduplicar requests
  const users = await dedupeRequest('users-list', () =>
    fetch('/api/users').then((r) => r.json())
  )
}

// ============================================================================
// 7. A/B TESTING
// ============================================================================

import {
  defineABTest,
  assignVariant,
  recordABTestConversion,
  getWinningVariant,
} from '@/lib/advanced-features'

export function ABTestingExample() {
  // Definir test
  defineABTest('homepage-v2', ['control', 'variant-a', 'variant-b'])

  // Asignar variante a usuario
  const variant = assignVariant('homepage-v2', 'user-123')

  // Mostrar contenido según variante
  const homepageContent = {
    control: <ControlHomepage />,
    'variant-a': <HomepageVariantA />,
    'variant-b': <HomepageVariantB />,
  }

  // Registrar conversión
  const handleConversion = () => {
    recordABTestConversion(
      'homepage-v2',
      variant!,
      45000, // session duration ms
      false  // bounced
    )
  }

  // Obtener variante ganadora
  const winner = getWinningVariant('homepage-v2')
  if (winner) {
    console.log(`✅ Winner: ${winner.variant} (${winner.improvement.toFixed(1)}% improvement)`)
  }

  return homepageContent[variant as keyof typeof homepageContent]
}

// ============================================================================
// 8. ERROR HANDLING
// ============================================================================

import { withErrorHandling, logError } from '@/lib/advanced-features'

// Decorador para funciones
const safeApiFetch = withErrorHandling(
  async (url: string) => {
    const response = await fetch(url)
    return response.json()
  },
  'APIFetchError'
)

// Logging manual
export function ErrorHandlingExample() {
  const handleComplexOperation = async () => {
    try {
      const data = await safeApiFetch('/api/complex')
      return data
    } catch (error) {
      logError(
        'ComplexOperationFailed',
        (error as Error).message,
        (error as Error).stack,
        'critical'
      )
    }
  }

  return <button onClick={handleComplexOperation}>Operación Compleja</button>
}

// ============================================================================
// 9. SEO
// ============================================================================

import {
  generateMetadata,
  generateBurgerStructuredData,
  injectMetaTags,
  injectStructuredData,
} from '@/lib/advanced-features'

export async function BurgerDetailPage({ params }: any) {
  const burger = await fetchBurger(params.id)

  // Generar metadata
  const metadata = generateMetadata(
    `${burger.name} - BurgeRank`,
    `Descubre las opiniones sobre ${burger.name}`,
    {
      keywords: ['burger', burger.restaurantName, 'rating'],
      image: burger.image,
      url: `/burger/${burger.id}`,
      type: 'product',
    }
  )

  // Inyectar en head
  useEffect(() => {
    injectMetaTags(metadata)

    // Structured data
    const structuredData = generateBurgerStructuredData({
      id: burger.id,
      name: burger.name,
      description: burger.description,
      image: burger.image,
      rating: burger.rating,
      ratingCount: burger.ratingCount,
      restaurantName: burger.restaurantName,
      price: burger.price,
    })

    injectStructuredData(structuredData)
  }, [burger])

  return <div>{burger.name}</div>
}

// ============================================================================
// 10. ACCESIBILIDAD
// ============================================================================

import { SkipToContent, announceToScreenReader } from '@/lib/advanced-features'

export function AccessibleApp() {
  return (
    <>
      <SkipToContent mainContentId="main-content" />
      <main id="main-content">
        <AccessibleBurgerForm />
      </main>
    </>
  )
}

export function AccessibleBurgerForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    announceToScreenReader('✅ Review enviado exitosamente', 'polite')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="rating">Calificación:</label>
      <input
        id="rating"
        type="number"
        min={1}
        max={10}
        aria-label="Calificación del burger"
      />
      <button type="submit">Enviar Review</button>
    </form>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  IntegrateInRootLayout,
  BurgerMapExample,
  BurgerImageExample,
  BurgerRatingExample,
  PerformanceExample,
  ComponentWithPerformanceTracking,
  CacheExample,
  ABTestingExample,
  ErrorHandlingExample,
  BurgerDetailPage,
  AccessibleApp,
}
