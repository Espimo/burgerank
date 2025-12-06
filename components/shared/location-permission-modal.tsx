'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X } from 'lucide-react'

interface LocationPermissionModalProps {
  onAllow: () => void
  onDismiss: () => void
  isOpen: boolean
}

export default function LocationPermissionModal({
  onAllow,
  onDismiss,
  isOpen,
}: LocationPermissionModalProps) {
  const [dismissed, setDismissed] = useState(false)
  const [neverShow, setNeverShow] = useState(false)

  useEffect(() => {
    // Verificar si usuario ya rechazó anteriormente
    const neverShowAgain = localStorage.getItem('burgerank_location_never_show')
    if (neverShowAgain) {
      setNeverShow(true)
    }
  }, [])

  const handleAllow = () => {
    setDismissed(true)
    onAllow()
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss()
  }

  const handleNeverShow = () => {
    localStorage.setItem('burgerank_location_never_show', 'true')
    setNeverShow(true)
    handleDismiss()
  }

  if (neverShow || dismissed || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin size={32} />
              </motion.div>
              <h2 className="text-xl font-bold">Encontremos Burgers Cerca de Ti</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Usa tu ubicación para descubrir las mejores hamburguesas en tu zona.
            </p>

            {/* Benefits */}
            <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🍔</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Descubre Burgers Cercanas</h3>
                  <p className="text-sm text-gray-600">Encuentra las mejores hamburguesas en tu zona</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Filtra por Distancia</h3>
                  <p className="text-sm text-gray-600">Ve exactamente cuán cerca está cada burger</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reviews Verificados</h3>
                  <p className="text-sm text-gray-600">Tus reviews obtienen un badge de ubicación</p>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500">
              🔒 Tu ubicación nunca será compartida públicamente. Solo nosotros la usamos para mejorar tu experiencia.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAllow}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              Permitir Ubicación
            </motion.button>

            <button
              onClick={handleDismiss}
              className="w-full px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Ahora No
            </button>

            <button
              onClick={handleNeverShow}
              className="w-full px-6 py-2 text-xs text-gray-500 hover:text-gray-700 transition"
            >
              No volver a mostrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
