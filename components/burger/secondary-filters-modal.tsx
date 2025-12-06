'use client'

import { useCallback } from 'react'
import { useFilters } from '@/lib/hooks/use-filters'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'

interface SecondaryFilter {
  id: string
  label: string
  category: 'tipo' | 'dieta' | 'precio' | 'distancia' | 'ocasion'
}

const SECONDARY_FILTERS: SecondaryFilter[] = [
  // Tipo
  { id: 'clasica', label: 'Clásica', category: 'tipo' },
  { id: 'artesanal', label: 'Artesanal', category: 'tipo' },
  { id: 'premium', label: 'Premium', category: 'tipo' },
  { id: 'fusion', label: 'Fusión', category: 'tipo' },

  // Dieta
  { id: 'vegana', label: 'Vegana', category: 'dieta' },
  { id: 'vegetariana', label: 'Vegetariana', category: 'dieta' },
  { id: 'sin_gluten', label: 'Sin gluten', category: 'dieta' },

  // Ocasión
  { id: 'rapida', label: 'Comida rápida', category: 'ocasion' },
  { id: 'casual', label: 'Casual', category: 'ocasion' },
  { id: 'especial', label: 'Ocasión especial', category: 'ocasion' },
]

const CATEGORIES = [
  { id: 'tipo', label: 'Tipo de hamburguesa' },
  { id: 'dieta', label: 'Preferencias dietéticas' },
  { id: 'ocasion', label: 'Ocasión' },
] as const

interface SecondaryFiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecondaryFiltersModal({ open, onOpenChange }: SecondaryFiltersModalProps) {
  const { filters, setFilter, clearFilters } = useFilters()

  const handleBurgerTypeChange = useCallback(
    (typeId: string) => {
      const types = filters.burgerTypes || []
      if (types.includes(typeId)) {
        setFilter('burgerTypes', types.filter((t) => t !== typeId))
      } else {
        setFilter('burgerTypes', [...types, typeId])
      }
    },
    [filters.burgerTypes, setFilter]
  )

  const handleDietChange = useCallback(
    (dietId: string) => {
      const diets = filters.diets || []
      if (diets.includes(dietId)) {
        setFilter('diets', diets.filter((d) => d !== dietId))
      } else {
        setFilter('diets', [...diets, dietId])
      }
    },
    [filters.diets, setFilter]
  )

  const handleOccasionChange = useCallback(
    (occasionId: string) => {
      const occasions = filters.occasions || []
      if (occasions.includes(occasionId)) {
        setFilter('occasions', occasions.filter((o) => o !== occasionId))
      } else {
        setFilter('occasions', [...occasions, occasionId])
      }
    },
    [filters.occasions, setFilter]
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-lg">
        <SheetHeader>
          <SheetTitle>Filtros avanzados</SheetTitle>
          <SheetDescription>Personaliza tu búsqueda de hamburguesas</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(80vh-150px)]">
          {/* Tipo de hamburguesa */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Tipo de hamburguesa</h3>
            <div className="space-y-2">
              {SECONDARY_FILTERS.filter((f) => f.category === 'tipo').map((filter) => (
                <label
                  key={filter.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={(filters.burgerTypes || []).includes(filter.id)}
                    onCheckedChange={() => handleBurgerTypeChange(filter.id)}
                  />
                  <span className="text-sm">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dieta */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Preferencias dietéticas</h3>
            <div className="space-y-2">
              {SECONDARY_FILTERS.filter((f) => f.category === 'dieta').map((filter) => (
                <label
                  key={filter.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={(filters.diets || []).includes(filter.id)}
                    onCheckedChange={() => handleDietChange(filter.id)}
                  />
                  <span className="text-sm">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ocasión */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Ocasión</h3>
            <div className="space-y-2">
              {SECONDARY_FILTERS.filter((f) => f.category === 'ocasion').map((filter) => (
                <label
                  key={filter.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={(filters.occasions || []).includes(filter.id)}
                    onCheckedChange={() => handleOccasionChange(filter.id)}
                  />
                  <span className="text-sm">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex-1"
          >
            Limpiar
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
