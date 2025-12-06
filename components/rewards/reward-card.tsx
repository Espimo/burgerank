'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import { type Reward } from '@/lib/api/rewards'

interface RewardCardProps {
  reward: Reward
  userPoints: number
  userLevel?: string
  onRedeem?: (reward: Reward) => void
  isLoading?: boolean
}

const levelBadges = {
  burger_fan: { label: 'Burger Fan', color: 'bg-blue-500/20 text-blue-700' },
  burger_lover: { label: 'Burger Lover', color: 'bg-purple-500/20 text-purple-700' },
  burger_obsessed: { label: 'Burger Obsessed', color: 'bg-red-500/20 text-red-700' },
}

const levelHierarchy = {
  burger_fan: 1,
  burger_lover: 2,
  burger_obsessed: 3,
}

export const RewardCard = memo(function RewardCard({
  reward,
  userPoints,
  userLevel = 'burger_fan',
  onRedeem,
  isLoading = false,
}: RewardCardProps) {
  const canAfford = userPoints >= reward.cost_points
  const userLevelValue = levelHierarchy[userLevel as keyof typeof levelHierarchy] || 0
  const requiredLevelValue = levelHierarchy[reward.level_required as keyof typeof levelHierarchy] || 0
  const hasLevel = userLevelValue >= requiredLevelValue
  const canRedeem = canAfford && hasLevel

  const levelInfo = levelBadges[reward.level_required] || levelBadges.burger_fan

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative rounded-xl border-2 overflow-hidden transition-all ${
        canRedeem ? 'border-primary bg-card hover:shadow-lg' : 'border-muted bg-muted/30'
      }`}
    >
      {/* Disabled overlay */}
      {!canRedeem && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-white/80" />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Icon */}
        <div className="text-5xl text-center">{reward.icon_emoji}</div>

        {/* Name and description */}
        <div className="space-y-1 text-center">
          <h3 className="font-bold text-sm line-clamp-2">{reward.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {reward.description}
          </p>
        </div>

        {/* Level badge */}
        <div className="flex justify-center">
          <Badge className={levelInfo.color} variant="secondary">
            {levelInfo.label}
          </Badge>
        </div>

        {/* Points */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {reward.cost_points}
          </div>
          <div className="text-xs text-muted-foreground">puntos</div>
        </div>

        {/* Status message */}
        {!canRedeem && (
          <div className="text-xs text-center text-destructive font-medium">
            {!canAfford && `Necesitas ${reward.cost_points - userPoints} puntos más`}
            {canAfford && !hasLevel && `Desbloquea en ${reward.level_required}`}
          </div>
        )}

        {/* Redeem button */}
        <Button
          onClick={() => onRedeem?.(reward)}
          disabled={!canRedeem || isLoading}
          className="w-full"
          size="sm"
        >
          {isLoading ? 'Canjeando...' : 'Canjear'}
        </Button>
      </div>
    </motion.div>
  )
})
