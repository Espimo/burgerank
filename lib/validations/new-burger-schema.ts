import { z } from 'zod'

export const newBurgerSchema = z.object({
  restaurant: z.object({
    id: z.string().optional(),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
    address: z.string().min(5, 'Dirección inválida'),
    city: z.string().min(2, 'Ciudad requerida'),
    phone: z.string().optional(),
  }),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  description: z.string().max(200, 'La descripción no puede exceder 200 caracteres').optional(),
  price: z.number().positive('El precio debe ser positivo'),
  type: z.enum(
    ['Clasica', 'Premium', 'Gourmet', 'Vegana', 'Vegetariana', 'Pollo', 'Cerdo', 'Cordero', 'Mixta'],
    {
      errorMap: () => ({ message: 'Selecciona un tipo válido' }),
    }
  ),
  special_features: z
    .object({
      sin_gluten: z.boolean().default(false),
      vegana: z.boolean().default(false),
      vegetariana: z.boolean().default(false),
      keto: z.boolean().default(false),
      picante: z.boolean().default(false),
    })
    .optional(),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= 5242880, 'La foto no debe exceder 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Solo se permiten JPG, PNG o WebP'
    ),
})

export type NewBurgerFormData = z.infer<typeof newBurgerSchema>
