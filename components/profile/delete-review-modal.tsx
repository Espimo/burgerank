'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertCircle, Loader } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Review } from '@/lib/api/my-reviews'

interface DeleteReviewModalProps {
  isOpen: boolean
  review: Review
  isDeleting?: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export const DeleteReviewModal = React.memo(function DeleteReviewModal({
  isOpen,
  review,
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteReviewModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Eliminar Valoración
          </DialogTitle>
          <DialogDescription>Esta acción no se puede deshacer</DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Warning */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900 font-medium">
              ⚠️ Se perderá:
            </p>
            <ul className="text-sm text-red-800 mt-2 space-y-1 ml-4">
              <li>• Tu valoración de "{review.burger?.name}"</li>
              <li>• 50 puntos que ganaste</li>
              <li>• {review.images?.length || 0} fotos asociadas</li>
              {review.likes_count && review.likes_count > 0 && (
                <li>• {review.likes_count} likes recibidos</li>
              )}
            </ul>
          </div>

          {/* Review Details */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div>
              <p className="text-xs text-gray-600">Burger</p>
              <p className="font-medium text-gray-900">{review.burger?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Restaurante</p>
              <p className="font-medium text-gray-900">{review.restaurant?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Tu puntuación</p>
              <p className="font-medium text-gray-900">
                {review.overall_rating?.toFixed(1)}⭐
              </p>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-gray-600">
            Si realmente deseas eliminar esta valoración, haz clic en el botón de abajo.
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar valoración'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
