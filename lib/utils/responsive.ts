'use client'

import { useCallback, useEffect, useState } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const

export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery =
      breakpoint === 'mobile'
        ? window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`)
        : breakpoint === 'tablet'
          ? window.matchMedia(`(max-width: ${BREAKPOINTS.tablet}px)`)
          : window.matchMedia(`(min-width: ${BREAKPOINTS.tablet + 1}px)`)

    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [breakpoint])

  return matches
}

export function useResponsive() {
  const isMobile = useMediaQuery('mobile')
  const isTablet = useMediaQuery('tablet')
  const isDesktop = !isTablet

  return { isMobile, isTablet, isDesktop }
}

export const responsive = {
  isMobile: () => typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.mobile,
  isTablet: () =>
    typeof window !== 'undefined' &&
    window.innerWidth >= BREAKPOINTS.mobile &&
    window.innerWidth < BREAKPOINTS.tablet,
  isDesktop: () => typeof window !== 'undefined' && window.innerWidth >= BREAKPOINTS.tablet,
}
