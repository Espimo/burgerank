'use client'

import { memo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  size?: 'small' | 'medium' | 'large'
  showValue?: boolean
  readOnly?: boolean
}

const sizeMap = {
  small: { star: 20, gap: 4 },
  medium: { star: 32, gap: 6 },
  large: { star: 48, gap: 8 },
}

export const StarRatingInput = memo(function StarRatingInput({
  value,
  onChange,
  size = 'medium',
  showValue = true,
  readOnly = false,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const { star, gap } = sizeMap[size]

  const handleMouseMove = useCallback(
    (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isHalf = x < rect.width / 2

      setHoverValue(index + (isHalf ? 0.5 : 1))
    },
    [readOnly]
  )

  const handleClick = useCallback(
    (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isHalf = x < rect.width / 2

      onChange(index + (isHalf ? 0.5 : 1))
    },
    [onChange, readOnly]
  )

  const displayValue = hoverValue ?? value

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1" style={{ gap: `${gap}px` }}>
        {[0, 1, 2, 3, 4].map((index) => {
          const fillValue = Math.min(Math.max(displayValue - index, 0), 1)

          return (
            <motion.button
              key={index}
              onMouseMove={(e) => handleMouseMove(index, e as any)}
              onClick={(e) => handleClick(index, e as any)}
              onMouseLeave={() => setHoverValue(null)}
              whileTap={!readOnly ? { scale: 0.9 } : {}}
              className="relative transition-transform"
              style={{
                width: `${star}px`,
                height: `${star}px`,
              }}
              type="button"
              disabled={readOnly}
            >
              {/* Background star */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-muted-foreground/30">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="currentColor"
                />
              </svg>

              {/* Filled star */}
              <div
                className="absolute top-0 left-0 overflow-hidden transition-all"
                style={{ width: `${fillValue * 100}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full text-yellow-400"
                  style={{ width: `${star}px` }}
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </motion.button>
          )
        })}
      </div>

      {showValue && (
        <motion.span
          key={displayValue}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-semibold min-w-12 text-center text-foreground"
        >
          {displayValue.toFixed(1)}
        </motion.span>
      )}
    </div>
  )
})
