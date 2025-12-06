'use client'

import { memo, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { compressImage, getFileSizeMB } from '@/lib/utils/image-compression'

interface PhotoUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxSizeMB?: number
}

const MAX_IMAGES = 5
const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const PhotoUpload = memo(function PhotoUpload({
  images,
  onImagesChange,
  maxImages = MAX_IMAGES,
  maxSizeMB = MAX_SIZE_MB,
}: PhotoUploadProps) {
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return

      setError(null)
      setIsCompressing(true)

      try {
        const newFiles = Array.from(files)
        const totalFiles = images.length + newFiles.length

        // Validar cantidad
        if (totalFiles > maxImages) {
          setError(`Máximo ${maxImages} fotos permitidas`)
          setIsCompressing(false)
          return
        }

        // Validar cada archivo
        for (const file of newFiles) {
          if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Solo JPG, PNG o WebP están permitidos')
            setIsCompressing(false)
            return
          }

          if (getFileSizeMB(file) > maxSizeMB) {
            setError(`Máximo ${maxSizeMB}MB por foto`)
            setIsCompressing(false)
            return
          }
        }

        // Comprimir imágenes
        const compressedFiles = await Promise.all(
          newFiles.map((file) => compressImage(file, 1200, 1200, 0.8))
        )

        // Crear previews
        const newPreviews = await Promise.all(
          compressedFiles.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
            })
          })
        )

        onImagesChange([...images, ...compressedFiles])
        setPreviews([...previews, ...newPreviews])
      } catch (err) {
        setError('Error al procesar imágenes')
        console.error(err)
      } finally {
        setIsCompressing(false)
      }
    },
    [images, onImagesChange, maxImages, previews]
  )

  const handleRemove = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index))
      setPreviews(previews.filter((_, i) => i !== index))
    },
    [images, onImagesChange, previews]
  )

  const canAddMore = images.length < maxImages

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Fotos de la Burger</h3>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages} fotos
        </span>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMore || isCompressing}
            className="hidden"
          />
          <Button
            asChild
            variant="outline"
            className="w-full cursor-pointer"
            disabled={!canAddMore || isCompressing}
          >
            <span className="flex flex-col items-center gap-1">
              {isCompressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>📷</span>}
              <span className="text-xs">Foto</span>
            </span>
          </Button>
        </label>

        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMore || isCompressing}
            className="hidden"
          />
          <Button
            asChild
            variant="outline"
            className="w-full cursor-pointer"
            disabled={!canAddMore || isCompressing}
          >
            <span className="flex flex-col items-center gap-1">
              <span>🖼️</span>
              <span className="text-xs">Galería</span>
            </span>
          </Button>
        </label>

        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMore || isCompressing}
            className="hidden"
          />
          <Button
            asChild
            variant="outline"
            className="w-full cursor-pointer"
            disabled={!canAddMore || isCompressing}
          >
            <span className="flex flex-col items-center gap-1">
              <span>🧾</span>
              <span className="text-xs">Ticket</span>
            </span>
          </Button>
        </label>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previews */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition-all opacity-0 hover:opacity-100"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        Mínimo 1 foto • JPG, PNG o WebP • Máximo {maxSizeMB}MB por foto
      </p>
    </motion.div>
  )
})
