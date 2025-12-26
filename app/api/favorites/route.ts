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

    // Primero verificar si la tabla existe haciendo una consulta simple
    const { data: favorites, error } = await (supabase
      .from('user_favorites')
      .select('id, created_at, burger_id') as any)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      // Si es error de permisos, devolver lista vacía en lugar de error
      if (error.code === '42501' || error.code === '42P01') {
        console.log('Tabla user_favorites no accesible, devolviendo lista vacía')
        return NextResponse.json({
          favorites: [],
          favoriteIds: [],
          count: 0
        })
      }
      return NextResponse.json({ error: 'Error al obtener favoritos', details: error.message }, { status: 500 })
    }

    // Obtener los IDs de burgers favoritas
    const favoriteIds = favorites?.map((f: any) => f.burger_id).filter(Boolean) || []

    return NextResponse.json({
      favorites: favorites || [],
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
    console.log('Intentando agregar a favoritos:', { user_id: user.id, burger_id })
    
    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        burger_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding favorite - CODE:', error.code, 'MESSAGE:', error.message, 'DETAILS:', error.details, 'HINT:', error.hint)
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Ya está en favoritos' }, { status: 409 })
      }
      if (error.code === '42P01') { // Table does not exist
        return NextResponse.json({ error: 'La tabla user_favorites no existe. Ejecuta el script SQL de migración.' }, { status: 500 })
      }
      if (error.code === '42501') { // Permission denied
        return NextResponse.json({ 
          error: 'Error de permisos en la base de datos. Necesitas re-ejecutar el script SQL con las políticas RLS corregidas.',
          details: 'Las políticas de seguridad RLS están bloqueando el acceso. Ejecuta de nuevo database/migration_notifications_favorites.sql',
          code: error.code 
        }, { status: 500 })
      }
      return NextResponse.json({ 
        error: 'Error al agregar a favoritos', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
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
