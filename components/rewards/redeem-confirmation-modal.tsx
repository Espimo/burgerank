'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type Reward } from '@/lib/api/rewards'

interface RedeemConfirmationModalProps {
  open: boolean
  reward?: Reward
  userPoints: number
  onConfirm?: () => void
  onCancel?: () => void
  isLoading?: boolean
}

export const RedeemConfirmationModal = memo(function RedeemConfirmationModal({
  open,
  reward,
  userPoints,
  onConfirm,
  onCancel,
  isLoading = false,
}: RedeemConfirmationModalProps) {
  if (!reward) return null

  const pointsAfter = userPoints - reward.cost_points

  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onCancel?.()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-3xl mb-2">
            {reward.icon_emoji}
          </AlertDialogTitle>
          <AlertDialogTitle className="text-center">{reward.name}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {reward.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Points breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 py-4 border-y border-border"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Puntos disponibles</span>
            <span className="font-semibold">{userPoints}</span>
          </div>
          <div className="flex justify-between items-center text-destructive">
            <span className="text-sm">Costo del premio</span>
            <span className="font-semibold">-{reward.cost_points}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <span className="text-sm font-medium">Puntos después del canje</span>
            <span className="text-lg font-bold text-primary">{pointsAfter}</span>
          </div>
        </motion.div>

        {/* Confirmation */}
        <p className="text-center text-sm font-medium">
          ¿Confirmas que quieres canjear este premio?
        </p>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Canjeando...' : 'Confirmar canje'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
})
