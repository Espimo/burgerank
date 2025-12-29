'use client'

import { useState, useEffect } from 'react'
import { createAdminClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Star, X, Search, GripVertical } from 'lucide-react'

interface Burger {
  id: string
  name: string
  restaurant_name: string
  city: string
  imagen_principal: string | null
  simple_average: number
  total_ratings: number
  is_featured: boolean
  featured_order: number | null
}

interface FeaturedSlot {
  order: number
  burger: Burger | null
}

// Helper function to format burgers with city names
const formatBurgersWithCities = async (data: any[], supabase: any) => {
  const cityIds = [...new Set(data.map((b: any) => b.restaurants?.city_id).filter(Boolean))];
  let cityMap = new Map<string, string>();
  
  if (cityIds.length > 0) {
    const { data: cities } = await supabase
      .from('cities')
      .select('id, name')
      .in('id', cityIds);
    
    if (cities) {
      cityMap = new Map(cities.map((c: any) => [c.id, c.name]));
    }
  }
  
  return data.map((b: any) => ({
    id: b.id,
    name: b.name,
    restaurant_name: b.restaurants?.name || '',
    city: cityMap.get(b.restaurants?.city_id) || '',
    imagen_principal: b.image_url,
    simple_average: b.average_rating || 0,
    total_ratings: b.total_ratings || 0,
    is_featured: b.is_featured,
    featured_order: b.featured_order,
  }));
}

export default function FeaturedManagement() {
  const [featuredSlots, setFeaturedSlots] = useState<FeaturedSlot[]>([
    { order: 1, burger: null },
    { order: 2, burger: null },
    { order: 3, burger: null },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [availableBurgers, setAvailableBurgers] = useState<Burger[]>([])
  const [recommendations, setRecommendations] = useState<Burger[]>([])

  useEffect(() => {
    loadFeaturedBurgers()
    loadRecommendations()
  }, [])

  const loadFeaturedBurgers = async () => {
    try {
      const supabase = createAdminClient()
      const { data, error } = await (supabase as any)
        .from('burgers')
        .select(`
          id,
          name,
          image_url,
          average_rating,
          total_ratings,
          is_featured,
          featured_order,
          restaurants!inner(id, name, city_id)
        `)
        .eq('is_featured', true)
        .order('featured_order', { ascending: true })

      if (error) throw error

      const formatted = await formatBurgersWithCities(data || [], supabase)

      // Asignar a slots
      const newSlots = [1, 2, 3].map(order => ({
        order,
        burger: formatted.find((b: Burger) => b.featured_order === order) || null,
      }))
      
      setFeaturedSlots(newSlots)
    } catch (error) {
      console.error('Error loading featured burgers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      const supabase = createAdminClient()
      
      // Top burgers sin destacar
      const { data, error } = await (supabase as any)
        .from('burgers')
        .select(`
          id,
          name,
          image_url,
          average_rating,
          total_ratings,
          is_featured,
          featured_order,
          created_at,
          restaurants!inner(id, name, city_id)
        `)
        .eq('is_in_ranking', true)
        .eq('is_featured', false)
        .order('ranking_score', { ascending: false })
        .limit(10)

      if (error) throw error

      const formatted = await formatBurgersWithCities(data || [], supabase)

      setRecommendations(formatted)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const loadAvailableBurgers = async () => {
    try {
      const supabase = createAdminClient()
      const { data, error } = await (supabase as any)
        .from('burgers')
        .select(`
          id,
          name,
          image_url,
          average_rating,
          total_ratings,
          is_featured,
          featured_order,
          restaurants!inner(id, name, city_id)
        `)
        .eq('is_in_ranking', true)
        .ilike('name', `%${searchQuery}%`)
        .order('ranking_score', { ascending: false })
        .limit(20)

      if (error) throw error

      const formatted = await formatBurgersWithCities(data || [], supabase)

      setAvailableBurgers(formatted)
    } catch (error) {
      console.error('Error loading burgers:', error)
    }
  }

  useEffect(() => {
    if (showSelector) {
      loadAvailableBurgers()
    }
  }, [searchQuery, showSelector])

  const handleSelectBurger = async (burger: Burger) => {
    if (selectedSlot === null) return

    setIsSaving(true)
    try {
      const supabase = createAdminClient()

      // Quitar el burger anterior del slot si existe
      const previousBurger = featuredSlots[selectedSlot - 1].burger
      if (previousBurger) {
        await (supabase as any)
          .from('burgers')
          .update({ is_featured: false, featured_order: null })
          .eq('id', previousBurger.id)
      }

      // Si el burger ya está featured en otro slot, quitarlo
      if (burger.is_featured && burger.featured_order) {
        await (supabase as any)
          .from('burgers')
          .update({ is_featured: false, featured_order: null })
          .eq('id', burger.id)
      }

      // Asignar al nuevo slot
      const { error } = await (supabase as any)
        .from('burgers')
        .update({ 
          is_featured: true, 
          featured_order: selectedSlot 
        })
        .eq('id', burger.id)

      if (error) throw error

      // Actualizar estado local
      const newSlots = [...featuredSlots]
      newSlots[selectedSlot - 1] = {
        order: selectedSlot,
        burger: { ...burger, is_featured: true, featured_order: selectedSlot },
      }
      setFeaturedSlots(newSlots)

      setShowSelector(false)
      setSelectedSlot(null)
      loadRecommendations() // Recargar recomendaciones
    } catch (error) {
      console.error('Error updating featured burger:', error)
      alert('Error al actualizar. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveBurger = async (slotOrder: number) => {
    const slot = featuredSlots.find(s => s.order === slotOrder)
    if (!slot || !slot.burger) return

    setIsSaving(true)
    try {
      const supabase = createAdminClient()
      const { error } = await (supabase as any)
        .from('burgers')
        .update({ is_featured: false, featured_order: null })
        .eq('id', slot.burger.id)

      if (error) throw error

      // Actualizar estado local
      const newSlots = [...featuredSlots]
      newSlots[slotOrder - 1] = { order: slotOrder, burger: null }
      setFeaturedSlots(newSlots)

      loadRecommendations() // Recargar recomendaciones
    } catch (error) {
      console.error('Error removing featured burger:', error)
      alert('Error al quitar. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const openSelector = (slotOrder: number) => {
    setSelectedSlot(slotOrder)
    setSearchQuery('')
    setShowSelector(true)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
          Gestión de Burgers Destacadas
        </h1>
        <p className="text-gray-400">
          Selecciona las 3 hamburguesas que aparecerán en el carousel del ranking principal
        </p>
      </div>

      {/* Featured Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {featuredSlots.map((slot) => (
          <div
            key={slot.order}
            className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700 hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                  {slot.order}
                </div>
                <span className="font-semibold text-white">Posición {slot.order}</span>
              </div>
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>

            {slot.burger ? (
              <div className="space-y-3">
                {/* Preview */}
                <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden">
                  {slot.burger.imagen_principal ? (
                    <Image
                      src={slot.burger.imagen_principal}
                      alt={slot.burger.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍔
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-bold text-white text-lg">{slot.burger.name}</h3>
                  <p className="text-sm text-gray-400">{slot.burger.restaurant_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(slot.burger!.simple_average)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      ({slot.burger.total_ratings})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openSelector(slot.order)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                    disabled={isSaving}
                  >
                    Cambiar
                  </button>
                  <button
                    onClick={() => handleRemoveBurger(slot.order)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    disabled={isSaving}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">🍔</div>
                <button
                  onClick={() => openSelector(slot.order)}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 py-3 px-6 rounded-lg font-bold transition-colors"
                  disabled={isSaving}
                >
                  + Añadir Burger
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          💡 Recomendaciones
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Top 10 burgers sin destacar, ordenadas por ranking
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((burger) => (
            <div
              key={burger.id}
              className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedSlot(featuredSlots.find(s => !s.burger)?.order || 1)
                handleSelectBurger(burger)
              }}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {burger.imagen_principal ? (
                    <Image
                      src={burger.imagen_principal}
                      alt={burger.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍔
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">
                    {burger.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {burger.restaurant_name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-300">
                      {burger.simple_average.toFixed(1)} ({burger.total_ratings})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Seleccionar Burger para Posición {selectedSlot}
                </h2>
                <button
                  onClick={() => setShowSelector(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableBurgers.map((burger) => (
                  <div
                    key={burger.id}
                    onClick={() => handleSelectBurger(burger)}
                    className="bg-gray-900 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer border-2 border-transparent hover:border-amber-500"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {burger.imagen_principal ? (
                          <Image
                            src={burger.imagen_principal}
                            alt={burger.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🍔
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white mb-1">{burger.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {burger.restaurant_name} • {burger.city}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(burger.simple_average)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            ({burger.total_ratings})
                          </span>
                        </div>
                        {burger.is_featured && (
                          <div className="mt-2 inline-block bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded">
                            Ya destacada (Pos. {burger.featured_order})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {availableBurgers.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>No se encontraron burgers</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
