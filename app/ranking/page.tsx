'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import { burgers } from '@/lib/data/mockData'

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  // Filter burgers based on city and search
  const filteredBurgers = burgers.filter(burger => {
    const matchCity = !selectedCity || burger.city === selectedCity
    const matchSearch = !searchQuery || 
      burger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      burger.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCity && matchSearch
  })

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.floor(rating) ? '★' : '☆')
    }
    return stars.join('')
  }

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        <h2 className="text-2xl font-bold mb-4">🏆 Ranking Nacional de Hamburguesas</h2>

        {/* Filtro por Ciudad */}
        <div style={{ marginBottom: '1.5rem' }}>
          <select 
            className="filter-select" 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ padding: '0.75rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', width: '100%', marginBottom: '1rem' }}>
            <option value="">📍 Todas las Ciudades</option>
            <option value="Madrid">Madrid</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Valencia">Valencia</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Bilbao">Bilbao</option>
          </select>
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
            {filteredBurgers.map((burger, index) => (
              <div key={burger.id} className="card" style={{ padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ minWidth: '50px', fontSize: '2rem', textAlign: 'center' }}>🍔</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                          #{index + 1} {burger.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                          {burger.restaurant} • {burger.city}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                          {burger.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24', marginBottom: '0.2rem' }}>
                          {renderStars(burger.rating)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {burger.rating.toFixed(1)} ({burger.reviews} valoraciones)
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {burger.tags.map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#374151', color: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                          {tag}
                        </span>
                      ))}
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
