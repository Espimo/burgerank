'use client'

import { useCallback, useState } from 'react'
import { useFilters } from '@/lib/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { SecondaryFiltersModal } from './secondary-filters-modal'
import { motion } from 'framer-motion'

interface PrimaryFilter {
  id: string
  label: string
  value: string
}

const PRIMARY_FILTERS: PrimaryFilter[] = [
  { id: 'general', label: 'General', value: 'general' },
  { id: 'rating', label: 'Mejor calificadas', value: 'rating' },
  { id: 'newest', label: 'Más nuevas', value: 'newest' },
]

export function RankingFilters() {
  const { filters, setFilter } = useFilters()
  const [showSecondary, setShowSecondary] = useState(false)

  const handlePrimaryFilterChange = useCallback(
    (filterId: string) => {
      setFilter('sortBy', filterId === 'general' ? 'rating' : (filterId as any))
    },
    [setFilter]
  )

  const activeFilterCount = 
    (filters.burgerTypes?.length || 0) +
    (filters.diets?.length || 0) +
    (filters.occasions?.length || 0)

  return (
    <>
      <div className="sticky top-[56px] z-40 bg-background border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
          {PRIMARY_FILTERS.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => handlePrimaryFilterChange(filter.id)}
              className="relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`relative z-10 ${
                  (filters.sortBy === filter.value || (filter.id === 'general' && filters.sortBy === 'rating'))
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
              </span>
              {(filters.sortBy === filter.value || (filter.id === 'general' && filters.sortBy === 'rating')) && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                />
              )}
            </motion.button>
          ))}

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSecondary(true)}
            className="ml-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <SecondaryFiltersModal open={showSecondary} onOpenChange={setShowSecondary} />
    </>
  )
}
