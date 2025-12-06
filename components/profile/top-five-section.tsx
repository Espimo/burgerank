'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, RotateCcw } from 'lucide-react'
import TopFiveBurgerCard from './top-five-burger-card'
import ReorderTopFive from './reorder-top-five'
import TopFiveAutoCalculate from './top-five-auto-calculate'
import { getUserTopFive, updateUserTopFive } from '@/lib/api/top-burgers'

export interface Burger {
  id: string
  name: string
  type: string
  average_rating: number
  restaurant?: {
    id: string
    name: string
    city: string
  }
  match_score?: number
}

interface TopBurger extends Burger {
  position: number
}

const TopFiveSection = React.memo(function TopFiveSection({ userId }: { userId: string }) {
  const [topBurgers, setTopBurgers] = useState<TopBurger[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReordering, setIsReordering] = useState(false)
  const [isAutoCalculating, setIsAutoCalculating] = useState(false)
  const [lastManualUpdate, setLastManualUpdate] = useState<Date | null>(null)

  // Cargar top 5
  const loadTopFive = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getUserTopFive(userId)
      setTopBurgers(
        data.map((burger, index) => ({
          ...burger,
          position: index + 1,
        }))
      )
      setLastManualUpdate(new Date())
    } catch (error) {
      console.error('Error loading top 5:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadTopFive()
  }, [loadTopFive])

  const handleReorderComplete = useCallback(
    async (reorderedBurgers: TopBurger[]) => {
      try {
        const burgerIds = reorderedBurgers.map((b) => b.id)
        await updateUserTopFive(userId, burgerIds)
        setTopBurgers(reorderedBurgers)
        setLastManualUpdate(new Date())
        setIsReordering(false)
      } catch (error) {
        console.error('Error updating order:', error)
      }
    },
    [userId]
  )

  const handleAutoCalculate = useCallback(
    async (newBurgers: TopBurger[]) => {
      setTopBurgers(newBurgers)
      setLastManualUpdate(new Date())
      setIsAutoCalculating(false)
    },
    []
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  if (topBurgers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 p-8 text-center"
      >
        <p className="text-sm text-amber-700">
          Aún no tienes top 5 burgers. ¡Comienza a valorar para crear tu ranking!
        </p>
      </motion.div>
    )
  }

  if (isReordering) {
    return (
      <ReorderTopFive
        burgers={topBurgers}
        onComplete={handleReorderComplete}
        onCancel={() => setIsReordering(false)}
      />
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header con acciones */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Top 5 Burgers</h2>
          {lastManualUpdate && (
            <p className="text-sm text-gray-500">
              Actualizado{' '}
              {new Date().getTime() - lastManualUpdate.getTime() < 60000
                ? 'hace poco'
                : `hace ${Math.round((new Date().getTime() - lastManualUpdate.getTime()) / 60000)} min`}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <TopFiveAutoCalculate
            userId={userId}
            currentBurgers={topBurgers}
            onComplete={handleAutoCalculate}
            isCalculating={isAutoCalculating}
            setIsCalculating={setIsAutoCalculating}
          />

          <Button
            onClick={() => setIsReordering(true)}
            variant="outline"
            size="sm"
            className="border-amber-200 hover:bg-amber-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reordenar
          </Button>
        </div>
      </motion.div>

      {/* Cards del ranking */}
      <motion.div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {topBurgers.map((burger, index) => (
            <motion.div
              key={burger.id}
              layoutId={burger.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <TopFiveBurgerCard
                burger={burger}
                position={index + 1}
                isHighlighted={index === 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

export default TopFiveSection
