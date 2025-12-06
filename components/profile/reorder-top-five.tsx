'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Grip, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Burger } from './top-five-section'

interface ReorderTopFiveProps {
  burgers: Burger[]
  onComplete: (reorderedBurgers: Burger[]) => void
  onCancel: () => void
}

interface DraggableBurgerItemProps {
  burger: Burger
  position: number
}

const DraggableBurgerItem = React.memo(function DraggableBurgerItem({
  burger,
  position,
}: DraggableBurgerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: burger.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={cn(
        'group flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 transition-all',
        isDragging && 'border-amber-500 bg-amber-50 shadow-lg'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab touch-none rounded bg-gray-100 p-2 hover:bg-gray-200 active:cursor-grabbing"
      >
        <Grip className="h-5 w-5 text-gray-400" />
      </div>

      {/* Position badge */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-300 font-bold text-amber-900">
        {position}
      </div>

      {/* Burger info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{burger.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {burger.restaurant?.name || 'Restaurante'}
        </p>
      </div>

      {/* Rating */}
      <div className="flex-shrink-0 rounded bg-amber-50 px-2 py-1">
        <p className="text-sm font-medium text-amber-900">{burger.average_rating.toFixed(1)} ⭐</p>
      </div>
    </motion.div>
  )
})

const ReorderTopFive = React.memo(function ReorderTopFive({
  burgers,
  onComplete,
  onCancel,
}: ReorderTopFiveProps) {
  const [items, setItems] = useState(burgers)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    } as any)
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  const handleSave = useCallback(() => {
    onComplete(items)
  }, [items, onComplete])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  }

  const hasChanges = items.some((item, idx) => item.id !== burgers[idx].id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">Reordenar Top 5</h3>
        <p className="text-sm text-gray-600">Arrastra para reorganizar tu ranking</p>
      </div>

      {/* Drag context */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {items.map((burger, index) => (
                <motion.div key={burger.id} variants={itemVariants} layout>
                  <DraggableBurgerItem burger={burger} position={index + 1} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          Guardar cambios
        </Button>
      </motion.div>

      {!hasChanges && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          Sin cambios por guardar
        </motion.p>
      )}
    </motion.div>
  )
})

export default ReorderTopFive
