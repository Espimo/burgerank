import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Test 1: Crear cliente Supabase
    const clientStart = Date.now();
    const supabase = await createClient();
    results.checks.clientCreation = {
      status: 'ok',
      time: Date.now() - clientStart
    };

    // Test 2: Query simple a cities
    const citiesStart = Date.now();
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name')
      .limit(5);
    
    results.checks.citiesQuery = {
      status: citiesError ? 'error' : 'ok',
      time: Date.now() - citiesStart,
      count: cities?.length || 0,
      error: citiesError?.message
    };

    // Test 3: Query a restaurants
    const restaurantsStart = Date.now();
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('id, name')
      .limit(5);
    
    results.checks.restaurantsQuery = {
      status: restaurantsError ? 'error' : 'ok',
      time: Date.now() - restaurantsStart,
      count: restaurants?.length || 0,
      error: restaurantsError?.message
    };

    // Test 4: Query a burgers
    const burgersStart = Date.now();
    const { data: burgers, error: burgersError } = await supabase
      .from('burgers')
      .select('id, name')
      .limit(5);
    
    results.checks.burgersQuery = {
      status: burgersError ? 'error' : 'ok',
      time: Date.now() - burgersStart,
      count: burgers?.length || 0,
      error: burgersError?.message
    };

    // Test 5: Auth check
    const authStart = Date.now();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    results.checks.authCheck = {
      status: authError ? 'warning' : 'ok',
      time: Date.now() - authStart,
      authenticated: !!user,
      error: authError?.message
    };

    // Resumen
    results.totalTime = Date.now() - startTime;
    results.status = Object.values(results.checks).every((c: any) => c.status === 'ok' || c.status === 'warning')
      ? 'healthy'
      : 'unhealthy';

    return NextResponse.json(results);

  } catch (error) {
    results.totalTime = Date.now() - startTime;
    results.status = 'error';
    results.error = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(results, { status: 500 });
  }
}
