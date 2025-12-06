'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import {
  isInstallable,
  isInstalled,
  showInstallPrompt,
  getPlatform,
  initializePWA,
} from '@/lib/utils/pwa-install'

interface InstallPromptProps {
  onInstalled?: () => void
  onDismissed?: () => void
}

export function InstallPrompt({ onInstalled, onDismissed }: InstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [platform, setPlatform] = useState<string>('unknown')
  const [visitCount, setVisitCount] = useState(0)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Inicializar PWA
    initializePWA()
    setPlatform(getPlatform())

    // Escuchar eventos PWA
    const handlePWAInstallable = () => {
      updateVisitCount()
    }

    const handlePWAInstalled = () => {
      setShowPrompt(false)
      onInstalled?.()
    }

    window.addEventListener('pwa-installable', handlePWAInstallable)
    window.addEventListener('pwa-installed', handlePWAInstalled)

    // Verificar visitas y mostrar prompt
    updateVisitCount()

    return () => {
      window.removeEventListener('pwa-installable', handlePWAInstallable)
      window.removeEventListener('pwa-installed', handlePWAInstalled)
    }
  }, [onInstalled])

  const updateVisitCount = () => {
    const visits = parseInt(localStorage.getItem('burgerank_visits') || '0') + 1
    localStorage.setItem('burgerank_visits', visits.toString())
    setVisitCount(visits)

    // Mostrar prompt después de 2 visitas
    if (visits === 2 && isInstallable() && !isInstalled()) {
      setShowPrompt(true)
    }
  }

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await showInstallPrompt()
      if (success) {
        setShowPrompt(false)
        onInstalled?.()
      }
    } catch (error) {
      console.error('Error installing app:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('burgerank_install_dismissed', 'true')
    onDismissed?.()
  }

  // No mostrar si ya está instalado o si fue desechado
  if (
    isInstalled() ||
    !isInstallable() ||
    localStorage.getItem('burgerank_install_dismissed') === 'true'
  ) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Contenido */}
            <div className="flex items-center gap-4 flex-1">
              {/* Ícono */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <Download className="w-6 h-6 text-white" />
              </motion.div>

              {/* Texto */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm md:text-base">
                  📱 Instala BurgeRank
                </h3>
                <p className="text-orange-100 text-xs md:text-sm">
                  Acceso rápido a rankings, calificaciones y más
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                disabled={isInstalling}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isInstalling
                    ? 'bg-orange-400 text-white cursor-not-allowed'
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
              >
                {isInstalling ? '⏳ Instalando...' : 'Instalar'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="p-2 text-white hover:bg-orange-500 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Indicador de progreso */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 5 }}
            className="h-1 bg-white origin-left opacity-30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InstallPrompt
