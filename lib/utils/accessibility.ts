export interface AccessibilityOptions {
  highContrast?: boolean
  largeText?: boolean
  reducedMotion?: boolean
  screenReaderMode?: boolean
}

/**
 * Anunciar a screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return

  // Crear o encontrar live region
  let liveRegion = document.querySelector('[aria-live]')

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only' // Oculto visualmente
    document.body.appendChild(liveRegion)
  }

  // Actualizar mensaje
  liveRegion.textContent = message
  liveRegion.setAttribute('aria-live', priority)

  // Limpiar después de anuncio
  setTimeout(() => {
    liveRegion!.textContent = ''
  }, 1000)
}

/**
 * Trapear focus dentro de modal
 */
export function trapFocus(containerElement: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input[type="text"]:not([disabled])',
    'input[type="radio"]:not([disabled])',
    'input[type="checkbox"]:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]

  const focusableElements = Array.from(
    containerElement.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    const isTabPressed = e.key === 'Tab'

    if (!isTabPressed) return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  containerElement.addEventListener('keydown', handleKeyDown)

  // Focus en primer elemento
  firstElement?.focus()

  // Retornar función para limpiar
  return () => {
    containerElement.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Manejar focus al cambiar ruta
 */
export function manageFocusOnRouteChange(): void {
  if (typeof window === 'undefined') return

  // Buscar elemento main o contenedor principal
  const main = document.querySelector('main') || document.querySelector('[role="main"]')

  if (main) {
    main.setAttribute('tabindex', '-1')
    ;(main as HTMLElement).focus()

    // Anunciar cambio de página
    const pageTitle = document.querySelector('h1')?.textContent || 'Nueva página'
    announceToScreenReader(`Navegado a ${pageTitle}`)
  }
}

/**
 * Verificar preferencia de movimiento reducido
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Verificar preferencia de alto contraste
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-contrast: more)').matches
}

/**
 * Verificar si es modo oscuro
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Obtener preferencias de accesibilidad
 */
export function getUserAccessibilityPreferences(): AccessibilityOptions {
  return {
    reducedMotion: prefersReducedMotion(),
    highContrast: prefersHighContrast(),
    screenReaderMode:
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('a11y_screen_reader_mode') === 'true'
        : false,
    largeText:
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('a11y_large_text') === 'true'
        : false,
  }
}

/**
 * Aplicar configuración de accesibilidad
 */
export function applyAccessibilitySettings(options: AccessibilityOptions): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Alto contraste
  if (options.highContrast) {
    root.classList.add('high-contrast')
  } else {
    root.classList.remove('high-contrast')
  }

  // Texto grande
  if (options.largeText) {
    root.classList.add('large-text')
    root.style.fontSize = '18px'
  } else {
    root.classList.remove('large-text')
    root.style.fontSize = ''
  }

  // Movimiento reducido
  if (options.reducedMotion) {
    root.classList.add('reduce-motion')
  } else {
    root.classList.remove('reduce-motion')
  }

  // Guardar preferencias
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('a11y_high_contrast', String(options.highContrast))
    localStorage.setItem('a11y_large_text', String(options.largeText))
    localStorage.setItem('a11y_screen_reader_mode', String(options.screenReaderMode))
  }
}

/**
 * Agregar atributos ARIA a elemento
 */
export function setAriaAttributes(
  element: HTMLElement,
  attributes: Record<string, string>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(`aria-${key}`, value)
  })
}

/**
 * Validar accesibilidad de elementos
 */
export function validateElementAccessibility(element: HTMLElement): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Verificar alt text en imágenes
  if (element.tagName === 'IMG') {
    const img = element as HTMLImageElement
    if (!img.alt || img.alt.trim() === '') {
      issues.push('❌ Image missing alt text')
    }
  }

  // Verificar labels en inputs
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
    const input = element as HTMLInputElement
    const label = document.querySelector(`label[for="${input.id}"]`)

    if (!label && !input.getAttribute('aria-label')) {
      issues.push('⚠️ Form input missing label')
    }
  }

  // Verificar contraste de color
  const styles = window.getComputedStyle(element)
  const color = styles.color
  const bgColor = styles.backgroundColor

  if (color && bgColor) {
    const contrast = calculateColorContrast(color, bgColor)
    if (contrast < 4.5) {
      issues.push('⚠️ Low color contrast (< 4.5:1)')
    }
  }

  // Verificar heading hierarchy
  if (element.tagName.match(/^H[1-6]$/)) {
    const headingLevel = parseInt(element.tagName[1])
    const previousHeadings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).filter((h) => h.compareDocumentPosition(element) === Node.DOCUMENT_POSITION_PRECEDING)

    if (previousHeadings.length > 0) {
      const maxPreviousLevel = Math.max(
        ...previousHeadings.map((h) => parseInt(h.tagName[1]))
      )
      if (headingLevel > maxPreviousLevel + 1) {
        issues.push('⚠️ Heading hierarchy broken')
      }
    }
  }

  return {
    valid: issues.filter((i) => i.startsWith('❌')).length === 0,
    issues,
  }
}

/**
 * Calcular contraste de color (WCAG)
 */
function calculateColorContrast(foreground: string, background: string): number {
  const fgLuminance = getRelativeLuminance(foreground)
  const bgLuminance = getRelativeLuminance(background)

  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Calcular luminancia relativa (WCAG)
 */
function getRelativeLuminance(color: string): number {
  const rgb = parseRGB(color)
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255]

  const [rs, gs, bs] = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Parsear color RGB
 */
function parseRGB(color: string): { r: number; g: number; b: number } {
  const match = color.match(/\d+/g)
  return {
    r: parseInt(match?.[0] || '0'),
    g: parseInt(match?.[1] || '0'),
    b: parseInt(match?.[2] || '0'),
  }
}

/**
 * Inicializar accesibilidad
 */
export function initializeAccessibility(): void {
  if (typeof window === 'undefined') return

  // Aplicar preferencias guardadas
  const preferences = getUserAccessibilityPreferences()
  applyAccessibilitySettings(preferences)

  // Escuchar cambios de preferencias del sistema
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeQuery.addEventListener('change', (e) => {
    console.log('Dark mode preference changed:', e.matches)
  })

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
  })

  console.log('♿ Accessibility initialized')
}
