import { memo, useState, useCallback, useEffect } from 'react'
import { BurgerCard } from '../burger/burger-card'
import * as api from '@/lib/api/restaurants-client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface RestaurantBurgersListProps {
  restaurantId: string
  onSelectBurger?: (burgerId: string) => void
}

interface Burger {
  id: string
  name: string
  image_url?: string
  average_rating: number
  price?: number
  burger_type?: string
}

export const RestaurantBurgersList = memo(function RestaurantBurgersList({
  restaurantId,
  onSelectBurger,
}: RestaurantBurgersListProps) {
  const [burgers, setBurgers] = useState<Burger[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'price'>('rating')

  useEffect(() => {
    const loadBurgers = async () => {
      setIsLoading(true)
      try {
        const data = await api.getRestaurantBurgers(restaurantId, sortBy)
        setBurgers(data || [])
      } catch (error) {
        console.error('Error loading restaurant burgers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBurgers()
  }, [restaurantId, sortBy])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (burgers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay hamburguesas disponibles
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort buttons */}
      <div className="flex gap-2">
        {(
          [
            { value: 'rating' as const, label: 'Mejor calificadas' },
            { value: 'newest' as const, label: 'Más nuevas' },
            { value: 'price' as const, label: 'Precio menor' },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Burgers grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {burgers.map((burger) => (
          <BurgerCard
            key={burger.id}
            id={burger.id}
            name={burger.name}
            image_url={burger.image_url}
            restaurant_name=""
            restaurant_id={restaurantId}
            average_rating={burger.average_rating || 0}
            review_count={0}
            price={burger.price}
            burger_type={burger.burger_type}
            onViewDetails={() => onSelectBurger?.(burger.id)}
          />
        ))}
      </motion.div>
    </div>
  )
})

RestaurantBurgersList.displayName = 'RestaurantBurgersList'
