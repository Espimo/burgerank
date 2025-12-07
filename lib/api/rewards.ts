import { createClient } from '@supabase/supabase-js'
import { generateQRCode, getDaysUntilExpiration } from '@/lib/utils/qr-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Reward {
  id: string
  name: string
  description: string
  cost_points: number
  level_required: 'burger_fan' | 'burger_lover' | 'burger_obsessed'
  icon_emoji: string
  image_url?: string
  expiration_days: number
  available: boolean
}

export interface UserReward {
  id: string
  reward_id: string
  user_id: string
  reward: Reward
  qr_code: string
  qr_expires_at: number
  status: 'active' | 'used'
  created_at: string
  used_at?: string
  used_at_restaurant?: string
}

/**
 * Obtiene premios disponibles según el nivel del usuario
 */
export async function getAvailableRewards(userLevel?: string): Promise<Reward[]> {
  try {
    let query = supabase.from('rewards').select('*').eq('available', true)

    if (userLevel) {
      query = query.or(`level_required.eq.${userLevel},level_required.is.null`)
    }

    const { data, error } = await query.order('cost_points', { ascending: true })

    if (error) {
      console.error('Error fetching rewards:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get available rewards error:', error)
    return []
  }
}

/**
 * Canjea un premio por puntos
 */
export async function redeemReward(
  rewardId: string,
  userId: string
): Promise<{ success: boolean; userReward?: UserReward; error?: string }> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Debes iniciar sesión' }
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('available_points, level')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return { success: false, error: 'Perfil no encontrado' }
    }

    // Obtener reward
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single()

    if (rewardError || !reward) {
      return { success: false, error: 'Premio no encontrado' }
    }

    // Validar puntos suficientes
    if (profile.available_points < reward.cost_points) {
      return { success: false, error: 'Puntos insuficientes' }
    }

    // Validar nivel requerido
    const levelHierarchy = {
      burger_fan: 1,
      burger_lover: 2,
      burger_obsessed: 3,
    }

    const userLevelValue = levelHierarchy[profile.level as keyof typeof levelHierarchy] || 0
    const requiredLevelValue = levelHierarchy[reward.level_required as keyof typeof levelHierarchy] || 0

    if (userLevelValue < requiredLevelValue) {
      return {
        success: false,
        error: `Necesitas alcanzar el nivel ${reward.level_required} para este premio`,
      }
    }

    // Generar QR
    const qrData = generateQRCode(rewardId, userId)

    // Crear user_reward en transacción
    const { data: userReward, error: userRewardError } = await supabase
      .from('user_rewards')
      .insert({
        reward_id: rewardId,
        user_id: userId,
        qr_code: qrData.code,
        qr_expires_at: qrData.expiresAt,
        status: 'active',
      })
      .select(
        `
        id,
        reward_id,
        user_id,
        qr_code,
        qr_expires_at,
        status,
        created_at,
        reward:rewards (*)
      `
      )
      .single()

    if (userRewardError) {
      return { success: false, error: 'Error al crear el premio' }
    }

    // Restar puntos
    const { error: pointsError } = await supabase
      .from('profiles')
      .update({
        available_points: profile.available_points - reward.cost_points,
      })
      .eq('id', userId)

    if (pointsError) {
      console.error('Error updating points:', pointsError)
    }

    // Registrar transacción en log
    await supabase.from('points_log').insert({
      user_id: userId,
      amount: -reward.cost_points,
      reason: `reward_redemption`,
      reference_id: userReward.id,
    })

    return {
      success: true,
      userReward: userReward as any as UserReward,
    }
  } catch (error) {
    console.error('Redeem reward error:', error)
    return { success: false, error: 'Error al canjear el premio' }
  }
}

/**
 * Obtiene premios del usuario
 */
export async function getUserRewards(
  userId: string,
  status?: 'active' | 'used'
): Promise<UserReward[]> {
  try {
    let query = supabase
      .from('user_rewards')
      .select(
        `
        id,
        reward_id,
        user_id,
        qr_code,
        qr_expires_at,
        status,
        created_at,
        used_at,
        used_at_restaurant,
        reward:rewards (*)
      `
      )
      .eq('user_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user rewards:', error)
      return []
    }

    return (data as any as UserReward[]) || []
  } catch (error) {
    console.error('Get user rewards error:', error)
    return []
  }
}

/**
 * Marca un premio como usado
 */
export async function useReward(
  userRewardId: string,
  restaurantId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_rewards')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        used_at_restaurant: restaurantId || null,
      })
      .eq('id', userRewardId)

    if (error) {
      return { success: false, error: 'Error al usar el premio' }
    }

    return { success: true }
  } catch (error) {
    console.error('Use reward error:', error)
    return { success: false, error: 'Error al usar el premio' }
  }
}

/**
 * Obtiene restaurantes asociados que aceptan premios
 */
export async function getPartnerRestaurants(filters?: {
  city?: string
  rewardType?: string
}): Promise<
  Array<{
    id: string
    name: string
    address: string
    city: string
    logo_url?: string
    accepted_reward_types: string[]
  }>
> {
  try {
    let query = supabase
      .from('restaurants')
      .select('id, name, address, city, logo_url, accepted_reward_types')
      .eq('accepts_rewards', true)

    if (filters?.city) {
      query = query.eq('city', filters.city)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching partner restaurants:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get partner restaurants error:', error)
    return []
  }
}

/**
 * Valida un código QR y marca el premio como usado
 */
export async function validateAndUseRewardQR(
  qrCode: string,
  restaurantId: string
): Promise<{ success: boolean; reward?: Reward; error?: string }> {
  try {
    // Obtener el user_reward por QR
    const { data: userReward, error: findError } = await supabase
      .from('user_rewards')
      .select('id, status, qr_expires_at, reward:rewards (*)')
      .eq('qr_code', qrCode)
      .single()

    if (findError || !userReward) {
      return { success: false, error: 'Código QR no válido' }
    }

    // Verificar que no esté ya usado
    if (userReward.status === 'used') {
      return { success: false, error: 'Este premio ya ha sido utilizado' }
    }

    // Verificar que no esté expirado
    if (Date.now() > userReward.qr_expires_at) {
      return { success: false, error: 'El código QR ha expirado' }
    }

    // Marcar como usado
    const { error: updateError } = await supabase
      .from('user_rewards')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        used_at_restaurant: restaurantId,
      })
      .eq('id', userReward.id)

    if (updateError) {
      return { success: false, error: 'Error al usar el premio' }
    }

    return { success: true, reward: userReward.reward as any as Reward }
  } catch (error) {
    console.error('Validate and use reward QR error:', error)
    return { success: false, error: 'Error al validar el código QR' }
  }
}
