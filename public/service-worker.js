// Service Worker para BurgeRank PWA
// Versión: 1.0.0

const CACHE_NAME_STATIC = 'burgerank-static-v1'
const CACHE_NAME_DYNAMIC = 'burgerank-dynamic-v1'
const CACHE_NAME_IMAGES = 'burgerank-images-v1'
const OFFLINE_PAGE = '/offline.html'

const STATIC_ASSETS = [
  '/',
  '/ranking',
  '/search',
  '/about',
  '/offline.html',
  '/manifest.json',
  // CSS, JS se cachean automáticamente
]

// Install event - cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

// Activate event - limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME_STATIC &&
            cacheName !== CACHE_NAME_DYNAMIC &&
            cacheName !== CACHE_NAME_IMAGES
          ) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - estrategias de cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Images - Stale While Revalidate
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidateStrategy(request))
    return
  }

  // Archivos estáticos - Cache First
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Páginas - Network First con fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, OFFLINE_PAGE))
    return
  }

  // Default - Network First
  event.respondWith(networkFirstStrategy(request))
})

// Network First Strategy
async function networkFirstStrategy(request, fallbackUrl) {
  try {
    const response = await fetch(request)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Cachear respuesta exitosa
    const cache = await caches.open(CACHE_NAME_DYNAMIC)
    cache.put(request, response.clone())

    return response
  } catch (error) {
    // Intentar obtener del cache
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }

    // Fallback
    if (fallbackUrl) {
      return caches.match(fallbackUrl)
    }

    // Error response
    return new Response('Offline - No cached data available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' }),
    })
  }
}

// Cache First Strategy
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)

    if (!response.ok) {
      throw new Error('Network request failed')
    }

    const cache = await caches.open(CACHE_NAME_STATIC)
    cache.put(request, response.clone())

    return response
  } catch (error) {
    return new Response('Resource not available', {
      status: 404,
      statusText: 'Not Found',
    })
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (!response.ok) {
      return response
    }

    // Actualizar cache en background
    const cache = caches.open(CACHE_NAME_IMAGES)
    cache.then((c) => c.put(request, response.clone()))

    return response
  })

  return cached || fetchPromise
}

// Background Sync para reviews pendientes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncPendingReviews())
  }
})

async function syncPendingReviews() {
  try {
    const db = await openIndexedDB()
    const pendingReviews = await getPendingReviews(db)

    for (const review of pendingReviews) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(review),
        })

        if (response.ok) {
          await markReviewSynced(db, review.id)
        }
      } catch (error) {
        console.error('Failed to sync review:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body || 'Nueva notificación de BurgeRank',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      ...data,
    },
  }

  event.waitUntil(self.registration.showNotification(data.title || 'BurgeRank', options))
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Buscar ventana existente
      for (let client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus()
        }
      }

      // Abrir nueva ventana si no existe
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url)
      }
    })
  )
})

// Periodic Background Sync (actualizar datos)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateAppData())
  }
})

async function updateAppData() {
  try {
    const response = await fetch('/api/app-data')
    if (response.ok) {
      const data = await response.json()
      // Guardar en IndexedDB
      const db = await openIndexedDB()
      await saveAppData(db, data)
    }
  } catch (error) {
    console.error('Failed to update app data:', error)
  }
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BurgeRank', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('app-data')) {
        db.createObjectStore('app-data', { keyPath: 'key' })
      }
    }
  })
}

async function getPendingReviews(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reviews', 'readonly')
    const store = transaction.objectStore('reviews')
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () =>
      resolve(request.result.filter((r) => r.synced === false))
  })
}

async function markReviewSynced(db, id) {
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

async function saveAppData(db, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('app-data', 'readwrite')
    const store = transaction.objectStore('app-data')
    const request = store.put({ key: 'app-data', value: data, timestamp: Date.now() })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
