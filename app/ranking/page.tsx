'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'

export default function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttons = (e.currentTarget.parentElement?.querySelectorAll('button') || []) as NodeListOf<HTMLButtonElement>
    buttons.forEach(btn => btn.classList.remove('active'))
    e.currentTarget.classList.add('active')
  }

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        <h2 className="text-2xl font-bold mb-4">🏆 Ranking Nacional de Hamburguesas</h2>

        {/* Filtros en Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <select className="filter-select" style={{ padding: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: '#e5e7eb', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <option>📍 Ciudad</option>
            <option>Madrid</option>
            <option>Barcelona</option>
            <option>Valencia</option>
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

        {/* Filtros Rápidos de Vistas */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button className="filter-btn active" onClick={handleFilterClick} style={{ fontSize: '0.85rem' }}>Todos</button>
          <button className="filter-btn" onClick={handleFilterClick} style={{ fontSize: '0.85rem' }}>🔥 Tendencias</button>
          <button className="filter-btn" onClick={handleFilterClick} style={{ fontSize: '0.85rem' }}>✨ Nuevas</button>
        </div>

        {/* Slider Destacadas */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="font-semibold mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>💡 Destacadas Para Ti</h3>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <div className="card" style={{ minWidth: '130px', flexShrink: 0, padding: '0.6rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.3rem' }}>🥩</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Smash Beef</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Burger Club</div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>★★★★☆</div>
            </div>
            <div className="card" style={{ minWidth: '130px', flexShrink: 0, padding: '0.6rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.3rem' }}>🍔</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Double Beef</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Burger Master</div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>★★★★☆</div>
            </div>
            <div className="card" style={{ minWidth: '130px', flexShrink: 0, padding: '0.6rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.3rem' }}>🍔</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Triple Stack</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Stacked Burger</div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>★★★★☆</div>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Buscar hamburguesa..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        {/* Lista de Ranking */}
        <div id="rankingList">
          {/* Burgers will be inserted here */}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
