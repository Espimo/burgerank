'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { type LucideIcon } from 'lucide-react'

interface SliderRatingInputProps {
  label: string
  icon?: LucideIcon
  value: number
  onChange: (value: number) => void
}

export const SliderRatingInput = memo(function SliderRatingInput({
  label,
  icon: Icon,
  value,
  onChange,
}: SliderRatingInputProps) {
  const getColor = (val: number) => {
    if (val < 2) return 'from-red-500 to-red-600'
    if (val < 3.5) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getColorClass = (val: number) => {
    if (val < 2) return 'text-red-600'
    if (val < 3.5) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-border bg-muted/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <label className="text-sm font-semibold">{label}</label>
        </div>
        <motion.span
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-lg font-bold ${getColorClass(value)}`}
        >
          {value.toFixed(1)}
        </motion.span>
      </div>

      {/* Slider */}
      <Slider
        min={0}
        max={5}
        step={0.5}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
      />

      {/* Color indicator */}
      <div className="mt-3 flex gap-2">
        <div
          className={`flex-1 h-2 rounded-full bg-gradient-to-r ${getColor(value)} transition-all`}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Pobre</span>
        <span>Regular</span>
        <span>Excelente</span>
      </div>
    </motion.div>
  )
})
