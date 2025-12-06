'use client'

import { useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  isLoading?: boolean
  autofocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  autofocus = true,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autofocus) {
      inputRef.current?.focus()
    }
  }, [autofocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative flex items-center gap-2">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />

        <Input
          ref={inputRef}
          type="text"
          placeholder="Busca burgers o restaurantes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e as any)
            }
          }}
          className="pl-10 pr-10 py-3 text-lg rounded-lg border-2 border-border focus:border-primary"
        />

        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute right-4"
          >
            <Loader2 className="w-5 h-5 text-primary" />
          </motion.div>
        ) : value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 h-auto p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </motion.form>
  )
}
