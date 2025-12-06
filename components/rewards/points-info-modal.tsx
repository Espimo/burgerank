'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Award, CheckCircle, Users, Zap, Star, Gift, Medal } from 'lucide-react'

interface PointsInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const pointSources = [
  {
    icon: Star,
    title: 'Calificar una burger',
    points: 50,
    description: 'Comparte tu opinión',
  },
  {
    icon: CheckCircle,
    title: 'Subir foto verificada',
    points: 10,
    description: 'Incluye una foto en tu review',
  },
  {
    icon: Award,
    title: 'Completar perfil',
    points: 30,
    description: 'Llena todos tus datos',
  },
  {
    icon: Zap,
    title: 'Primera valoración del mes',
    points: 20,
    description: 'Bonus mensual',
  },
  {
    icon: Medal,
    title: 'Completar 10 Burger Matches',
    points: 5,
    description: 'Juega y gana',
  },
  {
    icon: Users,
    title: 'Invitar un amigo',
    points: 100,
    description: 'Comparte BurgeRank',
  },
  {
    icon: Gift,
    title: 'Conseguir un badge',
    points: 25,
    description: 'Logros especiales',
  },
]

export const PointsInfoModal = memo(function PointsInfoModal({
  open,
  onOpenChange,
}: PointsInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            ¿Cómo ganar puntos?
          </DialogTitle>
          <DialogDescription>
            Descubre todas las formas de ganar puntos en BurgeRank
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <AnimatePresence>
            {pointSources.map((source, index) => {
              const Icon = source.icon

              return (
                <motion.div
                  key={source.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">{source.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {source.description}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-primary text-sm">+{source.points}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-xs text-blue-700">
            💡 Los puntos no utilizados caducan después de 1 año. ¡Canjealos cuanto antes!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
})
