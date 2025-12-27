// ============================================================================
// AFFILIATE HELPERS - Funciones reutilizables para monetización
// ============================================================================

import { createClient } from '@/lib/supabase/client';
import type { 
  AffiliateCTAData, 
  RestaurantAffiliateLink, 
  RestaurantDiscount,
  AffiliatePlatform,
  TrackClickPayload 
} from '@/types/monetization';

// Genera un ID de sesión único para tracking
export function generateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('burgerank_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('burgerank_session_id', sessionId);
  }
  return sessionId;
}

// Obtiene los datos de CTA para un restaurante
export async function getAffiliateCTAData(restaurantId: string): Promise<AffiliateCTAData> {
  const emptyResult: AffiliateCTAData = {
    primaryLink: null,
    discount: null,
    alternativeLinks: [],
    hasAffiliation: false,
    hasDiscount: false,
    restaurantId
  };

  try {
    const supabase = createClient();

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
      return emptyResult;
    }

    // Obtener descuento activo - cast agresivo para tablas no tipadas
    let activeDiscount: any = null;
    try {
      const supabaseAny = supabase as any;
      const { data: discountsData } = await supabaseAny
        .from('restaurant_discounts')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .limit(1);
      
      if (discountsData && discountsData.length > 0) {
        activeDiscount = discountsData[0];
      }
    } catch (discountErr) {
      console.warn('Could not fetch discounts:', discountErr);
    }

    // Procesar links
    const processedLinks = (links || [])
      .filter((link: any) => link.platform?.is_active)
      .map((link: any) => ({
        url: link.affiliate_url,
        ctaText: link.custom_cta_text || link.platform.cta_text,
        platformName: link.platform.name,
        platformDisplayName: link.platform.display_name,
        platformType: link.platform.type as 'delivery' | 'reservation' | 'direct',
        iconEmoji: link.platform.icon_emoji,
        color: link.platform.color,
        platformId: link.platform_id,
        linkId: link.id,
        priority: link.custom_priority ?? link.platform.default_priority
      }))
      .sort((a: any, b: any) => a.priority - b.priority);

    // Procesar descuento
    const discount = activeDiscount ? {
      id: activeDiscount.id as string,
      title: activeDiscount.title as string,
      description: activeDiscount.description as string | null,
      code: activeDiscount.discount_code as string | null,
      type: activeDiscount.discount_type as string,
      value: activeDiscount.discount_value as number | null,
      validUntil: activeDiscount.valid_until as string | null,
      isExclusive: activeDiscount.is_exclusive as boolean
    } : null;

    return {
      primaryLink: processedLinks[0] || null,
      discount,
      alternativeLinks: processedLinks.slice(1),
      hasAffiliation: processedLinks.length > 0,
      hasDiscount: !!discount,
      restaurantId
    };

  } catch (error) {
    console.error('Error in getAffiliateCTAData:', error);
    return emptyResult;
  }
}

// Registra un click de afiliación (non-blocking)
export async function trackAffiliateClick(payload: TrackClickPayload): Promise<void> {
  try {
    // No bloquear la UI - ejecutar en background
    const sessionId = generateSessionId();
    
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      })
    }).catch(err => {
      // Silently fail - tracking shouldn't break UX
      console.warn('Tracking failed:', err);
    });
  } catch (error) {
    // Silently fail
    console.warn('Tracking error:', error);
  }
}

// Formatea el texto del descuento para mostrar
export function formatDiscountText(discount: AffiliateCTAData['discount']): string {
  if (!discount) return '';
  
  if (discount.type === 'percentage' && discount.value) {
    return `${discount.value}% OFF`;
  }
  if (discount.type === 'fixed_amount' && discount.value) {
    return `${discount.value}€ de descuento`;
  }
  if (discount.type === 'free_delivery') {
    return 'Envío gratis';
  }
  return discount.title;
}

// Comprueba si un descuento está próximo a expirar (menos de 7 días)
export function isDiscountExpiringSoon(validUntil: string | null): boolean {
  if (!validUntil) return false;
  
  const expiryDate = new Date(validUntil);
  const now = new Date();
  const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
}

// Copia código de descuento al portapapeles
export async function copyDiscountCode(code: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    // Fallback para navegadores antiguos
    try {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

// Hook para obtener datos de afiliación (puede usarse con SWR/React Query)
export function useAffiliateData(restaurantId: string | null) {
  // Esta es una versión básica - se puede mejorar con SWR
  return {
    fetchData: () => restaurantId ? getAffiliateCTAData(restaurantId) : Promise.resolve(null)
  };
}
