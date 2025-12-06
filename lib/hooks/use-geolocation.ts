'use client'

import { useEffect, useState, useCallback } from 'react'

interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en este navegador')
      setIsLoading(false)
      return
    }

    const successCallback = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      })
      setError(null)
      setIsLoading(false)
    }

    const errorCallback = (err: GeolocationPositionError) => {
      const errorMessages: Record<number, string> = {
        1: 'Permiso denegado para acceder a la ubicación',
        2: 'Posición no disponible',
        3: 'Tiempo de espera agotado',
      }
      setError(errorMessages[err.code] || 'Error desconocido')
      setIsLoading(false)
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: options.enableHighAccuracy ?? false,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 300000,
    })
  }, [options])

  const calculateDistance = useCallback(
    (lat: number, lng: number): number | null => {
      if (!coords) return null

      const R = 6371 // Radio de la Tierra en km
      const dLat = ((lat - coords.latitude) * Math.PI) / 180
      const dLng = ((lng - coords.longitude) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords.latitude * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },
    [coords]
  )

  return { coords, error, isLoading, calculateDistance }
}
