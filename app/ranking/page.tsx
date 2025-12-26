'use client'

import { useState, useEffect } from 'react'
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
  image_url?: string
  ranking_position: number | null
  ranking_score: number
  average_rating: number
  total_reviews: number
  verified_reviews_count: number
  is_in_ranking: boolean
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

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const { isAdmin } = useAdmin()
  const { authUser } = useAuth()
  
  // Data from API
  const [rankedBurgers, setRankedBurgers] = useState<RankedBurger[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllBurgers, setShowAllBurgers] = useState(true) // Modo desarrollo: mostrar todas
  
  // Load ranking data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Build query params
        const params = new URLSearchParams()
        if (selectedCity) params.append('city', selectedCity)
        if (selectedType) params.append('type', selectedType)
        if (showAllBurgers) params.append('includeAll', 'true')
        params.append('limit', '50')
        
        const response = await fetch(`/api/burgers/ranking?${params.toString()}`)
        const data = await response.json()
        
        if (data.burgers) {
          setRankedBurgers(data.burgers)
        }
        
        // Load cities separately
        const supabase = createClient()
        const { data: citiesData } = await supabase.from('cities').select('id, name').eq('status', 'approved')
        if (citiesData) {
          setCities(citiesData)
        }
      } catch (error) {
        console.error('Error loading ranking:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [selectedCity, selectedType, showAllBurgers])

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
        <div className="ranking-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h2 className="ranking-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🏆 Ranking de Hamburguesas</h2>
        </div>

        {/* Filtros rápidos */}
        <div className="ranking-filters" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
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
              
              return (
                <div 
                  key={burger.id} 
                  className="card burger-card" 
                  style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    marginBottom: '0.75rem', 
                    position: 'relative',
                    alignItems: 'stretch',
                    cursor: 'pointer',
                    padding: '1rem'
                  }}
                >
                  {/* Posición Badge */}
                  <div 
                    className="burger-position"
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      width: '40px',
                      height: '40px',
                      background: position <= 3 
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : position <= 10 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : '#374151',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: position <= 3 ? '1.2rem' : '0.9rem',
                      color: position <= 10 ? '#1a1a1a' : '#e5e7eb',
                      boxShadow: position <= 3 
                        ? '0 2px 8px rgba(251, 191, 36, 0.3)'
                        : position <= 10
                          ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                          : 'none'
                    }}
                  >
                    {position <= 3 ? ['🥇', '🥈', '🥉'][position - 1] : `#${position}`}
                  </div>

                  {/* Imagen de la Hamburguesa */}
                  <div 
                    className="burger-image"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '0.5rem',
                      objectFit: 'cover',
                      backgroundColor: '#4b5563',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      background: burger.image_url 
                        ? `url(${burger.image_url}) center/cover`
                        : 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
                    }}
                  >
                    {!burger.image_url && '🍔'}
                  </div>

                  {/* Contenido */}
                  <div className="burger-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="burger-name" style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                        {burger.name}
                      </div>
                      <div className="burger-restaurant" style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                        🏪 {burger.restaurant?.name}
                      </div>
                    </div>
                    <div>
                      <div className="burger-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <div className="rating-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span className="stars" style={{ color: '#fbbf24' }}>{renderStars(burger.average_rating || 0)}</span>
                          <span>{(burger.average_rating || 0).toFixed(1)} ({burger.total_reviews})</span>
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
