'use client';

import { useEffect, useState } from 'react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // Check if user has dismissed the banner recently
    const dismissedTime = localStorage.getItem('pwa-banner-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Don't show for 7 days after dismissal
    }

    // Listen for the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom instructions after a delay
    if (isIOSDevice) {
      const timeout = setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px', // Above bottom nav
        left: '1rem',
        right: '1rem',
        backgroundColor: 'rgba(31, 41, 55, 0.98)',
        border: '2px solid #fbbf24',
        borderRadius: '1rem',
        padding: '1rem',
        zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>🍔</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: '#fbbf24', 
            fontSize: '1rem', 
            fontWeight: 700,
            marginBottom: '0.25rem' 
          }}>
            Instalar BurgeRank
          </h3>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '0.85rem',
            lineHeight: 1.4,
            marginBottom: '0.75rem'
          }}>
            {isIOS 
              ? 'Toca el botón compartir y luego "Añadir a pantalla de inicio"'
              : 'Añade la app a tu pantalla de inicio para acceso rápido'
            }
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Instalar
              </button>
            )}
            <button
              onClick={handleDismiss}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              {isIOS ? 'Entendido' : 'Ahora no'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('BurgeRank SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('BurgeRank SW registration failed:', error);
        });
    }
  }, []);

  return null;
}
