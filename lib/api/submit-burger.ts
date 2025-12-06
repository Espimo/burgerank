import { createClient } from '@supabase/supabase-js'
import { type NewBurgerFormData } from '@/lib/validations/new-burger-schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface SubmitBurgerResponse {
  success: boolean
  burgerId?: string
  error?: string
}

/**
 * Envía una nueva burger para revisión
 */
export async function submitNewBurger(data: NewBurgerFormData): Promise<SubmitBurgerResponse> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Debes iniciar sesión',
      }
    }

    // Verificar o crear restaurante
    let restaurantId = data.restaurant.id

    if (!restaurantId) {
      // Buscar restaurante existente
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('name', data.restaurant.name)
        .eq('city', data.restaurant.city)
        .single()

      if (existingRestaurant) {
        restaurantId = existingRestaurant.id
      } else {
        // Crear nuevo restaurante
        const { data: newRestaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .insert({
            name: data.restaurant.name,
            address: data.restaurant.address,
            city: data.restaurant.city,
            phone: data.restaurant.phone || null,
            verified: false,
            pending_review: true,
            created_by: user.id,
          })
          .select('id')
          .single()

        if (restaurantError) {
          return {
            success: false,
            error: 'Error al crear restaurante',
          }
        }

        restaurantId = newRestaurant.id
      }
    }

    // Subir foto de la burger
    let imageUrl: string | null = null

    if (data.photo) {
      const fileName = `${user.id}/${restaurantId}/${Date.now()}-burger.webp`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('burger-images')
        .upload(fileName, data.photo, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from('burger-images').getPublicUrl(uploadData.path)
        imageUrl = publicUrl
      }
    }

    // Crear burger
    const { data: burger, error: burgerError } = await supabase
      .from('burgers')
      .insert({
        restaurant_id: restaurantId,
        name: data.name,
        description: data.description || null,
        price: data.price,
        type: data.type,
        image_url: imageUrl,
        special_features: data.special_features || {},
        verified: false,
        pending_review: true,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (burgerError) {
      return {
        success: false,
        error: 'Error al crear burger',
      }
    }

    // Enviar notificación al equipo (webhook)
    try {
      await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_burger_submitted',
          burgerId: burger.id,
          restaurantId,
          userName: user.user_metadata?.full_name || user.email,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Webhook error:', error)
    }

    return {
      success: true,
      burgerId: burger.id,
    }
  } catch (error) {
    console.error('Submit new burger error:', error)
    return {
      success: false,
      error: 'Error al enviar burger',
    }
  }
}

/**
 * Envía un nuevo restaurante para revisión
 */
export async function submitNewRestaurant(restaurantData: {
  name: string
  address: string
  city: string
  phone?: string
}) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Debes iniciar sesión',
      }
    }

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        ...restaurantData,
        verified: false,
        pending_review: true,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (error) {
      return {
        success: false,
        error: 'Error al crear restaurante',
      }
    }

    return {
      success: true,
      restaurantId: restaurant.id,
    }
  } catch (error) {
    console.error('Submit new restaurant error:', error)
    return {
      success: false,
      error: 'Error al enviar restaurante',
    }
  }
}
