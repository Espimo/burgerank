'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { QuickSearch } from '@/components/burger/quick-search'
import { RankingFilters } from '@/components/burger/ranking-filters'
import { BurgerList } from '@/components/burger/burger-list'
import { BurgerDetailModal } from '@/components/burger/burger-detail-modal'
import { useBurgeRankFunctions } from '@/lib/hooks/use-burger-rank-functions'
import { Flame } from 'lucide-react'

interface RankingClientProps {}

export function RankingClient(props: RankingClientProps) {
  const [selectedBurgerId, setSelectedBurgerId] = useState<string | undefined>()
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  const {
    filterByView,
    switchRankingView,
    filterRanking,
    showCityModal,
    showTagFiltersModal,
    showAllergensModal,
  } = useBurgeRankFunctions()

  const handleSelectBurger = useCallback((burgerId: string) => {
    setSelectedBurgerId(burgerId)
    setShowDetailModal(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-[56px] z-30 bg-background border-b border-border px-4 py-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Flame className="w-5 h-5 text-orange-500" />
          <h1 className="text-xl font-bold">Ranking de Hamburguesas</h1>
        </motion.div>

        {/* Search */}
        <QuickSearch />
      </div>

      {/* Filters */}
      <RankingFilters />

      {/* Content */}
      <div className="flex-1">
        <BurgerList onSelectBurger={handleSelectBurger} />
      </div>

      {/* Detail Modal */}
      <BurgerDetailModal
        burgerId={selectedBurgerId}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </motion.div>
  )
}
