import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AdminProvider } from './contexts/AdminContext'
import { AuthProvider } from './contexts/AuthContext'

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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
      <body>
        <AuthProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
