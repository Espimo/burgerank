const CACHE_NAME = 'burgerank-v2';
const urlsToCache = [
  '/offline.html',
  '/manifest.json'
];

// Solo cachear assets estáticos, NO páginas HTML
const STATIC_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('BurgeRank SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('BurgeRank SW: Cache failed', err);
      })
  );
  // Activate worker immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('BurgeRank SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first for everything, cache static assets only
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  const url = new URL(event.request.url);
  
  // NEVER intercept API calls - let them go directly to server
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // NEVER intercept Supabase calls
  if (url.hostname.includes('supabase')) {
    return;
  }
  
  // For navigation requests (HTML pages), always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // Check if this is a static asset we should cache
  const isStaticAsset = STATIC_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
  
  if (isStaticAsset) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
    );
    return;
  }
  
  // For everything else, network first
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// Handle push notifications (future)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización en BurgeRank',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Ver ranking' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BurgeRank 🍔', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/ranking')
    );
  }
});
