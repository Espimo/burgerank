import { z } from 'zod'

export const reviewSchema = z.object({
  burgerId: z.string().min(1, 'Selecciona una burger'),
  overall_rating: z.number().min(0).max(5).default(0),
  detailed_ratings: z
    .object({
      bread: z.number().min(0).max(5).optional(),
      meat: z.number().min(0).max(5).optional(),
      sauce: z.number().min(0).max(5).optional(),
      toppings: z.number().min(0).max(5).optional(),
      presentation: z.number().min(0).max(5).optional(),
      price_value: z.number().min(0).max(5).optional(),
      overall_experience: z.number().min(0).max(5).optional(),
    })
    .optional(),
  category_tags: z
    .object({
      bread: z.array(z.string()).max(5),
      meat: z.array(z.string()).max(5),
      sauce: z.array(z.string()).max(5),
      toppings: z.array(z.string()).max(5),
    })
    .optional(),
  experience_tags: z.array(z.string()).max(12).optional(),
  comment: z.string().max(280, 'El comentario no puede exceder 280 caracteres').optional(),
  visit_date: z
    .date()
    .max(new Date(), 'La fecha de visita no puede ser en el futuro')
    .default(() => new Date()),
  images: z
    .array(z.instanceof(File))
    .min(1, 'Debes subir al menos una foto')
    .max(5, 'Máximo 5 fotos'),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
