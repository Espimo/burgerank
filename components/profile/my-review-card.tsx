'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit2, Trash2, Heart, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { deleteReview } from '@/lib/api/my-reviews'
import { DeleteReviewModal } from './delete-review-modal'
import { EditReviewModal } from './edit-review-modal'
import type { Review } from '@/lib/api/my-reviews'

interface MyReviewCardProps {
  review: Review
  onDeleteSuccess?: () => void
  onRefresh?: () => Promise<void>
}

export const MyReviewCard = React.memo(function MyReviewCard({
  review,
  onDeleteSuccess,
  onRefresh,
}: MyReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteReview(review.id)
      onDeleteSuccess?.()
      await onRefresh?.()
    } catch (error) {
      console.error('Error deleting review:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-amber-600'
    if (rating >= 2.5) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        whileHover={{ y: -2 }}
      >
        {/* Image Section */}
        <div className="relative h-40 bg-gray-200 overflow-hidden">
          {review.images?.[0] ? (
            <Image
              src={review.images[0]}
              alt={review.burger?.name || 'Burger'}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>Sin foto</span>
            </div>
          )}
          {review.verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ✓ Verificada
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h4 className="font-bold text-gray-900 line-clamp-1">
              {review.burger?.name || 'Burger desconocida'}
            </h4>
            <p className="text-sm text-gray-600">{review.restaurant?.name || 'Restaurante'}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className={`text-2xl font-bold ${getRatingColor(review.overall_rating || 0)}`}>
                {review.overall_rating?.toFixed(1)}
              </span>
              <span className="text-lg">⭐</span>
            </motion.div>
            <p className="text-xs text-gray-500">
              {review.created_at ? new Date(review.created_at).toLocaleDateString('es-ES') : ''}
            </p>
          </div>

          {/* Comment Preview */}
          {review.comment && (
            <p className="text-sm text-gray-700 line-clamp-2 italic">&quot;{review.comment}&quot;</p>
          )}

          {/* Tags */}
          {review.experience_tags && review.experience_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {review.experience_tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {review.experience_tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{review.experience_tags.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Likes */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{review.likes_count || 0} likes</span>
          </div>

          {/* Expandable Detailed Ratings */}
          {review.detailed_ratings && (
            <motion.div className="border-t border-amber-200 pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 w-full"
              >
                Desglose de puntuaciones
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  {review.detailed_ratings.bread !== undefined && (
                    <div>
                      <span className="text-gray-600">Pan: </span>
                      <span className="font-bold">{review.detailed_ratings.bread}⭐</span>
                    </div>
                  )}
                  {review.detailed_ratings.meat !== undefined && (
                    <div>
                      <span className="text-gray-600">Carne: </span>
                      <span className="font-bold">{review.detailed_ratings.meat}⭐</span>
                    </div>
                  )}
                  {review.detailed_ratings.sauce !== undefined && (
                    <div>
                      <span className="text-gray-600">Salsa: </span>
                      <span className="font-bold">{review.detailed_ratings.sauce}⭐</span>
                    </div>
                  )}
                  {review.detailed_ratings.toppings !== undefined && (
                    <div>
                      <span className="text-gray-600">Extras: </span>
                      <span className="font-bold">{review.detailed_ratings.toppings}⭐</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-amber-200">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded transition-colors text-gray-600 hover:text-amber-700 text-sm">
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded transition-colors text-gray-600 hover:text-amber-700 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white rounded transition-colors text-gray-600 hover:text-red-600 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <DeleteReviewModal
        isOpen={isDeleteModalOpen}
        review={review}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <EditReviewModal
        isOpen={isEditModalOpen}
        review={review}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false)
          onRefresh?.()
        }}
      />
    </>
  )
})
