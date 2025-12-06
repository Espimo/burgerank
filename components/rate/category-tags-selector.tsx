'use client'

import { memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface CategoryTagsSelectorProps {
  category: 'bread' | 'meat' | 'sauce' | 'toppings'
  selected: string[]
  onChange: (tags: string[]) => void
}

const tagOptions = {
  bread: [
    'Brioche',
    'Sésamo',
    'Integral',
    'Sin gluten',
    'Ciabatta',
    'Pretzel',
    'Otro',
  ],
  meat: [
    'Smash',
    'Vaca madurada',
    'Wagyu',
    'Poco hecha',
    'Al punto',
    'Muy hecha',
    'Blend especial',
    'Vegana',
    'Pollo',
    'Cerdo',
    'Cordero',
  ],
  sauce: [
    'Mayonesa',
    'BBQ',
    'Ketchup',
    'Mostaza',
    'Emmy',
    'Trufa',
    'Brava',
    'Alioli',
    'Sriracha',
    'Otra',
  ],
  toppings: [
    'Bacon',
    'Cebolla frita',
    'Cebolla caramelizada',
    'Mermelada bacon',
    'Queso cheddar',
    'Queso azul',
    'Queso americano',
    'Queso cabra',
    'Lechuga',
    'Tomate',
    'Pepinillos',
    'Jalapeños',
    'Huevo',
    'Aguacate',
    'Otro',
  ],
}

export const CategoryTagsSelector = memo(function CategoryTagsSelector({
  category,
  selected,
  onChange,
}: CategoryTagsSelectorProps) {
  const options = tagOptions[category]
  const canAdd = selected.length < 5

  const handleToggle = useCallback(
    (tag: string) => {
      if (selected.includes(tag)) {
        onChange(selected.filter((t) => t !== tag))
      } else if (canAdd) {
        onChange([...selected, tag])
      }
    },
    [selected, onChange, canAdd]
  )

  const categoryLabels = {
    bread: '🍞 Pan',
    meat: '🥩 Carne',
    sauce: '🍯 Salsas',
    toppings: '🥗 Acompañamientos',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{categoryLabels[category]}</h3>
        <span className="text-xs text-muted-foreground">
          {selected.length}/5 seleccionados
        </span>
      </div>

      {/* Selected tags */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-3 bg-primary/10 rounded-lg"
          >
            {selected.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Badge
                  variant="default"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleToggle(tag)}
                >
                  {tag} ×
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available options */}
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const isSelected = selected.includes(tag)

          return (
            <motion.button
              key={tag}
              onClick={() => handleToggle(tag)}
              disabled={!isSelected && !canAdd}
              whileTap={!isSelected && canAdd ? { scale: 0.95 } : {}}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : canAdd
                    ? 'bg-muted hover:bg-muted/80 cursor-pointer'
                    : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
              }`}
              type="button"
            >
              {tag}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
})
