import { notFound } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import PublicProfileHeader from '@/components/profile/public-profile-header'
import PublicTopFive from '@/components/profile/public-top-five'
import PublicReviews from '@/components/profile/public-reviews'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PageProps {
  params: {
    username: string
  }
}

async function getPublicProfile(username: string) {
  const supabase = getSupabaseServer()

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select(
      `
      id,
      username,
      avatar_url,
      bio,
      level,
      total_reviews,
      followers_count,
      following_count,
      created_at
    `
    )
    .eq('username', username)
    .single() as { data: any | null; error: any }

  if (userError || !user) {
    notFound()
  }

  // Get top 5
  const { data: topFive } = await supabase
    .from('user_top_five')
    .select(
      `
      id,
      burger_id,
      position,
      is_private,
      burgers (
        id,
        name,
        image_url,
        rating,
        restaurants (
          id,
          name
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('position', { ascending: true })
    .limit(5) as { data: any[] | null }

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(
      `
      id,
      user_id,
      burger_id,
      rating,
      comment,
      liked_count,
      created_at,
      burgers (
        id,
        name,
        image_url,
        restaurants (
          id,
          name
        )
      )
    `
    )
    .eq('user_id', user.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50) as { data: any[] | null }

  return {
    user,
    topFive: topFive || [],
    reviews: reviews || [],
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { user, topFive, reviews } = await getPublicProfile(params.username)

  const formattedTopFive = topFive
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      id: item.burgers?.id || '',
      restaurant_id: item.burgers?.restaurants?.id || '',
      name: item.burgers?.name || '',
      image_url: item.burgers?.image_url,
      rating: item.burgers?.rating,
      restaurant: {
        name: item.burgers?.restaurants?.name || '',
      },
    }))

  const formattedReviews = reviews.map((review) => ({
    id: review.id,
    user_id: review.user_id,
    burger_id: review.burger_id,
    rating: review.rating,
    comment: review.comment,
    liked_count: review.liked_count,
    created_at: review.created_at,
    burger: {
      name: review.burgers?.name || '',
      image_url: review.burgers?.image_url,
      restaurant: {
        name: review.burgers?.restaurants?.name || '',
      },
    },
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <PublicProfileHeader
          user={user}
          currentUserId={undefined}
        />

        {/* Content Tabs */}
        <Tabs defaultValue="top-five" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="top-five" className="data-[state=active]:bg-amber-100">
              🏆 Top 5
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-amber-100">
              📝 Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-five" className="bg-white rounded-lg border border-gray-200 p-6">
            <PublicTopFive
              userId={user.id}
              topFive={formattedTopFive}
              isPrivate={formattedTopFive.length === 0}
            />
          </TabsContent>

          <TabsContent value="reviews" className="bg-white rounded-lg border border-gray-200 p-6">
            <PublicReviews
              userId={user.id}
              reviews={formattedReviews}
              isOwnProfile={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
