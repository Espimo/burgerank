'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';
import AffiliateCTA from '@/app/components/AffiliateCTA';

interface Restaurant {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  hours: string | null;
  website: string | null;
  delivery_url: string | null;
  reservation_url: string | null;
  average_rating: number;
  total_ratings: number;
  banner_url: string | null;
  logo_url: string | null;
  city: {
    name: string;
  };
}

interface Burger {
  id: string;
  name: string;
  description: string | null;
  average_rating: number;
  total_ratings: number;
  tags: string[] | null;
  position: number | null;
  image_url: string | null;
}

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  valid_until: string | null;
  terms: string | null;
  emoji: string | null;
}

interface Rating {
  id: string;
  overall_rating: number;
  comment: string | null;
  created_at: string;
  user: {
    username: string;
  };
  burger: {
    name: string;
  };
}

const getStars = (rating: number) => {
  const stars = Math.round(rating);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

export default function RestaurantePage() {
  const params = useParams();
  const nombre = decodeURIComponent(params?.nombre as string || '');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurantData() {
      if (!nombre) {
        console.log('No restaurant name provided');
        setLoading(false);
        return;
      }

      console.log('Loading restaurant data for:', nombre);
      const supabase = createClient();

      try {
        // Buscar restaurante por nombre - intentar coincidencia exacta primero
        let { data: restData, error: restError } = await supabase
          .from('restaurants')
          .select('*, city:cities(name)')
          .ilike('name', nombre)
          .single();

        console.log('First query result:', { restData, restError });

        // Si no encuentra, intentar con búsqueda parcial
        if (restError || !restData) {
          const { data: partialData, error: partialError } = await supabase
            .from('restaurants')
            .select('*, city:cities(name)')
            .ilike('name', `%${nombre}%`)
            .limit(1)
            .single();
          
          console.log('Partial search result:', { partialData, partialError });
          
          if (partialData) {
            restData = partialData;
            restError = null;
          }
        }

        // También intentar buscar si el nombre está en formato slug
        if (restError || !restData) {
          // Convertir slug a nombre (reemplazar - por espacios)
          const nameFromSlug = nombre.replace(/-/g, ' ');
          console.log('Trying slug format:', nameFromSlug);
          
          const { data: slugData, error: slugError } = await supabase
            .from('restaurants')
            .select('*, city:cities(name)')
            .ilike('name', nameFromSlug)
            .single();
          
          console.log('Slug search result:', { slugData, slugError });
          
          if (slugData) {
            restData = slugData;
            restError = null;
          }
        }

        if (restError || !restData) {
          console.log('Restaurant not found after all attempts:', nombre);
          setLoading(false);
          return;
        }

        const restaurant = restData as Restaurant;
        console.log('Restaurant found:', restaurant.name);
        setRestaurant(restaurant);

      // Cargar hamburguesas del restaurante
      const { data: burgersData } = await supabase
        .from('burgers')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('average_rating', { ascending: false });

      if (burgersData) setBurgers(burgersData);

      // Cargar promociones activas
      const { data: promoData } = await supabase
        .from('restaurant_promotions')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (promoData) setPromotions(promoData);

      // Cargar valoraciones de las hamburguesas de este restaurante
      if (burgersData && burgersData.length > 0) {
        const burgerIds = (burgersData as any[]).map((b: any) => b.id);
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select(`
            id,
            overall_rating,
            comment,
            created_at,
            user:users(username),
            burger:burgers(name)
          `)
          .in('burger_id', burgerIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (ratingsData) setRatings(ratingsData as any);
      }

      setLoading(false);
      } catch (error) {
        console.error('Error loading restaurant:', error);
        setLoading(false);
      }
    }

    if (nombre) {
      loadRestaurantData();
    }
  }, [nombre]);

  if (loading) {
    return (
      <div className="container">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍔</div>
          <div>Cargando...</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="main" style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ marginBottom: '1rem' }}>Restaurante no encontrado</h2>
          <Link href="/ranking" style={{ color: '#fbbf24' }}>
            ← Volver al ranking
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="container">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        {/* Banner del Restaurante */}
        {restaurant.banner_url && (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            borderRadius: '0.75rem', 
            overflow: 'hidden',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <img 
              src={restaurant.banner_url} 
              alt={`Banner de ${restaurant.name}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
            {restaurant.logo_url && (
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '20px',
                width: '80px',
                height: '80px',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                border: '3px solid #1f2937',
                backgroundColor: '#fff'
              }}>
                <img 
                  src={restaurant.logo_url}
                  alt={`Logo de ${restaurant.name}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    padding: '4px'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Header del Restaurante */}
        <div style={{ marginBottom: '1.5rem', marginTop: restaurant.logo_url && restaurant.banner_url ? '40px' : '0' }}>
          <Link href="/ranking" style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Volver al ranking
          </Link>
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            {!restaurant.banner_url && '🏪 '}{restaurant.name}
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
            📍 {restaurant.city.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
              {getStars(Math.round(restaurant.average_rating))}
            </span>
            <span style={{ fontWeight: '600', color: '#fbbf24' }}>
              {restaurant.average_rating.toFixed(1)}/5
            </span>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              ({restaurant.total_ratings} valoraciones)
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="card mb-4" style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {restaurant.delivery_url && (
              <a
                href={restaurant.delivery_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  padding: '0.875rem',
                  minHeight: '2.75rem', // 44px touch target
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  textAlign: 'center',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🛵 Delivery
              </a>
            )}
            {restaurant.reservation_url && (
              <a
                href={restaurant.reservation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  padding: '0.875rem',
                  minHeight: '2.75rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  textAlign: 'center',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📅 Reservar Mesa
              </a>
            )}
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  padding: '0.875rem',
                  minHeight: '2.75rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  textAlign: 'center',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  border: '1px solid #4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🌐 Web
              </a>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="card mb-4">
          <h3 className="font-semibold mb-3" style={{ fontSize: '1.1rem' }}>ℹ️ Información</h3>
          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem' }}>
            {restaurant.address && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>Dirección:</span>
                <span style={{ color: '#d1d5db' }}>{restaurant.address}</span>
              </div>
            )}
            {restaurant.phone && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>Teléfono:</span>
                <a href={`tel:${restaurant.phone}`} style={{ color: '#60a5fa' }}>{restaurant.phone}</a>
              </div>
            )}
            {restaurant.hours && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>Horario:</span>
                <span style={{ color: '#d1d5db' }}>{restaurant.hours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Promociones */}
        {promotions.length > 0 && (
          <div className="card mb-4">
            <h3 className="font-semibold mb-3" style={{ fontSize: '1.1rem' }}>🎉 Promociones Activas</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                    borderLeft: '4px solid #fbbf24',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>{promo.emoji || '🎉'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {promo.title}
                        {promo.discount_percentage && (
                          <span style={{ marginLeft: '0.5rem', color: '#fbbf24' }}>
                            {promo.discount_percentage}% OFF
                          </span>
                        )}
                      </div>
                      {promo.description && (
                        <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                          {promo.description}
                        </div>
                      )}
                      {promo.valid_until && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Válido hasta: {new Date(promo.valid_until).toLocaleDateString('es-ES')}
                        </div>
                      )}
                      {promo.terms && (
                        <details style={{ marginTop: '0.5rem' }}>
                          <summary style={{ fontSize: '0.75rem', color: '#9ca3af', cursor: 'pointer' }}>
                            Ver términos y condiciones
                          </summary>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem', paddingLeft: '1rem' }}>
                            {promo.terms}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hamburguesas en el Ranking */}
        <div className="card mb-4">
          <h3 className="font-semibold mb-3" style={{ fontSize: '1.1rem' }}>
            🍔 Hamburguesas en el Ranking ({burgers.length})
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {burgers.map((burger) => (
              <div
                key={burger.id}
                style={{
                  backgroundColor: '#374151',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Imagen de la hamburguesa - estilo ranking */}
                <div style={{ 
                  width: '100%',
                  height: '140px',
                  background: burger.image_url 
                    ? `url(${burger.image_url}) center/cover`
                    : 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  position: 'relative'
                }}>
                  {!burger.image_url && '🍔'}
                  {/* Badge de posición */}
                  {burger.position && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      width: '40px',
                      height: '40px',
                      background: burger.position <= 3 
                        ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                        : burger.position <= 10 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : '#374151',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: burger.position <= 3 ? '1.2rem' : '0.9rem',
                      color: burger.position <= 10 ? '#1a1a1a' : '#e5e7eb',
                      boxShadow: burger.position <= 3 
                        ? '0 2px 8px rgba(251, 191, 36, 0.3)'
                        : burger.position <= 10
                          ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                          : 'none'
                    }}>
                      {burger.position <= 3 ? ['🥇', '🥈', '🥉'][burger.position - 1] : `#${burger.position}`}
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {burger.name}
                  </div>
                  {burger.description && (
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#d1d5db', 
                      marginBottom: '0.5rem',
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
                  {burger.tags && burger.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {burger.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
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
                  )}
                  
                  {/* Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '600' }}>
                      ★ {burger.average_rating.toFixed(1)}/5
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {burger.total_ratings} valoraciones
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comentarios */}
        {ratings.length > 0 && (
          <div className="card mb-4">
            <h3 className="font-semibold mb-3" style={{ fontSize: '1.1rem' }}>
              💬 Comentarios Recientes
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {ratings.filter(r => r.comment).map((rating) => (
                <div
                  key={rating.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#374151',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        @{rating.user.username}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {rating.burger.name} • {formatDate(rating.created_at)}
                      </div>
                    </div>
                    <div style={{ color: '#fbbf24' }}>
                      {getStars(rating.overall_rating)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                    {rating.comment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA de Afiliación - Sticky en móvil */}
      {restaurant && (
        <AffiliateCTA
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          sourcePage="restaurant"
          variant="sticky"
          showAlternatives={true}
        />
      )}

      <BottomNav />
    </div>
  );
}

