'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/app/contexts/AuthContext'

interface UserRating {
  id: string;
  overall_rating: number;
  pan_rating: number | null;
  carne_rating: number | null;
  toppings_rating: number | null;
  salsa_rating: number | null;
  comment: string | null;
  created_at: string;
  burger: {
    id: string;
    name: string;
    description: string | null;
    restaurant: {
      name: string;
      city: {
        name: string;
      };
    };
  };
}

export default function MyRatingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ratings, setRatings] = useState<UserRating[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date')
  const { authUser, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Esperar a que el contexto de auth termine de cargar
    if (authLoading) {
      return
    }

    if (!authUser) {
      router.push('/auth/signin')
      return
    }

    loadRatings()
  }, [authUser, authLoading, sortBy, router])

  async function loadRatings() {
    if (!authUser) return

    const supabase = createClient()
    
    const orderBy = sortBy === 'date' ? 'created_at' : 'overall_rating'
    const ascending = sortBy === 'rating' ? false : false

    const { data, error } = await supabase
      .from('ratings')
      .select(`
        id,
        overall_rating,
        pan_rating,
        carne_rating,
        toppings_rating,
        salsa_rating,
        comment,
        created_at,
        burger:burgers(
          id,
          name,
          description,
          image_url,
          restaurant:restaurants(
            name,
            city:cities(name)
          )
        )
      `)
      .eq('user_id', authUser.id)
      .order(orderBy, { ascending })

    if (error) {
      console.error('Error loading ratings:', error)
    } else if (data) {
      setRatings(data as any)
    }

    setPageLoading(false)
  }

  const getStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return date.toLocaleDateString('es-ES')
  }

  const getAverageComponents = (rating: UserRating) => {
    const components = [
      rating.pan_rating,
      rating.carne_rating,
      rating.toppings_rating,
      rating.salsa_rating
    ].filter(r => r !== null) as number[]

    if (components.length === 0) return 0
    return (components.reduce((a, b) => a + b, 0) / components.length).toFixed(1)
  }

  return (
    <div className="container">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="text-2xl font-bold mb-2">⭐ Mis Valoraciones</h2>
          <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            Has valorado <span style={{ color: '#fbbf24', fontWeight: '600' }}>{ratings.length}</span> hamburguesas
          </div>
        </div>

        {/* Filtros */}
        <div className="card mb-4" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.5rem' }}>
            Ordenar por:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setSortBy('date')}
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: sortBy === 'date' ? '#fbbf24' : '#374151',
                color: sortBy === 'date' ? '#000' : '#e5e7eb',
                border: sortBy === 'date' ? 'none' : '1px solid #4b5563',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              📅 Fecha
            </button>
            <button
              onClick={() => setSortBy('rating')}
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: sortBy === 'rating' ? '#fbbf24' : '#374151',
                color: sortBy === 'rating' ? '#000' : '#e5e7eb',
                border: sortBy === 'rating' ? 'none' : '1px solid #4b5563',
                borderRadius: '0.375rem',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              ⭐ Puntuación
            </button>
          </div>
        </div>

        {/* Lista de Valoraciones */}
        {pageLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍔</div>
            <div style={{ color: '#9ca3af' }}>Cargando tus valoraciones...</div>
          </div>
        ) : ratings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Aún no has valorado ninguna hamburguesa
            </div>
            <div style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              ¡Empieza a valorar y comparte tu opinión!
            </div>
            <a
              href="/ranking"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#fbbf24',
                color: '#000',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Ver Ranking
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {ratings.map((rating) => (
              <div key={rating.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                {/* Imagen de la hamburguesa */}
                {rating.burger.image_url && (
                  <div style={{ flexShrink: 0 }}>
                    <img 
                      src={rating.burger.image_url}
                      alt={rating.burger.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        🍔 {rating.burger.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        {rating.burger.restaurant.name} • {rating.burger.restaurant.city.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: '600' }}>
                        {getStars(rating.overall_rating)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {formatDate(rating.created_at)}
                      </div>
                    </div>
                  </div>

                {/* Descripción de la burger */}
                {rating.burger.description && (
                  <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    {rating.burger.description}
                  </div>
                )}

                {/* Componentes detallados */}
                {(rating.pan_rating || rating.carne_rating || rating.toppings_rating || rating.salsa_rating) && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                    gap: '0.5rem', 
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(75, 85, 99, 0.3)',
                    borderRadius: '0.375rem'
                  }}>
                    {rating.pan_rating && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>🥖 Pan</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24' }}>{rating.pan_rating}/3</div>
                      </div>
                    )}
                    {rating.carne_rating && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>🥩 Carne</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24' }}>{rating.carne_rating}/3</div>
                      </div>
                    )}
                    {rating.toppings_rating && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>🥬 Toppings</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24' }}>{rating.toppings_rating}/3</div>
                      </div>
                    )}
                    {rating.salsa_rating && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>🍅 Salsa</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24' }}>{rating.salsa_rating}/3</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Comentario */}
                {rating.comment && (
                  <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'rgba(251, 191, 36, 0.05)', 
                    borderLeft: '3px solid #fbbf24',
                    borderRadius: '0.375rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                      💬 Tu comentario:
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
                      {rating.comment}
                    </div>
                  </div>
                )}

                {/* Botón para ver restaurante */}
                <a
                  href={`/restaurante/${encodeURIComponent(rating.burger.restaurant.name)}`}
                  style={{
                    display: 'block',
                    padding: '0.5rem',
                    backgroundColor: '#374151',
                    color: '#e5e7eb',
                    textAlign: 'center',
                    borderRadius: '0.375rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    border: '1px solid #4b5563'
                  }}
                >
                  Ver Restaurante →
                </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
