'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Gamepad2 } from 'lucide-react'
import MatchGame from './match-game'
import MatchStats from './match-stats'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

interface BurgerMatchSectionProps {
  userId: string
}

const BurgerMatchSection = React.memo(function BurgerMatchSection({
  userId,
}: BurgerMatchSectionProps) {
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [tutorialSeen, setTutorialSeen] = useLocalStorage('burger_match_tutorial_seen', false)

  const handlePlayClick = useCallback(() => {
    if (!tutorialSeen) {
      // Mostrar tutorial
      setTutorialSeen(true)
    }
    setIsGameOpen(true)
  }, [tutorialSeen, setTutorialSeen])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              🎮 Burger Match
            </h2>
            <p className="text-gray-600 mt-1">
              Elige entre tus burgers favoritas y sube de nivel
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handlePlayClick}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              Jugar Match
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-4"
      >
        <p className="text-sm text-gray-700">
          💡 <span className="font-semibold">¿Cómo funciona?</span> Elige entre dos de tus
          burgers favoritas. Tus elecciones ajustarán automáticamente el ranking de tus burgers
          usando un algoritmo de ranking tipo ajedrez. ¡Gana puntos cada 10 matches!
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Progreso</h3>
        <MatchStats userId={userId} />
      </motion.div>

      {/* Game Modal */}
      {isGameOpen && (
        <MatchGame
          userId={userId}
          onClose={() => setIsGameOpen(false)}
        />
      )}
    </motion.div>
  )
})

export default BurgerMatchSection
