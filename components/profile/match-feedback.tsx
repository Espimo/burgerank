'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

interface MatchFeedbackProps {
  isVisible: boolean
  matchCount: number
  pointsEarned?: number
  levelUp?: boolean
  newLevel?: number
  onComplete?: () => void
}

const MatchFeedback = React.memo(function MatchFeedback({
  isVisible,
  matchCount,
  pointsEarned = 0,
  levelUp = false,
  newLevel,
  onComplete,
}: MatchFeedbackProps) {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  // Mostrar confetti cada 10 matches
  const showConfetti = matchCount % 10 === 0 && matchCount > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti para milestones */}
          {showConfetti && (
            <>
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="fixed pointer-events-none"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    rotate: Math.random() * 360,
                    opacity: 1,
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: Math.random() * 720,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    ease: 'easeIn',
                  }}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      [
                        'bg-yellow-400',
                        'bg-amber-400',
                        'bg-orange-400',
                        'bg-pink-400',
                        'bg-purple-400',
                      ][i % 5]
                    )}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* Feedback card */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div
              className={cn(
                'rounded-2xl p-8 shadow-2xl backdrop-blur-md',
                showConfetti
                  ? 'bg-gradient-to-br from-yellow-400/90 to-orange-400/90'
                  : 'bg-gradient-to-br from-green-400/90 to-emerald-400/90'
              )}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div className="mb-4 flex justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1 }}
                    className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center"
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>

                {/* Main message */}
                <motion.h3
                  animate={{ opacity: [0, 1] }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  +1 Match
                </motion.h3>

                {/* Secondary message */}
                {showConfetti && (
                  <motion.p
                    animate={{ scale: [0.8, 1] }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white mb-3"
                  >
                    🎉 {matchCount} Matches! 🎉
                  </motion.p>
                )}

                {/* Points earned */}
                {pointsEarned > 0 && (
                  <motion.div
                    animate={{ opacity: [0, 1], y: [-10, 0] }}
                    transition={{ delay: 0.3 }}
                    className="mb-3 text-lg text-white font-semibold"
                  >
                    +{pointsEarned} 🍔 Puntos
                  </motion.div>
                )}

                {/* Level up */}
                {levelUp && newLevel && (
                  <motion.div
                    animate={{ scale: [0, 1] }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="mt-4 pt-4 border-t border-white/30"
                  >
                    <p className="text-sm text-white/90 mb-1">🌟 LEVEL UP! 🌟</p>
                    <p className="text-3xl font-bold text-white">Nivel {newLevel}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})

export default MatchFeedback

import { cn } from '@/lib/utils'
