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
    const { name, description, restaurant_id, city_id, type, tags, image_url } = body;

    // Validate required fields
    if (!name || !restaurant_id || !city_id) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Insert burger with status='approved' (immediate publication)
    const { data, error } = await supabase
      .from('burgers')
      .insert({
        name,
        description: description || null,
        restaurant_id,
        city_id,
        type: type || null,
        tags: tags || [],
        image_url: image_url || null,
        status: 'approved', // Users' burgers are immediately approved
        submitted_by: user.id,
        is_featured: false,
        featured_order: null,
        average_rating: 0,
        total_ratings: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating burger:', error);
      return NextResponse.json(
        { error: 'Error al crear la hamburguesa: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/burgers/create:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
