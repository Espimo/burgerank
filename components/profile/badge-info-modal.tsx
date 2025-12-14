'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BadgeInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  badge?: { name: string; description: string }
}

export function BadgeInfoModal({ open, onOpenChange, badge }: BadgeInfoModalProps) {
  if (!badge) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-lg">🏅 {badge.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-4">{badge.description}</p>
      </DialogContent>
    </Dialog>
  )
}
