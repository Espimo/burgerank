'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MatchBurgerCard from './match-burger-card'
import MatchFeedback from './match-feedback'
import { getMatchPair, submitMatch } from '@/lib/api/burger-match'
import type { MatchPair } from '@/lib/api/burger-match'

interface MatchGameProps {
  userId: string
  onClose?: () => void
}

const MatchGame = React.memo(function MatchGame({ userId, onClose }: MatchGameProps) {
  const [pair, setPair] = useState<MatchPair | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionMatches, setSessionMatches] = useState(0)
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState<any>(null)

  // Cargar próximo par
  const loadNextPair = useCallback(async () => {
    setIsLoading(true)
    setSelectedWinner(null)
    setShowFeedback(false)

    const newPair = await getMatchPair(userId)
    setPair(newPair)
    setIsLoading(false)
  }, [userId])

  // Cargar par inicial
  useEffect(() => {
    loadNextPair()
  }, [loadNextPair])

  // Manejar selección de burger
  const handleSelect = useCallback(
    async (winnerId: string) => {
      if (!pair || selectedWinner) return

      setSelectedWinner(winnerId)
      setShowFeedback(true)

      try {
        // Enviar match
        const result = await submitMatch(
          userId,
          pair.burgerA.id,
          pair.burgerB.id,
          winnerId
        )

        setFeedbackData(result)
        setSessionMatches((prev) => prev + 1)

        // Esperar a que se complete el feedback y cargar siguiente
        setTimeout(() => {
          loadNextPair()
        }, 2500)
      } catch (error) {
        console.error('Error submitting match:', error)
        setShowFeedback(false)
      }
    },
    [pair, selectedWinner, userId, loadNextPair]
  )

  // Si no hay burgers
  if (!isLoading && !pair) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-gray-600 text-center mb-4">
          Necesitas valorar al menos 2 burgers para jugar
        </p>
        <Button onClick={onClose} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    )
  }

  return (
    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur z-40 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">¿Cuál prefieres?</h2>
          <p className="text-sm text-gray-600">
            {sessionMatches} {sessionMatches === 1 ? 'match' : 'matches'} esta sesión
          </p>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Game Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : pair ? (
          <div className="max-w-6xl mx-auto h-full">
            {/* Desktop Layout - Side by side */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 h-full">
              {/* Burger A */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <button
                  onClick={() => handleSelect(pair.burgerA.id)}
                  disabled={selectedWinner !== null}
                  className="w-full h-full disabled:opacity-75"
                >
                  <MatchBurgerCard
                    burger={pair.burgerA}
                    restaurant={pair.restaurants[pair.burgerA.id]}
                    isWinner={selectedWinner === pair.burgerA.id}
                    isLoser={selectedWinner === pair.burgerB.id}
                  />
                </button>
              </motion.div>

              {/* Burger B */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <button
                  onClick={() => handleSelect(pair.burgerB.id)}
                  disabled={selectedWinner !== null}
                  className="w-full h-full disabled:opacity-75"
                >
                  <MatchBurgerCard
                    burger={pair.burgerB}
                    restaurant={pair.restaurants[pair.burgerB.id]}
                    isWinner={selectedWinner === pair.burgerB.id}
                    isLoser={selectedWinner === pair.burgerA.id}
                  />
                </button>
              </motion.div>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="md:hidden flex flex-col gap-4 h-full">
              {/* Burger A */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 min-h-64"
              >
                <button
                  onClick={() => handleSelect(pair.burgerA.id)}
                  disabled={selectedWinner !== null}
                  className="w-full h-full disabled:opacity-75"
                >
                  <MatchBurgerCard
                    burger={pair.burgerA}
                    restaurant={pair.restaurants[pair.burgerA.id]}
                    isWinner={selectedWinner === pair.burgerA.id}
                    isLoser={selectedWinner === pair.burgerB.id}
                  />
                </button>
              </motion.div>

              {/* VS Text */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-center py-4"
              >
                <span className="text-2xl font-bold text-gray-900">VS</span>
              </motion.div>

              {/* Burger B */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 min-h-64"
              >
                <button
                  onClick={() => handleSelect(pair.burgerB.id)}
                  disabled={selectedWinner !== null}
                  className="w-full h-full disabled:opacity-75"
                >
                  <MatchBurgerCard
                    burger={pair.burgerB}
                    restaurant={pair.restaurants[pair.burgerB.id]}
                    isWinner={selectedWinner === pair.burgerB.id}
                    isLoser={selectedWinner === pair.burgerA.id}
                  />
                </button>
              </motion.div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Feedback */}
      <MatchFeedback
        isVisible={showFeedback}
        matchCount={sessionMatches}
        pointsEarned={feedbackData?.pointsEarned}
        levelUp={feedbackData?.levelUp}
        newLevel={feedbackData?.newLevel}
      />
    </motion.div>
  )
})

export default MatchGame
