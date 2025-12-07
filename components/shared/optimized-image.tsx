'use client'

import Image from 'next/image'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  priority?: boolean
  sizes?: string
  quality?: number
  className?: string
  containerClassName?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholder = 'blur',
  blurDataURL,
  priority = false,
  sizes,
  quality = 80,
  className,
  containerClassName,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Precarga de imagen si está en viewport
    if (!priority && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.href = src
            document.head.appendChild(link)
          }
        },
        { rootMargin: '50px' }
      )

      observer.observe(containerRef.current)

      return () => observer.disconnect()
    }
  }, [src, priority])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Default blur placeholder
  const defaultBlurDataURL =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=='

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-gray-100', containerClassName)}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder && !hasError ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        sizes={
          sizes ||
          '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        }
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        className={cn(
          'object-cover object-center transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
      />

      {/* Skeleton loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-sm text-gray-600">No se pudo cargar la imagen</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface LazyImageProps extends OptimizedImageProps {
  threshold?: number
}

/**
 * Versión lazy-loaded de OptimizedImage
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldLoad) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [shouldLoad, threshold])

  return (
    <div ref={ref} className={props.containerClassName}>
      {shouldLoad ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          {...props}
        />
      ) : (
        // Placeholder skeleton mientras no está en viewport
        <div
          className="bg-gray-200 animate-pulse"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      )}
    </div>
  )
}

interface ResponsiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  mobileSrc?: string
  tabletSrc?: string
  desktopSrc?: string
  blurDataURL?: string
  className?: string
  containerClassName?: string
}

/**
 * Imagen responsiva con diferentes fuentes por breakpoint
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  mobileSrc,
  tabletSrc,
  desktopSrc,
  ...props
}: ResponsiveImageProps) {
  return (
    <picture>
      {desktopSrc && (
        <source media="(min-width: 1024px)" srcSet={desktopSrc} />
      )}
      {tabletSrc && (
        <source media="(min-width: 640px)" srcSet={tabletSrc} />
      )}
      {mobileSrc && <source media="(max-width: 639px)" srcSet={mobileSrc} />}

      <div>
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          {...props}
        />
      </div>
    </picture>
  )
}

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    blurDataURL?: string
  }>
  width: number
  height: number
  gap?: number
  columns?: number
  className?: string
}

/**
 * Galería de imágenes optimizadas
 */
export function ImageGallery({
  images,
  width,
  height,
  gap = 4,
  columns = 3,
  className,
}: ImageGalleryProps) {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${width}px, 1fr))`,
        gap: `${gap * 4}px`,
      }}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={`${image.src}-${index}`}
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          blurDataURL={image.blurDataURL}
          priority={index < columns}
        />
      ))}
    </div>
  )
}
