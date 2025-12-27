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
      <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  if (burgers.length === 0) {
    return null // No mostrar nada si no hay burgers destacadas
  }

  return (
    <section className="w-full mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌟</span>
          <h2 className="text-2xl font-bold text-gray-900">Destacadas</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 shadow-lg">
        {/* Main Slide */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {burgers.map((burger) => (
              <div key={burger.id} className="min-w-full flex-shrink-0">
                <Link href={`/restaurante/${encodeURIComponent(burger.restaurant_name)}`}>
                  <div className="relative group cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-80 md:h-96 bg-gray-900 rounded-xl overflow-hidden">
                      {burger.imagen_principal ? (
                        <Image
                          src={burger.imagen_principal}
                          alt={burger.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                          priority={burger.featured_order === 1}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <span className="text-8xl">🍔</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Badge Destacada */}
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                        <Star className="w-4 h-4 fill-white" />
                        DESTACADA
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                          {burger.name}
                        </h3>
                        <p className="text-xl md:text-2xl mb-3 text-amber-300 drop-shadow-lg">
                          {burger.restaurant_name}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(burger.simple_average)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                            <span className="font-bold text-lg ml-1">
                              {burger.simple_average.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-gray-300">
                            ({burger.total_ratings} valoraciones)
                          </span>
                        </div>
                        <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-6 py-2 rounded-full font-semibold group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
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

        {/* Navigation Arrows */}
        {burgers.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {burgers.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {burgers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-amber-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Autoplay Indicator */}
        {isAutoPlaying && burgers.length > 1 && (
          <div className="absolute bottom-8 right-6 text-xs text-white/60 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Auto-rotación activa
          </div>
        )}
      </div>
    </section>
  )
}
