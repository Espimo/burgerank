'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LevelInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const LEVEL_INFO = [
  {
    level: 1,
    name: 'Novato',
    emoji: '🌱',
    description: 'Acabas de empezar tu viaje en BurgeRank',
    pointsRange: '0 - 500',
    color: 'from-gray-400 to-gray-600',
  },
  {
    level: 2,
    name: 'Explorador',
    emoji: '🗺️',
    description: 'Ya conoces varios sitios para comer burgers',
    pointsRange: '501 - 1000',
    color: 'from-green-400 to-green-600',
  },
  {
    level: 3,
    name: 'Experto',
    emoji: '🎓',
    description: 'Eres referencia en valoraciones de burgers',
    pointsRange: '1001 - 1500',
    color: 'from-blue-400 to-blue-600',
  },
  {
    level: 4,
    name: 'Maestro',
    emoji: '⚡',
    description: 'Tu paladar es prácticamente perfecto',
    pointsRange: '1501 - 2000',
    color: 'from-purple-400 to-purple-600',
  },
  {
    level: 5,
    name: 'Leyenda',
    emoji: '👑',
    description: 'Eres una leyenda viviente de BurgeRank',
    pointsRange: '2001+',
    color: 'from-amber-400 to-amber-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

export const LevelInfoModal = React.memo(function LevelInfoModal({ isOpen, onClose }: LevelInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Sistema de Niveles</DialogTitle>
          <DialogDescription>
            Sube de nivel completando valoraciones y desbloqueando badges
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-3 max-h-96 overflow-y-auto pr-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {LEVEL_INFO.map((level, idx) => (
            <motion.div
              key={level.level}
              variants={itemVariants}
              className={`p-4 rounded-lg bg-gradient-to-r ${level.color} bg-opacity-10 border border-opacity-20 border-current`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{level.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">Nivel {level.level}: {level.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {level.pointsRange} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{level.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Ventajas */}
          <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Beneficios por Nivel</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>✨ <span className="font-medium">Desbloqueo de Badges:</span> Nuevos badges con cada nivel</p>
              <p>⭐ <span className="font-medium">Visibilidad:</span> Mayor alcance de tus valoraciones</p>
              <p>🎁 <span className="font-medium">Recompensas:</span> Acceso a más premios en el catálogo</p>
              <p>🏆 <span className="font-medium">Estatus:</span> Muestra tu nivel en tu perfil público</p>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
})
