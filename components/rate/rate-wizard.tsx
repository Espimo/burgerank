'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RateWizardProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onPublish?: () => void
  canGoNext?: boolean
  canGoBack?: boolean
  isLoading?: boolean
  children: React.ReactNode
  stepTitles?: string[]
}

export const RateWizard = memo(function RateWizard({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPublish,
  canGoNext = true,
  canGoBack = true,
  isLoading = false,
  children,
  stepTitles = ['Burger', 'Calificación', 'Éxito'],
}: RateWizardProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="w-full bg-muted h-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="h-full bg-primary"
        />
      </div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 border-b border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {stepTitles[currentStep - 1] || `Paso ${currentStep}`}
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentStep} de {totalSteps}
            </p>
          </div>

          {/* Mini stepper */}
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index + 1 === currentStep ? 1.2 : 1,
                  backgroundColor:
                    index + 1 < currentStep
                      ? 'rgb(var(--color-primary))'
                      : index + 1 === currentStep
                        ? 'rgb(var(--color-primary))'
                        : 'rgb(var(--color-muted))',
                }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 border-t border-border bg-background space-y-2"
      >
        <div className="flex gap-2">
          <Button
            onClick={onPrevious}
            variant="outline"
            disabled={!canGoBack || isLoading}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="flex-1"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onPublish}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Publicando...' : 'Publicar'}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
})
