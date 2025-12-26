'use client'

import { useState, useEffect, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import RegistrationPromptModal from '@/app/components/RegistrationPromptModal'
import { useAdmin } from '@/app/contexts/AdminContext'
import { useAuth } from '@/app/contexts/AuthContext'
import { AdminBadge } from '@/app/components/AdminBadge'
import { createClient } from '@/lib/supabase/client'

// Type for burgers with ranking data
interface RankedBurger {
  id: string
  name: string
  description?: string
  image_url?: string
  ranking_position: number | null
  ranking_score: number
  average_rating: number
  total_reviews: number
  total_ratings: number
  verified_reviews_count: number
  is_in_ranking: boolean
  is_featured?: boolean
  tags?: string[]
  type?: string
  verified_percentage: number
  restaurant: {
    id: string
    name: string
    city_id: string
    cities: { id: string; name: string }
  }
}

interface CityData {
  id: string
  name: string
}

type SortMode = 'ranking' | 'nuevas' | 'tendencias'

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const { isAdmin } = useAdmin()
  const { authUser } = useAuth()
  
  // Filtros avanzados
  const [sortMode, setSortMode] = useState<SortMode>('ranking')
  const [showFilters, setShowFilters] = useState(false)
  const [panFilter, setPanFilter] = useState<number | null>(null)
  const [carneFilter, setCarneFilter] = useState<number | null>(null)
  const [salsaFilter, setSalsaFilter] = useState<number | null>(null)
  const [toppingsFilter, setToppingsFilter] = useState<number | null>(null)
  
  // Data from API
  const [rankedBurgers, setRankedBurgers] = useState<RankedBurger[]>([])
  const [featuredBurgers, setFeaturedBurgers] = useState<RankedBurger[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllBurgers, setShowAllBurgers] = useState(true) // Modo desarrollo: mostrar todas
  const [featuredIndex, setFeaturedIndex] = useState(0)
  
  // Load ranking data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Build query params for main ranking
      const params = new URLSearchParams()
      if (selectedCity) params.append('city', selectedCity)
      if (selectedType) params.append('type', selectedType)
      if (showAllBurgers) params.append('includeAll', 'true')
      params.append('sortBy', sortMode)
      params.append('limit', '50')
      
      // Cargar ranking y destacadas en paralelo
      const [rankingRes, featuredRes, citiesData] = await Promise.all([
        fetch(`/api/burgers/ranking?${params.toString()}`),
        fetch(`/api/burgers/ranking?featured=true`),
        createClient().from('cities').select('id, name').eq('status', 'approved')
      ])
      
      const rankingData = await rankingRes.json()
      const featuredData = await featuredRes.json()
      
      if (rankingData.burgers) {
        setRankedBurgers(rankingData.burgers)
      }
      
      if (featuredData.burgers) {
        setFeaturedBurgers(featuredData.burgers)
      }
      
      if (citiesData.data) {
        setCities(citiesData.data)
      }
    } catch (error) {
      console.error('Error loading ranking:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCity, selectedType, showAllBurgers, sortMode])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-rotate featured slider
  useEffect(() => {
    if (featuredBurgers.length > 1) {
      const interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % featuredBurgers.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredBurgers.length])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  // Filter burgers based on search
  const filteredBurgers = rankedBurgers.filter(burger => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return burger.name.toLowerCase().includes(query) ||
           burger.restaurant?.name?.toLowerCase().includes(query) ||
           burger.restaurant?.cities?.name?.toLowerCase().includes(query)
  })

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★')
      } else if (i === fullStars && hasHalf) {
        stars.push('★')
      } else {
        stars.push('☆')
      }
    }
    return stars.join('')
  }

  const getPositionBadge = (position: number | null, index: number) => {
    const pos = position || (index + 1)
    const isTop3 = pos <= 3
    const isTop10 = pos <= 10
    
    return {
      emoji: isTop3 ? ['🥇', '🥈', '🥉'][pos - 1] : `#${pos}`,
      background: isTop3 
        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
        : isTop10 
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : '#374151',
      color: isTop10 ? '#1a1a1a' : '#e5e7eb',
      shadow: isTop3 
        ? '0 2px 8px rgba(251, 191, 36, 0.3)'
        : isTop10
          ? '0 2px 8px rgba(239, 68, 68, 0.3)'
          : 'none'
    }
  }

  // Renderizar tags populares (máximo 4)
  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return null
    return (
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
        {tags.slice(0, 4).map((tag, i) => (
          <span 
            key={i}
            style={{
              padding: '0.15rem 0.4rem',
              fontSize: '0.65rem',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              color: '#fbbf24',
              borderRadius: '0.25rem',
              fontWeight: 500
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <TopBar onMenuClick={handleMenuClick} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <div className="main" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando ranking...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="container">
      <RegistrationPromptModal
        isOpen={showRegistrationModal && !authUser}
        onClose={() => setShowRegistrationModal(false)}
      />
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      {isAdmin && <AdminBadge />}

      <div className="main">
        {/* Header del Ranking */}
        <div className="ranking-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 className="ranking-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🏆 Ranking de Hamburguesas</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: showFilters ? '#fbbf24' : '#374151',
              color: showFilters ? '#1a1a1a' : '#e5e7eb',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            🎛️ Filtros
          </button>
        </div>

        {/* Slider de Destacadas */}
        {featuredBurgers.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fbbf24' }}>
              ⭐ Destacadas
            </div>
            <div style={{ 
              position: 'relative', 
              borderRadius: '0.75rem', 
              overflow: 'hidden',
              backgroundColor: '#1f2937',
              border: '1px solid #374151'
            }}>
              {/* Slider Container */}
              <div style={{
                display: 'flex',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(-${featuredIndex * 100}%)`
              }}>
                {featuredBurgers.map((burger, idx) => (
                  <div 
                    key={burger.id}
                    style={{ 
                      minWidth: '100%',
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    {/* Imagen Featured */}
                    <div style={{
                      width: '100px',
                      height: '80px',
                      borderRadius: '0.5rem',
                      flexShrink: 0,
                      background: burger.image_url 
                        ? `url(${burger.image_url}) center/cover`
                        : 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem'
                    }}>
                      {!burger.image_url && '🍔'}
                    </div>
                    {/* Info Featured */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {burger.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                        🏪 {burger.restaurant?.name} • 📍 {burger.restaurant?.cities?.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#fbbf24' }}>{renderStars(burger.average_rating || 0)}</span>
                        <span style={{ fontSize: '0.8rem' }}>{(burger.average_rating || 0).toFixed(1)}</span>
                      </div>
                    </div>
                    {/* Botón */}
                    <a 
                      href={authUser ? "/rate" : undefined}
                      onClick={(e) => {
                        if (!authUser) {
                          e.preventDefault()
                          setShowRegistrationModal(true)
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#fbbf24',
                        color: '#1a1a1a',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ⭐ Valorar
                    </a>
                  </div>
                ))}
              </div>
              {/* Dots */}
              {featuredBurgers.length > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  paddingBottom: '0.75rem' 
                }}>
                  {featuredBurgers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFeaturedIndex(idx)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: idx === featuredIndex ? '#fbbf24' : '#4b5563',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modos de ordenamiento */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['ranking', 'tendencias', 'nuevas'] as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #4b5563',
                backgroundColor: sortMode === mode ? '#fbbf24' : 'transparent',
                color: sortMode === mode ? '#1a1a1a' : '#e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: sortMode === mode ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {mode === 'ranking' && '🏆 Ranking'}
              {mode === 'tendencias' && '🔥 Tendencias'}
              {mode === 'nuevas' && '✨ Nuevas'}
            </button>
          ))}
        </div>

        {/* Filtros rápidos por ciudad */}
        <div className="ranking-filters" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button 
            className={`filter-btn ${selectedCity === '' ? 'active' : ''}`}
            onClick={() => setSelectedCity('')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #4b5563', 
              backgroundColor: selectedCity === '' ? '#fbbf24' : 'transparent',
              color: selectedCity === '' ? '#1a1a1a' : '#e5e7eb',
              borderRadius: '0.5rem', 
              cursor: 'pointer', 
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            📍 Todas
          </button>
          {cities.slice(0, 4).map(city => (
            <button 
              key={city.id}
              className={`filter-btn ${selectedCity === city.id ? 'active' : ''}`}
              onClick={() => setSelectedCity(city.id)}
              style={{ 
                padding: '0.5rem 1rem', 
                border: '1px solid #4b5563', 
                backgroundColor: selectedCity === city.id ? '#fbbf24' : 'transparent',
                color: selectedCity === city.id ? '#1a1a1a' : '#e5e7eb',
                borderRadius: '0.5rem', 
                cursor: 'pointer', 
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Panel de filtros avanzados */}
        {showFilters && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#1f2937', 
            borderRadius: '0.75rem', 
            marginBottom: '1rem',
            border: '1px solid #374151'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#e5e7eb' }}>
              🎛️ Filtros Avanzados
            </div>
            
            {/* Filtros de sección */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {/* Pan */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>
                  🍞 Pan
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setPanFilter(panFilter === n ? null : n)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        border: '1px solid #4b5563',
                        backgroundColor: panFilter === n ? '#fbbf24' : 'transparent',
                        color: panFilter === n ? '#1a1a1a' : '#e5e7eb',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Carne */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>
                  🥩 Carne
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setCarneFilter(carneFilter === n ? null : n)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        border: '1px solid #4b5563',
                        backgroundColor: carneFilter === n ? '#fbbf24' : 'transparent',
                        color: carneFilter === n ? '#1a1a1a' : '#e5e7eb',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Salsa */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>
                  🥫 Salsa
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setSalsaFilter(salsaFilter === n ? null : n)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        border: '1px solid #4b5563',
                        backgroundColor: salsaFilter === n ? '#fbbf24' : 'transparent',
                        color: salsaFilter === n ? '#1a1a1a' : '#e5e7eb',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Toppings */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>
                  🧀 Toppings
                </label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => setToppingsFilter(toppingsFilter === n ? null : n)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        border: '1px solid #4b5563',
                        backgroundColor: toppingsFilter === n ? '#fbbf24' : 'transparent',
                        color: toppingsFilter === n ? '#1a1a1a' : '#e5e7eb',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Limpiar filtros */}
            <button
              onClick={() => {
                setPanFilter(null)
                setCarneFilter(null)
                setSalsaFilter(null)
                setToppingsFilter(null)
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#374151',
                color: '#e5e7eb',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🗑️ Limpiar filtros
            </button>
          </div>
        )}

        {/* Toggle mostrar todas (solo en desarrollo) */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showAllBurgers}
              onChange={(e) => setShowAllBurgers(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            🛠️ Dev: Mostrar todas (incluso sin reviews)
          </label>
        </div>

        {/* Buscador */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <input 
            type="text" 
            className="search-input"
            placeholder="🔍 Busca hamburguesas, restaurantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Lista de Hamburguesas */}
        <div id="rankingList">
          {filteredBurgers.length > 0 ? (
            filteredBurgers.map((burger, index) => {
              const position = burger.ranking_position || (index + 1)
              const badge = getPositionBadge(burger.ranking_position, index)
              
              return (
                <div 
                  key={burger.id} 
                  className="card burger-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    marginBottom: '0.75rem', 
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '0',
                    overflow: 'hidden'
                  }}
                >
                  {/* Posición Badge */}
                  <div 
                    className="burger-position"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      width: '40px',
                      height: '40px',
                      background: badge.background,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: position <= 3 ? '1.2rem' : '0.9rem',
                      color: badge.color,
                      boxShadow: badge.shadow,
                      zIndex: 10
                    }}
                  >
                    {badge.emoji}
                  </div>

                  {/* Imagen de la Hamburguesa - Rectangular Horizontal */}
                  <div 
                    className="burger-image"
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      backgroundColor: '#4b5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      background: burger.image_url 
                        ? `url(${burger.image_url}) center/cover`
                        : 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
                    }}
                  >
                    {!burger.image_url && '🍔'}
                  </div>

                  {/* Contenido */}
                  <div className="burger-content" style={{ padding: '1rem', flex: 1 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div className="burger-name" style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '1rem' }}>
                        {burger.name}
                      </div>
                      <div className="burger-restaurant" style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                        🏪 {burger.restaurant?.name}
                      </div>
                      {/* Descripción */}
                      {burger.description && (
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#9ca3af', 
                          marginBottom: '0.4rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.3'
                        }}>
                          {burger.description}
                        </div>
                      )}
                      {/* Tags */}
                      {renderTags(burger.tags)}
                    </div>
                    
                    <div>
                      <div className="burger-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <div className="rating-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span className="stars" style={{ color: '#fbbf24' }}>{renderStars(burger.average_rating || 0)}</span>
                          <span>{(burger.average_rating || 0).toFixed(1)} ({burger.total_reviews || burger.total_ratings || 0})</span>
                        </div>
                      </div>
                      <div className="burger-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>📍 {burger.restaurant?.cities?.name}</span>
                        <div className="burger-actions" style={{ display: 'flex', gap: '0.4rem' }}>
                          <a 
                            href={`/restaurante/${encodeURIComponent(burger.restaurant?.name || '')}`}
                            className="btn-tiny"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.75rem',
                              border: 'none',
                              backgroundColor: '#374151',
                              color: '#e5e7eb',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                              textDecoration: 'none'
                            }}
                          >
                            🏪 Restaurante
                          </a>
                          <a 
                            href={authUser ? "/rate" : undefined}
                            className="btn-tiny"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!authUser) {
                                e.preventDefault()
                                setShowRegistrationModal(true)
                              }
                            }}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.75rem',
                              border: 'none',
                              backgroundColor: '#fbbf24',
                              color: '#1a1a1a',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                              textDecoration: 'none'
                            }}
                          >
                            ⭐ Valorar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍔</div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No hay hamburguesas en el ranking</div>
              <div style={{ fontSize: '0.85rem' }}>
                ¡Sé el primero en valorar una hamburguesa!
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
