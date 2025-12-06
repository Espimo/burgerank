'use client'

import { memo, useCallback, useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface ReviewCardProps {
  review: {
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
    likes?: number
  }
  onLike?: (reviewId: string) => void
}

export const ReviewCard = memo(function ReviewCard({
  review,
  onLike,
}: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes || 0)

  const handleLike = useCallback(async () => {
    try {
      setIsLiked(!isLiked)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      onLike?.(review.id)
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }, [isLiked, review.id, onLike])

  const formattedDate = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: es,
  })

  return (
    <div className="border-b border-border pb-4 last:border-b-0">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {review.profile?.avatar_url ? (
          <Image
            src={review.profile.avatar_url}
            alt={review.profile.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
            {review.profile?.username.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <Link
            href={`/profile/${review.user_id}`}
            className="font-semibold text-sm hover:text-primary transition-colors"
          >
            {review.profile?.username}
          </Link>
          {review.profile?.level && (
            <div className="text-xs text-muted-foreground">Nivel {review.profile.level}</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">{formattedDate}</div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-sm">
            {i < Math.round(review.rating) ? '⭐' : '☆'}
          </span>
        ))}
        <span className="text-xs text-muted-foreground ml-1">({review.rating.toFixed(1)})</span>
      </div>

      {/* Comment */}
      {review.comment && <p className="text-sm mb-3 leading-relaxed">{review.comment}</p>}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className="text-xs h-auto px-2 py-1"
        >
          <Heart
            className={`w-3 h-3 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
          />
          {likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-auto px-2 py-1"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Responder
        </Button>
      </div>
    </div>
  )
})

ReviewCard.displayName = 'ReviewCard'
