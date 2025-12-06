'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface SkipToContentProps {
  mainContentId?: string
}

/**
 * Componente Skip To Content (visible solo con Tab)
 * Permite a usuarios de screen readers saltar al contenido principal
 */
export function SkipToContent({ mainContentId = 'main-content' }: SkipToContentProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // Asegurarse de que el elemento target existe
    const target = document.getElementById(mainContentId)
    if (!target) {
      console.warn(`⚠️ Skip-to-content target element not found: #${mainContentId}`)
    }

    // Hacer focusable con tabindex
    if (target) {
      target.setAttribute('tabindex', '-1')
    }
  }, [mainContentId])

  return (
    <a
      ref={linkRef}
      href={`#${mainContentId}`}
      onClick={(e) => {
        e.preventDefault()
        const target = document.getElementById(mainContentId)
        if (target) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-orange-600 focus:text-white focus:font-bold focus:rounded-b"
    >
      ⬇️ Saltar al contenido principal
    </a>
  )
}

export default SkipToContent
