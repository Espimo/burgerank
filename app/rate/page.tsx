'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
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
  userRating: number
  type: string
  position: number
  tags: string[]
  image_url?: string
}

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBurger, setSelectedBurger] = useState<BurgerData | null>(null)
  const [hasTicketUploaded, setHasTicketUploaded] = useState(false)
  
  // Edición de valoración existente
  const [isEditing, setIsEditing] = useState(false)
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [pendingExistingRating, setPendingExistingRating] = useState<any>(null)
  
  // Burgers loaded from Supabase
  const [burgers, setBurgers] = useState<BurgerData[]>([])
  const [loadingBurgers, setLoadingBurgers] = useState(true)
  
  // Rating submission state
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingResult, setRatingResult] = useState<{ 
    pointsEarned: number; 
    newTotal: number; 
    hasTicket: boolean;
    newBadges?: { name: string; emoji: string }[]
  } | null>(null)
  const [ratingError, setRatingError] = useState<string | null>(null)
  
  // New burger form
  const [newBurgerName, setNewBurgerName] = useState('')
  const [newBurgerRestaurantId, setNewBurgerRestaurantId] = useState('')
  const [newBurgerRestaurantName, setNewBurgerRestaurantName] = useState('')
  const [newBurgerCityId, setNewBurgerCityId] = useState('')
  const [newBurgerCityName, setNewBurgerCityName] = useState('')
  const [newBurgerDescription, setNewBurgerDescription] = useState('')
  const [newBurgerImageUrl, setNewBurgerImageUrl] = useState('')
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loadingForm, setLoadingForm] = useState(false)
  const [showNewRestaurant, setShowNewRestaurant] = useState(false)
  const [showNewCity, setShowNewCity] = useState(false)
  
  // Load restaurants, cities and burgers from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        
        setLoadingBurgers(true)
        
        const [citiesRes, restaurantsRes, burgersRes] = await Promise.all([
          supabase.from('cities').select('*'),
          supabase.from('restaurants').select('*'),
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
            restaurants(id, name),
            cities(id, name)
          `).eq('status', 'approved')
        ])
        
        if (citiesRes.error) {
          console.error('Error loading cities:', citiesRes.error)
        } else if (citiesRes.data) {
          setCities(citiesRes.data)
        }
        
        if (restaurantsRes.error) {
          console.error('Error loading restaurants:', restaurantsRes.error)
        } else if (restaurantsRes.data) {
          setRestaurants(restaurantsRes.data)
        }
        
        if (burgersRes.error) {
          console.error('Error loading burgers:', burgersRes.error)
        } else if (burgersRes.data) {
          // Transform burgers to our format
          const transformedBurgers: BurgerData[] = burgersRes.data.map((b: any, index: number) => ({
            id: b.id,
            name: b.name,
            description: b.description || '',
            restaurant: b.restaurants?.name || 'Restaurante',
            restaurant_id: b.restaurant_id,
            city: b.cities?.name || 'Ciudad',
            city_id: b.city_id,
            rating: b.average_rating || 0,
            reviews: b.total_ratings || 0,
            userRating: 0,
            type: 'premium',
            position: index + 1,
            tags: b.tags || [],
            image_url: b.image_url
          }))
          setBurgers(transformedBurgers)
        }
      } catch (error) {
        console.error('Error in loadData:', error)
      } finally {
        setLoadingBurgers(false)
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

  const advanceStep = (step: number) => {
    setCurrentStep(step)
  }

  const selectBurger = (burger: typeof burgers[0]) => {
    setSelectedBurger(burger)
    advanceStep(2)
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
    setSelectedBurger(null)
    setRatingResult(null)
    setRatingError(null)
    setHasTicketUploaded(false)
    setIsEditing(false)
    setExistingRatingId(null)
    setShowUpdateConfirm(false)
    setPendingExistingRating(null)
  }

  // Confirmar actualización de valoración existente
  const confirmUpdateRating = async () => {
    if (!pendingExistingRating || !selectedBurger) return
    
    setShowUpdateConfirm(false)
    setSubmittingRating(true)
    setRatingError(null)

    const ratingIdToUpdate = pendingExistingRating.id

    try {
      const ratingData = {
        burger_id: selectedBurger.id,
        overall_rating: generalRating,
        pan_rating: panRating,
        carne_rating: meatRating,
        toppings_rating: toppingsRating,
        salsa_rating: sauceRating,
        price: parseFloat(price) || undefined,
        comment: comment || undefined,
        consumption_type: selectedConsumption as 'local' | 'delivery',
        appetizers: selectedAppetizers.length > 0 ? selectedAppetizers : undefined,
        has_ticket: hasTicketUploaded,
      }

      console.log('Enviando actualización de rating:', { rating_id: ratingIdToUpdate, ...ratingData })
      
      const response = await fetch('/api/ratings/create', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating_id: ratingIdToUpdate,
          ...ratingData
        })
      })
      
      console.log('Respuesta del servidor:', response.status, response.statusText)
      const data = await response.json()
      console.log('Datos de respuesta:', data)

      if (!response.ok) {
        console.error('Error al actualizar rating:', data)
        throw new Error(data.error || 'Error al actualizar la valoración')
      }

      setRatingResult({
        pointsEarned: data.pointsDiff || 0,
        newTotal: data.newTotal,
        hasTicket: data.hasTicket || false,
        newBadges: data.newBadges || []
      })

      setPendingExistingRating(null)
      setIsEditing(true)
      setExistingRatingId(ratingIdToUpdate)
      advanceStep(4)
    } catch (error) {
      console.error('Error updating rating:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar'
      console.error('Mensaje de error completo:', errorMessage)
      setRatingError(errorMessage)
      alert('Error al actualizar valoración: ' + errorMessage) // Mostrar alert temporal para debug
    } finally {
      setSubmittingRating(false)
    }
  }

  // Cancelar actualización
  const cancelUpdateRating = () => {
    setShowUpdateConfirm(false)
    setPendingExistingRating(null)
    resetRate()
  }

  // Submit rating to the database
  const submitRating = async () => {
    if (!selectedBurger) {
      setRatingError('No hay hamburguesa seleccionada')
      return
    }

    setSubmittingRating(true)
    setRatingError(null)

    try {
      // Preparar datos
      const ratingData = {
        burger_id: selectedBurger.id,
        overall_rating: generalRating,
        pan_rating: panRating,
        carne_rating: meatRating,
        toppings_rating: toppingsRating,
        salsa_rating: sauceRating,
        price: parseFloat(price) || undefined,
        comment: comment || undefined,
        consumption_type: selectedConsumption as 'local' | 'delivery',
        appetizers: selectedAppetizers.length > 0 ? selectedAppetizers : undefined,
        has_ticket: hasTicketUploaded,
      }

      let response, data

      if (isEditing && existingRatingId) {
        // Actualizar valoración existente
        response = await fetch('/api/ratings/create', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating_id: existingRatingId,
            ...ratingData
          })
        })
        data = await response.json()
      } else {
        // Crear nueva valoración
        response = await fetch('/api/ratings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ratingData)
        })
        data = await response.json()
      }

      // Manejar error de valoración existente - mostrar modal de confirmación
      if (!response.ok && response.status === 409 && data.canEdit) {
        setPendingExistingRating(data.existingRating)
        setShowUpdateConfirm(true)
        setSubmittingRating(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la valoración')
      }

      // Store the result to show in success screen
      setRatingResult({
        pointsEarned: isEditing ? (data.pointsDiff || 0) : data.pointsEarned,
        newTotal: data.newTotal,
        hasTicket: data.hasTicket || false,
        newBadges: data.newBadges || []
      })

      // Advance to success step
      advanceStep(4)
    } catch (error) {
      console.error('Error submitting rating:', error)
      setRatingError(error instanceof Error ? error.message : 'Error al guardar la valoración')
    } finally {
      setSubmittingRating(false)
    }
  }

  const filteredBurgers = burgers.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStarButton = (index: number, rating: number, onClick: () => void, fontSize = '2rem') => (
    <button
      className={`star-btn ${index < rating ? 'active' : ''}`}
      onClick={onClick}
      style={{ 
        fontSize,
        minWidth: '2.75rem', // 44px touch target
        minHeight: '2.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: index < rating ? '#fbbf24' : '#6b7280',
        transition: 'transform 0.15s ease',
      }}
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
          <h2 className="text-xl font-bold mb-4">★ Valorar</h2>

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
            <div className="wizard-step active">
              <div className="form-group">
                <label className="form-label">Buscar Hamburguesa</label>
                <input
                  type="text"
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe el nombre de la hamburguesa o restaurante..."
                />
              </div>
              <div id="burgerSearchResults" style={{ marginBottom: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {loadingBurgers ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    ⏳ Cargando hamburguesas...
                  </div>
                ) : filteredBurgers.length > 0 ? (
                  filteredBurgers.map(burger => (
                    <div
                      key={burger.id}
                      className="card"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        padding: '1rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                      }}
                      onClick={() => selectBurger(burger)}
                    >
                      <div style={{ fontSize: '2rem', flexShrink: 0 }}>🍔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{burger.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.3rem' }}>🏪 {burger.restaurant}</div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: '#fbbf24' }}>★★★★☆</span>
                          <span style={{ color: '#9ca3af' }}>{burger.rating.toFixed(1)} ({burger.reviews})</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    {searchQuery ? 'No se encontraron hamburguesas con esa búsqueda' : 'No hay hamburguesas disponibles. ¡Crea la primera!'}
                  </div>
                )}
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
            <div className="wizard-step active">
              <div className="form-group">
                <label className="form-label">Puntuación General</label>
                <div className="rating-input" style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(i =>
                    renderStarButton(i - 1, generalRating, () => setRating(i), '2.5rem')
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
                <label className="form-label">□ Pan</label>
                <div className="rating-input" style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, panRating, () => setSectionRating('pan', i), '1.5rem')
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
                <label className="form-label">■ Carne</label>
                <div className="rating-input" style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, meatRating, () => setSectionRating('meat', i), '1.5rem')
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
                <label className="form-label">● Toppings</label>
                <div className="rating-input" style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, toppingsRating, () => setSectionRating('toppings', i), '1.5rem')
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
                <label className="form-label">◆ Salsa</label>
                <div className="rating-input" style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3].map(i =>
                    renderStarButton(i - 1, sauceRating, () => setSectionRating('sauce', i), '1.5rem')
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
            <div className="wizard-step active">
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
                    border: hasTicketUploaded ? '2px solid #22c55e' : '2px dashed #4b5563',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    backgroundColor: hasTicketUploaded ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => document.getElementById('ticketInput')?.click()}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {hasTicketUploaded ? '✔' : '□'}
                  </div>
                  <p className="text-muted">
                    {hasTicketUploaded 
                      ? '¡Ticket cargado! Haz clic para cambiar' 
                      : 'Haz clic para seleccionar imagen'}
                  </p>
                  <input 
                    type="file" 
                    id="ticketInput" 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // TODO: Implementar subida real a Supabase Storage
                        setHasTicketUploaded(true)
                      }
                    }}
                  />
                </div>

                {hasTicketUploaded && (
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: '#22c55e'
                  }}>
                    🎉 ¡Ganarás +{generalRating === 5 ? 6 : generalRating === 4 ? 4 : generalRating === 3 ? 2 : 1} puntos con esta valoración!
                  </div>
                )}

                {!hasTicketUploaded && (
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: '#fbbf24'
                  }}>
                    ⚠️ Sin ticket no ganarás puntos, pero tu valoración se guardará igualmente.
                  </div>
                )}

                {ratingError && (
                  <div style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    ❌ {ratingError}
                  </div>
                )}

                <div className="btn-group" style={{ marginTop: '2rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => advanceStep(2)}
                    disabled={submittingRating}
                  >
                    ← Atrás
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={submitRating}
                    disabled={submittingRating}
                  >
                    {submittingRating ? 'Enviando...' : 'Enviar Valoración ✓'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success WITH Ticket (Points Earned) */}
          {currentStep === 4 && ratingResult?.hasTicket && (
            <div className="wizard-step active">
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 className="text-2xl font-bold mb-2">¡Valoración Enviada!</h3>
                <p className="text-muted mb-4">Gracias por tu participación en la comunidad.</p>

                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid #22c55e',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.25rem' }}>
                    +{ratingResult?.pointsEarned || 0} puntos
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                    Puntuación: {generalRating}/5 ⭐ para {selectedBurger?.name || 'la hamburguesa'}
                  </div>
                  
                  {/* Badges nuevos */}
                  {ratingResult?.newBadges && ratingResult.newBadges.length > 0 && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.25rem' }}>
                        🏅 ¡Nueva insignia desbloqueada!
                      </div>
                      {ratingResult.newBadges.map((badge: any, idx: number) => (
                        <div key={idx} style={{ fontSize: '1.2rem' }}>
                          {badge.emoji} {badge.name}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#fbbf24'
                  }}>
                    📈 Total de puntos: <strong>{ratingResult?.newTotal || 0}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <a 
                    href="/ranking"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#374151',
                      color: '#e5e7eb',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    🏆 Ver Ranking
                  </a>
                  <button 
                    onClick={() => resetRate()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#fbbf24',
                      color: '#1a1a1a',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    ⭐ Valorar Otra
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success WITHOUT Ticket (No Points) */}
          {currentStep === 4 && !ratingResult?.hasTicket && (
            <div className="wizard-step active">
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                <h3 className="text-2xl font-bold mb-2">Valoración Guardada</h3>
                <p className="text-muted mb-4">Tu opinión ayuda a la comunidad a encontrar las mejores burgers.</p>

                <div style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  border: '2px solid #fbbf24',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#e5e7eb', marginBottom: '1rem' }}>
                    Puntuación: {generalRating}/5 ⭐ para {selectedBurger?.name || 'la hamburguesa'}
                  </div>
                  
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(75, 85, 99, 0.3)',
                    borderRadius: '0.5rem',
                    border: '1px dashed #6b7280'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎫</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24', marginBottom: '0.25rem' }}>
                      ¿Tienes tu ticket?
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                      Sube una foto de tu ticket en tu próxima valoración para ganar puntos y desbloquear recompensas.
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <span>⭐5 = +6pts</span>
                      <span>•</span>
                      <span>⭐4 = +4pts</span>
                      <span>•</span>
                      <span>⭐3 = +2pts</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <a 
                    href="/ranking"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#374151',
                      color: '#e5e7eb',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    🏆 Ver Ranking
                  </a>
                  <button 
                    onClick={() => resetRate()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#fbbf24',
                      color: '#1a1a1a',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    ⭐ Valorar Otra
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Create New Burger */}
          {currentStep === 6 && (
            <div className="wizard-step active">
              <h3 className="text-lg font-bold mb-4">➕ Crear Nueva Hamburguesa</h3>
              
              {/* Success message */}
              {selectedBurger && (
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  ✅ Hamburguesa creada exitosamente. Ahora puedes valorarla.
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newBurgerName}
                  onChange={(e) => setNewBurgerName(e.target.value)}
                  placeholder="Ej: The Ultimate Burger"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={newBurgerDescription}
                  onChange={(e) => setNewBurgerDescription(e.target.value)}
                  placeholder="Ej: Con doble carne, queso cheddar y bacon..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Restaurante *</label>
                {!showNewRestaurant ? (
                  <>
                    <select
                      className="form-input"
                      value={newBurgerRestaurantId}
                      onChange={(e) => setNewBurgerRestaurantId(e.target.value)}
                    >
                      <option value="">Seleccionar restaurante...</option>
                      {restaurants.length > 0 && restaurants.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewRestaurant(true)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#374151',
                        color: '#e5e7eb',
                        border: '1px solid #4b5563',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ➕ Crear Nuevo Restaurante
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      value={newBurgerRestaurantName}
                      onChange={(e) => setNewBurgerRestaurantName(e.target.value)}
                      placeholder="Nombre del nuevo restaurante"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewRestaurant(false)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#374151',
                        color: '#e5e7eb',
                        border: '1px solid #4b5563',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ← Seleccionar de lista
                    </button>
                  </>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Ciudad *</label>
                {!showNewCity ? (
                  <>
                    <select
                      className="form-input"
                      value={newBurgerCityId}
                      onChange={(e) => setNewBurgerCityId(e.target.value)}
                    >
                      <option value="">Seleccionar ciudad...</option>
                      {cities.length > 0 && cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCity(true)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#374151',
                        color: '#e5e7eb',
                        border: '1px solid #4b5563',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ➕ Crear Nueva Ciudad
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      value={newBurgerCityName}
                      onChange={(e) => setNewBurgerCityName(e.target.value)}
                      placeholder="Nombre de la nueva ciudad"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewCity(false)}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: '#374151',
                        color: '#e5e7eb',
                        border: '1px solid #4b5563',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ← Seleccionar de lista
                    </button>
                  </>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Imagen URL (opcional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={newBurgerImageUrl}
                  onChange={(e) => setNewBurgerImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {newBurgerImageUrl && (
                  <img 
                    src={newBurgerImageUrl} 
                    alt="Preview"
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '150px', 
                      marginTop: '0.5rem',
                      borderRadius: '0.5rem'
                    }}
                    onError={() => {}}
                  />
                )}
              </div>
              
              <div className="btn-group" style={{ marginTop: '2rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    advanceStep(1)
                    setNewBurgerName('')
                    setNewBurgerRestaurantId('')
                    setNewBurgerCityId('')
                    setNewBurgerDescription('')
                    setNewBurgerImageUrl('')
                  }}
                  disabled={loadingForm}
                >
                  ← Atrás
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    if (!newBurgerName) {
                      alert('Por favor completa el nombre de la hamburguesa')
                      return
                    }
                    
                    if (!showNewRestaurant && !newBurgerRestaurantId) {
                      alert('Por favor selecciona o crea un restaurante')
                      return
                    }
                    
                    if (!showNewCity && !newBurgerCityId) {
                      alert('Por favor selecciona o crea una ciudad')
                      return
                    }
                    
                    if (showNewRestaurant && !newBurgerRestaurantName) {
                      alert('Por favor ingresa el nombre del restaurante')
                      return
                    }
                    
                    if (showNewCity && !newBurgerCityName) {
                      alert('Por favor ingresa el nombre de la ciudad')
                      return
                    }
                    
                    setLoadingForm(true)
                    try {
                      let finalRestaurantId = newBurgerRestaurantId
                      let finalCityId = newBurgerCityId
                      
                      // PRIMERO: Create new city if needed (restaurante necesita city_id)
                      if (showNewCity) {
                        const cityRes = await fetch('/api/cities/create', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: newBurgerCityName })
                        })
                        
                        if (!cityRes.ok) {
                          const error = await cityRes.json()
                          throw new Error('Error al crear ciudad: ' + error.error)
                        }
                        
                        const city = await cityRes.json()
                        finalCityId = city.id
                      }
                      
                      // SEGUNDO: Create new restaurant if needed (ahora tenemos city_id)
                      if (showNewRestaurant) {
                        const resRes = await fetch('/api/restaurants/create', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: newBurgerRestaurantName, city_id: finalCityId })
                        })
                        
                        if (!resRes.ok) {
                          const error = await resRes.json()
                          throw new Error('Error al crear restaurante: ' + error.error)
                        }
                        
                        const restaurant = await resRes.json()
                        finalRestaurantId = restaurant.id
                      }
                      
                      const response = await fetch('/api/burgers/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: newBurgerName,
                          description: newBurgerDescription,
                          restaurant_id: finalRestaurantId,
                          city_id: finalCityId,
                          image_url: newBurgerImageUrl || null,
                        })
                      })
                      
                      if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || 'Error al crear la hamburguesa')
                      }
                      
                      const burger = await response.json()
                      
                      // Set the new burger as selected and advance
                      setSelectedBurger({
                        id: burger.id,
                        name: burger.name,
                        description: burger.description || '',
                        restaurant: newBurgerRestaurantName || restaurants.find(r => r.id === burger.restaurant_id)?.name || 'Restaurante',
                        restaurant_id: burger.restaurant_id,
                        city: newBurgerCityName || cities.find(c => c.id === burger.city_id)?.name || 'Ciudad',
                        city_id: burger.city_id,
                        rating: 0,
                        reviews: 0,
                        userRating: 0,
                        type: 'premium',
                        position: 0,
                        tags: burger.tags || [],
                        image_url: burger.image_url
                      })
                      
                      // Clear form
                      setNewBurgerName('')
                      setNewBurgerRestaurantId('')
                      setNewBurgerRestaurantName('')
                      setNewBurgerCityId('')
                      setNewBurgerCityName('')
                      setNewBurgerDescription('')
                      setNewBurgerImageUrl('')
                      setShowNewRestaurant(false)
                      setShowNewCity(false)
                      
                      // Advance to rating step
                      advanceStep(2)
                    } catch (error) {
                      console.error('Error:', error)
                      alert(error instanceof Error ? error.message : 'Error al crear la hamburguesa')
                    } finally {
                      setLoadingForm(false)
                    }
                  }}
                  disabled={loadingForm}
                >
                  {loadingForm ? 'Creando...' : '✅ Crear y Valorar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para actualizar valoración existente */}
      {showUpdateConfirm && pendingExistingRating && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelUpdateRating()
          }}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              border: '2px solid #f59e0b',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem' }}>🍔</span>
            </div>
            
            <h3 style={{ 
              color: '#f59e0b', 
              textAlign: 'center', 
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              ¡Ya valoraste esta burger!
            </h3>
            
            <p style={{ 
              color: '#d1d5db', 
              textAlign: 'center', 
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Tu valoración anterior fue:
            </p>
            
            <div style={{
              backgroundColor: '#374151',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                {'⭐'.repeat(pendingExistingRating.overall_rating || 0)}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                {pendingExistingRating.overall_rating}/5 estrellas
              </div>
              {pendingExistingRating.comment && (
                <div style={{ 
                  color: '#d1d5db', 
                  marginTop: '0.5rem', 
                  fontStyle: 'italic',
                  fontSize: '0.9rem'
                }}>
                  "{pendingExistingRating.comment}"
                </div>
              )}
            </div>
            
            <p style={{ 
              color: '#9ca3af', 
              textAlign: 'center', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              ¿Quieres actualizar tu puntuación con los nuevos valores?
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center' 
            }}>
              <button
                onClick={cancelUpdateRating}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#374151',
                  color: '#d1d5db',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
              >
                ❌ Cancelar
              </button>
              <button
                onClick={confirmUpdateRating}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f59e0b',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
              >
                ✅ Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
