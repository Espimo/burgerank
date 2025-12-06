'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => Promise<void> | void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null)
  const lastCallTime = useRef<number>(0)
  const debounceDelay = 200

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && hasMore && !isLoading) {
        const now = Date.now()
        if (now - lastCallTime.current > debounceDelay) {
          lastCallTime.current = now
          onLoadMore()
        }
      }
    },
    [hasMore, isLoading, onLoadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '50px',
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [handleIntersection])

  return observerTarget
}
