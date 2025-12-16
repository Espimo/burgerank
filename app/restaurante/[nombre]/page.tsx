'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAdmin } from '@/app/contexts/AdminContext';
import { AdminBadge } from '@/app/components/AdminBadge';
import { AdminEditButton } from '@/app/components/AdminEditButton';
import { AdminEditRestaurantModal } from '@/app/components/AdminEditRestaurantModal';
import { useAdminData, Restaurant } from '@/app/hooks/useAdminData';

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
