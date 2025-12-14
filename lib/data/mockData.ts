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
  // MADRID
  { id: 1, name: 'The King Burger', restaurant: 'Burger Palace', description: 'Smash beef con queso fundido y bacon crujiente', rating: 4.8, reviews: 245, userRating: 5, type: 'premium', position: 1, tags: ['Jugosa', 'Carne Fresca', 'Premium'], city: 'Madrid' },
  { id: 2, name: 'Double Stack Madrid', restaurant: 'Burger Palace', description: 'Dos carnes smash con queso americano y cebolla', rating: 4.6, reviews: 198, userRating: 4, type: 'doble', position: 2, tags: ['Doble', 'Clásica'], city: 'Madrid' },
  { id: 3, name: 'BBQ Master', restaurant: 'Fast Burger', description: 'Ternera con salsa BBQ casera', rating: 4.7, reviews: 212, userRating: 5, type: 'premium', position: 3, tags: ['BBQ', 'Ternera'], city: 'Madrid' },
  { id: 4, name: 'Classic Madrid', restaurant: 'Fast Burger', description: 'La clásica de toda la vida, simple y perfecta', rating: 4.4, reviews: 189, userRating: 4, type: 'clásica', position: 4, tags: ['Clásica', 'Económica'], city: 'Madrid' },
  { id: 5, name: 'Premium Gold', restaurant: 'Premium Beef', description: 'Carne wagyu con foie gras', rating: 4.9, reviews: 89, userRating: 5, type: 'premium', position: 5, tags: ['Wagyu', 'Luxury'], city: 'Madrid' },
  { id: 6, name: 'Truffle Burger', restaurant: 'Premium Beef', description: 'Con queso trufado y cebolla caramelizada', rating: 4.8, reviews: 76, userRating: 5, type: 'premium', position: 6, tags: ['Trufado', 'Gourmet'], city: 'Madrid' },
  { id: 7, name: 'Smash Classic', restaurant: 'Smash Burguer', description: 'Dos smash con queso y bacon', rating: 4.7, reviews: 203, userRating: 5, type: 'premium', position: 7, tags: ['Smash', 'Bacon'], city: 'Madrid' },
  { id: 8, name: 'The Inferno', restaurant: 'Fast Burger', description: 'Picante con jalapeños y salsa de fuego', rating: 4.5, reviews: 156, userRating: 4, type: 'premium', position: 8, tags: ['Picante', 'Jalapeños'], city: 'Madrid' },
  
  // BARCELONA
  { id: 9, name: 'Smoky BBQ', restaurant: 'Grill House', description: 'Ternera con salsa BBQ y cebolla caramelizada', rating: 4.7, reviews: 186, userRating: 4, type: 'premium', position: 9, tags: ['BBQ', 'Ternera', 'Salsa'], city: 'Barcelona' },
  { id: 10, name: 'Green Supreme', restaurant: 'Green Burger', description: 'Lentejas y setas con aguacate y rúcula', rating: 4.2, reviews: 156, userRating: 4, type: 'vegana', position: 10, tags: ['Vegana', 'Sano'], city: 'Barcelona' },
  { id: 11, name: 'BCN Meat Heaven', restaurant: 'Burger Barcelona', description: 'Tres tipos de carnes premium', rating: 4.6, reviews: 198, userRating: 5, type: 'premium', position: 11, tags: ['Triple', 'Premium'], city: 'Barcelona' },
  { id: 12, name: 'Catalan Burger', restaurant: 'Burger Barcelona', description: 'Con tomates de Ribarroja y jamón ibérico', rating: 4.8, reviews: 212, userRating: 5, type: 'premium', position: 12, tags: ['Ibérico', 'Local'], city: 'Barcelona' },
  { id: 13, name: 'The Beast', restaurant: 'The Meat House', description: 'Gran burger con tres carnes y tocino', rating: 4.7, reviews: 189, userRating: 5, type: 'doble', position: 13, tags: ['Beast', 'Triple'], city: 'Barcelona' },
  { id: 14, name: 'Craft Barcelona', restaurant: 'Craft Burgers BCN', description: 'Hecha a mano con ingredientes de calidad', rating: 4.6, reviews: 143, userRating: 4, type: 'premium', position: 14, tags: ['Craft', 'Casera'], city: 'Barcelona' },
  { id: 15, name: 'Gothic Glory', restaurant: 'Gothic Burger', description: 'Burger medieval con especias antiguas', rating: 4.4, reviews: 121, userRating: 4, type: 'premium', position: 15, tags: ['Especial', 'Medieval'], city: 'Barcelona' },
  { id: 16, name: 'Barcelona Triple Stack', restaurant: 'The Meat House', description: 'Tres carnes apiladas', rating: 4.8, reviews: 201, userRating: 5, type: 'premium', position: 16, tags: ['Triple', 'Stack'], city: 'Barcelona' },

  // VALENCIA
  { id: 17, name: 'Clásica Tradicional', restaurant: 'Burger Artisan', description: 'Simple pero perfecta, carne de calidad con queso', rating: 4.5, reviews: 312, userRating: 4, type: 'clásica', position: 17, tags: ['Clásica', 'Económica'], city: 'Valencia' },
  { id: 18, name: 'Turia Premium', restaurant: 'Turia Burgers', description: 'Con ingredientes especiales del río Turia', rating: 4.6, reviews: 178, userRating: 4, type: 'premium', position: 18, tags: ['Premium', 'Local'], city: 'Valencia' },
  { id: 19, name: 'Beach Special', restaurant: 'The Beach Burger', description: 'Burger fresca con pescado ahumado', rating: 4.4, reviews: 145, userRating: 4, type: 'premium', position: 19, tags: ['Pescado', 'Fresca'], city: 'Valencia' },
  { id: 20, name: 'Valencia Grill Master', restaurant: 'Valencia Grill', description: 'Especialidad a la parrilla', rating: 4.7, reviews: 198, userRating: 5, type: 'premium', position: 20, tags: ['Parrilla', 'Especial'], city: 'Valencia' },
  { id: 21, name: 'City Valencia', restaurant: 'Burger City Valencia', description: 'La favorita de la ciudad', rating: 4.4, reviews: 167, userRating: 4, type: 'clásica', position: 21, tags: ['Clásica', 'Popular'], city: 'Valencia' },
  { id: 22, name: 'Huerta Veggie', restaurant: 'Huerta Burgers', description: 'Vegetales de la huerta valenciana', rating: 4.3, reviews: 123, userRating: 4, type: 'vegana', position: 22, tags: ['Huerta', 'Orgánico'], city: 'Valencia' },
  { id: 23, name: 'Modern Valencia', restaurant: 'Modern Burger Valencia', description: 'Toque contemporáneo y sabores antiguos', rating: 4.6, reviews: 154, userRating: 4, type: 'premium', position: 23, tags: ['Moderno', 'Contemporáneo'], city: 'Valencia' },
  { id: 24, name: 'Premium Paella Burger', restaurant: 'Premium Valencia', description: 'Inspirada en la paella con azafrán', rating: 4.8, reviews: 189, userRating: 5, type: 'premium', position: 24, tags: ['Azafrán', 'Paella'], city: 'Valencia' },

  // SEVILLA
  { id: 25, name: 'Andaluz Classic', restaurant: 'Andaluz Burger', description: 'Clásica andaluza con especias', rating: 4.5, reviews: 189, userRating: 4, type: 'clásica', position: 25, tags: ['Andaluz', 'Especias'], city: 'Sevilla' },
  { id: 26, name: 'Giralda Premium', restaurant: 'Giralda Grill', description: 'Premium con vistas a la Giralda', rating: 4.7, reviews: 167, userRating: 5, type: 'premium', position: 26, tags: ['Premium', 'Monumental'], city: 'Sevilla' },
  { id: 27, name: 'Sevilla Signature', restaurant: 'Sevilla Burgers', description: 'La firma de Sevilla', rating: 4.6, reviews: 145, userRating: 4, type: 'premium', position: 27, tags: ['Firma', 'Iconic'], city: 'Sevilla' },
  { id: 28, name: 'Flamenco Spice', restaurant: 'Flamenco Burger', description: 'Con un toque de especias flamenco', rating: 4.4, reviews: 134, userRating: 4, type: 'premium', position: 28, tags: ['Especias', 'Flamenco'], city: 'Sevilla' },
  { id: 29, name: 'Triana Soul', restaurant: 'Triana Burger', description: 'El alma de Triana en una burger', rating: 4.6, reviews: 156, userRating: 4, type: 'premium', position: 29, tags: ['Soul', 'Triana'], city: 'Sevilla' },
  { id: 30, name: 'Premium Sevilla Gold', restaurant: 'Premium Sevilla', description: 'Lo mejor de Sevilla', rating: 4.8, reviews: 178, userRating: 5, type: 'premium', position: 30, tags: ['Gold', 'Premium'], city: 'Sevilla' },

  // BILBAO
  { id: 31, name: 'Basque Country', restaurant: 'Basque Burger', description: 'Ingredientes vascos locales', rating: 4.7, reviews: 198, userRating: 4, type: 'premium', position: 31, tags: ['Vasco', 'Local'], city: 'Bilbao' },
  { id: 32, name: 'Guggenheim', restaurant: 'Guggenheim Grill', description: 'Arte moderno en una burger', rating: 4.6, reviews: 167, userRating: 4, type: 'premium', position: 32, tags: ['Arte', 'Moderno'], city: 'Bilbao' },
  { id: 33, name: 'Bilbao Soul', restaurant: 'Bilbao Burgers', description: 'El alma de Bilbao', rating: 4.5, reviews: 145, userRating: 4, type: 'premium', position: 33, tags: ['Soul', 'Bilbao'], city: 'Bilbao' },
  { id: 34, name: 'Casco Viejo Wonder', restaurant: 'Casco Viejo Burger', description: 'Maravilla del Casco Viejo', rating: 4.7, reviews: 178, userRating: 5, type: 'premium', position: 34, tags: ['Medieval', 'Tradicional'], city: 'Bilbao' },
  { id: 35, name: 'Artisan Bilbao Premium', restaurant: 'Artisan Bilbao', description: 'Artesanía vasca premium', rating: 4.8, reviews: 145, userRating: 5, type: 'premium', position: 35, tags: ['Artisanal', 'Premium'], city: 'Bilbao' },
  { id: 36, name: 'Basque Excellence', restaurant: 'Premium Basque', description: 'Excelencia vasca', rating: 4.9, reviews: 189, userRating: 5, type: 'premium', position: 36, tags: ['Excelencia', 'Vasco'], city: 'Bilbao' },
]
