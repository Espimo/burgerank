export interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number // Time to live en ms
  tag?: string
}

export interface CacheOptions {
  ttl?: number // ms
  tag?: string
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  entries: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    entries: 0,
  }
  private maxSize = 50 * 1024 * 1024 // 50MB
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup automático cada 5 minutos
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 5 * 60 * 1000)
    }
  }

  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const { ttl = 5 * 60 * 1000, tag } = options // Default 5 min
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
      tag,
    }

    // Estimar tamaño (aproximado)
    const size = JSON.stringify(entry).length * 2 // UTF-16

    // Verificar límite
    if (this.stats.size + size > this.maxSize) {
      this.evictLRU()
    }

    this.cache.set(key, entry)
    this.stats.size += size
    this.stats.entries = this.cache.size
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    // Verificar si expiró
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.stats.entries = this.cache.size
      this.stats.misses++
      return null
    }

    this.stats.hits++
    return entry.value
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.stats.entries = this.cache.size
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.stats.size = 0
    this.stats.entries = 0
  }

  invalidateByTag(tag: string): number {
    let count = 0
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tag === tag) {
        this.cache.delete(key)
        count++
      }
    }
    this.stats.entries = this.cache.size
    return count
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  private evictLRU(): void {
    // Encontrar entry más antigua
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.stats.entries = this.cache.size
    }
  }

  private cleanup(): void {
    const now = Date.now()
    let removed = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      this.stats.entries = this.cache.size
      console.debug(`🧹 Cleaned up ${removed} expired cache entries`)
    }
  }
}

// Instancia global
const memoryCache = new MemoryCache()

/**
 * Cache para datos del ranking
 * TTL: 5 minutos
 */
export function cacheRankingData<T>(key: string, value: T): void {
  memoryCache.set(key, value, {
    ttl: 5 * 60 * 1000,
    tag: 'ranking',
  })
}

export function getRankingData<T>(key: string): T | null {
  return memoryCache.get<T>(key)
}

export function invalidateRankingCache(): void {
  memoryCache.invalidateByTag('ranking')
}

/**
 * Cache para estadísticas
 * TTL: 10 minutos
 */
export function cacheStatistics<T>(key: string, value: T): void {
  memoryCache.set(key, value, {
    ttl: 10 * 60 * 1000,
    tag: 'statistics',
  })
}

export function getStatistics<T>(key: string): T | null {
  return memoryCache.get<T>(key)
}

export function invalidateStatisticsCache(): void {
  memoryCache.invalidateByTag('statistics')
}

/**
 * Cache para burgers
 * TTL: 1 hora
 */
export function cacheBurgerData<T>(key: string, value: T): void {
  memoryCache.set(key, value, {
    ttl: 60 * 60 * 1000,
    tag: 'burgers',
  })
}

export function getBurgerData<T>(key: string): T | null {
  return memoryCache.get<T>(key)
}

export function invalidateBurgerCache(): void {
  memoryCache.invalidateByTag('burgers')
}

/**
 * Cache genérico
 */
export function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): void {
  memoryCache.set(key, value, options)
}

export function getCache<T>(key: string): T | null {
  return memoryCache.get<T>(key)
}

export function hasCache(key: string): boolean {
  return memoryCache.has(key)
}

export function deleteCache(key: string): boolean {
  return memoryCache.delete(key)
}

export function clearAllCache(): void {
  memoryCache.clear()
}

export function getCacheStats(): CacheStats {
  return memoryCache.getStats()
}

/**
 * SWR (Stale-While-Revalidate) pattern
 */
export async function useSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; revalidateInterval?: number } = {}
): Promise<T> {
  const { ttl = 5 * 60 * 1000, revalidateInterval = 30 * 1000 } = options

  // Retornar del cache si existe
  const cached = getCache<T>(key)
  if (cached) {
    // Revalidar en background
    setTimeout(() => {
      fetcher()
        .then((fresh) => {
          setCache(key, fresh, { ttl })
        })
        .catch((error) => {
          console.error('SWR revalidation failed:', error)
        })
    }, 0)

    return cached
  }

  // Si no existe, buscar y cachear
  try {
    const data = await fetcher()
    setCache(key, data, { ttl })
    return data
  } catch (error) {
    console.error('SWR fetch failed:', error)
    throw error
  }
}

/**
 * Request deduplication
 */
const pendingRequests = new Map<string, Promise<any>>()

export async function dedupeRequest<T>(
  key: string,
  request: () => Promise<T>
): Promise<T> {
  // Si hay una request pendiente con la misma key, retornarla
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }

  // Crear nueva request
  const promise = request()
    .then((result) => {
      pendingRequests.delete(key)
      return result
    })
    .catch((error) => {
      pendingRequests.delete(key)
      throw error
    })

  pendingRequests.set(key, promise)
  return promise
}

/**
 * HTTP Cache Headers builder
 */
export function buildCacheHeaders(ttl: number): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${ttl / 1000}`,
    'ETag': `"${Date.now()}"`,
    'Last-Modified': new Date().toUTCString(),
    'Vary': 'Accept-Encoding',
  }
}

/**
 * CDN Cache headers (para Vercel KV o Redis)
 */
export function buildCDNCacheHeaders(ttl: number): Record<string, string> {
  return {
    'Cache-Control': `public, s-maxage=${ttl / 1000}, stale-while-revalidate=${ttl / 1000}`,
    'CDN-Cache-Control': `max-age=${ttl / 1000}`,
  }
}

/**
 * Integración con Redis/Vercel KV (si está disponible)
 */
export async function getRedisCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 min
): Promise<T> {
  try {
    // Intentar usar Vercel KV si está disponible
    if (typeof process !== 'undefined' && process.env.KV_REST_API_URL) {
      // Este código corre en servidor
      const redis = await import('@vercel/kv').then((m) => m.kv)

      const cached = await redis.get(key)
      if (cached) {
        return cached as T
      }

      const fresh = await fetcher()
      await redis.setex(key, ttl, fresh)
      return fresh
    }
  } catch (error) {
    console.debug('Redis not available, using memory cache:', error)
  }

  // Fallback a memory cache
  return useSWR(key, fetcher, { ttl })
}

/**
 * Warmup cache (precarga de datos críticos)
 */
export async function warmupCache<T>(
  keys: Array<{ key: string; fetcher: () => Promise<T> }>,
  concurrency: number = 3
): Promise<void> {
  const queue = [...keys]
  const active: Promise<any>[] = []

  while (queue.length > 0 || active.length > 0) {
    while (active.length < concurrency && queue.length > 0) {
      const { key, fetcher } = queue.shift()!

      const promise = dedupeRequest(key, fetcher)
        .then((data) => {
          setCache(key, data)
        })
        .catch((error) => {
          console.error(`Failed to warmup cache for key: ${key}`, error)
        })

      active.push(promise)
    }

    if (active.length > 0) {
      await Promise.race(active)
      active.splice(
        active.findIndex((p) => p),
        1
      )
    }
  }

  console.log('✅ Cache warmup completed')
}

/**
 * Cache invalidation scheduler
 */
export function scheduleInvalidation(
  tag: string,
  interval: number // ms
): NodeJS.Timeout {
  return setInterval(() => {
    memoryCache.invalidateByTag(tag)
    console.log(`🔄 Invalidated cache with tag: ${tag}`)
  }, interval)
}
