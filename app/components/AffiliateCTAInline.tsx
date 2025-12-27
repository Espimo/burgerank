'use client';

// ============================================================================
// AFFILIATE CTA INLINE - Botón compacto para cards
// Para usar en listas/rankings sin ocupar mucho espacio
// ============================================================================

import { useState, useEffect } from 'react';
import type { AffiliateCTAData } from '@/types/monetization';
import { trackAffiliateClick, formatDiscountText } from '@/lib/affiliate/helpers';

interface AffiliateCTAInlineProps {
  restaurantId: string;
  sourcePage: 'ranking' | 'restaurant' | 'burger_detail' | 'search' | 'home';
  sourceBurgerId?: string;
  size?: 'small' | 'medium';
}

export default function AffiliateCTAInline({
  restaurantId,
  sourcePage,
  sourceBurgerId,
  size = 'small'
}: AffiliateCTAInlineProps) {
  const [data, setData] = useState<AffiliateCTAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/affiliate?restaurantId=${restaurantId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching affiliate data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [restaurantId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!data?.primaryLink) return;

    // Track click
    trackAffiliateClick({
      restaurantId,
      platformId: data.primaryLink.platformId,
      linkId: data.primaryLink.linkId,
      discountId: data.discount?.id,
      sourcePage,
      sourceBurgerId
    });

    // Open link
    window.open(data.primaryLink.url, '_blank', 'noopener,noreferrer');
  };

  // No mostrar si no hay afiliación
  if (loading || !data?.hasAffiliation || !data.primaryLink) {
    return null;
  }

  const { primaryLink, discount } = data;

  const buttonPadding = size === 'small' ? '0.4rem 0.6rem' : '0.5rem 0.8rem';
  const fontSize = size === 'small' ? '0.7rem' : '0.8rem';

  return (
    <button
      onClick={handleClick}
      style={{
        padding: buttonPadding,
        fontSize,
        border: 'none',
        backgroundColor: primaryLink.color || '#fbbf24',
        color: primaryLink.color === '#fbbf24' || primaryLink.color === '#FFC244' ? '#1a1a1a' : '#ffffff',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        whiteSpace: 'nowrap',
        position: 'relative'
      }}
    >
      <span>{primaryLink.iconEmoji}</span>
      <span>Pedir</span>
      {discount && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            fontSize: '0.55rem',
            padding: '0.1rem 0.3rem',
            backgroundColor: discount.isExclusive ? '#fbbf24' : '#22c55e',
            color: discount.isExclusive ? '#000' : '#fff',
            borderRadius: '0.25rem',
            fontWeight: 700
          }}
        >
          {discount.type === 'percentage' && discount.value ? `${discount.value}%` : '🎁'}
        </span>
      )}
    </button>
  );
}
