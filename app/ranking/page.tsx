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

// Type for burgers loaded from Supabase
interface BurgerData {
  id: string
  name: string
  description: string
  restaurant: string
  restaurant_id: string
  city: string
  city_id: string
  rating: number
  reviews: number
  tags: string[]
  image_url?: string
  is_featured: boolean
  created_at: string
}

interface CityData {
  id: string
  name: string
}

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('todos') // 'todos', 'tendencias', 'nuevas'
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const { isAdmin } = useAdmin()
  const { authUser } = useAuth()
  
  // Supabase data
  const [burgers, setBurgers] = useState<BurgerData[]>([])
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        
        const [burgersRes, citiesRes] = await Promise.all([
          supabase.from('burgers').select(`
            id,
            name,
            description,
            image_url,
            average_rating,
            total_ratings,
            tags,
            restaurant_id,
            city_id,
            is_featured,
            created_at,
            restaurants(id, name),
            cities(id, name)
          `).eq('status', 'approved'),
          supabase.from('cities').select('id, name')
        ])
        
        if (burgersRes.error) {
          console.error('Error loading burgers:', burgersRes.error)
        } else if (burgersRes.data) {
          const transformedBurgers: BurgerData[] = burgersRes.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description || '',
            restaurant: b.restaurants?.name || 'Restaurante',
            restaurant_id: b.restaurant_id,
            city: b.cities?.name || 'Ciudad',
            city_id: b.city_id,
            rating: b.average_rating || 0,
            reviews: b.total_ratings || 0,
            tags: b.tags || [],
            image_url: b.image_url,
            is_featured: b.is_featured || false,
            created_at: b.created_at
          }))
          setBurgers(transformedBurgers)
        }
        
        if (citiesRes.error) {
          console.error('Error loading cities:', citiesRes.error)
        } else if (citiesRes.data) {
          setCities(citiesRes.data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  // Filter burgers based on city and search
  let filteredBurgers = burgers.filter(burger => {
    const matchCity = !selectedCity || burger.city === selectedCity
    const matchSearch = !searchQuery || 
      burger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      burger.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCity && matchSearch
  })

  // Sort based on view mode
  if (viewMode === 'todos') {
    filteredBurgers = [...filteredBurgers].sort((a, b) => b.rating - a.rating)
  } else if (viewMode === 'tendencias') {
    // Tendencias: por rating pero reciente (simulado con reviews)
    filteredBurgers = [...filteredBurgers].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
  } else if (viewMode === 'nuevas') {
    // Nuevas: ordenadas por fecha de creación (más nuevas primero)
    filteredBurgers = [...filteredBurgers].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.floor(rating) ? '★' : '☆')
    }
    return stars.join('')
  }

  const handleScrollSlider = (direction: 'left' | 'right') => {
    const slider = document.getElementById('featured-slider')
    if (slider) {
      const newPos = scrollPosition + (direction === 'left' ? -200 : 200)
      slider.scrollLeft = newPos
      setScrollPosition(newPos)
    }
  }

  // Get featured burgers (marked as featured, or top 3 by rating if none are featured)
  const featuredBurgers = burgers.filter(b => b.is_featured).length > 0
    ? burgers.filter(b => b.is_featured).slice(0, 3)
    : [...burgers].sort((a, b) => b.rating - a.rating).slice(0, 3)

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

        {/* Filtros principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <select 
            className="filter-select" 
            style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">📍 Todas las Ciudades</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>{city.name}</option>
            ))}
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>🥖 Pan</option>
            <option>Sésamo</option>
            <option>Brioche</option>
            <option>Mantequilla</option>
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>🥩 Carne</option>
            <option>Ternera</option>
            <option>Pollo</option>
            <option>Smash</option>
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>🍯 Salsa</option>
            <option>BBQ</option>
            <option>Ketchup</option>
            <option>Mayo</option>
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>🥗 Toppings</option>
            <option>Bacon</option>
            <option>Queso</option>
            <option>Cebolla</option>
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>💰 Precio</option>
            <option>0-10€</option>
            <option>10-20€</option>
            <option>20-30€</option>
          </select>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>⚠️ Alergenos</option>
            <option>Sin gluten</option>
            <option>Sin frutos secos</option>
            <option>Vegetariano</option>
          </select>
        </div>

        {/* Filtros rápidos */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`filter-btn ${viewMode === 'todos' ? 'active' : ''}`}
            onClick={() => setViewMode('todos')}
            style={{ fontSize: '0.85rem', backgroundColor: viewMode === 'todos' ? '#fbbf24' : '#374151', color: viewMode === 'todos' ? '#000' : '#e5e7eb', border: 'none' }}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${viewMode === 'tendencias' ? 'active' : ''}`}
            onClick={() => setViewMode('tendencias')}
            style={{ fontSize: '0.85rem', backgroundColor: viewMode === 'tendencias' ? '#fbbf24' : '#374151', color: viewMode === 'tendencias' ? '#000' : '#e5e7eb', border: 'none' }}
          >
            🔥 Tendencias
          </button>
          <button 
            className={`filter-btn ${viewMode === 'nuevas' ? 'active' : ''}`}
            onClick={() => setViewMode('nuevas')}
            style={{ fontSize: '0.85rem', backgroundColor: viewMode === 'nuevas' ? '#fbbf24' : '#374151', color: viewMode === 'nuevas' ? '#000' : '#e5e7eb', border: 'none' }}
          >
            ✨ Nuevas
          </button>
        </div>

        {/* Slider destacadas */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem' }}>
            💡 Destacadas Para Ti
          </h3>
          <div style={{ position: 'relative' }}>
            <div 
              id="featured-slider"
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                overflowX: 'auto', 
                scrollBehavior: 'smooth',
                paddingBottom: '0.5rem'
              }}
            >
              {featuredBurgers.map(burger => (
                <div 
                  key={burger.id} 
                  className="card" 
                  style={{ 
                    minWidth: '150px', 
                    flexShrink: 0, 
                    padding: '1rem', 
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍔</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    {burger.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                    {burger.restaurant}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginBottom: '0.3rem' }}>
                    {renderStars(burger.rating)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    {burger.rating.toFixed(1)} ({burger.reviews})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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

        {/* Resultados */}
        {filteredBurgers.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredBurgers.map((burger) => (
              <div key={burger.id} className="card" style={{ padding: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  {/* Imagen arriba */}
                  <div style={{ 
                    width: '100%', 
                    height: '120px', 
                    backgroundColor: '#374151', 
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    🍔
                  </div>
                  
                  {/* Contenido */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                          {burger.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                          {burger.restaurant} • {burger.city}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24', marginBottom: '0.2rem' }}>
                          {renderStars(burger.rating)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {burger.rating.toFixed(1)} ({burger.reviews})
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                      {burger.description}
                    </div>

                    {/* Tags amarillos */}
                    <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {burger.tags.map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#fbbf24', color: '#000', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', fontWeight: '500' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a 
                        href={`/restaurante/${encodeURIComponent(burger.restaurant)}`}
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
                          transition: 'all 0.2s',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#4b5563'}}
                        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#374151'}}
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
                          transition: 'all 0.2s',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f59e0b'}}
                        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#fbbf24'}}
                      >
                        ⭐ Valorar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <div>No se encontraron hamburguesas con esos criterios</div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
