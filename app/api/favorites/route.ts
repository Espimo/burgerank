import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET: Obtener favoritos del usuario
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Usar admin client para bypassear RLS
    const { data: favorites, error } = await adminClient
      .from('user_favorites')
      .select('id, created_at, burger_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      // Si es error, devolver lista vacía
      return NextResponse.json({
        favorites: [],
        favoriteIds: [],
        count: 0
      })
    }

    // Obtener los IDs de burgers favoritas
    const favoriteIds = favorites?.map((f: any) => f.burger_id).filter(Boolean) || []

    // Obtener detalles de las burgers favoritas
    let favoritesWithBurgers = favorites || []
    if (favoriteIds.length > 0) {
      const { data: burgers } = await adminClient
        .from('burgers')
        .select('id, name, image_url, average_rating, restaurant_id')
        .in('id', favoriteIds)

      if (burgers) {
        // Obtener nombres de restaurantes
        const restaurantIds = [...new Set(burgers.map(b => b.restaurant_id).filter(Boolean))]
        const { data: restaurants } = await adminClient
          .from('restaurants')
          .select('id, name')
          .in('id', restaurantIds)

        const restaurantMap = new Map(restaurants?.map(r => [r.id, r]) || [])
        const burgerMap = new Map(burgers.map(b => [b.id, { ...b, restaurant: restaurantMap.get(b.restaurant_id) }]))

        favoritesWithBurgers = favorites?.map((f: any) => ({
          ...f,
          burger: burgerMap.get(f.burger_id)
        })) || []
      }
    }

    return NextResponse.json({
      favorites: favoritesWithBurgers,
      favoriteIds,
      count: favorites?.length || 0
    })

  } catch (error) {
    console.error('Error in favorites GET:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// POST: Agregar a favoritos
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    
    // Log para diagnóstico
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const keyLength = process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    console.log('🔑 Service Role Key Status:', { hasServiceKey, keyLength })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { burger_id } = body

    if (!burger_id) {
      return NextResponse.json({ error: 'ID de burger requerido' }, { status: 400 })
    }

    console.log('POST favorites - burger_id recibido:', burger_id, 'tipo:', typeof burger_id)

    // Verificar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(burger_id)) {
      console.error('Invalid UUID format:', burger_id)
      return NextResponse.json({ 
        error: 'ID de burger inválido (debe ser UUID)',
        received: burger_id
      }, { status: 400 })
    }

    // Intentar agregar directamente - el FK constraint validará si existe
    console.log('Intentando agregar a favoritos:', { user_id: user.id, burger_id })
    
    const { data: favorite, error } = await adminClient
      .from('user_favorites')
      .insert({
        user_id: user.id,
        burger_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding favorite - CODE:', error.code, 'MESSAGE:', error.message, 'DETAILS:', error.details)
      
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Ya está en favoritos' }, { status: 409 })
      }
      
      if (error.code === '23503') { // Foreign key violation
        return NextResponse.json({ error: 'Burger no encontrada' }, { status: 404 })
      }
      
      return NextResponse.json({ 
        error: 'Error al agregar a favoritos', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Añadida a favoritos',
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Añadida a favoritos',
      favorite
    })

  } catch (error) {
    console.error('Error in favorites POST:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// DELETE: Eliminar de favoritos
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const burgerId = searchParams.get('burger_id')

    if (!burgerId) {
      return NextResponse.json({ error: 'ID de burger requerido' }, { status: 400 })
    }

    // Eliminar usando admin client
    const { error } = await adminClient
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('burger_id', burgerId)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: 'Error al eliminar de favoritos' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Eliminado de favoritos'
    })

  } catch (error) {
    console.error('Error in favorites DELETE:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
