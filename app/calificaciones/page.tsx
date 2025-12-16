'use client';

import Link from 'next/link';

interface Rating {
  id: number;
  burgerName: string;
  restaurantName: string;
  city: string;
  rating: number;
  daysAgo: number;
  comment: string;
  starColor: string;
}

// Datos de ejemplo
const ratingsData: Rating[] = [
  {
    id: 1,
    burgerName: 'The King',
    restaurantName: 'Burger Palace',
    city: 'Madrid',
    rating: 5,
    daysAgo: 0.08,
    comment: 'Hamburguesa increíble, muy jugosa y bien presentada.',
    starColor: '#fbbf24',
  },
  {
    id: 2,
    burgerName: 'Smoky BBQ Delight',
    restaurantName: 'The Smokehouse',
    city: 'Barcelona',
    rating: 4,
    daysAgo: 1,
    comment: 'Excelente sabor ahumado. Un poco más de carne habría sido perfecto.',
    starColor: '#f59e0b',
  },
  {
    id: 3,
    burgerName: 'Doble Sabor Clásico',
    restaurantName: 'Hamburguesería Las Delicias',
    city: 'Valencia',
    rating: 4,
    daysAgo: 3,
    comment: 'Muy buena relación calidad-precio. Recomendado.',
    starColor: '#d97706',
  },
  {
    id: 4,
    burgerName: 'Gourmet Cheese Premium',
    restaurantName: 'Gourmet Burgers Co.',
    city: 'Sevilla',
    rating: 5,
    daysAgo: 5,
    comment: 'Los quesos combinan perfectamente, una experiencia premium.',
    starColor: '#fbbf24',
  },
  {
    id: 5,
    burgerName: 'Picante Jalapeño',
    restaurantName: 'Taquería Mexicana',
    city: 'Madrid',
    rating: 4,
    daysAgo: 7,
    comment: 'Muy picante para algunos, pero deliciosa. Ideal con cerveza fría.',
    starColor: '#f59e0b',
  },
  {
    id: 6,
    burgerName: 'Clásica Americana',
    restaurantName: 'Route 66 Diner',
    city: 'Bilbao',
    rating: 4,
    daysAgo: 10,
    comment: 'Auténtica hamburguesa americana. Tamaño generoso.',
    starColor: '#d97706',
  },
  {
    id: 7,
    burgerName: 'Vegetariana Gourmet',
    restaurantName: 'Green Burgers',
    city: 'Barcelona',
    rating: 5,
    daysAgo: 14,
    comment: 'Sorprendentemente deliciosa incluso sin carne. La lenteja está perfecta.',
    starColor: '#fbbf24',
  },
  {
    id: 8,
    burgerName: 'Smash Burger Crujiente',
    restaurantName: 'Burger Lab',
    city: 'Valencia',
    rating: 4,
    daysAgo: 14,
    comment: 'Técnica smash ejecutada correctamente. Muy crujiente por fuera.',
    starColor: '#f59e0b',
  },
  {
    id: 9,
    burgerName: 'Bacon & Huevo',
    restaurantName: 'El Desayunador',
    city: 'Madrid',
    rating: 3,
    daysAgo: 21,
    comment: 'Buen desayuno, pero el huevo estaba ligeramente pasado.',
    starColor: '#d97706',
  },
  {
    id: 10,
    burgerName: 'Trufada Negra',
    restaurantName: 'Premium Burgers',
    city: 'Sevilla',
    rating: 4,
    daysAgo: 30,
    comment: 'La trufa le da un toque especial, un poco cara pero vale la pena.',
    starColor: '#f59e0b',
  },
];

const getStars = (rating: number) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

const getFormattedDate = (daysAgo: number) => {
  if (daysAgo < 1) return `hace ${Math.round(daysAgo * 24)} horas`;
  if (daysAgo === 1) return 'hace 1 día';
  if (daysAgo < 7) return `hace ${Math.round(daysAgo)} días`;
  if (daysAgo === 7) return 'hace 1 semana';
  if (daysAgo === 14) return 'hace 2 semanas';
  if (daysAgo === 21) return 'hace 3 semanas';
  if (daysAgo === 30) return 'hace 1 mes';
  return `hace ${Math.round(daysAgo)} días`;
};

export default function CalificacionesPage() {
  const totalRatings = ratingsData.length;
  const averageRating = (ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1);
  const totalPoints = totalRatings * 20 + 5; // Ejemplo de cálculo

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/50 border-b-2 border-amber-600 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-amber-400">🍔 BurgeRank</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl font-bold mb-6">⭐ Mis Calificaciones</h1>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">{totalRatings}</div>
            <div className="text-sm text-gray-400">Total valoradas</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">{averageRating}</div>
            <div className="text-sm text-gray-400">Promedio</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">{totalPoints} pts</div>
            <div className="text-sm text-gray-400">Puntos ganados</div>
          </div>
        </div>

        {/* Historial */}
        <div className="space-y-3">
          {ratingsData.map((rating) => (
            <div
              key={rating.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              style={{ borderLeftWidth: '4px', borderLeftColor: rating.starColor }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">🍔 {rating.burgerName}</div>
                  <div className="text-sm text-gray-400">
                    🏪 {rating.restaurantName} • {rating.city}
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ color: rating.starColor }} className="text-sm">
                    {getStars(rating.rating)}
                  </div>
                  <div className="text-sm text-gray-400">{rating.rating}/10</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-2">📅 Valorada {getFormattedDate(rating.daysAgo)}</div>
              <div className="text-sm text-gray-300">{rating.comment}</div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg font-semibold transition-colors"
        >
          ← Volver
        </Link>
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
