'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface FeaturedBurger {
  id: string
  name: string
  restaurant_name: string
  city: string
  imagen_principal: string | null
  ranking_score: number
  simple_average: number
  total_ratings: number
  featured_order: number
}

export default function FeaturedCarousel() {
  const [burgers, setBurgers] = useState<FeaturedBurger[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    fetchFeaturedBurgers()
  }, [])

  // Auto-rotate cada 5 segundos
  useEffect(() => {
    if (!isAutoPlaying || burgers.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % burgers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, burgers.length])

  const fetchFeaturedBurgers = async () => {
    try {
      const response = await fetch('/api/featured')
      if (response.ok) {
        const data = await response.json()
        setBurgers(data)
      }
    } catch (error) {
      console.error('Error fetching featured burgers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % burgers.length)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume autoplay after 10s
  }

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + burgers.length) % burgers.length)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div className="skeleton" style={{ height: '12rem', borderRadius: '0.75rem' }}></div>
      </div>
    )
  }

  if (burgers.length === 0) {
    return null
  }

  return (
    <section style={{ width: '100%', marginBottom: '1.5rem' }}>
      {/* Header - Mobile optimized */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>★</span>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#fbbf24',
            margin: 0,
          }}>
            Destacadas
          </h2>
        </div>
        <div style={{
          flex: 1,
          height: '2px',
          background: 'linear-gradient(90deg, #fbbf24 0%, transparent 100%)',
        }}></div>
      </div>

      {/* Carousel Container - Touch friendly */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        borderRadius: '1rem',
        padding: '0.75rem',
        border: '1px solid rgba(251, 191, 36, 0.3)',
      }}>
        {/* Main Slide */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {burgers.map((burger) => (
              <div key={burger.id} style={{ minWidth: '100%', flexShrink: 0 }}>
                <Link href={`/restaurante/${encodeURIComponent(burger.restaurant_name)}`}>
                  <div style={{ position: 'relative', cursor: 'pointer' }}>
                    {/* Image Container - Mobile height */}
                    <div style={{
                      position: 'relative',
                      height: '14rem', // Más pequeño en móvil
                      background: '#1f2937',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                    }}>
                      {burger.imagen_principal ? (
                        <Image
                          src={burger.imagen_principal}
                          alt={burger.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority={burger.featured_order === 1}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                        }}>
                          <span style={{ fontSize: '4rem' }}>🍔</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                      }}></div>
                      
                      {/* Badge Destacada */}
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        color: '#1a1a1a',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
                      }}>
                        <Star className="w-3 h-3" style={{ fill: '#1a1a1a' }} />
                        DESTACADA
                      </div>

                      {/* Content Overlay - Mobile optimized text */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1rem',
                        color: 'white',
                      }}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          marginBottom: '0.25rem',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {burger.name}
                        </h3>
                        <p style={{
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          color: '#fbbf24',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        }}>
                          {burger.restaurant_name}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          flexWrap: 'wrap',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4"
                                style={{
                                  fill: star <= Math.round(burger.simple_average) ? '#fbbf24' : 'transparent',
                                  color: star <= Math.round(burger.simple_average) ? '#fbbf24' : '#6b7280',
                                }}
                              />
                            ))}
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', marginLeft: '0.25rem' }}>
                              {burger.simple_average.toFixed(1)}
                            </span>
                          </div>
                          <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                            ({burger.total_ratings} valoraciones)
                          </span>
                        </div>
                        <div style={{
                          display: 'inline-block',
                          background: 'rgba(251, 191, 36, 0.9)',
                          color: '#1a1a1a',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          minHeight: '2.5rem',
                          lineHeight: '1.5rem',
                        }}>
                          Ver más →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Bigger touch targets */}
        {burgers.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: '0.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#1a1a1a',
                borderRadius: '50%',
                padding: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10,
                minWidth: '2.5rem',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Anterior"
            >
              <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '0.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#1a1a1a',
                borderRadius: '50%',
                padding: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                zIndex: 10,
                minWidth: '2.5rem',
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Siguiente"
            >
              <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </>
        )}

        {/* Dots Navigation - Touch friendly */}
        {burgers.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.25rem',
          }}>
            {burgers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  height: '0.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  width: index === currentIndex ? '2rem' : '0.5rem',
                  background: index === currentIndex ? '#fbbf24' : '#4b5563',
                  minHeight: '2rem', // Touch target invisible pero clickeable
                  marginTop: '-0.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  backgroundClip: 'content-box',
                }}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
