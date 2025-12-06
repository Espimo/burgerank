import React from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchFilters } from "@/types"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClose?: () => void
}

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      min_price: value[0],
      max_price: value[1],
    })
  }

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      min_rating: value[0],
    })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      city: e.target.value,
    })
  }

  const handleReset = () => {
    onFiltersChange({})
    onClose?.()
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Ciudad</label>
        <Input
          placeholder="Ej: Madrid, Barcelona"
          value={filters.city || ""}
          onChange={handleCityChange}
        />
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Precio: ${filters.min_price || 0} - ${filters.max_price || 50}
        </label>
        <Slider
          defaultValue={[filters.min_price || 0, filters.max_price || 50]}
          min={0}
          max={100}
          step={1}
          onValueChange={handlePriceChange}
        />
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Calificación mínima: {filters.min_rating?.toFixed(1) || 0}
        </label>
        <Slider
          defaultValue={[filters.min_rating || 0]}
          min={0}
          max={5}
          step={0.5}
          onValueChange={handleRatingChange}
        />
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Ordenar por</label>
        <div className="flex gap-2">
          {(["rating", "recent", "price"] as const).map((sort) => (
            <Button
              key={sort}
              variant={filters.sort_by === sort ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, sort_by: sort })}
              className="flex-1"
            >
              {sort === "rating" && "Rating"}
              {sort === "recent" && "Reciente"}
              {sort === "price" && "Precio"}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleReset}
      >
        Limpiar filtros
      </Button>
    </Card>
  )
}
