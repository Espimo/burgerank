import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface CityRow {
  name: string;
  country?: string;
}

interface RestaurantRow {
  name: string;
  city: string; // City name to match
  address?: string;
  phone?: string;
}

interface BurgerRow {
  name: string;
  restaurant: string; // Restaurant name to match
  city: string; // City name to match
  description?: string;
  type?: string;
  tags?: string; // comma-separated
  price?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { type, data: rows } = body;

    if (!type || !rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere type (cities/restaurants/burgers) y data (array)' },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      errors: [] as string[],
      created: [] as any[]
    };

    // Process based on type
    if (type === 'cities') {
      for (const row of rows as CityRow[]) {
        if (!row.name) {
          results.errors.push(`Ciudad sin nombre: ${JSON.stringify(row)}`);
          continue;
        }

        // Check if city already exists
        const { data: existing } = await supabase
          .from('cities')
          .select('id')
          .eq('name', row.name.trim())
          .single();

        if (existing) {
          results.errors.push(`Ciudad ya existe: ${row.name}`);
          continue;
        }

        const { data, error } = await supabase
          .from('cities')
          .insert({
            name: row.name.trim(),
            country: row.country?.trim() || 'España',
            status: 'approved' // Admin imports are auto-approved
          })
          .select()
          .single();

        if (error) {
          results.errors.push(`Error creando ciudad ${row.name}: ${error.message}`);
        } else {
          results.success++;
          results.created.push(data);
        }
      }
    } 
    else if (type === 'restaurants') {
      // First, get all cities for matching
      const { data: cities } = await supabase.from('cities').select('id, name');
      const cityMap = new Map(cities?.map(c => [c.name.toLowerCase(), c.id]) || []);

      for (const row of rows as RestaurantRow[]) {
        if (!row.name || !row.city) {
          results.errors.push(`Restaurante incompleto: ${JSON.stringify(row)}`);
          continue;
        }

        const cityId = cityMap.get(row.city.toLowerCase().trim());
        if (!cityId) {
          results.errors.push(`Ciudad no encontrada para restaurante ${row.name}: ${row.city}`);
          continue;
        }

        // Check if restaurant already exists
        const { data: existing } = await supabase
          .from('restaurants')
          .select('id')
          .eq('name', row.name.trim())
          .eq('city_id', cityId)
          .single();

        if (existing) {
          results.errors.push(`Restaurante ya existe: ${row.name} en ${row.city}`);
          continue;
        }

        const { data, error } = await supabase
          .from('restaurants')
          .insert({
            name: row.name.trim(),
            city_id: cityId,
            address: row.address?.trim() || null,
            phone: row.phone?.trim() || null,
            status: 'approved', // Admin imports are auto-approved
            average_rating: 0,
            total_ratings: 0,
            submitted_by: user.id
          })
          .select()
          .single();

        if (error) {
          results.errors.push(`Error creando restaurante ${row.name}: ${error.message}`);
        } else {
          results.success++;
          results.created.push(data);
        }
      }
    } 
    else if (type === 'burgers') {
      // Get cities and restaurants for matching
      const { data: cities } = await supabase.from('cities').select('id, name');
      const { data: restaurants } = await supabase.from('restaurants').select('id, name, city_id');
      
      const cityMap = new Map(cities?.map(c => [c.name.toLowerCase(), c.id]) || []);
      
      // Create restaurant map: "restaurantName|cityId" -> restaurant.id
      const restaurantMap = new Map<string, string>();
      restaurants?.forEach(r => {
        const key = `${r.name.toLowerCase()}|${r.city_id}`;
        restaurantMap.set(key, r.id);
      });

      for (const row of rows as BurgerRow[]) {
        if (!row.name || !row.restaurant || !row.city) {
          results.errors.push(`Hamburguesa incompleta: ${JSON.stringify(row)}`);
          continue;
        }

        const cityId = cityMap.get(row.city.toLowerCase().trim());
        if (!cityId) {
          results.errors.push(`Ciudad no encontrada para burger ${row.name}: ${row.city}`);
          continue;
        }

        const restaurantKey = `${row.restaurant.toLowerCase().trim()}|${cityId}`;
        const restaurantId = restaurantMap.get(restaurantKey);
        if (!restaurantId) {
          results.errors.push(`Restaurante no encontrado para burger ${row.name}: ${row.restaurant} en ${row.city}`);
          continue;
        }

        // Check if burger already exists
        const { data: existing } = await supabase
          .from('burgers')
          .select('id')
          .eq('name', row.name.trim())
          .eq('restaurant_id', restaurantId)
          .single();

        if (existing) {
          results.errors.push(`Hamburguesa ya existe: ${row.name} en ${row.restaurant}`);
          continue;
        }

        // Parse tags
        const tags = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

        const { data, error } = await supabase
          .from('burgers')
          .insert({
            name: row.name.trim(),
            restaurant_id: restaurantId,
            city_id: cityId,
            description: row.description?.trim() || null,
            type: row.type?.trim() || null,
            tags,
            status: 'approved', // Admin imports are auto-approved
            average_rating: 0,
            total_ratings: 0,
            is_featured: false,
            submitted_by: user.id
          })
          .select()
          .single();

        if (error) {
          results.errors.push(`Error creando burger ${row.name}: ${error.message}`);
        } else {
          results.success++;
          results.created.push(data);
        }
      }
    } 
    else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: cities, restaurants, o burgers' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `Importación completada: ${results.success} items creados`,
      success: results.success,
      errors: results.errors,
      created: results.created
    });

  } catch (error) {
    console.error('Error in CSV import:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
