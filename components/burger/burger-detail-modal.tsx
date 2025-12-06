'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, Heart, Share2, MapPin, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RatingBreakdown } from './rating-breakdown'
import { ReviewCard } from '../review/review-card'
import { BurgerCard } from './burger-card'
import * as api from '@/lib/api/burgers-client'
import * as reviewApi from '@/lib/api/reviews-client'
import Link from 'next/link'

interface BurgerDetailModalProps {
  burgerId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Burger {
  id: string
  name: string
  description?: string
  image_url?: string
  price?: number
  burger_type?: string
  average_rating: number
  restaurant?: {
    id: string
    name: string
    city?: string
  }
}

interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  user_id: string
  profile?: {
    username: string
    avatar_url?: string
    level?: number
  }
}

interface RatingBreakdownData {
  total: number
  average: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function BurgerDetailModal({
  burgerId,
  open,
  onOpenChange,
}: BurgerDetailModalProps) {
  const [burger, setBurger] = useState<Burger | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [similarBurgers, setSimilarBurgers] = useState<Burger[]>([])
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdownData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)

  const loadBurgerData = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const [burgerData, reviewsData, similar, breakdown] = await Promise.all([
        api.getBurgerById(id),
        reviewApi.getReviewsByBurger(id, 5),
        api.getSimilarBurgers(id, 4),
        reviewApi.getRatingBreakdown(id),
      ])

      setBurger(burgerData)
      setReviews(reviewsData.data)
      setSimilarBurgers(similar)
      setRatingBreakdown(breakdown)
    } catch (error) {
      console.error('Error loading burger data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && burgerId) {
      loadBurgerData(burgerId)
    }
  }, [open, burgerId, loadBurgerData])

  if (!burger) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b p-4">
          <DialogTitle>Detalles de la hamburguesa</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 p-4"
        >
          {/* Image */}
          {burger.image_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={burger.image_url}
                alt={burger.name}
                fill
                className="object-cover"
              />
              {burger.burger_type === 'premium' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <Flame className="w-4 h-4" />
                  Premium
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{burger.name}</h2>
            <Link
              href={`/restaurant/${burger.restaurant?.id}`}
              className="text-primary hover:underline flex items-center gap-2"
            >
              <span>{burger.restaurant?.name}</span>
              {burger.restaurant?.city && (
                <>
                  <span>•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{burger.restaurant.city}</span>
                </>
              )}
            </Link>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            {burger.price && <div className="text-2xl font-bold">${burger.price}</div>}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{burger.average_rating.toFixed(1)}</span>
              <span className="text-xl">⭐</span>
            </div>
          </div>

          {/* Description */}
          {burger.description && (
            <p className="text-muted-foreground">{burger.description}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Guardado' : 'Guardar'}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Rating Breakdown */}
          {ratingBreakdown && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Desglose de calificaciones</h3>
              <RatingBreakdown
                average={ratingBreakdown.average}
                total={ratingBreakdown.total}
                distribution={ratingBreakdown.distribution}
              />
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Reseñas recientes</h3>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              <Link href={`/burger/${burger.id}/reviews`} className="text-primary text-sm hover:underline">
                Ver todas las reseñas →
              </Link>
            </div>
          )}

          {/* Similar Burgers */}
          {similarBurgers.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Hamburguesas similares</h3>
              <div className="grid grid-cols-2 gap-3">
                {similarBurgers.map((similar) => (
                  <BurgerCard
                    key={similar.id}
                    id={similar.id}
                    name={similar.name}
                    image_url={similar.image_url}
                    restaurant_name={similar.restaurant?.name || ''}
                    restaurant_id={similar.restaurant?.id || ''}
                    average_rating={similar.average_rating}
                    review_count={0}
                    price={similar.price}
                    onViewDetails={() => {
                      setBurger(similar)
                      loadBurgerData(similar.id)
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
