'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { logError } from '@/lib/utils/error-logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error a Sentry/Analytics
    logError('PageError', error.message, error.stack, 'error')
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Emoji animado */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🍔😵
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>

        {error.digest && (
          <p className="text-gray-500 text-sm mb-6 font-mono">
            ID: {error.digest}
          </p>
        )}

        {/* Detalles en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 text-left">
            <p className="text-red-700 text-sm font-mono break-words">
              {error.stack}
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            🔄 Reintentar
          </motion.button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            🏠 Ir a Inicio
          </Link>
        </div>

        {/* Sugerencias */}
        <div className="mt-8 text-left">
          <p className="text-gray-700 font-semibold mb-3">Puedes intentar:</p>
          <ul className="text-gray-600 space-y-2">
            <li>✓ Recargar la página</li>
            <li>✓ Limpiar cookies y caché</li>
            <li>✓ Ir a otra página</li>
            <li>✓ Contactar al soporte si persiste</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
