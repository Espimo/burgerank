// ============================================================================
// AFFILIATE API - Obtener datos de afiliación
// GET /api/affiliate?restaurantId=xxx
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'restaurantId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener links de afiliación activos con sus plataformas
    const { data: links, error: linksError } = await supabase
      .from('restaurant_affiliate_links')
      .select(`
        id,
        restaurant_id,
        platform_id,
        affiliate_url,
        custom_priority,
        custom_cta_text,
        is_active,
        platform:affiliate_platforms(
          id,
          name,
          display_name,
          type,
          icon_emoji,
          default_priority,
          cta_text,
          color,
          is_active
        )
      `)
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true);

    if (linksError) {
      console.error('Error fetching affiliate links:', linksError);
      // No fallar - devolver datos vacíos
    }

    // Obtener descuento activo
    const now = new Date().toISOString();
    const { data: discounts, error: discountsError } = await supabase
      .from('restaurant_discounts')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .or(`valid_from.is.null,valid_from.lte.${now}`)
      .or(`valid_until.is.null,valid_until.gt.${now}`)
      .order('is_exclusive', { ascending: false })
      .order('discount_value', { ascending: false })
      .limit(1);

    if (discountsError) {
      console.error('Error fetching discounts:', discountsError);
    }

    // Procesar links
    const processedLinks = (links || [])
      .filter((link: any) => link.platform?.is_active)
      .map((link: any) => ({
        url: link.affiliate_url,
        ctaText: link.custom_cta_text || link.platform.cta_text,
        platformName: link.platform.name,
        platformDisplayName: link.platform.display_name,
        platformType: link.platform.type,
        iconEmoji: link.platform.icon_emoji,
        color: link.platform.color,
        platformId: link.platform_id,
        linkId: link.id,
        priority: link.custom_priority ?? link.platform.default_priority
      }))
      .sort((a: any, b: any) => a.priority - b.priority);

    // Procesar descuento
    const activeDiscount = discounts?.[0];
    const discount = activeDiscount ? {
      id: activeDiscount.id,
      title: activeDiscount.title,
      description: activeDiscount.description,
      code: activeDiscount.discount_code,
      type: activeDiscount.discount_type,
      value: activeDiscount.discount_value,
      validUntil: activeDiscount.valid_until,
      isExclusive: activeDiscount.is_exclusive
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        primaryLink: processedLinks[0] || null,
        discount,
        alternativeLinks: processedLinks.slice(1),
        hasAffiliation: processedLinks.length > 0,
        hasDiscount: !!discount,
        restaurantId
      }
    });

  } catch (error) {
    console.error('Affiliate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
