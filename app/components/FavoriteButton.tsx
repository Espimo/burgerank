'use client';

import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  burgerId: string;
  isFavorite?: boolean;
  size?: 'small' | 'medium' | 'large';
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ 
  burgerId, 
  isFavorite: initialFavorite = false, 
  size = 'medium',
  onToggle 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?burger_id=${burgerId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setIsFavorite(false);
          onToggle?.(false);
        } else if (response.status === 401) {
          // Not authenticated - could show login modal
          console.log('Must be logged in to use favorites');          alert('Debes iniciar sesión para usar favoritos')
        } else {
          const error = await response.text()
          console.error('Error removing favorite:', error)
          alert('Error al quitar de favoritos: ' + (error || 'Error desconocido'))        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ burger_id: burgerId })
        });
        
        if (response.ok) {
          setIsFavorite(true);
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 600);
          onToggle?.(true);
        } else if (response.status === 401) {
          console.log('Must be logged in to use favorites');
          alert('Debes iniciar sesión para usar favoritos')
        } else {
          const error = await response.text()
          console.error('Error adding favorite:', error)
          alert('Error al agregar a favoritos: ' + (error || 'Error desconocido'))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error en favoritos: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setLoading(false);
    }
  };

  const sizeStyles = {
    small: { fontSize: '1rem', padding: '0.25rem' },
    medium: { fontSize: '1.25rem', padding: '0.4rem' },
    large: { fontSize: '1.5rem', padding: '0.5rem' }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        ...sizeStyles[size],
        transition: 'transform 0.2s',
        transform: showAnimation ? 'scale(1.3)' : 'scale(1)',
        filter: loading ? 'grayscale(50%)' : 'none',
      }}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <span
        style={{
          color: isFavorite ? '#ef4444' : '#6b7280',
          transition: 'color 0.2s',
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </span>
      
      {/* Heart burst animation */}
      {showAnimation && (
        <span
          style={{
            position: 'absolute',
            animation: 'heartBurst 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        >
          💖
        </span>
      )}

      <style jsx>{`
        @keyframes heartBurst {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(2) translateY(-10px);
          }
        }
      `}</style>
    </button>
  );
}
