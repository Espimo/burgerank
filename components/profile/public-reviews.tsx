'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ThumbsUp, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Review {
  id: string
  user_id: string
  burger_id: string
  rating: number
  comment?: string
  liked_count?: number
  created_at: string
  burger?: {
    name: string
    image_url?: string
    restaurant?: {
      name: string
    }
  }
}

interface PublicReviewsProps {
  userId: string
  reviews: Review[]
  currentUserId?: string
  isOwnProfile?: boolean
  onDeleteReview?: (reviewId: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const PublicReviews = React.memo(function PublicReviews({
  userId,
  reviews,
  currentUserId,
  isOwnProfile = false,
  onDeleteReview,
}: PublicReviewsProps) {
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>(reviews.slice(0, 10))
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-50 border-green-200'
    if (rating >= 3.5) return 'bg-yellow-50 border-yellow-200'
    if (rating >= 2.5) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return '🤩 Excelente'
    if (rating >= 3.5) return '😊 Muy bueno'
    if (rating >= 2.5) return '😐 Regular'
    return '😞 Malo'
  }

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedReviews.length < reviews.length) {
          const nextReviews = reviews.slice(
            displayedReviews.length,
            displayedReviews.length + 5
          )
          setDisplayedReviews([...displayedReviews, ...nextReviews])
        }
      },
      { threshold: 0.5 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [displayedReviews.length, reviews])

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center"
      >
        <p className="text-gray-600 mb-4">Este usuario aún no ha escrito reviews</p>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">📝 Últimas Reviews</h3>
        <p className="text-sm text-gray-600">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} publicado{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {displayedReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              exit="exit"
              className={`rounded-lg border p-4 ${getRatingColor(review.rating)}`}
            >
              <div className="flex gap-4">
                {/* Burger Image */}
                {review.burger?.image_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img
                      src={review.burger.image_url}
                      alt={review.burger.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Burger Info */}
                  <div className="mb-2">
                    <h4 className="font-bold text-gray-900">{review.burger?.name || 'Hamburguesa'}</h4>
                    <p className="text-sm text-gray-600">
                      🏪 {review.burger?.restaurant?.name || 'Restaurante desconocido'}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-amber-600">
                      {review.rating.toFixed(1)}⭐
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {getRatingText(review.rating)}
                    </span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">"{review.comment}"</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{review.liked_count || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isOwnProfile && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteReview?.(review.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll trigger */}
      {displayedReviews.length < reviews.length && (
        <div ref={observerTarget} className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}

      {displayedReviews.length === reviews.length && reviews.length > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-gray-500 text-sm"
        >
          ✨ Llegaste al final
        </motion.div>
      )}
    </div>
  )
})

export default PublicReviews
