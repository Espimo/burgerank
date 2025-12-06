'use client'

import { memo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'

interface CommentTextareaProps {
  value: string
  onChange: (value: string) => void
}

const MAX_CHARS = 280

export const CommentTextarea = memo(function CommentTextarea({
  value,
  onChange,
}: CommentTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value.slice(0, MAX_CHARS)
      onChange(newValue)
      adjustHeight()
    },
    [onChange]
  )

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 80)}px`
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const remaining = MAX_CHARS - value.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="text-sm font-semibold">Comentario (Opcional)</label>

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Cuéntanos tu experiencia (opcional)"
          className="resize-none min-h-20 pr-12"
        />

        {/* Character counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute bottom-2 right-2 text-xs font-semibold ${
            remaining < 50 ? 'text-red-600' : remaining < 100 ? 'text-yellow-600' : 'text-muted-foreground'
          }`}
        >
          {remaining}
        </motion.div>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        Máximo {MAX_CHARS} caracteres • {value.length} usados
      </p>
    </motion.div>
  )
})
