'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Número 404 con estilo */}
        <div className="text-9xl font-black text-blue-200 mb-4">404</div>

        {/* Emoji animado */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🍟
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Página no encontrada
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          La hamburguesa que buscas parece haberse perdido. Quizá fue demasiado deliciosa 😋
        </p>

        {/* Navegación sugerida */}
        <div className="space-y-3 mb-8">
          <p className="text-gray-700 font-semibold">¿Qué deseas hacer?</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/ranking"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              📊 Ver Ranking
            </Link>

            <Link
              href="/search"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🔍 Buscar Hamburguesas
            </Link>

            <Link
              href="/rate"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              ⭐ Calificar Burger
            </Link>

            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              🏠 Ir a Inicio
            </Link>
          </div>
        </div>

        {/* Sugerencias */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700 text-sm">
            💡 Si crees que esto es un error, contáctanos a soporte@burgerank.com
          </p>
        </div>
      </div>
    </div>
  )
}
