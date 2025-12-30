import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AdminProvider } from './contexts/AdminContext'
import { AuthProvider } from './contexts/AuthContext'
import { ServiceWorkerRegistration, PWAInstallPrompt } from './components/PWAComponents'

export const metadata: Metadata = {
  title: 'BurgeRank - Ranking de Hamburguesas',
  description: 'Descubre y valora las mejores hamburguesas. La comunidad definitiva de amantes de las burgers.',
  keywords: ['hamburguesas', 'burgers', 'ranking', 'valoraciones', 'restaurantes', 'comida'],
  authors: [{ name: 'BurgeRank Team' }],
  creator: 'BurgeRank',
  publisher: 'BurgeRank',
  applicationName: 'BurgeRank',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://burgerank.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BurgeRank - Ranking de Hamburguesas',
    description: 'Descubre y valora las mejores hamburguesas. La comunidad definitiva de amantes de las burgers.',
    url: 'https://burgerank.com',
    siteName: 'BurgeRank',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BurgeRank - La mejor plataforma de ranking de hamburguesas',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BurgeRank - Ranking de Hamburguesas',
    description: 'Descubre y valora las mejores hamburguesas. La comunidad definitiva de amantes de las burgers.',
    images: ['/og-image.png'],
    creator: '@burgerank',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BurgeRank" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
      </head>
      <body>
        <AuthProvider>
          <AdminProvider>
            <ServiceWorkerRegistration />
            {children}
            <PWAInstallPrompt />
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
