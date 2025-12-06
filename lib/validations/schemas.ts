import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    displayName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre debe tener máximo 50 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

// Burger rating schema
export const ratingSchema = z.object({
  burger_id: z.string().min(1, "Selecciona una hamburguesa"),
  score: z.number().min(1, "Rating requerido").max(5, "Rating máximo es 5"),
  taste_score: z.number().min(1).max(5),
  texture_score: z.number().min(1).max(5),
  presentation_score: z.number().min(1).max(5),
  value_score: z.number().min(1).max(5),
  comment: z.string().max(500, "El comentario es muy largo").optional(),
})

export type RatingInput = z.infer<typeof ratingSchema>

// Burger creation schema
export const burgerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().max(500, "Descripción muy larga").optional(),
  restaurant_id: z.string().min(1, "Selecciona un restaurante"),
  price: z.number().positive("El precio debe ser positivo"),
  ingredients: z.array(z.string()).min(1, "Agrega al menos un ingrediente"),
})

export type BurgerInput = z.infer<typeof burgerSchema>

// Search and filter schema
export const searchSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  min_rating: z.number().min(0).max(5).optional(),
  sort_by: z.enum(["rating", "recent", "price"]).optional(),
})

export type SearchInput = z.infer<typeof searchSchema>

// Profile update schema
export const profileSchema = z.object({
  display_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres"),
  bio: z.string().max(200, "La biografía es muy larga").optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
