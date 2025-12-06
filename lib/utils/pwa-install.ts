export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}

export interface PWAInstallationState {
  isInstallable: boolean
  isInstalled: boolean
  prompt: PWAInstallPrompt | null
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
}

let installPrompt: PWAInstallPrompt | null = null
let installationState: PWAInstallationState = {
  isInstallable: false,
  isInstalled: false,
  prompt: null,
  platform: 'unknown',
}

// Detectar plataforma
export function getPlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
  const ua = navigator.userAgent

  if (/iPhone|iPad|iPod/.test(ua)) {
    return 'ios'
  } else if (/Android/.test(ua)) {
    return 'android'
  } else if (/Windows|Macintosh|Linux/.test(ua)) {
    return 'desktop'
  }

  return 'unknown'
}

// Inicializar PWA
export function initializePWA(): void {
  installationState.platform = getPlatform()
  checkInstallationStatus()
  setupInstallPromptListener()
}

// Verificar si está instalado
function checkInstallationStatus(): void {
  if (typeof window === 'undefined') return

  // Verificar si es PWA instalada
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installationState.isInstalled = true
  }

  // Para iOS, verificar modo fullscreen
  if (
    installationState.platform === 'ios' &&
    window.navigator.standalone === true
  ) {
    installationState.isInstalled = true
  }

  // Verificar en localStorage
  const savedState = localStorage.getItem('pwa_installed')
  if (savedState === 'true') {
    installationState.isInstalled = true
  }
}

// Setup del listener para beforeinstallprompt
function setupInstallPromptListener(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    installPrompt = e as BeforeInstallPromptEvent
    installationState.isInstallable = true
    installationState.prompt = installPrompt

    // Disparar evento para mostrar el prompt personalizado
    window.dispatchEvent(new CustomEvent('pwa-installable', { detail: installationState }))
  })

  // Escuchar instalación
  window.addEventListener('appinstalled', () => {
    installationState.isInstalled = true
    installationState.isInstallable = false
    installPrompt = null
    localStorage.setItem('pwa_installed', 'true')

    // Disparar evento de instalación
    window.dispatchEvent(new CustomEvent('pwa-installed'))

    // Registrar con analytics
    trackPWAInstallation()
  })
}

// Mostrar prompt de instalación
export async function showInstallPrompt(): Promise<boolean> {
  if (!installPrompt) {
    console.warn('Install prompt not available')
    return false
  }

  try {
    installPrompt.prompt()

    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      trackPWAInstallation('user_accepted')
      return true
    } else {
      trackPWAInstallation('user_dismissed')
      return false
    }
  } catch (error) {
    console.error('Error showing install prompt:', error)
    return false
  }
}

// Obtener estado actual
export function getPWAInstallationState(): PWAInstallationState {
  checkInstallationStatus()
  return installationState
}

// Verificar si es instalable
export function isInstallable(): boolean {
  return installationState.isInstallable && !installationState.isInstalled
}

// Verificar si está instalado
export function isInstalled(): boolean {
  return installationState.isInstalled
}

// Registrar Service Worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none',
    })

    console.log('Service Worker registered:', registration)

    // Verificar updates periódicamente
    setInterval(() => {
      registration.update()
    }, 60000) // Cada minuto

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

// Unregister Service Worker
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    const results = await Promise.all(registrations.map((r) => r.unregister()))
    return results.every((r) => r === true)
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
    return false
  }
}

// Sincronizar en background
export async function registerBackgroundSync(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync not supported')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.sync.register(tag)
    console.log('Background sync registered:', tag)
    return true
  } catch (error) {
    console.error('Background sync registration failed:', error)
    return false
  }
}

// Sincronizar reviews offline
export async function syncOfflineReviews(): Promise<boolean> {
  try {
    // Obtener reviews pendientes de IndexedDB
    const db = await openIndexedDB()
    const pendingReviews = await getPendingReviewsFromDB(db)

    if (pendingReviews.length === 0) {
      return true
    }

    // Sincronizar cada review
    let successCount = 0
    for (const review of pendingReviews) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review),
        })

        if (response.ok) {
          await markReviewSyncedInDB(db, review.id)
          successCount++
        }
      } catch (error) {
        console.error('Failed to sync review:', review.id, error)
      }
    }

    return successCount === pendingReviews.length
  } catch (error) {
    console.error('Error syncing offline reviews:', error)
    return false
  }
}

// Instrucciones específicas por plataforma
export function getInstallationInstructions(): string {
  const platform = installationState.platform

  switch (platform) {
    case 'ios':
      return `
        Para instalar BurgeRank en iOS:
        1. Abre Safari
        2. Toca el botón Compartir (↑)
        3. Selecciona "Agregar a Pantalla de Inicio"
        4. Toca "Agregar" en la esquina superior derecha
      `

    case 'android':
      return `
        Para instalar BurgeRank en Android:
        1. Toca el botón de menú (⋮)
        2. Selecciona "Instalar aplicación"
        3. Confirma en el diálogo de instalación
      `

    case 'desktop':
      return `
        Para instalar BurgeRank en tu computadora:
        1. Busca el ícono de instalación en la barra de direcciones
        2. O abre el menú (⋮) y selecciona "Instalar BurgeRank"
      `

    default:
      return 'Instala BurgeRank directamente desde tu navegador'
  }
}

// Analytics tracking
function trackPWAInstallation(outcome?: string): void {
  if (typeof window === 'undefined') return

  const event = new CustomEvent('pwa-install-event', {
    detail: {
      timestamp: new Date(),
      platform: installationState.platform,
      outcome: outcome || 'installed',
    },
  })

  window.dispatchEvent(event)

  // Enviar a analytics si está disponible
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_install', {
      platform: installationState.platform,
      outcome: outcome || 'installed',
    })
  }
}

// IndexedDB helpers
async function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BurgeRank', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result as IDBDatabase
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'id' })
      }
    }
  })
}

async function getPendingReviewsFromDB(db: IDBDatabase): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reviews', 'readonly')
    const store = transaction.objectStore('reviews')
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () =>
      resolve(request.result.filter((r) => r.synced === false))
  })
}

async function markReviewSyncedInDB(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reviews', 'readwrite')
    const store = transaction.objectStore('reviews')
    const request = store.get(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const review = request.result
      review.synced = true
      const updateRequest = store.put(review)
      updateRequest.onerror = () => reject(updateRequest.error)
      updateRequest.onsuccess = () => resolve()
    }
  })
}
