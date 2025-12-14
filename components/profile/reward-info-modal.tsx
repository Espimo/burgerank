'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RewardInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reward?: { name: string; description: string; points: number }
}

export function RewardInfoModal({ open, onOpenChange, reward }: RewardInfoModalProps) {
  if (!reward) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-lg">🎁 {reward.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">{reward.description}</p>
          <p className="text-sm font-semibold">
            Costo: <span className="text-primary text-base">{reward.points} puntos</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
