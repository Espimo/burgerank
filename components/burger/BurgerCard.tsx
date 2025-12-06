import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Burger } from "@/types"
import { formatPrice, formatRating, getStarArray } from "@/lib/utils/format"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BurgerCardProps {
  burger: Burger
  onClick?: () => void
}

export function BurgerCard({ burger, onClick }: BurgerCardProps) {
  const stars = getStarArray(burger.average_rating)

  return (
    <Link href={`/burger/${burger.id}`}>
      <Card
        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        onClick={onClick}
      >
        {/* Imagen */}
        <div className="relative w-full h-40 bg-muted">
          {burger.image_url ? (
            <Image
              src={burger.image_url}
              alt={burger.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🍔
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm truncate">{burger.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {burger.restaurant?.name}
              </p>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {formatPrice(burger.price)}
            </Badge>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-0.5">
              {stars.map((star, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    star === 1
                      ? "fill-primary text-primary"
                      : star === 0.5
                        ? "fill-primary text-primary"
                        : "text-muted"
                  }`}
                  style={
                    star === 0.5
                      ? {
                          backgroundImage:
                            "linear-gradient(90deg, currentColor 50%, transparent 50%)",
                          backgroundClip: "padding-box",
                        }
                      : undefined
                  }
                />
              ))}
            </div>
            <span className="text-xs font-medium">
              {formatRating(burger.average_rating)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({burger.total_reviews})
            </span>
          </div>

          {/* Descripción */}
          {burger.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {burger.description}
            </p>
          )}

          {/* Ingredientes */}
          {burger.ingredients && burger.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {burger.ingredients.slice(0, 3).map((ingredient, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
              {burger.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{burger.ingredients.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
