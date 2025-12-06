import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import * as api from '@/lib/api/restaurants-client'
import { RestaurantHero } from '@/components/restaurant/restaurant-hero'
import { RestaurantActions } from '@/components/restaurant/restaurant-actions'
import { RestaurantBurgersList } from '@/components/restaurant/restaurant-burgers-list'

interface RestaurantPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function generateMetadata({
  params,
}: RestaurantPageProps): Promise<Metadata> {
  return {
    title: 'Restaurante | BurgeRank',
    description: 'Descubre este restaurante en BurgeRank',
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  return (
    <div className="pb-20">
      {/* Placeholder - Content will be loaded client-side */}
      <div className="p-4">
        <p>Cargando restaurante...</p>
      </div>
    </div>
  )
}
