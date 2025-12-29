import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Aumentar timeout para esta ruta
export const maxDuration = 60;

interface CityRow {
  name: string;
  country?: string;
}

interface RestaurantRow {
  name: string;
  city: string;
  address?: string;
  phone?: string;
  hours?: string;
}

interface BurgerRow {
  name: string;
  restaurant: string;
  city: string;
  description?: string;
  type?: string;
  tags?: string;
}

export async function POST(request: NextRequest) {
  console.log('[CSV Import] Iniciando importación...');
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Verify admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log('[CSV Import] No autenticado');
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!userData?.is_admin) {
      console.log('[CSV Import] No autorizado');
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { type, data: rows } = body;

    if (!type || !rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere type y data (array)' },
        { status: 400 }
      );
    }

    console.log(`[CSV Import] Procesando ${rows.length} ${type}`);

    const results = {
      success: 0,
      errors: [] as string[],
      created: [] as any[]
    };

    // ==================== CIUDADES ====================
    if (type === 'cities') {
      // Obtener ciudades existentes
      const { data: existingCities } = await supabase.from('cities').select('name');
      const existingNames = new Set((existingCities || []).map(c => c.name.toLowerCase()));

      // Filtrar nuevas ciudades
      const newCities = (rows as CityRow[])
        .filter(row => row.name && !existingNames.has(row.name.toLowerCase().trim()))
        .map(row => ({
          name: row.name.trim(),
          country: row.country?.trim() || 'España'
        }));

      if (newCities.length > 0) {
        const { data, error } = await supabase
          .from('cities')
          .insert(newCities)
          .select();

        if (error) {
          results.errors.push(`Error insertando ciudades: ${error.message}`);
        } else {
          results.success = data?.length || 0;
          results.created = data || [];
        }
      }

      // Contar duplicados
      const duplicates = rows.length - newCities.length;
      if (duplicates > 0) {
        results.errors.push(`${duplicates} ciudades ya existían`);
      }
    }
    
    // ==================== RESTAURANTES ====================
    else if (type === 'restaurants') {
      // Obtener ciudades y restaurantes existentes en una sola consulta
      const [citiesRes, restaurantsRes] = await Promise.all([
        supabase.from('cities').select('id, name'),
        supabase.from('restaurants').select('name, city_id')
      ]);

      const cityMap = new Map((citiesRes.data || []).map(c => [c.name.toLowerCase(), c.id]));
      const existingRestaurants = new Set(
        (restaurantsRes.data || []).map(r => `${r.name.toLowerCase()}|${r.city_id}`)
      );

      // Preparar restaurantes válidos
      const validRestaurants: any[] = [];
      
      for (const row of rows as RestaurantRow[]) {
        if (!row.name || !row.city) {
          results.errors.push(`Restaurante incompleto: ${row.name || 'sin nombre'}`);
          continue;
        }

        const cityId = cityMap.get(row.city.toLowerCase().trim());
        if (!cityId) {
          results.errors.push(`Ciudad no encontrada: ${row.city} (para ${row.name})`);
          continue;
        }

        const key = `${row.name.toLowerCase().trim()}|${cityId}`;
        if (existingRestaurants.has(key)) {
          results.errors.push(`Ya existe: ${row.name}`);
          continue;
        }

        existingRestaurants.add(key); // Evitar duplicados en el mismo batch

        validRestaurants.push({
          name: row.name.trim(),
          city_id: cityId,
          address: row.address?.trim() || null,
          phone: row.phone?.trim() || null,
          hours: row.hours?.trim() || null,
          status: 'approved',
          average_rating: 0,
          total_ratings: 0,
          submitted_by: user.id
        });
      }

      // Insertar en batches de 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < validRestaurants.length; i += BATCH_SIZE) {
        const batch = validRestaurants.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase
          .from('restaurants')
          .insert(batch)
          .select();

        if (error) {
          results.errors.push(`Error batch ${Math.floor(i/BATCH_SIZE) + 1}: ${error.message}`);
        } else {
          results.success += data?.length || 0;
          results.created.push(...(data || []));
        }
      }
    }
    
    // ==================== HAMBURGUESAS ====================
    else if (type === 'burgers') {
      // Obtener datos necesarios en paralelo
      const [citiesRes, restaurantsRes, burgersRes] = await Promise.all([
        supabase.from('cities').select('id, name'),
        supabase.from('restaurants').select('id, name, city_id'),
        supabase.from('burgers').select('name, restaurant_id')
      ]);

      const cityMap = new Map((citiesRes.data || []).map(c => [c.name.toLowerCase(), c.id]));
      
      // Mapa de restaurantes: "nombre|city_id" -> id
      const restaurantMap = new Map<string, string>();
      (restaurantsRes.data || []).forEach(r => {
        const key = `${r.name.toLowerCase()}|${r.city_id}`;
        restaurantMap.set(key, r.id);
      });

      // Burgers existentes
      const existingBurgers = new Set(
        (burgersRes.data || []).map(b => `${b.name.toLowerCase()}|${b.restaurant_id}`)
      );

      // Preparar burgers válidas
      const validBurgers: any[] = [];

      for (const row of rows as BurgerRow[]) {
        if (!row.name || !row.restaurant || !row.city) {
          results.errors.push(`Burger incompleta: ${row.name || 'sin nombre'}`);
          continue;
        }

        const cityId = cityMap.get(row.city.toLowerCase().trim());
        if (!cityId) {
          results.errors.push(`Ciudad no encontrada: ${row.city} (para ${row.name})`);
          continue;
        }

        const restaurantKey = `${row.restaurant.toLowerCase().trim()}|${cityId}`;
        const restaurantId = restaurantMap.get(restaurantKey);
        if (!restaurantId) {
          results.errors.push(`Restaurante no encontrado: ${row.restaurant} (para ${row.name})`);
          continue;
        }

        const burgerKey = `${row.name.toLowerCase().trim()}|${restaurantId}`;
        if (existingBurgers.has(burgerKey)) {
          results.errors.push(`Ya existe: ${row.name} en ${row.restaurant}`);
          continue;
        }

        existingBurgers.add(burgerKey);

        // Parsear tags
        const tags = row.tags 
          ? row.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [];

        validBurgers.push({
          name: row.name.trim(),
          restaurant_id: restaurantId,
          city_id: cityId,
          description: row.description?.trim() || null,
          type: row.type?.trim() || 'clásica',
          tags,
          status: 'approved',
          average_rating: 0,
          total_ratings: 0,
          is_featured: false,
          submitted_by: user.id
        });
      }

      // Insertar en batches de 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < validBurgers.length; i += BATCH_SIZE) {
        const batch = validBurgers.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase
          .from('burgers')
          .insert(batch)
          .select();

        if (error) {
          results.errors.push(`Error batch ${Math.floor(i/BATCH_SIZE) + 1}: ${error.message}`);
        } else {
          results.success += data?.length || 0;
          results.created.push(...(data || []));
        }
      }
    }
    else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: cities, restaurants, o burgers' },
        { status: 400 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`[CSV Import] Completado en ${duration}ms: ${results.success} creados, ${results.errors.length} errores`);

    return NextResponse.json({
      message: `Importación completada: ${results.success} items creados`,
      success: results.success,
      errors: results.errors.slice(0, 50), // Limitar errores mostrados
      totalErrors: results.errors.length,
      duration: `${duration}ms`
    });

  } catch (error: any) {
    console.error('[CSV Import] Error:', error);
    return NextResponse.json(
      { error: `Error interno: ${error.message || 'desconocido'}` },
      { status: 500 }
    );
  }
}
