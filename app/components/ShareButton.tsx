'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  image?: string;
  rating?: number;
  variant?: 'icon' | 'button' | 'dropdown';
}

export default function ShareButton({ 
  title, 
  text, 
  url, 
  image,
  rating,
  variant = 'icon' 
}: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || `¡Mira ${title} en BurgeRank!${rating ? ` ⭐ ${rating.toFixed(1)}/5` : ''}`;

  const shareOptions = [
    {
      name: 'Twitter / X',
      icon: '𝕏',
      color: '#000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Email',
      icon: '📧',
      color: '#EA4335',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed, show dropdown instead
        if ((err as Error).name !== 'AbortError') {
          setShowDropdown(true);
        }
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareClick = (shareOption: typeof shareOptions[0]) => {
    window.open(shareOption.url, '_blank', 'width=600,height=400');
    setShowDropdown(false);
  };

  if (variant === 'button') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleNativeShare}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#374151',
            color: '#e5e7eb',
            border: '1px solid #4b5563',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          📤 Compartir
        </button>

        {showDropdown && (
          <ShareDropdown 
            shareOptions={shareOptions}
            onSelect={handleShareClick}
            onCopy={handleCopyLink}
            copied={copied}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleNativeShare}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.4rem',
          fontSize: '1.1rem',
          opacity: 0.8,
          transition: 'opacity 0.2s'
        }}
        title="Compartir"
      >
        📤
      </button>

      {showDropdown && (
        <ShareDropdown 
          shareOptions={shareOptions}
          onSelect={handleShareClick}
          onCopy={handleCopyLink}
          copied={copied}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

interface ShareDropdownProps {
  shareOptions: Array<{name: string; icon: string; color: string; url: string}>;
  onSelect: (option: {name: string; icon: string; color: string; url: string}) => void;
  onCopy: () => void;
  copied: boolean;
  onClose: () => void;
}

function ShareDropdown({ shareOptions, onSelect, onCopy, copied, onClose }: ShareDropdownProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }}
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          border: '1px solid #374151',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          zIndex: 1000,
          minWidth: '200px'
        }}
      >
        <div style={{ 
          padding: '0.75rem 1rem', 
          borderBottom: '1px solid #374151',
          fontWeight: '600',
          fontSize: '0.9rem',
          color: '#fff'
        }}>
          Compartir en:
        </div>

        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => onSelect(option)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#d1d5db',
              fontSize: '0.9rem',
              textAlign: 'left',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{option.icon}</span>
            <span>{option.name}</span>
          </button>
        ))}

        {/* Copy link button */}
        <button
          onClick={onCopy}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: copied ? '#10b981' : '#d1d5db',
            fontSize: '0.9rem',
            textAlign: 'left',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
        </button>
      </div>
    </>
  );
}
