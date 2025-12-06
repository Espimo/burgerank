import React from "react"
import { Rating } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { formatDate, getStarArray, getInitials } from "@/lib/utils/format"

interface RatingItemProps {
  rating: Rating & { user?: any }
  showBurgerName?: boolean
}

export function RatingItem({ rating, showBurgerName }: RatingItemProps) {
  const stars = getStarArray(rating.rating)

  return (
    <Card className="p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={rating.user?.avatar_url} alt={rating.user?.display_name} />
          <AvatarFallback>{getInitials(rating.user?.display_name || "U")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{rating.user?.display_name}</p>
          <p className="text-xs text-muted-foreground">{formatDate(rating.created_at)}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-0.5">
          {stars.map((star, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                star === 1 ? "fill-primary text-primary" : "text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating.rating}/5</span>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Útil:</span>
          <span className="font-medium">{rating.helpful_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">No útil:</span>
          <span className="font-medium">{rating.unhelpful_count}</span>
        </div>
      </div>

      {/* Tags */}
      {rating.tags && rating.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {rating.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Comment */}
      {rating.comment && (
        <p className="text-sm text-foreground mt-2 line-clamp-3">{rating.comment}</p>
      )}
    </Card>
  )
}
