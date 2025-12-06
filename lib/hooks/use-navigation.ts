'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useNavigation() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const navigate = async (path: string) => {
    try {
      setIsLoading(true)
      router.push(path)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    goToRanking: () => navigate('/ranking'),
    goToSearch: () => navigate('/search'),
    goToRate: () => navigate('/rate'),
    goToRewards: () => navigate('/rewards'),
    goToProfile: () => navigate('/profile'),
    goToBurger: (id: string) => navigate(`/burger/${id}`),
    goToRestaurant: (id: string) => navigate(`/restaurant/${id}`),
    navigate,
  }
}
