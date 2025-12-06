import { useEffect, useState, useCallback, useRef } from 'react'

interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
}

interface NearbyBurger {
  id: string
  name: string
  restaurantId: string
  restaurantName: string
  distance: number
  rating: number
  latitude: number
  longitude: number
}

interface NearbyRestaurant {
  id: string
  name: string
  distance: number
  rating: number
  latitude: number
  longitude: number
  address: string
}

interface GeolocationError {
  code: number
  message: string
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN'
}

const CACHE_KEY = 'burgerank_geolocation_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Haversine formula para calcular distancia entre dos puntos
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useGeolocationAdvanced() {
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const watchIdRef = useRef<number | null>(null)
  const cacheRef = useRef<{ coords: GeolocationCoordinates; timestamp: number } | null>(null)

  // Verificar si geolocalización está soportada
  useEffect(() => {
    const supported = 'geolocation' in navigator
    setIsSupported(supported)
  }, [])

  // Función para obtener posición actual
  const getCurrentPosition = useCallback(
    (options?: PositionOptions): Promise<GeolocationCoordinates> => {
      return new Promise((resolve, reject) => {
        if (!isSupported) {
          const err: GeolocationError = {
            code: 0,
            message: 'Geolocalización no soportada en este navegador',
            type: 'UNKNOWN',
          }
          setError(err)
          reject(err)
          return
        }

        // Verificar cache
        if (cacheRef.current) {
          const now = Date.now()
          if (now - cacheRef.current.timestamp < CACHE_DURATION) {
            resolve(cacheRef.current.coords)
            return
          }
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            }

            // Guardar en cache
            cacheRef.current = { coords, timestamp: Date.now() }

            setCoordinates(coords)
            setHasPermission(true)
            setLoading(false)
            resolve(coords)
          },
          (error) => {
            const geoError: GeolocationError = {
              code: error.code,
              message: error.message,
              type:
                error.code === 1
                  ? 'PERMISSION_DENIED'
                  : error.code === 2
                    ? 'POSITION_UNAVAILABLE'
                    : error.code === 3
                      ? 'TIMEOUT'
                      : 'UNKNOWN',
            }

            if (error.code === 1) {
              setHasPermission(false)
            }

            setError(geoError)
            setLoading(false)
            reject(geoError)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            ...options,
          }
        )
      })
    },
    [isSupported]
  )

  // Función para monitorear cambios de posición
  const watchPosition = useCallback(
    (
      onSuccess: (coords: GeolocationCoordinates) => void,
      onError?: (error: GeolocationError) => void,
      options?: PositionOptions
    ) => {
      if (!isSupported) {
        const err: GeolocationError = {
          code: 0,
          message: 'Geolocalización no soportada',
          type: 'UNKNOWN',
        }
        onError?.(err)
        return
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          }

          cacheRef.current = { coords, timestamp: Date.now() }
          setCoordinates(coords)
          onSuccess(coords)
        },
        (error) => {
          const geoError: GeolocationError = {
            code: error.code,
            message: error.message,
            type:
              error.code === 1
                ? 'PERMISSION_DENIED'
                : error.code === 2
                  ? 'POSITION_UNAVAILABLE'
                  : error.code === 3
                    ? 'TIMEOUT'
                    : 'UNKNOWN',
          }
          setError(geoError)
          onError?.(geoError)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options,
        }
      )
    },
    [isSupported]
  )

  // Detener monitoreo
  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  // Obtener burgers cercanas
  const getNearbyBurgers = useCallback(
    async (
      radius: number = 10, // km
      filters?: { minRating?: number; maxPrice?: number }
    ): Promise<NearbyBurger[]> => {
      if (!coordinates) {
        throw new Error('Ubicación no disponible')
      }

      try {
        const response = await fetch('/api/geolocation/burgers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            radius,
            filters,
          }),
        })

        if (!response.ok) throw new Error('Error obteniendo burgers cercanas')

        const burgers: NearbyBurger[] = await response.json()

        // Calcular distancia real para cada burger
        return burgers
          .map((burger) => ({
            ...burger,
            distance: calculateDistance(
              coordinates.latitude,
              coordinates.longitude,
              burger.latitude,
              burger.longitude
            ),
          }))
          .filter((burger) => burger.distance <= radius)
          .sort((a, b) => a.distance - b.distance)
      } catch (err) {
        console.error('Error getting nearby burgers:', err)
        throw err
      }
    },
    [coordinates]
  )

  // Obtener restaurantes cercanos
  const getNearbyRestaurants = useCallback(
    async (radius: number = 10): Promise<NearbyRestaurant[]> => {
      if (!coordinates) {
        throw new Error('Ubicación no disponible')
      }

      try {
        const response = await fetch('/api/geolocation/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            radius,
          }),
        })

        if (!response.ok) throw new Error('Error obteniendo restaurantes cercanos')

        const restaurants: NearbyRestaurant[] = await response.json()

        return restaurants
          .map((restaurant) => ({
            ...restaurant,
            distance: calculateDistance(
              coordinates.latitude,
              coordinates.longitude,
              restaurant.latitude,
              restaurant.longitude
            ),
          }))
          .filter((restaurant) => restaurant.distance <= radius)
          .sort((a, b) => a.distance - b.distance)
      } catch (err) {
        console.error('Error getting nearby restaurants:', err)
        throw err
      }
    },
    [coordinates]
  )

  return {
    coordinates,
    error,
    loading,
    isSupported,
    hasPermission,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    getNearbyBurgers,
    getNearbyRestaurants,
    calculateDistance,
  }
}
