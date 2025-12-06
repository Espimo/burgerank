'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Award, BarChart3 } from 'lucide-react'
import { MyReviewsSection } from '@/components/profile/my-reviews-section'
import TopFiveSection from '@/components/profile/top-five-section'
import ReviewStatsCard from '@/components/profile/review-stats-card'
import RatingDistribution from '@/components/profile/rating-distribution'
import { getMyReviews, getReviewStats, type Review } from '@/lib/api/my-reviews'

/**
 * EXAMPLE: Complete Profile with Reviews and Top 5
 * 
 * This is a complete working example that combines all the new components
 * from Profile Phase 2 into a tabbed interface.
 * 
 * Usage in your profile page:
 * ```tsx
 * import ProfileReviewsTab from '@/components/examples/profile-reviews-example'
 * 
 * export default function ProfilePage({ userId }: { userId: string }) {
 *   return <ProfileReviewsTab userId={userId} />
 * }
 * ```
 */

interface ReviewStats {
  avgRating: number
  totalReviews: number
  totalLikes: number
  mostPopular: any
  mostVisitedRestaurant: string | null
  monthWithMostReviews: [string, number] | null
}

export default function ProfileReviewsTab({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Load stats when tab changes to statistics
  const handleStatsTabClick = async () => {
    if (stats) return // Already loaded

    try {
      setIsLoadingStats(true)
      const [statsData, reviewsData] = await Promise.all([
        getReviewStats(userId),
        getMyReviews(userId, 100, 0), // Load first 100 for stats
      ])
      setStats(statsData)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  return (
    <Tabs defaultValue="reviews" className="w-full">
      {/* Tabs Header */}
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="reviews" className="flex gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Valoraciones</span>
          <span className="sm:hidden">Reviews</span>
        </TabsTrigger>

        <TabsTrigger value="top5" className="flex gap-2">
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Top 5</span>
          <span className="sm:hidden">Ranking</span>
        </TabsTrigger>

        <TabsTrigger
          value="stats"
          onClick={handleStatsTabClick}
          className="flex gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Estadísticas</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab Contents */}

      {/* 1. My Reviews Tab */}
      <TabsContent value="reviews" className="space-y-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mis Valoraciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona todas tus reviews de burgers. Filtra, edita y elimina tus valoraciones.
          </p>
        </div>

        <MyReviewsSection reviews={reviews} isLoading={isLoadingStats} />
      </TabsContent>

      {/* 2. Top 5 Burgers Tab */}
      <TabsContent value="top5" className="space-y-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mi Ranking Personal</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tu top 5 de burgers. Reordena manualmente o deja que se auto-calcule basado en tus
            valoraciones.
          </p>
        </div>

        <TopFiveSection userId={userId} />
      </TabsContent>

      {/* 3. Statistics Tab */}
      <TabsContent value="stats" className="space-y-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Mis Estadísticas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Análisis detallado de tus valoraciones y preferencias de burgers.
          </p>
        </div>

        {isLoadingStats ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ReviewStatsCard
                stat="avgRating"
                label="Rating Promedio"
                value={stats.avgRating.toFixed(1)}
                icon={<span className="text-2xl">⭐</span>}
                color="amber"
              />

              <ReviewStatsCard
                stat="totalReviews"
                label="Total Valoraciones"
                value={stats.totalReviews}
                icon={<BookOpen className="h-6 w-6" />}
                color="blue"
              />

              <ReviewStatsCard
                stat="totalLikes"
                label="Likes Recibidos"
                value={stats.totalLikes}
                icon={<span className="text-2xl">❤️</span>}
                color="rose"
              />

              <ReviewStatsCard
                stat="monthWithMostReviews"
                label="Mes Más Activo"
                value={
                  stats.monthWithMostReviews
                    ? `${stats.monthWithMostReviews[0]} (${stats.monthWithMostReviews[1]})`
                    : '-'
                }
                icon={<span className="text-2xl">📅</span>}
                color="green"
              />
            </div>

            {/* Rating Distribution */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Distribución de Ratings
              </h3>
              <RatingDistribution reviews={reviews} variant="bar" />
            </div>

            {/* Most Popular Review */}
            {stats.mostPopular && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Review Más Popular
                </h3>
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {stats.mostPopular.burger?.name || 'Burger desconocida'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {stats.mostPopular.restaurant?.name || 'Restaurante desconocido'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">❤️ {stats.mostPopular.likes_count}</p>
                      <p className="text-sm text-gray-500">likes</p>
                    </div>
                  </div>

                  {stats.mostPopular.comment && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-sm text-gray-700 italic">
                        "{stats.mostPopular.comment}"
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-200 text-amber-900">
                      {stats.mostPopular.overall_rating.toFixed(1)} ⭐
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Dato Curioso</h4>
                <p className="text-sm text-blue-700">
                  Has valorado {stats.totalReviews} burgers. ¡Eres un verdadero crítico de
                  burgers! 🍔
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <h4 className="font-semibold text-green-900 mb-2">🎯 Recomendación</h4>
                <p className="text-sm text-green-700">
                  Tu rating promedio es {stats.avgRating.toFixed(1)}. Parece que tienes criterio
                  selectivo 👍
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay estadísticas disponibles aún.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * 1. Simple integration in profile page:
 * ```tsx
 * import ProfileReviewsTab from '@/components/examples/profile-reviews-example'
 * 
 * export default function ProfilePage() {
 *   const { userId } = useAuth()
 *   return <ProfileReviewsTab userId={userId} />
 * }
 * ```
 * 
 * 2. With page wrapper:
 * ```tsx
 * import ProfileReviewsTab from '@/components/examples/profile-reviews-example'
 * 
 * export default function MyReviewsPage() {
 *   const { userId } = useAuth()
 *   
 *   return (
 *     <div className="container mx-auto py-8">
 *       <ProfileReviewsTab userId={userId} />
 *     </div>
 *   )
 * }
 * ```
 * 
 * 3. With analytics:
 * ```tsx
 * function ProfileReviewsTabWithAnalytics({ userId }: { userId: string }) {
 *   useEffect(() => {
 *     analytics.track('profile_reviews_tab_viewed', { userId })
 *   }, [userId])
 *   
 *   return <ProfileReviewsTab userId={userId} />
 * }
 * ```
 * 
 * 4. Standalone as separate routes:
 * ```tsx
 * // app/profile/reviews/page.tsx
 * import MyReviewsSection from '@/components/profile/my-reviews-section'
 * export default function ReviewsPage() {
 *   const userId = useUserId()
 *   return <MyReviewsSection userId={userId} />
 * }
 * 
 * // app/profile/top5/page.tsx
 * import TopFiveSection from '@/components/profile/top-five-section'
 * export default function Top5Page() {
 *   const userId = useUserId()
 *   return <TopFiveSection userId={userId} />
 * }
 * ```
 */
