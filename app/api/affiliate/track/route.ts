// ============================================================================
// AFFILIATE TRACKING API - Registrar clicks
// POST /api/affiliate/track
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Función para generar hash simple de IP (privacidad)
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      restaurantId,
      platformId,
      linkId,
      discountId,
      sourcePage,
      sourceBurgerId,
      sessionId,
      referrer,
      userAgent
    } = body;

    // Validación mínima
    if (!restaurantId || !platformId || !sourcePage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener usuario si está logueado
    const { data: { user } } = await supabase.auth.getUser();

    // Hash de IP para analytics (no guardar IP directa)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIP || 'unknown';
    const ipHash = hashIP(ip);

    // Insertar click
    const { error } = await supabase
      .from('affiliate_clicks')
      .insert({
        restaurant_id: restaurantId,
        platform_id: platformId,
        affiliate_link_id: linkId || null,
        discount_id: discountId || null,
        user_id: user?.id || null,
        source_page: sourcePage,
        source_burger_id: sourceBurgerId || null,
        referrer: referrer || null,
        user_agent: userAgent || null,
        ip_hash: ipHash,
        session_id: sessionId || null
      });

    if (error) {
      // Log error pero no fallar - tracking no debe romper UX
      console.error('Error tracking click:', error);
    }

    // Siempre devolver success para no afectar UX
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Tracking API error:', error);
    // No devolver error 500 - tracking no debe romper UX
    return NextResponse.json({ success: true });
  }
}
