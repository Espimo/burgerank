'use client'

import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Calendar, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

interface RestaurantActionsProps {
  restaurant: {
    id: string
    phone?: string
    address?: string
    name: string
  }
}

export const RestaurantActions = memo(function RestaurantActions({
  restaurant,
}: RestaurantActionsProps) {
  const handleCall = useCallback(() => {
    if (restaurant.phone) {
      window.location.href = `tel:${restaurant.phone}`
    }
  }, [restaurant.phone])

  const handleDirections = useCallback(() => {
    if (restaurant.address) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`,
        '_blank'
      )
    }
  }, [restaurant.address])

  const handleReserve = useCallback(() => {
    // TODO: Implement reservation system
    window.open(`/restaurant/${restaurant.id}/reserve`, '_blank')
  }, [restaurant.id])

  const handleOrder = useCallback(() => {
    // TODO: Implement order system
    window.open(`/restaurant/${restaurant.id}/order`, '_blank')
  }, [restaurant.id])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Button
          onClick={handleCall}
          disabled={!restaurant.phone}
          variant="outline"
          className="w-full"
        >
          <Phone className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Llamar</span>
          <span className="sm:hidden">Llamar</span>
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Button
          onClick={handleDirections}
          disabled={!restaurant.address}
          variant="outline"
          className="w-full"
        >
          <MapPin className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Ubicación</span>
          <span className="sm:hidden">Mapa</span>
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Button
          onClick={handleReserve}
          variant="outline"
          className="w-full"
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Reservar</span>
          <span className="sm:hidden">Reservar</span>
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Button
          onClick={handleOrder}
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Pedir</span>
          <span className="sm:hidden">Pedir</span>
        </Button>
      </motion.div>
    </motion.div>
  )
})

RestaurantActions.displayName = 'RestaurantActions'
