'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'

export default function RatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedConsumption, setSelectedConsumption] = useState('local')
  const [selectedAppetizers, setSelectedAppetizers] = useState<string[]>([])
  const [generalRating, setGeneralRating] = useState(5)
  const [panRating, setPanRating] = useState(2)
  const [meatRating, setMeatRating] = useState(2)
  const [toppingsRating, setToppingsRating] = useState(2)
  const [sauceRating, setSauceRating] = useState(2)
  const [price, setPrice] = useState('8.50')
  const [comment, setComment] = useState('')

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const advanceStep = (step: number) => {
    setCurrentStep(step)
  }

  const selectConsumption = (type: string) => {
    setSelectedConsumption(type)
  }

  const toggleAppetizer = (type: string) => {
    setSelectedAppetizers(prev =>
      prev.includes(type) ? prev.filter(a => a !== type) : [...prev, type]
    )
  }

  const toggleSectionTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    button.classList.toggle('active')
  }

  const setRating = (stars: number) => {
    setGeneralRating(stars)
  }

  const setSectionRating = (section: string, rating: number) => {
    switch (section) {
      case 'pan':
        setPanRating(rating)
        break
      case 'meat':
        setMeatRating(rating)
        break
      case 'toppings':
        setToppingsRating(rating)
        break
      case 'sauce':
        setSauceRating(rating)
        break
    }
  }

  const resetRate = () => {
    setCurrentStep(0)
    setSelectedConsumption('local')
    setSelectedAppetizers([])
    setGeneralRating(5)
    setPanRating(2)
    setMeatRating(2)
    setToppingsRating(2)
    setSauceRating(2)
    setPrice('8.50')
    setComment('')
  }

  const renderStarButton = (index: number, rating: number, onClick: () => void, fontSize = '1.5rem') => (
    <button
      className={`star-btn ${index < rating ? 'active' : ''}`}
      onClick={onClick}
      style={{ fontSize }}
    >
      {index < rating ? '★' : '☆'}
    </button>
  )

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        <div className="rate-wizard" style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h2 className="text-xl font-bold mb-4">⭐ Valorar</h2>

          {/* Progress Dots */}
          <div className="wizard-progress">
            <div className={`progress-dot ${currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : ''}`} />
            <div className={`progress-dot ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} />
            <div className={`progress-dot ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} />
            <div className={`progress-dot ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`} />
            <div className={`progress-dot ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`} />
          </div>

          {/* Step 0: Context Questions */}
          {currentStep === 0 && (
            <div className="wizard-step active">
              <div className="form-group">
                <label className="form-label">¿Dónde consumiste la hamburguesa?</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <button
                    className={`filter-btn ${selectedConsumption === 'local' ? 'active' : ''}`}
                    onClick={() => selectConsumption('local')}
                    style={{ flex: 1 }}
                  >
                    🏪 En el Local
                  </button>
                  <button
                    className={`filter-btn ${selectedConsumption === 'delivery' ? 'active' : ''}`}
                    onClick={() => selectConsumption('delivery')}
                    style={{ flex: 1 }}
                  >
                    🚚 A Domicilio
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">¿Pediste Aperitivos?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    className={`filter-btn ${selectedAppetizers.includes('fries') ? 'active' : ''}`}
                    onClick={() => toggleAppetizer('fries')}
                  >
                    🍟 Papas Fritas
                  </button>
                  <button
                    className={`filter-btn ${selectedAppetizers.includes('nachos') ? 'active' : ''}`}
                    onClick={() => toggleAppetizer('nachos')}
                  >
                    🌽 Nachos
                  </button>
                  <button
                    className={`filter-btn ${selectedAppetizers.includes('chicken') ? 'active' : ''}`}
                    onClick={() => toggleAppetizer('chicken')}
                  >
                    🍗 Alitas
                  </button>
                  <button
                    className={`filter-btn ${selectedAppetizers.includes('rings') ? 'active' : ''}`}
                    onClick={() => toggleAppetizer('rings')}
                  >
                    🧅 Aros de Cebolla
                  </button>
                  <button
                    className={`filter-btn ${selectedAppetizers.includes('none') ? 'active' : ''}`}
                    onClick={() => toggleAppetizer('none')}
                    style={{ flexBasis: '100%' }}
                  >
                    ❌ Ninguno
                  </button>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => advanceStep(1)}>
                Continuar →
              </button>
            </div>
          )}

          {/* Step 1: Search */}
          {currentStep === 1 && (
            <div className="wizard-step">
              <div className="form-group">
                <label className="form-label">Buscar Hamburguesa</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Escribe el nombre de la hamburguesa..."
                />
              </div>
              <div id="burgerSearchResults" style={{ marginBottom: '1rem' }}>
                <div
                  className="card"
                  style={{
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                  onClick={() => advanceStep(2)}
                >
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>🍔</div>
                  <div style={{ flex: 1 }}>
                    <div className="burger-name">The King Burger</div>
                    <div className="burger-restaurant">🏪 Burger Palace</div>
                    <div className="burger-rating">
                      <span className="stars">★★★★☆</span>
                      <span>4.8 (245)</span>
                    </div>
                  </div>
                </div>
                <div
                  className="card"
                  style={{
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                  onClick={() => advanceStep(2)}
                >
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>🍔</div>
                  <div style={{ flex: 1 }}>
                    <div className="burger-name">Smoky BBQ</div>
                    <div className="burger-restaurant">🏪 Grill House</div>
                    <div className="burger-rating">
                      <span className="stars">★★★★★</span>
                      <span>4.7 (186)</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => advanceStep(6)}>
                ➕ Crear Nueva Hamburguesa
              </button>
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => advanceStep(0)}>
                  ← Atrás
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Rating */}
          {currentStep === 2 && (
            <div className="wizard-step">
              <div className="form-group">
                <label className="form-label">Puntuación General</label>
                <div className="rating-input" style={{ fontSize: '0.9rem' }}>
                  {[1, 2, 3, 4, 5].map(i =>
                    renderStarButton(i - 1, generalRating, () => setRating(i))
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="€"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>

              {/* PAN Section */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">🥖 Pan</label>
                <div className="rating-input" style={{ marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, panRating, () => setSectionRating('pan', i), '0.9rem')
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button className="filter-btn active" onClick={toggleSectionTag}>
                    Sésamo
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Brioche
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Mantequilla
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Sin Gluten
                  </button>
                </div>
              </div>

              {/* CARNE Section */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">🥩 Carne</label>
                <div className="rating-input" style={{ marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, meatRating, () => setSectionRating('meat', i), '0.9rem')
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button className="filter-btn active" onClick={toggleSectionTag}>
                    Ternera
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Pollo
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Smash
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Pescado
                  </button>
                </div>
              </div>

              {/* TOPPINGS Section */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">🥗 Toppings</label>
                <div className="rating-input" style={{ marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, toppingsRating, () => setSectionRating('toppings', i), '0.9rem')
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Bacon
                  </button>
                  <button className="filter-btn active" onClick={toggleSectionTag}>
                    Queso
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Cebolla
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Lechuga
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Tomate
                  </button>
                </div>
              </div>

              {/* SALSA Section */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label">🍯 Salsa</label>
                <div className="rating-input" style={{ marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, sauceRating, () => setSectionRating('sauce', i), '0.9rem')
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    BBQ
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Ketchup
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Mostaza
                  </button>
                  <button className="filter-btn active" onClick={toggleSectionTag}>
                    Mayo
                  </button>
                  <button className="filter-btn" onClick={toggleSectionTag}>
                    Sriracha
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comentario (Opcional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Comparte tu experiencia..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>

              <div className="btn-group" style={{ marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => advanceStep(1)}>
                  ← Atrás
                </button>
                <button className="btn btn-primary" onClick={() => advanceStep(3)}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Ticket Upload */}
          {currentStep === 3 && (
            <div className="wizard-step">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                <h3 className="text-lg font-bold mb-3">Subir Comprobante</h3>
                <p
                  className="text-muted"
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderLeft: '3px solid #fbbf24',
                    borderRadius: '0.375rem',
                  }}
                >
                  ℹ️ Este paso es <strong>opcional</strong>, pero si quieres ganar puntos y conseguir
                  recompensas debes subir el ticket
                </p>

                <div
                  style={{
                    border: '2px dashed #4b5563',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('ticketInput')?.click()}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                  <p className="text-muted">Haz clic para seleccionar imagen</p>
                  <input type="file" id="ticketInput" style={{ display: 'none' }} accept="image/*" />
                </div>

                <div className="btn-group" style={{ marginTop: '2rem' }}>
                  <button className="btn btn-secondary" onClick={() => advanceStep(2)}>
                    ← Atrás
                  </button>
                  <button className="btn btn-primary" onClick={() => advanceStep(4)}>
                    Enviar Valoración ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="wizard-step">
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 className="text-2xl font-bold mb-2">¡Valoración Enviada!</h3>
                <p className="text-muted mb-4">Gracias por tu participación en la comunidad.</p>

                <div className="success-box">
                  <div className="font-semibold mb-2">🏆 +75 puntos ganados</div>
                  <div className="text-sm mb-3">Puntuación final: 8.2/10 (70% general + 30% secciones)</div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: '#fbbf24',
                      borderTop: '1px solid #22c55e',
                      paddingTop: '1rem',
                      marginTop: '1rem',
                    }}
                  >
                    📈 Próxima insignia en <strong>125 puntos</strong>
                    <br />
                    Progreso: ▓▓▓▓▓░░░░ 68%
                  </div>
                </div>

                <div className="btn-group" style={{ marginTop: '2rem' }}>
                  <button className="btn btn-secondary" onClick={() => advanceStep(0)}>
                    ↩️ Ir al Ranking
                  </button>
                  <button className="btn btn-primary" onClick={() => resetRate()}>
                    ⭐ Valorar Otra
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Create New Burger */}
          {currentStep === 6 && (
            <div className="wizard-step">
              <h3 className="text-lg font-bold mb-4">➕ Crear Nueva Hamburguesa</h3>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: The Ultimate Burger"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Restaurante</label>
                <input type="text" className="form-input" placeholder="Ej: Burger Paradise" />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Madrid, Barcelona..."
                />
              </div>
              <div className="btn-group" style={{ marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => advanceStep(1)}>
                  ← Atrás
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    alert('Nueva hamburguesa creada. Se revisará en 24-48h')
                    advanceStep(1)
                  }}
                >
                  Enviar para Revisión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
