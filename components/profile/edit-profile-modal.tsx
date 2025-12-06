'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Loader } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UserProfile } from '@/lib/api/user-stats'

interface EditProfileModalProps {
  isOpen: boolean
  profile: UserProfile
  isLoading?: boolean
  onClose: () => void
  onSave: (data: Partial<UserProfile>) => Promise<void>
}

const BURGER_CATEGORIES = [
  { value: 'clasica', label: 'Clásica 🍔', emoji: '🍔' },
  { value: 'gourmet', label: 'Gourmet 👑', emoji: '👑' },
  { value: 'vegana', label: 'Vegana 🥗', emoji: '🥗' },
  { value: 'picante', label: 'Picante 🌶️', emoji: '🌶️' },
  { value: 'exotica', label: 'Exótica 🌍', emoji: '🌍' },
]

export const EditProfileModal = React.memo(function EditProfileModal({
  isOpen,
  profile,
  isLoading = false,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    full_name: profile.full_name,
    bio: profile.bio,
    city: profile.city,
    preferred_category: profile.preferred_category,
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name?.trim()) {
      setError('El nombre es requerido')
      return
    }

    if ((formData.full_name?.length || 0) < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    if ((formData.bio?.length || 0) > 160) {
      setError('La biografía debe tener máximo 160 caracteres')
      return
    }

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
          <DialogDescription>Actualiza tu información personal</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Nombre Completo *
            </label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Biografía */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Biografía
              </label>
              <span className="text-xs text-gray-500">
                {(formData.bio?.length || 0)}/160
              </span>
            </div>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti (máx 160 caracteres)"
              disabled={isLoading}
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Ciudad */}
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <Input
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Tu ciudad"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Categoría preferida */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Mi Burger Favorita
            </label>
            <select
              id="category"
              name="preferred_category"
              value={formData.preferred_category || ''}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Selecciona una categoría</option>
              {BURGER_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
            >
              <X className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
})
