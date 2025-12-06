'use client'

import { useEffect, useRef } from 'react'
import {
  initializePerformanceMonitoring,
  getPerformanceMetrics,
  PerformanceMetrics,
  PerformanceThresholds,
  analyzeResources,
  monitorMemoryUsage,
} from '@/lib/utils/performance-monitoring'

interface PerformanceObserverProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  onDegradation?: (metric: string) => void
  customThresholds?: Partial<PerformanceThresholds>
  enableLogging?: boolean
  reportInterval?: number // ms
}

/**
 * Componente que monitorea performance usando Performance Observer API
 */
export function PerformanceObserver({
  onMetricsUpdate,
  onDegradation,
  customThresholds,
  enableLogging = false,
  reportInterval = 30000, // 30 segundos
}: PerformanceObserverProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const memoryMonitorRef = useRef<any>(null)

  useEffect(() => {
    // Inicializar monitoreo
    initializePerformanceMonitoring(customThresholds, onMetricsUpdate, onDegradation)

    // Logging periódico
    if (enableLogging) {
      intervalRef.current = setInterval(() => {
        const metrics = getPerformanceMetrics()
        const resources = analyzeResources()

        console.group('📊 Performance Metrics')
        console.table(metrics)
        console.log('Resources:', resources)
        console.groupEnd()

        // Monitorear memory
        if (memoryMonitorRef.current) {
          const growth = memoryMonitorRef.current.getGrowth()
          if (growth > 50 * 1024 * 1024) {
            // > 50MB
            console.warn('⚠️ Potential memory leak detected:', growth / 1024 / 1024, 'MB')
          }
        }
      }, reportInterval)

      // Iniciar monitoreo de memoria
      memoryMonitorRef.current = monitorMemoryUsage()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [onMetricsUpdate, onDegradation, customThresholds, enableLogging, reportInterval])

  return null
}

/**
 * Hook para usar en componentes
 */
export function usePerformanceMonitoring(
  options?: PerformanceObserverProps
) {
  const metricsRef = useRef<PerformanceMetrics>({
    longTasks: 0,
    layoutShifts: 0,
  })

  useEffect(() => {
    initializePerformanceMonitoring(
      options?.customThresholds,
      (metrics) => {
        metricsRef.current = metrics
        options?.onMetricsUpdate?.(metrics)
      },
      options?.onDegradation
    )
  }, [options])

  return metricsRef
}

/**
 * Hook para medir duración de renders
 */
export function useRenderDuration(componentName: string) {
  const renderCountRef = useRef(0)
  const lastRenderTimeRef = useRef<number>(0)

  useEffect(() => {
    renderCountRef.current++
    const now = performance.now()

    if (lastRenderTimeRef.current > 0) {
      const duration = now - lastRenderTimeRef.current

      if (duration > 16.67) {
        // Más de 1 frame @ 60fps
        console.warn(
          `⚠️ Slow render in ${componentName}: ${duration.toFixed(2)}ms (${renderCountRef.current} renders)`
        )
      }
    }

    lastRenderTimeRef.current = now
  })

  return renderCountRef.current
}

/**
 * Hook para detectar long tasks
 */
export function useLongTaskDetector(threshold: number = 50) {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return

    let longTaskCount = 0

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.duration > threshold) {
            longTaskCount++
            console.warn(
              `⚠️ Long task detected (${longTaskCount}): ${entry.duration.toFixed(0)}ms`
            )
          }
        })
      })

      observer.observe({ entryTypes: ['longtask', 'measure'] })

      return () => observer.disconnect()
    } catch (e) {
      console.debug('Long task detection not available')
    }
  }, [threshold])
}

/**
 * Hook para monitorear mutation del DOM
 */
export function useDOMMutationMonitoring(
  targetSelector: string = 'body',
  onMutationBurst?: (count: number) => void
) {
  useEffect(() => {
    const target = document.querySelector(targetSelector)
    if (!target) return

    let mutationCount = 0
    let mutationTimeout: NodeJS.Timeout | null = null

    const observer = new MutationObserver(() => {
      mutationCount++

      // Alerta si hay muchas mutaciones en corto tiempo
      if (mutationCount > 100) {
        console.warn(`⚠️ DOM mutation burst detected: ${mutationCount} mutations`)
        onMutationBurst?.(mutationCount)
        mutationCount = 0
      }

      if (mutationTimeout) clearTimeout(mutationTimeout)
      mutationTimeout = setTimeout(() => {
        mutationCount = 0
      }, 1000)
    })

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: false,
    })

    return () => {
      observer.disconnect()
      if (mutationTimeout) clearTimeout(mutationTimeout)
    }
  }, [targetSelector, onMutationBurst])
}

/**
 * Hook para monitorear cambios de scroll
 */
export function useScrollPerformance() {
  const isScrollingRef = useRef(false)
  const scrollCountRef = useRef(0)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null

    const handleScroll = () => {
      isScrollingRef.current = true
      scrollCountRef.current++

      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false
        console.log(`Scroll events in last cycle: ${scrollCountRef.current}`)
        scrollCountRef.current = 0
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  return { isScrolling: isScrollingRef.current, scrollCount: scrollCountRef.current }
}

/**
 * Hook para monitorear animaciones
 */
export function useAnimationPerformance() {
  useEffect(() => {
    if (!('requestIdleCallback' in window)) return

    const animationFrames: number[] = []
    let frameCount = 0
    let lastTime = performance.now()

    const measureFrame = () => {
      const currentTime = performance.now()
      const frameTime = currentTime - lastTime

      animationFrames.push(frameTime)
      frameCount++
      lastTime = currentTime

      // Cada 60 frames, calcular FPS
      if (frameCount >= 60) {
        const avgFrameTime = animationFrames.reduce((a, b) => a + b) / animationFrames.length
        const fps = 1000 / avgFrameTime

        if (fps < 50) {
          console.warn(`⚠️ Low FPS detected: ${fps.toFixed(1)} fps`)
        }

        animationFrames.length = 0
        frameCount = 0
      }

      requestAnimationFrame(measureFrame)
    }

    const id = requestAnimationFrame(measureFrame)

    return () => cancelAnimationFrame(id)
  }, [])
}

/**
 * Hook para monitorear eventos de usuario
 */
export function useUserEventPerformance() {
  useEffect(() => {
    const events = {
      clicks: 0,
      inputs: 0,
      touches: 0,
    }

    const handleClick = () => {
      events.clicks++
    }

    const handleInput = () => {
      events.inputs++
    }

    const handleTouch = () => {
      events.touches++
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('input', handleInput)
    window.addEventListener('touchstart', handleTouch)

    // Reportar cada 10 segundos
    const interval = setInterval(() => {
      if (Object.values(events).some((v) => v > 0)) {
        console.log('👆 User Events:', events)
        Object.keys(events).forEach((key) => {
          events[key as keyof typeof events] = 0
        })
      }
    }, 10000)

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('input', handleInput)
      window.removeEventListener('touchstart', handleTouch)
      clearInterval(interval)
    }
  }, [])
}

/**
 * Hook para detectar network throttling
 */
export function useNetworkMonitoring() {
  useEffect(() => {
    if (!('connection' in navigator)) return

    const connection = (navigator as any).connection

    const handleChange = () => {
      const info = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }

      console.log('🌐 Network Info:', info)

      if (connection.saveData) {
        console.log('💾 Data saver mode detected')
      }

      if (connection.effectiveType === '4g') {
        console.log('📶 Fast 4G connection')
      } else if (connection.effectiveType === '3g') {
        console.warn('⚠️ Slower 3G connection')
      }
    }

    connection.addEventListener('change', handleChange)

    return () => {
      connection.removeEventListener('change', handleChange)
    }
  }, [])
}
