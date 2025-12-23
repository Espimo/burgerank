import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, city_id } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Nombre de restaurante requerido' },
        { status: 400 }
      );
    }

    // Insert restaurant with default values
    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name,
        city_id: city_id || null,
        average_rating: 0,
        total_ratings: 0,
        status: 'approved',
        submitted_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      return NextResponse.json(
        { error: 'Error al crear el restaurante: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/restaurants/create:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
