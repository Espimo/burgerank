import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Obtener favoritos del usuario
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        created_at,
        burger:burgers(
          id,
          name,
          description,
          image_url,
          average_rating,
          total_ratings,
          tags,
          restaurant:restaurants(
            id,
            name,
            city:cities(name)
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 })
    }

    // También obtener solo los IDs de burgers favoritas para rápida consulta
    const favoriteIds = favorites?.map(f => (f.burger as any)?.id).filter(Boolean) || []

    return NextResponse.json({
      favorites,
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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { burger_id } = body

    if (!burger_id) {
      return NextResponse.json({ error: 'ID de burger requerido' }, { status: 400 })
    }

    // Verificar que la burger existe
    const { data: burger, error: burgerError } = await supabase
      .from('burgers')
      .select('id, name')
      .eq('id', burger_id)
      .single()

    if (burgerError || !burger) {
      return NextResponse.json({ error: 'Burger no encontrada' }, { status: 404 })
    }

    // Agregar a favoritos
    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        burger_id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Ya está en favoritos' }, { status: 409 })
      }
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: 'Error al agregar a favoritos' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${burger.name} añadida a favoritos`,
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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const burgerId = searchParams.get('burger_id')

    if (!burgerId) {
      return NextResponse.json({ error: 'ID de burger requerido' }, { status: 400 })
    }

    const { error } = await supabase
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
