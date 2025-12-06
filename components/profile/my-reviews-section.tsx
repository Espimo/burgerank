'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid3x3, List, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MyReviewCard } from './my-review-card'
import { ReviewsFilters } from './reviews-filters'
import type { Review } from '@/lib/api/my-reviews'

interface MyReviewsSectionProps {
  reviews: Review[]
  isLoading?: boolean
  onRefresh?: () => Promise<void>
  onDeleteSuccess?: () => void
}

type ViewMode = 'grid' | 'list'
type SortBy = 'date' | 'rating' | 'restaurant'
type FilterType = 'all' | 'five-stars' | 'recent' | 'restaurant' | 'burger-type'

export const MyReviewsSection = React.memo(function MyReviewsSection({
  reviews,
  isLoading = false,
  onRefresh,
  onDeleteSuccess,
}: MyReviewsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<{
    type: FilterType
    sortBy: SortBy
    restaurant?: string
    burgerTypes?: string[]
  }>({
    type: 'all',
    sortBy: 'date',
  })

  const filteredReviews = useCallback(() => {
    let filtered = [...reviews]

    // Aplicar filtros
    if (activeFilters.type === 'five-stars') {
      filtered = filtered.filter((r) => r.overall_rating === 5)
    } else if (activeFilters.type === 'restaurant' && activeFilters.restaurant) {
      filtered = filtered.filter((r) => r.restaurant?.id === activeFilters.restaurant)
    } else if (activeFilters.type === 'burger-type' && activeFilters.burgerTypes?.length) {
      filtered = filtered.filter((r) => r.burger?.type && activeFilters.burgerTypes?.includes(r.burger.type))
    }

    // Aplicar ordenamiento
    if (activeFilters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0))
    } else if (activeFilters.sortBy === 'restaurant') {
      filtered.sort((a, b) => (a.restaurant?.name || '').localeCompare(b.restaurant?.name || ''))
    } else {
      // date (default)
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return filtered
  }, [reviews, activeFilters])

  const displayedReviews = filteredReviews()

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  }

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Mis Valoraciones</h3>
          <p className="text-sm text-gray-600 mt-1">
            {displayedReviews.length} de {reviews.length} valoraciones
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            <Loader className="w-8 h-8 text-amber-500" />
          </motion.div>
        </div>
      ) : displayedReviews.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-500 mb-4">Aún no has valorado ninguna burger</p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            Valorar una burger
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {displayedReviews.map((review) => (
              <motion.div key={review.id} variants={itemVariants}>
                <MyReviewCard
                  review={review}
                  onDeleteSuccess={onDeleteSuccess}
                  onRefresh={onRefresh}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Filters Modal */}
      <ReviewsFilters
        isOpen={isFiltersOpen}
        activeFilters={activeFilters}
        reviews={reviews}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters)
          setIsFiltersOpen(false)
        }}
      />
    </motion.div>
  )
})
