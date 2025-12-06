'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { autoCalculateTopFive } from '@/lib/api/top-burgers'
import type { Burger } from './top-five-section'

interface TopFiveAutoCalculateProps {
  userId: string
  currentBurgers: Burger[]
  onComplete: (newBurgers: Burger[]) => void
  isCalculating: boolean
  setIsCalculating: (value: boolean) => void
}

const TopFiveAutoCalculate = React.memo(function TopFiveAutoCalculate({
  userId,
  currentBurgers,
  onComplete,
  isCalculating,
  setIsCalculating,
}: TopFiveAutoCalculateProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [previewBurgers, setPreviewBurgers] = useState<Burger[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenDialog = useCallback(async () => {
    try {
      setIsLoading(true)
      const calculated = await autoCalculateTopFive(userId)
      setPreviewBurgers(calculated)
      setShowDialog(true)
    } catch (error) {
      console.error('Error calculating top 5:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const handleConfirm = useCallback(() => {
    onComplete(previewBurgers)
    setShowDialog(false)
  }, [previewBurgers, onComplete])

  const hasChanges = !arraysEqual(currentBurgers, previewBurgers)

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        disabled={isCalculating || isLoading}
        variant="outline"
        size="sm"
        className="border-green-200 hover:bg-green-50"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Auto-calcular
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Recalcular Top 5
            </DialogTitle>
            <DialogDescription>
              El nuevo ranking se calculará basado en tus valoraciones recientes y puntuaciones
            </DialogDescription>
          </DialogHeader>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Nuevo ranking:</p>

            <motion.div className="space-y-2">
              {previewBurgers.map((burger, index) => (
                <motion.div
                  key={burger.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 p-2"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{burger.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {burger.restaurant?.name}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-600">
                    {burger.average_rating.toFixed(1)}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Cambios detectados */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3"
              >
                <p className="text-xs text-amber-900 font-medium">
                  ⚠️ Se reemplazará tu ranking manual actual
                </p>
              </motion.div>
            )}

            {!hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg border-l-4 border-green-400 bg-green-50 p-3"
              >
                <p className="text-xs text-green-900 font-medium">
                  ✓ El ranking es igual al actual
                </p>
              </motion.div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!hasChanges}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reemplazar ranking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

export default TopFiveAutoCalculate

/**
 * Helper para comparar arrays de burgers
 */
function arraysEqual(arr1: Burger[], arr2: Burger[]): boolean {
  if (arr1.length !== arr2.length) return false
  return arr1.every((burger, idx) => burger.id === arr2[idx]?.id)
}
