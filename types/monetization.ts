// ============================================================================
// MONETIZATION TYPES - Fase 1
// Tipos para afiliación y descuentos
// ============================================================================

// Plataforma de afiliación
export interface AffiliatePlatform {
  id: string;
  name: string;
  display_name: string;
  type: 'delivery' | 'reservation' | 'direct';
  icon_emoji: string;
  default_priority: number;
  cta_text: string;
  color: string;
  is_active: boolean;
}

// Link de afiliación de un restaurante
export interface RestaurantAffiliateLink {
  id: string;
  restaurant_id: string;
  platform_id: string;
  affiliate_url: string;
  custom_priority: number | null;
  custom_cta_text: string | null;
  is_active: boolean;
  commission_rate: number | null;
  // Joined data
  platform?: AffiliatePlatform;
}

// Descuento de restaurante
export interface RestaurantDiscount {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  discount_code: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'free_delivery' | 'other';
  discount_value: number | null;
  min_order_value: number | null;
  valid_from: string | null;
  valid_until: string | null;
  terms: string | null;
  platform_id: string | null;
  is_active: boolean;
  is_exclusive: boolean;
}

// Click de afiliación (para tracking)
export interface AffiliateClick {
  id?: string;
  restaurant_id: string;
  platform_id: string;
  affiliate_link_id?: string;
  discount_id?: string;
  user_id?: string;
  source_page: 'ranking' | 'restaurant' | 'burger_detail' | 'search' | 'home';
  source_burger_id?: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
}

// Datos de CTA procesados (resultado del helper)
export interface AffiliateCTAData {
  // Link principal
  primaryLink: {
    url: string;
    ctaText: string;
    platformName: string;
    platformDisplayName: string;
    platformType: 'delivery' | 'reservation' | 'direct';
    iconEmoji: string;
    color: string;
    platformId: string;
    linkId: string;
  } | null;
  
  // Descuento activo
  discount: {
    id: string;
    title: string;
    description: string | null;
    code: string | null;
    type: string;
    value: number | null;
    validUntil: string | null;
    isExclusive: boolean;
  } | null;
  
  // Links adicionales (para mostrar alternativas)
  alternativeLinks: Array<{
    url: string;
    ctaText: string;
    platformName: string;
    platformDisplayName: string;
    platformType: 'delivery' | 'reservation' | 'direct';
    iconEmoji: string;
    color: string;
    platformId: string;
    linkId: string;
  }>;
  
  // Metadata
  hasAffiliation: boolean;
  hasDiscount: boolean;
  restaurantId: string;
}

// Props para el componente CTA
export interface AffiliateCTAProps {
  restaurantId: string;
  restaurantName: string;
  sourcePage: AffiliateClick['source_page'];
  sourceBurgerId?: string;
  variant?: 'sticky' | 'inline' | 'card';
  showAlternatives?: boolean;
  className?: string;
}

// Respuesta de la API de afiliación
export interface AffiliateAPIResponse {
  success: boolean;
  data?: AffiliateCTAData;
  error?: string;
}

// Para tracking de clicks
export interface TrackClickPayload {
  restaurantId: string;
  platformId: string;
  linkId?: string;
  discountId?: string;
  sourcePage: AffiliateClick['source_page'];
  sourceBurgerId?: string;
}
