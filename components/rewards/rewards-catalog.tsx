'use client'

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RewardCard } from './reward-card'
import { type Reward } from '@/lib/api/rewards'
import { Button } from '@/components/ui/button'

interface RewardsCatalogProps {
  rewards: Reward[]
  userPoints: number
  userLevel?: string
  onRedeemClick?: (reward: Reward) => void
  isLoading?: boolean
}

const levelFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'burger_fan', label: '🍔 Burger Fan' },
  { id: 'burger_lover', label: '🍔🍔 Burger Lover' },
  { id: 'burger_obsessed', label: '🍔🍔🍔 Burger Obsessed' },
]

export const RewardsCatalog = memo(function RewardsCatalog({
  rewards,
  userPoints,
  userLevel = 'burger_fan',
  onRedeemClick,
  isLoading = false,
}: RewardsCatalogProps) {
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filteredRewards = rewards.filter((reward) => {
    if (selectedLevel === 'all') return true
    return reward.level_required === selectedLevel
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4"
      >
        {levelFilters.map((filter) => (
          <Button
            key={filter.id}
            onClick={() => setSelectedLevel(filter.id)}
            variant={selectedLevel === filter.id ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            {filter.label}
          </Button>
        ))}
      </motion.div>

      {/* Rewards grid */}
      <AnimatePresence mode="wait">
        {filteredRewards.length > 0 ? (
          <motion.div
            key={selectedLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          >
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RewardCard
                  reward={reward}
                  userPoints={userPoints}
                  userLevel={userLevel}
                  onRedeem={onRedeemClick}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-2">No hay premios disponibles</p>
            <p className="text-sm text-muted-foreground">
              Alcanza un nivel superior para ver más premios
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})
