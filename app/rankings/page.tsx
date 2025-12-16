'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdmin } from '@/app/contexts/AdminContext';
import { AdminBadge } from '@/app/components/AdminBadge';
import { AdminEditButton } from '@/app/components/AdminEditButton';
import { AdminEditRestaurantModal } from '@/app/components/AdminEditRestaurantModal';
import { useAdminData, Restaurant } from '@/app/hooks/useAdminData';

interface Hamburger {
  id: number;
  name: string;
  restaurant: string;
  city: string;
  rating: number;
  reviews: number;
  position: number;
  description: string;
  tags: string[];
  userRating: number;
}

// Datos de ejemplo
const rankingsData: Hamburger[] = [
  {
    id: 1,
    name: 'The King',
    restaurant: 'Burger Palace',
    city: 'Madrid',
    rating: 9.7,
    reviews: 523,
    position: 1,
    description: 'Hamburguesa increíble, muy jugosa y bien presentada.',
    tags: ['Ternera', 'BBQ', 'Bacon'],
    userRating: 5,
  },
  {
    id: 2,
    name: 'Smoky BBQ Delight',
    restaurant: 'The Smokehouse',
    city: 'Barcelona',
    rating: 9.5,
    reviews: 421,
    position: 2,
    description: 'Excelente sabor ahumado. Un poco más de carne habría sido perfecto.',
    tags: ['Ternera', 'BBQ', 'Ahumado'],
    userRating: 4,
  },
  {
    id: 3,
    name: 'Doble Sabor Clásico',
    restaurant: 'Hamburguesería Las Delicias',
    city: 'Valencia',
    rating: 9.3,
    reviews: 387,
    position: 3,
    description: 'Muy buena relación calidad-precio. Recomendado.',
    tags: ['Doble', 'Queso', 'Clásica'],
    userRating: 4,
  },
  {
    id: 4,
    name: 'Gourmet Cheese Premium',
    restaurant: 'Gourmet Burgers Co.',
    city: 'Sevilla',
    rating: 9.1,
    reviews: 312,
    position: 4,
    description: 'Los quesos combinan perfectamente, una experiencia premium.',
    tags: ['Premium', 'Queso', 'Gourmet'],
    userRating: 0,
  },
  {
    id: 5,
    name: 'Picante Jalapeño',
    restaurant: 'Taquería Mexicana',
    city: 'Madrid',
    rating: 8.9,
    reviews: 289,
    position: 5,
    description: 'Muy picante para algunos, pero deliciosa. Ideal con cerveza fría.',
    tags: ['Jalapeño', 'Picante', 'Mexicana'],
    userRating: 0,
  },
  {
    id: 6,
    name: 'Clásica Americana',
    restaurant: 'Route 66 Diner',
    city: 'Bilbao',
    rating: 8.7,
    reviews: 256,
    position: 6,
    description: 'Auténtica hamburguesa americana. Tamaño generoso.',
    tags: ['Americana', 'Clásica', 'Grande'],
    userRating: 0,
  },
  {
    id: 7,
    name: 'Vegetariana Gourmet',
    restaurant: 'Green Burgers',
    city: 'Barcelona',
    rating: 8.5,
    reviews: 198,
    position: 7,
    description: 'Sorprendentemente deliciosa incluso sin carne. La lenteja está perfecta.',
    tags: ['Vegetariana', 'Lenteja', 'Gourmet'],
    userRating: 0,
  },
  {
    id: 8,
    name: 'Smash Burger Crujiente',
    restaurant: 'Burger Lab',
    city: 'Valencia',
    rating: 8.3,
    reviews: 167,
    position: 8,
    description: 'Técnica smash ejecutada correctamente. Muy crujiente por fuera.',
    tags: ['Smash', 'Crujiente', 'Técnica'],
    userRating: 0,
  },
  {
    id: 9,
    name: 'Bacon & Huevo',
    restaurant: 'El Desayunador',
    city: 'Madrid',
    rating: 8.1,
    reviews: 145,
    position: 9,
    description: 'Buen desayuno, pero el huevo estaba ligeramente pasado.',
    tags: ['Bacon', 'Huevo', 'Desayuno'],
    userRating: 0,
  },
  {
    id: 10,
    name: 'Trufada Negra',
    restaurant: 'Premium Burgers',
    city: 'Sevilla',
    rating: 7.9,
    reviews: 123,
    position: 10,
    description: 'La trufa le da un toque especial, un poco cara pero vale la pena.',
    tags: ['Trufa', 'Premium', 'Especial'],
    userRating: 0,
  },
];

const getMedalColor = (position: number): { medal: string; color: string; bgColor: string } => {
  switch (position) {
    case 1:
      return { medal: '🥇', color: '#fbbf24', bgColor: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' };
    case 2:
      return { medal: '🥈', color: '#f59e0b', bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' };
    case 3:
      return { medal: '🥉', color: '#d97706', bgColor: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' };
    default:
      return { medal: `${position}º`, color: '#6b7280', bgColor: '#6b7280' };
  }
};

export default function RankingsPage() {
  const { isAdmin } = useAdmin();
  const { data } = useAdminData();
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/50 border-b-2 border-amber-600 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl hover:scale-110 transition-transform">
              ←
            </Link>
            <h1 className="text-2xl font-bold text-amber-400">🍔 BurgeRank</h1>
          </div>
          {isAdmin && <AdminBadge />}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl font-bold mb-4">🏆 Ranking Global de Hamburguesas</h1>

        {/* Descripción */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-gray-300">
            Las mejores hamburguesas del mundo ordenadas por puntuación. Descubre las favoritas de la comunidad BurgeRank.
          </p>
        </div>

        {/* Rankings List */}
        <div className="space-y-3">
          {rankingsData.map((burger) => {
            const { medal, color, bgColor } = getMedalColor(burger.position);

            return (
              <div
                key={burger.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex gap-4 hover:border-amber-500 transition-all"
                style={{ borderLeftWidth: '5px', borderLeftColor: color }}
              >
                {/* Medal */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-gray-900 shadow-lg"
                  style={{ background: bgColor }}
                >
                  {medal}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">{burger.name}</div>
                  <Link 
                    href={`/restaurante/${encodeURIComponent(burger.restaurant)}`}
                    className="text-sm text-gray-400 mb-2 hover:text-amber-400 transition-colors"
                  >
                    🏪 {burger.restaurant} • {burger.city}
                  </Link>
                  <div className="flex gap-2 items-center">
                    <span style={{ color }}>★★★★★</span>
                    <span className="text-sm text-gray-400">
                      {burger.rating}/10 ({burger.reviews} valoraciones)
                    </span>
                  </div>
                </div>

                {/* Admin Edit Button */}
                {isAdmin && (
                  <div className="flex-shrink-0">
                    <AdminEditButton
                      label="Editar"
                      icon="✏️"
                      onClick={() => {
                        const restaurant = data.restaurants.find(r => r.name === burger.restaurant);
                        if (restaurant) {
                          setEditingRestaurant(restaurant);
                          setModalOpen(true);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-semibold transition-colors"
        >
          ← Volver
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
          className="flex flex-col items-center gap-1 text-amber-400 text-sm font-semibold hover:scale-110 transition-transform"
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
