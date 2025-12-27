'use client';

// ============================================================================
// AFFILIATE CTA COMPONENT - Botón de acción principal
// Mobile-first, sticky en móvil, reutilizable
// ============================================================================

import { useState, useEffect } from 'react';
import type { AffiliateCTAData, AffiliateCTAProps } from '@/types/monetization';
import { trackAffiliateClick, formatDiscountText, isDiscountExpiringSoon, copyDiscountCode } from '@/lib/affiliate/helpers';

export default function AffiliateCTA({
  restaurantId,
  restaurantName,
  sourcePage,
  sourceBurgerId,
  variant = 'sticky',
  showAlternatives = false,
  className = ''
}: AffiliateCTAProps) {
  const [data, setData] = useState<AffiliateCTAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAlts, setShowAlts] = useState(false);

  // Cargar datos de afiliación
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

  // Manejar click en CTA principal
  const handleCTAClick = (link: NonNullable<AffiliateCTAData['primaryLink']>) => {
    // Track click (non-blocking)
    trackAffiliateClick({
      restaurantId,
      platformId: link.platformId,
      linkId: link.linkId,
      discountId: data?.discount?.id,
      sourcePage,
      sourceBurgerId
    });

    // Abrir link en nueva pestaña
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Copiar código de descuento
  const handleCopyCode = async () => {
    if (!data?.discount?.code) return;
    
    const success = await copyDiscountCode(data.discount.code);
    if (success) {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // No mostrar si está cargando o no hay datos
  if (loading || !data?.hasAffiliation) {
    return null;
  }

  const { primaryLink, discount, alternativeLinks } = data;

  // Estilos base según variante
  const containerStyles: React.CSSProperties = variant === 'sticky' 
    ? {
        position: 'fixed',
        bottom: '70px', // Por encima del BottomNav
        left: 0,
        right: 0,
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #374151',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }
    : variant === 'card'
    ? {
        padding: '1rem',
        backgroundColor: '#1f2937',
        borderRadius: '0.75rem',
        border: '1px solid #374151',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      };

  return (
    <div style={containerStyles} className={className}>
      {/* Badge de descuento */}
      {discount && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: discount.isExclusive 
              ? 'rgba(251, 191, 36, 0.15)' 
              : 'rgba(34, 197, 94, 0.15)',
            borderRadius: '0.5rem',
            border: `1px solid ${discount.isExclusive ? 'rgba(251, 191, 36, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '1.1rem' }}>
              {discount.isExclusive ? '⭐' : '🎉'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: 600,
                color: discount.isExclusive ? '#fbbf24' : '#22c55e'
              }}>
                {formatDiscountText(discount)}
                {discount.isExclusive && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    borderRadius: '0.25rem'
                  }}>
                    EXCLUSIVO
                  </span>
                )}
              </div>
              {discount.code && (
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Código: <strong>{discount.code}</strong>
                </div>
              )}
            </div>
          </div>
          
          {discount.code && (
            <button
              onClick={handleCopyCode}
              style={{
                padding: '0.4rem 0.6rem',
                fontSize: '0.7rem',
                backgroundColor: codeCopied ? '#22c55e' : '#374151',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {codeCopied ? '✓ Copiado' : '📋 Copiar'}
            </button>
          )}
          
          {isDiscountExpiringSoon(discount.validUntil) && (
            <span style={{ 
              fontSize: '0.7rem', 
              color: '#ef4444',
              whiteSpace: 'nowrap'
            }}>
              ⏰ Expira pronto
            </span>
          )}
        </div>
      )}

      {/* Botón CTA principal */}
      {primaryLink && (
        <button
          onClick={() => handleCTAClick(primaryLink)}
          style={{
            width: '100%',
            padding: '0.875rem 1.5rem',
            backgroundColor: primaryLink.color || '#fbbf24',
            color: primaryLink.color === '#fbbf24' || primaryLink.color === '#FFC244' ? '#1a1a1a' : '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.1s, opacity 0.2s',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span style={{ fontSize: '1.2rem' }}>{primaryLink.iconEmoji}</span>
          <span>{primaryLink.ctaText}</span>
        </button>
      )}

      {/* Links alternativos */}
      {showAlternatives && alternativeLinks.length > 0 && (
        <>
          <button
            onClick={() => setShowAlts(!showAlts)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}
          >
            {showAlts ? '▲ Ocultar opciones' : '▼ Más opciones de pedido'}
          </button>
          
          {showAlts && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {alternativeLinks.map((link) => (
                <button
                  key={link.linkId}
                  onClick={() => handleCTAClick(link as any)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#374151',
                    color: '#e5e7eb',
                    border: '1px solid #4b5563',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{link.iconEmoji}</span>
                  <span>{link.platformDisplayName}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Nota de afiliación (transparencia) */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '0.65rem', 
        color: '#6b7280',
        marginTop: '0.25rem'
      }}>
        Podemos recibir una comisión por las compras realizadas
      </div>
    </div>
  );
}
