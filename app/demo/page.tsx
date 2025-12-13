'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, AlertCircle, CheckCircle, Code, Eye, Zap } from 'lucide-react'

// MOCK DATA - Sin dependencia de Supabase
const MOCK_BURGERS = [
  {
    id: '1',
    name: 'La Clásica Premium',
    burger_type: 'clasica',
    average_rating: 4.7,
    price: 14.50,
    image_url: '🍔',
    restaurant: { id: 'r1', name: 'La Burguesía', city: 'Madrid' },
    review_count: 24,
  },
  {
    id: '2',
    name: 'Truffle Cheese Deluxe',
    burger_type: 'doble',
    average_rating: 4.9,
    price: 16.50,
    image_url: '🧀',
    restaurant: { id: 'r1', name: 'La Burguesía', city: 'Madrid' },
    review_count: 18,
  },
  {
    id: '3',
    name: 'Veggie Power',
    burger_type: 'vegana',
    average_rating: 4.4,
    price: 12.00,
    image_url: '🥬',
    restaurant: { id: 'r1', name: 'La Burguesía', city: 'Madrid' },
    review_count: 14,
  },
  {
    id: '4',
    name: 'Spicy Chicken Jalapeño',
    burger_type: 'pollo',
    average_rating: 4.5,
    price: 13.00,
    image_url: '🌶️',
    restaurant: { id: 'r1', name: 'La Burguesía', city: 'Madrid' },
    review_count: 16,
  },
]

const MOCK_FACTORS = [
  { id: 'promedio', title: 'Promedio Ponderado', weight: '40%', icon: '📊' },
  { id: 'verificadas', title: 'Reviews Verificadas', weight: '25%', icon: '✅' },
  { id: 'nivel', title: 'Nivel del Usuario', weight: '20%', icon: '⭐' },
  { id: 'cantidad', title: 'Cantidad de Reviews', weight: '10%', icon: '🔢' },
  { id: 'temporal', title: 'Boost Temporal', weight: '3%', icon: '⚡' },
  { id: 'elo', title: 'Match Score ELO', weight: '2%', icon: '🎮' },
]

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('ranking')
  const [expandedFactor, setExpandedFactor] = useState<string | null>('promedio')
  const [logs, setLogs] = useState<string[]>([
    '✅ Demo page initialized',
    '✅ Mock data loaded (4 burgers)',
    '✅ Mock factors loaded (6 items)',
    '✅ Ready to preview components',
  ])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">
                🧪 BurgeRank Demo & Preview
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-green-900/30 px-3 py-1 rounded border border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-300">LIVE DEV MODE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
              {[
                { id: 'ranking', label: '🍔 Ranking', icon: ChevronRight },
                { id: 'about', label: '📖 About', icon: ChevronRight },
                { id: 'profile', label: '👤 Profile', icon: ChevronRight },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    addLog(`Switched to ${tab.label} tab`)
                  }}
                  className={`px-4 py-3 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-amber-500 border-b-2 border-amber-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
              {/* RANKING TAB */}
              {activeTab === 'ranking' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🍔 Ranking de Hamburguesas
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Aquí se muestran las hamburguesas ordenadas por calificación
                  </p>

                  {/* Burger Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {MOCK_BURGERS.map((burger) => (
                      <div
                        key={burger.id}
                        className="bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden hover:border-amber-500 transition-colors group cursor-pointer"
                        onMouseEnter={() => addLog(`Hovered burger: ${burger.name}`)}
                      >
                        {/* Image */}
                        <div className="aspect-square bg-gradient-to-br from-amber-900 to-orange-900 flex items-center justify-center text-6xl relative overflow-hidden">
                          {burger.image_url}

                          {/* Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
                              {burger.burger_type}
                            </span>
                          </div>

                          {/* Rating Overlay */}
                          <div className="absolute bottom-2 right-2 bg-gray-900/90 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="text-sm font-bold text-white">
                              {burger.average_rating.toFixed(1)}
                            </span>
                            <span>⭐</span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 space-y-2">
                          <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-500 transition-colors">
                            {burger.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            📍 {burger.restaurant.name}
                          </p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">
                              💬 {burger.review_count} reseñas
                            </span>
                            <span className="text-amber-400 font-semibold">
                              €{burger.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addLog('Load more burgers clicked')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Cargar más hamburguesas
                  </button>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    📖 Metodología de Ranking
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Transparencia total: así es cómo calculamos el ranking
                  </p>

                  {/* Factors Accordion */}
                  <div className="space-y-3">
                    {MOCK_FACTORS.map((factor) => (
                      <div
                        key={factor.id}
                        className="border border-gray-600 rounded-lg overflow-hidden hover:border-amber-500 transition-colors"
                      >
                        {/* Header */}
                        <button
                          onClick={() => {
                            setExpandedFactor(
                              expandedFactor === factor.id ? null : factor.id
                            )
                            addLog(
                              `Toggled factor: ${factor.title}`
                            )
                          }}
                          className="w-full bg-gray-700/50 hover:bg-gray-700 px-4 py-3 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-2xl">{factor.icon}</span>
                            <div>
                              <h3 className="text-white font-semibold text-sm">
                                {factor.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-amber-400 font-bold text-lg">
                              {factor.weight}
                            </span>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedFactor === factor.id ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Expanded Content */}
                        {expandedFactor === factor.id && (
                          <div className="bg-amber-900/30 border-t border-gray-600 px-4 py-3 text-gray-300 text-sm">
                            <p>
                              Este es el detalle de cómo se calcula este factor en nuestro
                              algoritmo de ranking. Puedes expandir/contraer cada factor
                              haciendo clic.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    👤 Perfil de Usuario
                  </h2>

                  {/* Profile Header */}
                  <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                        👨
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">
                          Cristhian Espimo
                        </h3>
                        <p className="text-amber-400 text-sm font-semibold">
                          🏅 Burger Lover
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Apasionado de las burgers. Siempre buscando la hamburguesa perfecta
                          🍔
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-600">
                      <div className="text-center">
                        <p className="text-amber-400 font-bold text-2xl">1,500</p>
                        <p className="text-gray-400 text-xs">Puntos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-amber-400 font-bold text-2xl">15</p>
                        <p className="text-gray-400 text-xs">Reviews</p>
                      </div>
                      <div className="text-center">
                        <p className="text-amber-400 font-bold text-2xl">5</p>
                        <p className="text-gray-400 text-xs">Badges</p>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Badges Desbloqueados</h4>
                    <div className="flex flex-wrap gap-2">
                      {['🔍', '🎭', '🍔', '👥', '🎯'].map((badge, i) => (
                        <div
                          key={i}
                          className="bg-amber-900/50 border border-amber-600 rounded-lg px-3 py-2 text-sm text-amber-300 font-semibold"
                        >
                          {badge} Badge {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Logs & Info */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-green-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Sistema Status
              </h3>
              <div className="space-y-2 text-xs text-green-300">
                <p>✅ Frontend conectado</p>
                <p>✅ Mock data cargado</p>
                <p>✅ Sin dependencias externas</p>
                <p>✅ Interactividad funcionando</p>
              </div>
            </div>

            {/* Live Logs */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4" />
                  Live Logs
                </h3>
              </div>
              <div className="h-64 overflow-y-auto font-mono text-xs bg-gray-900/50">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="px-4 py-1 border-b border-gray-700 text-gray-400 hover:bg-gray-700/30 transition-colors"
                  >
                    {log}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setLogs(['✅ Logs cleared'])
                }}
                className="w-full text-xs text-gray-400 hover:text-gray-300 py-2 border-t border-gray-700 transition-colors"
              >
                Limpiar logs
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Cómo usar
              </h3>
              <div className="space-y-2 text-xs text-blue-300">
                <p>• Cambia entre tabs arriba</p>
                <p>• Hover en elementos para ver logs</p>
                <p>• Haz clic en accordions</p>
                <p>• Abre DevTools (F12) para ver consola</p>
                <p>• Todos los cambios sin refresh</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-white text-sm mb-3">Links Útiles</h3>
              <div className="space-y-2">
                <Link
                  href="/test"
                  className="block text-amber-400 hover:text-amber-300 text-sm transition-colors"
                  onMouseEnter={() => addLog('Link: /test')}
                >
                  → Testing Page
                </Link>
                <Link
                  href="/ranking"
                  className="block text-amber-400 hover:text-amber-300 text-sm transition-colors"
                  onMouseEnter={() => addLog('Link: /ranking')}
                >
                  → Ranking Real
                </Link>
                <Link
                  href="/about"
                  className="block text-amber-400 hover:text-amber-300 text-sm transition-colors"
                  onMouseEnter={() => addLog('Link: /about')}
                >
                  → About Page
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6">
            <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ¿Cómo usar esta página de Demo?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Esta página de DEMO te permite visualizar y probar componentes de BurgeRank SIN
              necesidad de Supabase o base de datos. Usa los tabs arriba para cambiar entre
              vistas. Los logs en vivo en la derecha muestran todas las interacciones. Abre
              DevTools (F12) para ver errores en consola. Luego puedes hacer cambios en el
              código y verlos reflejados inmediatamente sin recargar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
