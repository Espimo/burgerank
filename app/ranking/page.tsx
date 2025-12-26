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
  description: string
  type: string
  tags: string[]
  price: number
  image_url?: string
  ranking_position: number
  ranking_score: number
  bayesian_score: number
  wilson_score: number
  average_rating: number
  total_reviews: number
  verified_reviews_count: number
  positive_reviews_count: number
  standard_deviation: number
  last_review_date: string
  is_in_ranking: boolean
  verified_percentage: number
  created_at: string
  restaurant: {
    id: string
    name: string
    address: string
    city: { id: string; name: string }
  }
}

interface NewBurger {
  id: string
  name: string
  description: string
  average_rating: number
  total_reviews: number
  reviews_needed: number
  verified_percentage: number
  restaurant: {
    id: string
    name: string
    city: { id: string; name: string }
  }
}

interface CityData {
  id: string
  name: string
}

interface RankingStats {
  totalInRanking: number
  totalNew: number
  minReviewsForRanking: number
}

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('ranking') // 'ranking', 'nuevas', 'tendencias'
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [expandedBurger, setExpandedBurger] = useState<string | null>(null)
  const { isAdmin } = useAdmin()
  const { authUser } = useAuth()
  
  // Data from API
  const [rankedBurgers, setRankedBurgers] = useState<RankedBurger[]>([])
  const [newBurgers, setNewBurgers] = useState<NewBurger[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [stats, setStats] = useState<RankingStats>({ totalInRanking: 0, totalNew: 0, minReviewsForRanking: 15 })
  const [loading, setLoading] = useState(true)
  
  // Load ranking data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Build query params
        const params = new URLSearchParams()
        if (selectedCity) params.append('city', selectedCity)
        if (selectedType) params.append('type', selectedType)
        params.append('includeNew', 'true')
        params.append('limit', '50')
        
        const response = await fetch(`/api/burgers/ranking?${params.toString()}`)
        const data = await response.json()
        
        if (data.burgers) {
          setRankedBurgers(data.burgers)
        }
        if (data.newBurgers) {
          setNewBurgers(data.newBurgers)
        }
        if (data.stats) {
          setStats(data.stats)
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
  }, [selectedCity, selectedType])

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
           burger.restaurant?.city?.name?.toLowerCase().includes(query)
  })

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★')
      } else if (i === fullStars && hasHalf) {
        stars.push('☆')
      } else {
        stars.push('☆')
      }
    }
    return stars.join('')
  }

  const getPositionBadge = (position: number) => {
    if (position === 1) return { emoji: '🥇', color: '#ffd700' }
    if (position === 2) return { emoji: '🥈', color: '#c0c0c0' }
    if (position === 3) return { emoji: '🥉', color: '#cd7f32' }
    if (position <= 10) return { emoji: '🔥', color: '#ef4444' }
    return { emoji: '#', color: '#6b7280' }
  }

  const handleScrollSlider = (direction: 'left' | 'right') => {
    const slider = document.getElementById('featured-slider')
    if (slider) {
      const newPos = scrollPosition + (direction === 'left' ? -200 : 200)
      slider.scrollLeft = newPos
      setScrollPosition(newPos)
    }
  }

  // Get top 3 for featured section
  const featuredBurgers = rankedBurgers.slice(0, 3)

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
        <h2 className="text-2xl font-bold mb-4">🏆 Ranking Nacional de Hamburguesas</h2>
        
        {/* Stats del ranking */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem',
            border: '1px solid #374151'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>En ranking: </span>
            <span style={{ color: '#fbbf24', fontWeight: '600' }}>{stats.totalInRanking}</span>
          </div>
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem',
            border: '1px solid #374151'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Nuevas: </span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>{stats.totalNew}</span>
          </div>
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem',
            border: '1px solid #374151'
          }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Mín. reviews: </span>
            <span style={{ color: '#60a5fa', fontWeight: '600' }}>{stats.minReviewsForRanking}</span>
          </div>
        </div>

        {/* Filtros principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <select 
            className="filter-select" 
            style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">📍 Todas las Ciudades</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <select 
            className="filter-select" 
            style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">🍔 Tipo</option>
            <option value="classic">Clásica</option>
            <option value="smash">Smash</option>
            <option value="gourmet">Gourmet</option>
            <option value="veggie">Vegetariana</option>
          </select>
        </div>

        {/* Filtros rápidos */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`filter-btn ${viewMode === 'ranking' ? 'active' : ''}`}
            onClick={() => setViewMode('ranking')}
            style={{ fontSize: '0.85rem', backgroundColor: viewMode === 'ranking' ? '#fbbf24' : '#374151', color: viewMode === 'ranking' ? '#000' : '#e5e7eb', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
          >
            🏆 Ranking
          </button>
          <button 
            className={`filter-btn ${viewMode === 'nuevas' ? 'active' : ''}`}
            onClick={() => setViewMode('nuevas')}
            style={{ fontSize: '0.85rem', backgroundColor: viewMode === 'nuevas' ? '#fbbf24' : '#374151', color: viewMode === 'nuevas' ? '#000' : '#e5e7eb', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
          >
            ✨ Nuevas ({stats.totalNew})
          </button>
        </div>

        {/* Podio Top 3 */}
        {viewMode === 'ranking' && featuredBurgers.length >= 3 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏆 Podio
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {/* 2do lugar */}
              <div style={{ 
                backgroundColor: '#1f2937', 
                borderRadius: '0.5rem', 
                padding: '1rem', 
                textAlign: 'center',
                border: '2px solid #c0c0c0',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥈</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>{featuredBurgers[1]?.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.3rem' }}>{featuredBurgers[1]?.restaurant?.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>{featuredBurgers[1]?.average_rating?.toFixed(1)} ⭐</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>({featuredBurgers[1]?.total_reviews} reviews)</div>
              </div>
              {/* 1er lugar */}
              <div style={{ 
                backgroundColor: '#1f2937', 
                borderRadius: '0.5rem', 
                padding: '1rem', 
                textAlign: 'center',
                border: '2px solid #ffd700',
                transform: 'scale(1.05)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥇</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.3rem', color: '#fbbf24' }}>{featuredBurgers[0]?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>{featuredBurgers[0]?.restaurant?.name}</div>
                <div style={{ fontSize: '1rem', color: '#fbbf24', fontWeight: '600' }}>{featuredBurgers[0]?.average_rating?.toFixed(1)} ⭐</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>({featuredBurgers[0]?.total_reviews} reviews)</div>
              </div>
              {/* 3er lugar */}
              <div style={{ 
                backgroundColor: '#1f2937', 
                borderRadius: '0.5rem', 
                padding: '1rem', 
                textAlign: 'center',
                border: '2px solid #cd7f32',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥉</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>{featuredBurgers[2]?.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.3rem' }}>{featuredBurgers[2]?.restaurant?.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>{featuredBurgers[2]?.average_rating?.toFixed(1)} ⭐</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>({featuredBurgers[2]?.total_reviews} reviews)</div>
              </div>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Buscar hamburguesa o restaurante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Vista: Ranking oficial */}
        {viewMode === 'ranking' && (
          <>
            {filteredBurgers.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredBurgers.map((burger) => {
                  const badge = getPositionBadge(burger.ranking_position)
                  const isExpanded = expandedBurger === burger.id
                  
                  return (
                    <div key={burger.id} className="card" style={{ padding: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Posición */}
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          minWidth: '50px',
                          padding: '0.5rem',
                          backgroundColor: '#111827',
                          borderRadius: '0.5rem'
                        }}>
                          <span style={{ fontSize: '1.5rem' }}>{badge.emoji}</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: badge.color }}>
                            {burger.ranking_position <= 3 ? '' : burger.ranking_position}
                          </span>
                        </div>
                        
                        {/* Contenido */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <div>
                              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                                {burger.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                                {burger.restaurant?.name} • {burger.restaurant?.city?.name}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fbbf24' }}>
                                {burger.average_rating?.toFixed(1)} ⭐
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                ({burger.total_reviews} reviews)
                              </div>
                            </div>
                          </div>

                          {/* Indicadores de calidad */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              backgroundColor: burger.verified_percentage >= 70 ? '#059669' : '#4b5563', 
                              color: '#fff', 
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '0.25rem' 
                            }}>
                              📸 {burger.verified_percentage}% verificadas
                            </span>
                            {burger.wilson_score > 3.5 && (
                              <span style={{ fontSize: '0.7rem', backgroundColor: '#7c3aed', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                                ✓ Alta confianza
                              </span>
                            )}
                            {burger.standard_deviation < 0.5 && (
                              <span style={{ fontSize: '0.7rem', backgroundColor: '#0ea5e9', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                                📊 Consistente
                              </span>
                            )}
                          </div>

                          {/* Detalles expandidos */}
                          <button 
                            onClick={() => setExpandedBurger(isExpanded ? null : burger.id)}
                            style={{ 
                              fontSize: '0.75rem', 
                              color: '#60a5fa', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '0.25rem 0'
                            }}
                          >
                            {isExpanded ? '▲ Ocultar detalles' : '▼ Ver detalles del score'}
                          </button>
                          
                          {isExpanded && (
                            <div style={{ 
                              marginTop: '0.75rem', 
                              padding: '0.75rem', 
                              backgroundColor: '#111827', 
                              borderRadius: '0.375rem',
                              fontSize: '0.8rem'
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                  <span style={{ color: '#9ca3af' }}>Bayesian Score: </span>
                                  <span style={{ color: '#fbbf24' }}>{burger.bayesian_score?.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span style={{ color: '#9ca3af' }}>Wilson Score: </span>
                                  <span style={{ color: '#fbbf24' }}>{burger.wilson_score?.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span style={{ color: '#9ca3af' }}>Reviews positivas: </span>
                                  <span style={{ color: '#10b981' }}>{burger.positive_reviews_count}</span>
                                </div>
                                <div>
                                  <span style={{ color: '#9ca3af' }}>Desviación: </span>
                                  <span style={{ color: burger.standard_deviation < 0.5 ? '#10b981' : '#ef4444' }}>
                                    {burger.standard_deviation?.toFixed(2)}
                                  </span>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                  <span style={{ color: '#9ca3af' }}>Ranking Score: </span>
                                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{burger.ranking_score?.toFixed(4)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Botones */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <a 
                              href={`/restaurante/${encodeURIComponent(burger.restaurant?.name || '')}`}
                              style={{ 
                                flex: 1, 
                                padding: '0.5rem', 
                                backgroundColor: '#374151', 
                                color: '#e5e7eb',
                                border: '1px solid #4b5563',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textAlign: 'center',
                                textDecoration: 'none'
                              }}
                            >
                              🏪 Restaurante
                            </a>
                            <a 
                              href={authUser ? "/rate" : undefined}
                              onClick={(e) => {
                                if (!authUser) {
                                  e.preventDefault()
                                  setShowRegistrationModal(true)
                                }
                              }}
                              style={{ 
                                flex: 1, 
                                padding: '0.5rem', 
                                backgroundColor: '#fbbf24', 
                                color: '#000',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                textDecoration: 'none'
                              }}
                            >
                              ⭐ Valorar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <div>No hay hamburguesas en el ranking aún</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Las burgers necesitan mínimo {stats.minReviewsForRanking} reviews para entrar al ranking
                </div>
              </div>
            )}
          </>
        )}

        {/* Vista: Nuevas (aún no en ranking) */}
        {viewMode === 'nuevas' && (
          <>
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', border: '1px solid #374151' }}>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
                💡 Estas hamburguesas necesitan más reviews para entrar al ranking oficial. 
                ¡Ayúdalas valorándolas!
              </p>
            </div>
            
            {newBurgers.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {newBurgers.map((burger) => (
                  <div key={burger.id} className="card" style={{ padding: '1rem', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                          {burger.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                          {burger.restaurant?.name} • {burger.restaurant?.city?.name}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', color: '#fbbf24' }}>
                          {burger.average_rating?.toFixed(1)} ⭐
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          ({burger.total_reviews} reviews)
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de progreso hacia el ranking */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                        <span>Progreso hacia el ranking</span>
                        <span>{burger.total_reviews}/{stats.minReviewsForRanking} reviews</span>
                      </div>
                      <div style={{ 
                        height: '6px', 
                        backgroundColor: '#374151', 
                        borderRadius: '3px', 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${Math.min((burger.total_reviews / stats.minReviewsForRanking) * 100, 100)}%`,
                          height: '100%',
                          backgroundColor: '#10b981',
                          borderRadius: '3px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.3rem' }}>
                        Faltan {burger.reviews_needed} reviews para entrar al ranking
                      </div>
                    </div>
                    
                    <a 
                      href={authUser ? "/rate" : undefined}
                      onClick={(e) => {
                        if (!authUser) {
                          e.preventDefault()
                          setShowRegistrationModal(true)
                        }
                      }}
                      style={{ 
                        display: 'block',
                        width: '100%',
                        padding: '0.5rem', 
                        backgroundColor: '#10b981', 
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      🚀 ¡Ayúdala a subir! Valorar
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                <div>No hay hamburguesas nuevas pendientes</div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
