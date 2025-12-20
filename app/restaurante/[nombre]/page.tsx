'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';

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
      const supabase = createClient();

      // Buscar restaurante por nombre
      const { data: restData, error: restError } = await supabase
        .from('restaurants')
        .select('*, city:cities(name)')
        .ilike('name', nombre)
        .single();

      if (restError || !restData) {
        setLoading(false);
        return;
      }

      setRestaurant(restData as any);

      // Cargar hamburguesas del restaurante
      const { data: burgersData } = await supabase
        .from('burgers')
        .select('*')
        .eq('restaurant_id', restData.id)
        .order('average_rating', { ascending: false });

      if (burgersData) setBurgers(burgersData);

      // Cargar promociones activas
      const { data: promoData } = await supabase
        .from('restaurant_promotions')
        .select('*')
        .eq('restaurant_id', restData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (promoData) setPromotions(promoData);

      // Cargar valoraciones de las hamburguesas de este restaurante
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
        .in('burger_id', burgersData?.map(b => b.id) || [])
        .order('created_at', { ascending: false })
        .limit(10);

      if (ratingsData) setRatings(ratingsData as any);

      setLoading(false);
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
        {/* Header del Restaurante */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/ranking" style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Volver al ranking
          </Link>
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>
            🏪 {restaurant.name}
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
                  padding: '0.75rem',
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
                  padding: '0.75rem',
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
                  padding: '0.75rem',
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
                  padding: '1rem',
                  backgroundColor: '#374151',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      {burger.position && <span style={{ color: '#fbbf24', marginRight: '0.5rem' }}>#{burger.position}</span>}
                      {burger.name}
                    </div>
                    {burger.description && (
                      <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                        {burger.description}
                      </div>
                    )}
                    {burger.tags && burger.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {burger.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: '#fbbf24',
                              color: '#000',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontWeight: '500'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                    <div style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '600' }}>
                      ★ {burger.average_rating.toFixed(1)}
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

      <BottomNav />
    </div>
  );
}

interface Burger {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
}

interface Rating {
  id: number;
  username: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

const restaurantsData: {
  [key: string]: {
    name: string;
    city: string;
    address: string;
    phone: string;
    website: string;
    averageRating: number;
    totalReviews: number;
    openingHours: string;
    burgers: Burger[];
    ratings: Rating[];
  };
} = {
  'Burger Palace': {
    name: 'Burger Palace',
    city: 'Madrid',
    address: 'Calle Principal 123, 28001',
    phone: '+34 91 234 5678',
    website: 'www.burgerpalace.es',
    averageRating: 4.8,
    totalReviews: 245,
    openingHours: '12:00 - 23:30',
    burgers: [
      {
        id: 1,
        name: 'The King',
        price: 12.99,
        rating: 9.7,
        reviews: 52,
        description: 'Doble carne, queso cheddar, bacon, lechuga y tomate',
        tags: ['Clásica', 'Doble carne', 'Premium'],
      },
      {
        id: 2,
        name: 'Royal Deluxe',
        price: 14.99,
        rating: 9.5,
        reviews: 38,
        description: 'Triple carne con setas salteadas y queso azul',
        tags: ['Premium', 'Gourmet'],
      },
      {
        id: 3,
        name: 'BBQ Smoke',
        price: 11.99,
        rating: 9.2,
        reviews: 31,
        description: 'Carne ahumada con salsa BBQ casera',
        tags: ['Ahumada', 'BBQ'],
      },
      {
        id: 4,
        name: 'Vegetariana Deluxe',
        price: 10.99,
        rating: 8.8,
        reviews: 24,
        description: 'Lenteja especiada, aguacate y vegetales frescos',
        tags: ['Vegetariana', 'Saludable'],
      },
      {
        id: 5,
        name: 'Picante Jalapeño',
        price: 11.99,
        rating: 8.6,
        reviews: 19,
        description: 'Carne especiada con jalapeños frescos y salsa picante',
        tags: ['Picante', 'Especiada'],
      },
    ],
    ratings: [
      {
        id: 1,
        username: '@usuario_burguer',
        rating: 5,
        comment: 'Excelente atención y hamburguesas increíbles. Vuelvo seguro.',
        daysAgo: 2,
      },
      {
        id: 2,
        username: '@foodlover_madrid',
        rating: 5,
        comment: 'The King es la mejor hamburguesa que he probado.',
        daysAgo: 5,
      },
      {
        id: 3,
        username: '@crítico_gastro',
        rating: 4,
        comment: 'Muy bueno, aunque un poco caro. Recomendado.',
        daysAgo: 8,
      },
    ],
  },
  'The Smokehouse': {
    name: 'The Smokehouse',
    city: 'Barcelona',
    address: 'Paseo de Gracia 456, 08007',
    phone: '+34 93 234 5678',
    website: 'www.thesmokehouse.es',
    averageRating: 4.7,
    totalReviews: 189,
    openingHours: '13:00 - 22:30',
    burgers: [
      {
        id: 1,
        name: 'Smoky BBQ Delight',
        price: 13.99,
        rating: 9.4,
        reviews: 45,
        description: 'Carne ahumada con salsa BBQ premium',
        tags: ['Ahumada', 'BBQ', 'Specialty'],
      },
      {
        id: 2,
        name: 'Smoke Master',
        price: 15.99,
        rating: 9.3,
        reviews: 38,
        description: 'Carnes ahumadas mixtas con humo de roble',
        tags: ['Premium', 'Ahumada'],
      },
    ],
    ratings: [
      {
        id: 1,
        username: '@slowfood_barcelona',
        rating: 5,
        comment: 'El humo está trabajado a la perfección.',
        daysAgo: 3,
      },
      {
        id: 2,
        username: '@carnivore_bcn',
        rating: 5,
        comment: 'Las mejores hamburguesas ahumadas de Barcelona.',
        daysAgo: 10,
      },
    ],
  },
  'Gourmet Burgers Co.': {
    name: 'Gourmet Burgers Co.',
    city: 'Sevilla',
    address: 'Avenida Constitución 789, 41002',
    phone: '+34 95 234 5678',
    website: 'www.gourmetburgers.es',
    averageRating: 4.9,
    totalReviews: 267,
    openingHours: '12:00 - 00:00',
    burgers: [
      {
        id: 1,
        name: 'Gourmet Cheese Premium',
        price: 16.99,
        rating: 9.6,
        reviews: 72,
        description: 'Triple queso premium: cheddar, azul y brie',
        tags: ['Gourmet', 'Premium', 'Quesos'],
      },
      {
        id: 2,
        name: 'Executive Gold',
        price: 18.99,
        rating: 9.8,
        reviews: 64,
        description: 'Carnes premium con trufa negra y queso de cabra',
        tags: ['Luxury', 'Trufa', 'Premium'],
      },
    ],
    ratings: [
      {
        id: 1,
        username: '@chef_sevilla',
        rating: 5,
        comment: 'La combinación de quesos es arte puro.',
        daysAgo: 1,
      },
      {
        id: 2,
        username: '@gastrónomo_es',
        rating: 5,
        comment: 'Executive Gold es la experiencia más premium que he tenido.',
        daysAgo: 7,
      },
    ],
  },
};

const getStars = (rating: number) => {
  const stars = Math.round(rating / 2);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

export default function RestaurantePage() {
  const searchParams = useSearchParams();
  const nombre = decodeURIComponent(searchParams.get('nombre') || '');
  const { isAdmin } = useAdmin();
  const { data } = useAdminData();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const restaurant = restaurantsData[nombre];

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurante no encontrado</h1>
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/50 border-b-2 border-amber-600 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/rankings" className="text-2xl hover:scale-110 transition-transform">
              ←
            </Link>
            <h1 className="text-2xl font-bold text-amber-400">🍔 BurgeRank</h1>
          </div>
          {isAdmin && <AdminBadge />}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Nombre y Rating */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">🏪 {restaurant.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span style={{ color: '#fbbf24' }}>{getStars(restaurant.averageRating * 2)}</span>
              <span className="text-amber-400 font-semibold">{restaurant.averageRating}/5</span>
              <span className="text-gray-400">({restaurant.totalReviews} reseñas)</span>
            </div>
          </div>
        </div>

        {/* Información del Restaurante */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">ℹ️ Información</h2>
            {isAdmin && (
              <AdminEditButton
                label="Editar"
                icon="✏️"
                onClick={() => {
                  const restaurantData = data.restaurants.find(r => r.name === restaurant.name);
                  if (restaurantData) {
                    setEditingRestaurant(restaurantData);
                    setModalOpen(true);
                  } else {
                    // Create a restaurant object if not found in admin data
                    const newRestaurant: Restaurant = {
                      id: Math.max(...data.restaurants.map(r => r.id), 0) + 1,
                      name: restaurant.name,
                      city: restaurant.city,
                      address: restaurant.address,
                      phone: restaurant.phone,
                      hours: restaurant.openingHours,
                      website: restaurant.website,
                      rating: restaurant.averageRating,
                      reviews: restaurant.totalReviews
                    };
                    setEditingRestaurant(newRestaurant);
                    setModalOpen(true);
                  }
                }}
              />
            )}
          </div>
          <div className="space-y-2 text-gray-300">
            <div>
              <span className="text-amber-400 font-semibold">Dirección:</span> {restaurant.address}
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Ciudad:</span> {restaurant.city}
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Teléfono:</span> {restaurant.phone}
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Web:</span> {restaurant.website}
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Horario:</span> {restaurant.openingHours}
            </div>
          </div>
        </div>

        {/* Hamburguesas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">🍔 Nuestras Hamburguesas</h2>
          <div className="grid gap-4">
            {restaurant.burgers.map((burger) => (
              <div key={burger.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{burger.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{burger.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-bold text-lg">${burger.price}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2 flex-wrap">
                    {burger.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span style={{ color: '#fbbf24' }}>★</span> {burger.rating}/10
                    </div>
                    <div className="text-xs text-gray-400">{burger.reviews} valoraciones</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reseñas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">💬 Reseñas de Usuarios</h2>
          <div className="space-y-3">
            {restaurant.ratings.map((rating) => (
              <div key={rating.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">👤 {rating.username}</div>
                    <div className="text-sm text-gray-400">Hace {rating.daysAgo} días</div>
                  </div>
                  <span style={{ color: '#fbbf24' }} className="text-lg">
                    {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                  </span>
                </div>
                <p className="text-gray-300">{rating.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/rankings"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-semibold transition-colors"
        >
          ← Volver a Rankings
        </Link>

        {/* Admin Edit Modal */}
        {editingRestaurant && (
          <AdminEditRestaurantModal
            restaurant={editingRestaurant}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingRestaurant(null);
            }}
            onSave={() => {
              // Reload data if needed
            }}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800/80 border-t border-gray-700 flex justify-around items-center z-40">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-gray-400 text-sm hover:text-amber-400 hover:scale-110 transition-all"
        >
          <span className="text-xl">🏆</span>
          <span>Inicio</span>
        </Link>
        <Link
          href="/rate"
          className="flex flex-col items-center gap-1 text-gray-400 text-sm hover:text-amber-400 hover:scale-110 transition-all"
        >
          <span className="text-xl">⭐</span>
          <span>Valorar</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-gray-400 text-sm hover:text-amber-400 hover:scale-110 transition-all"
        >
          <span className="text-xl">👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
