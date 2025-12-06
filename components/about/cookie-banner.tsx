'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings } from 'lucide-react'

type CookiePreferences = {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem('cookiePreferences')
    if (!stored) {
      setIsVisible(true)
    } else {
      setPreferences(JSON.parse(stored))
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
    setPreferences(allAccepted)
    setIsVisible(false)
  }

  const handleRejectNonEssential = () => {
    const minimal = {
      essential: true,
      analytics: false,
      marketing: false,
    }
    localStorage.setItem('cookiePreferences', JSON.stringify(minimal))
    setPreferences(minimal)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setIsVisible(false)
  }

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // essential cannot be toggled
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-gray-900 border-t border-gray-800 text-white p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">🍪 Cookies y Privacidad</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Usamos cookies para mejorar tu experiencia en BurgeRank. Algunos datos se usan para análisis y marketing personalizado. Puedes personalizar tus preferencias o aceptar todas.
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-gray-800 rounded transition"
                >
                  <X size={20} />
                </button>
              </div>

              {!showSettings ? (
                <div className="grid md:grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium text-sm"
                  >
                    Rechazar No-Esenciales
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Personalizar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition font-bold text-sm"
                  >
                    Aceptar Todo
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold mb-3">Preferencias de Cookies</h4>

                  {/* Essential */}
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">🔒 Cookies Esenciales</p>
                      <p className="text-xs text-gray-400">
                        Necesarias para que el sitio funcione
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      className="w-5 h-5 rounded cursor-not-allowed"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">📊 Cookies de Análisis</p>
                      <p className="text-xs text-gray-400">
                        Para entender cómo usas BurgeRank
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handleTogglePreference('analytics')}
                      className="w-5 h-5 rounded cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">📢 Cookies de Marketing</p>
                      <p className="text-xs text-gray-400">
                        Para mostrarte contenido personalizado
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handleTogglePreference('marketing')}
                      className="w-5 h-5 rounded cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium text-sm"
                    >
                      Volver
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSavePreferences}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition font-bold text-sm"
                    >
                      Guardar Preferencias
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Lee nuestra{' '}
                <a href="/legal/cookies" className="text-amber-400 hover:underline">
                  política de cookies
                </a>{' '}
                y{' '}
                <a href="/legal/privacy" className="text-amber-400 hover:underline">
                  política de privacidad
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
