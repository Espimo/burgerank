import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface SubmitReviewData {
  burgerId: string
  overall_rating: number
  detailed_ratings?: {
    bread?: number
    meat?: number
    sauce?: number
    toppings?: number
    presentation?: number
    price_value?: number
    overall_experience?: number
  }
  category_tags?: {
    bread: string[]
    meat: string[]
    sauce: string[]
    toppings: string[]
  }
  experience_tags?: string[]
  comment?: string
  visit_date: Date
  images: File[]
}

export interface SubmitReviewResponse {
  success: boolean
  reviewId?: string
  newPoints?: number
  newLevel?: number
  unlockedBadges?: string[]
  unlockedRewards?: string[]
  error?: string
}

/**
 * Envía una review completa
 */
export async function submitReview(data: SubmitReviewData): Promise<SubmitReviewResponse> {
  try {
    // Obtener usuario actual
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para publicar una valoración',
      }
    }

    // Subir imágenes a Storage
    const imageUrls: string[] = []
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i]
      const fileName = `${user.id}/${data.burgerId}/${Date.now()}-${i}.webp`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('burger-reviews')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('burger-reviews').getPublicUrl(uploadData.path)

      imageUrls.push(publicUrl)
    }

    // Crear review en la base de datos
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        burger_id: data.burgerId,
        user_id: user.id,
        overall_rating: data.overall_rating,
        detailed_ratings: data.detailed_ratings || {},
        category_tags: data.category_tags || {},
        experience_tags: data.experience_tags || [],
        comment: data.comment || null,
        visit_date: data.visit_date.toISOString().split('T')[0],
        image_urls: imageUrls,
        verified: imageUrls.length > 0,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (reviewError) {
      return {
        success: false,
        error: 'Error al guardar la valoración',
      }
    }

    // Actualizar burger ratings
    const { error: burgerError } = await supabase.rpc('update_burger_rating', {
      burger_id: data.burgerId,
      new_rating: data.overall_rating,
    })

    if (burgerError) {
      console.error('Error updating burger rating:', burgerError)
    }

    // Calcular puntos
    let points = 50 // Review completa
    if (imageUrls.length > 0) points += 10 // Con foto verificada
    // TODO: Verificar si es primera del mes para +20 pts

    // Obtener los puntos actuales del usuario
    const { data: profileData } = await supabase
      .from('profiles')
      .select('total_points, available_points, total_reviews')
      .eq('id', user.id)
      .single()

    // Actualizar puntos del usuario
    const { error: pointsError } = await supabase
      .from('profiles')
      .update({
        total_points: (profileData?.total_points || 0) + points,
        available_points: (profileData?.available_points || 0) + points,
        total_reviews: (profileData?.total_reviews || 0) + 1,
      })
      .eq('id', user.id)

    if (pointsError) {
      console.error('Error updating points:', pointsError)
    }

    return {
      success: true,
      reviewId: reviewData.id,
      newPoints: points,
      newLevel: undefined, // TODO: Calcular nivel
      unlockedBadges: [],
      unlockedRewards: [],
    }
  } catch (error) {
    console.error('Submit review error:', error)
    return {
      success: false,
      error: 'Error al publicar la valoración',
    }
  }
}
