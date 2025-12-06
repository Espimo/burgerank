'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Loader, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { updateReview } from '@/lib/api/my-reviews'
import type { Review } from '@/lib/api/my-reviews'

interface EditReviewModalProps {
  isOpen: boolean
  review: Review
  onClose: () => void
  onSuccess: () => void
}

export const EditReviewModal = React.memo(function EditReviewModal({
  isOpen,
  review,
  onClose,
  onSuccess,
}: EditReviewModalProps) {
  const [formData, setFormData] = useState({
    overall_rating: review.overall_rating,
    comment: review.comment || '',
    experience_tags: review.experience_tags || [],
    detailed_ratings: review.detailed_ratings || {},
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      setHasChanges(JSON.stringify(updated) !== JSON.stringify({
        overall_rating: review.overall_rating,
        comment: review.comment || '',
        experience_tags: review.experience_tags || [],
        detailed_ratings: review.detailed_ratings || {},
      }))
      return updated
    })
    setError(null)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      await updateReview(review.id, {
        overall_rating: formData.overall_rating,
        comment: formData.comment,
        experience_tags: formData.experience_tags,
        detailed_ratings: formData.detailed_ratings,
      })

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Valoración</DialogTitle>
          <DialogDescription>
            Burger: {review.burger?.name} • {review.restaurant?.name}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-6 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Warning if has changes */}
          {hasChanges && (
            <motion.div
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Tienes cambios sin guardar
            </motion.div>
          )}

          {/* Overall Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Puntuación General
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={formData.overall_rating}
                onChange={(e) => handleChange('overall_rating', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-amber-600 min-w-16 text-center">
                {formData.overall_rating?.toFixed(1)}⭐
              </span>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Puntuaciones Detalladas
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['bread', 'meat', 'sauce', 'toppings'].map((category) => (
                <div key={category} className="space-y-2">
                  <label className="text-xs text-gray-600 capitalize">{category}</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={formData.detailed_ratings?.[category as keyof typeof formData.detailed_ratings] || 0}
                    onChange={(e) =>
                      handleChange('detailed_ratings', {
                        ...formData.detailed_ratings,
                        [category]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {(formData.detailed_ratings?.[category as keyof typeof formData.detailed_ratings] || 0).toFixed(1)}⭐
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Comentario (opcional)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="Cuéntanos tu experiencia..."
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <p className="text-xs text-gray-500">
              {formData.comment.length}/500 caracteres
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
