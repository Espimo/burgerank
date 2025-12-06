'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Clock } from 'lucide-react'
import { useSearchStore } from '@/lib/stores/search-store'

interface SearchHistoryProps {
  onSelectHistory?: (query: string) => void
}

export const SearchHistory = memo(function SearchHistory({
  onSelectHistory,
}: SearchHistoryProps) {
  const { searchHistory, removeFromHistory, clearHistory } = useSearchStore()

  if (searchHistory.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">BÚSQUEDAS RECIENTES</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
        >
          Limpiar
        </Button>
      </div>

      {/* History items */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {searchHistory.map((query, index) => (
            <motion.div
              key={query}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted group"
            >
              <button
                onClick={() => onSelectHistory?.(query)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{query}</span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromHistory(query)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})
