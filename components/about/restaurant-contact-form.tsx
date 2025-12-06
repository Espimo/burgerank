'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const restaurantSchema = z.object({
  restaurantName: z.string().min(3, 'El nombre del restaurante es requerido'),
  contactName: z.string().min(2, 'El nombre de contacto es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  address: z.string().min(5, 'La dirección es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  message: z.string().optional(),
  honeypot: z.string().optional().refine((val) => !val, 'Invalid submission'),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

interface RestaurantContactFormProps {
  onClose?: () => void
}

export default function RestaurantContactForm({ onClose }: RestaurantContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
  })

  const onSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        setTimeout(() => {
          setSubmitStatus('idle')
          onClose?.()
        }, 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Registra tu Restaurante</h3>

      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h4 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por tu interés!</h4>
          <p className="text-gray-600">
            Nos pondremos en contacto contigo pronto para activar tu restaurante en BurgeRank.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden */}
          <input type="hidden" {...register('honeypot')} />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nombre del Restaurante */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre del Restaurante *
              </label>
              <Input
                placeholder="Mi Burger Place"
                {...register('restaurantName')}
                className="w-full"
              />
              {errors.restaurantName && (
                <p className="text-red-600 text-sm mt-1">{errors.restaurantName.message}</p>
              )}
            </div>

            {/* Nombre de Contacto */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre de Contacto *
              </label>
              <Input
                placeholder="Tu nombre"
                {...register('contactName')}
                className="w-full"
              />
              {errors.contactName && (
                <p className="text-red-600 text-sm mt-1">{errors.contactName.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email *
              </label>
              <Input
                type="email"
                placeholder="contacto@restaurante.com"
                {...register('email')}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Teléfono *
              </label>
              <Input
                placeholder="+34 600 123 456"
                {...register('phone')}
                className="w-full"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Dirección *
            </label>
            <Input
              placeholder="Calle Principal 123"
              {...register('address')}
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ciudad *
            </label>
            <Input
              placeholder="Madrid"
              {...register('city')}
              className="w-full"
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mensaje (Opcional)
            </label>
            <Textarea
              placeholder="Cuéntanos más sobre tu restaurante y tus especialidades..."
              {...register('message')}
              className="w-full h-24"
            />
          </div>

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle size={20} />
              <p>Hubo un error. Por favor, intenta de nuevo.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Registrar Restaurante'
              )}
            </Button>

            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Tus datos serán procesados conforme a nuestra{' '}
            <a href="/legal/privacy" className="text-amber-600 hover:underline">
              política de privacidad
            </a>
          </p>
        </form>
      )}
    </motion.div>
  )
}
