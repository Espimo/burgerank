'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Review } from '@/lib/api/my-reviews'

type FilterType = 'all' | 'five-stars' | 'recent' | 'restaurant' | 'burger-type'
type SortBy = 'date' | 'rating' | 'restaurant'

interface ReviewsFiltersProps {
  isOpen: boolean
  activeFilters: {
    type: FilterType
    sortBy: SortBy
    restaurant?: string
    burgerTypes?: string[]
  }
  reviews: Review[]
  onClose: () => void
  onApplyFilters: (filters: any) => void
}

const BURGER_TYPES = [
  { value: 'clasica', label: 'Clásica' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'picante', label: 'Picante' },
  { value: 'premium', label: 'Premium' },
]

export const ReviewsFilters = React.memo(function ReviewsFilters({
  isOpen,
  activeFilters,
  reviews,
  onClose,
  onApplyFilters,
}: ReviewsFiltersProps) {
  const [filters, setFilters] = useState(activeFilters)

  // Obtener lista única de restaurantes
  const restaurants = Array.from(
    new Map(reviews.map((r) => [r.restaurant?.id, r.restaurant])).values()
  ).filter(Boolean)

  const handleReset = () => {
    setFilters({
      type: 'all',
      sortBy: 'date',
    })
  }

  const handleApply = () => {
    onApplyFilters(filters)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtros de Valoraciones</DialogTitle>
          <DialogDescription>Personaliza cómo ver tus valoraciones</DialogDescription>
        </DialogHeader>

        <motion.div className="space-y-6 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filter Type */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Mostrar</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Todas las valoraciones' },
                { value: 'five-stars', label: 'Solo 5⭐ (perfectas)' },
                { value: 'recent', label: 'Más recientes primero' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value={option.value}
                    checked={filters.type === option.value}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterType })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Ordenar por</h4>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortBy })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="date">Más reciente primero</option>
              <option value="rating">Puntuación más alta</option>
              <option value="restaurant">Restaurante (A-Z)</option>
            </select>
          </div>

          {/* Restaurant Filter */}
          {restaurants.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Restaurante</h4>
              <select
                value={filters.restaurant || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    restaurant: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Todos los restaurantes</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Burger Types */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Tipos de burger</h4>
            <div className="space-y-2">
              {BURGER_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.burgerTypes?.includes(type.value) || false}
                    onChange={(e) => {
                      const types = filters.burgerTypes || []
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          burgerTypes: [...types, type.value],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          burgerTypes: types.filter((t) => t !== type.value),
                        })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Limpiar filtros
          </Button>
          <Button
            onClick={handleApply}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Aplicar filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
