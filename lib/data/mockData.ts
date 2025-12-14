export interface Burger {
  id: number
  name: string
  restaurant: string
  description: string
  rating: number
  reviews: number
  userRating: number
  type: string
  position: number
  tags: string[]
  city: string
}

export const burgers: Burger[] = [
  {
    id: 1,
    name: 'The King Burger',
    restaurant: 'Burger Palace',
    description: 'Smash beef con queso fundido y bacon crujiente',
    rating: 4.8,
    reviews: 245,
    userRating: 5,
    type: 'premium',
    position: 1,
    tags: ['Jugosa', 'Carne Fresca', 'Premium'],
    city: 'Madrid',
  },
  {
    id: 2,
    name: 'Smoky BBQ',
    restaurant: 'Grill House',
    description: 'Ternera con salsa BBQ y cebolla caramelizada',
    rating: 4.7,
    reviews: 186,
    userRating: 4,
    type: 'premium',
    position: 2,
    tags: ['BBQ', 'Ternera', 'Salsa'],
    city: 'Barcelona',
  },
  {
    id: 3,
    name: 'Clásica Tradicional',
    restaurant: 'Burger Artisan',
    description: 'Simple pero perfecta, carne de calidad con queso',
    rating: 4.5,
    reviews: 312,
    userRating: 0,
    type: 'clásica',
    position: 3,
    tags: ['Clásica', 'Económica'],
    city: 'Valencia',
  },
  {
    id: 4,
    name: 'Doble Sabor',
    restaurant: 'Fast Burger',
    description: 'Dos carnes con doble queso y salsa especial',
    rating: 4.3,
    reviews: 198,
    userRating: 3,
    type: 'doble',
    position: 4,
    tags: ['Doble', 'Picante'],
    city: 'Madrid',
  },
  {
    id: 5,
    name: 'Veggie Supreme',
    restaurant: 'Green Burger',
    description: 'Lentejas y setas con aguacate y rúcula',
    rating: 4.2,
    reviews: 156,
    userRating: 0,
    type: 'vegana',
    position: 5,
    tags: ['Vegana', 'Sano'],
    city: 'Barcelona',
  },
]
