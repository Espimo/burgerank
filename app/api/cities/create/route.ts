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
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Nombre de ciudad requerido' },
        { status: 400 }
      );
    }

    // Insert city
    const { data, error } = await supabase
      .from('cities')
      .insert({
        name,
        country: 'España'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating city:', error);
      return NextResponse.json(
        { error: 'Error al crear la ciudad: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/cities/create:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
