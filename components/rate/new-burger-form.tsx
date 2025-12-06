'use client'

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newBurgerSchema, type NewBurgerFormData } from '@/lib/validations/new-burger-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface NewBurgerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: NewBurgerFormData) => void | Promise<void>
  isSubmitting?: boolean
}

export const NewBurgerForm = memo(function NewBurgerForm({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: NewBurgerFormProps) {
  const [step, setStep] = useState<'restaurant' | 'burger'>('restaurant')
  const [restaurantSearch, setRestaurantSearch] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<NewBurgerFormData>({
    resolver: zodResolver(newBurgerSchema),
    defaultValues: {
      restaurant: {
        name: '',
        address: '',
        city: '',
        phone: '',
      },
      name: '',
      description: '',
      price: 0,
      type: 'Clasica',
      special_features: {
        sin_gluten: false,
        vegana: false,
        vegetariana: false,
        keto: false,
        picante: false,
      },
      photo: undefined,
    },
  })

  const handleFormSubmit = async (data: NewBurgerFormData) => {
    await onSubmit(data)
    setSubmitted(true)
  }

  const handleClose = () => {
    if (!isSubmitting && !submitted) {
      onOpenChange(false)
      form.reset()
      setStep('restaurant')
      setSubmitted(false)
    }
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center space-y-4 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">¡Burger Enviada!</h2>
            <p className="text-sm text-muted-foreground">
              Tu burger será revisada por nuestro equipo y aparecerá en 24-48 horas
            </p>
          </div>

          <Button
            onClick={() => {
              onOpenChange(false)
              form.reset()
              setStep('restaurant')
              setSubmitted(false)
            }}
            className="w-full"
          >
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Burger</DialogTitle>
          <DialogDescription>
            {step === 'restaurant'
              ? 'Primero, información del restaurante'
              : 'Ahora, detalles de la burger'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {/* Step: Restaurant */}
              {step === 'restaurant' && (
                <motion.div
                  key="restaurant"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="restaurant.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Restaurante</FormLabel>
                        <FormControl>
                          <Input placeholder="Mi Burger" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restaurant.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección Completa</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle Principal 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restaurant.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Madrid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restaurant.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 912 345 678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={() => setStep('burger')}
                    type="button"
                    className="w-full"
                  >
                    Siguiente
                  </Button>
                </motion.div>
              )}

              {/* Step: Burger */}
              {step === 'burger' && (
                <motion.div
                  key="burger"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Burger</FormLabel>
                        <FormControl>
                          <Input placeholder="Burger Classic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe los ingredientes principales..."
                            className="resize-none min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="9.99"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Clasica">Clásica</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Gourmet">Gourmet</SelectItem>
                              <SelectItem value="Vegana">Vegana</SelectItem>
                              <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                              <SelectItem value="Pollo">Pollo</SelectItem>
                              <SelectItem value="Cerdo">Cerdo</SelectItem>
                              <SelectItem value="Cordero">Cordero</SelectItem>
                              <SelectItem value="Mixta">Mixta</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Special features */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Características Especiales</label>
                    <div className="space-y-2">
                      {(
                        [
                          { key: 'sin_gluten', label: 'Sin gluten' },
                          { key: 'vegana', label: 'Vegana' },
                          { key: 'vegetariana', label: 'Vegetariana' },
                          { key: 'keto', label: 'Keto' },
                          { key: 'picante', label: 'Picante' },
                        ] as const
                      ).map(({ key, label }) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`special_features.${key}`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Info message */}
                  <div className="flex gap-2 p-3 bg-blue-500/10 text-blue-700 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Tu burger será revisada por nuestro equipo y aparecerá en 24-48h</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setStep('restaurant')}
                      variant="outline"
                      type="button"
                      className="flex-1"
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar para revisión'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
