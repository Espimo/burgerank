import React from 'react'
import { Metadata } from 'next'
import { CookieBannerWrapper } from './cookie-banner-wrapper'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sobre BurgeRank | La comunidad definitiva de amantes de las hamburguesas',
  description:
    'Descubre cómo BurgeRank está revolucionando la forma en que compartimos opiniones sobre las mejores hamburguesas. Transparencia, comunidad y pasión por el burger perfecto.',
  keywords: [
    'hamburguesas',
    'ranking de burgers',
    'opiniones de comida',
    'comunidad foodie',
    'calificaciones de restaurantes',
    'best burgers',
  ],
  openGraph: {
    title: 'Sobre BurgeRank - La plataforma definitiva de hamburguesas',
    description: 'Descubre cómo funcionamos y únete a nuestra comunidad',
    type: 'website',
    url: 'https://burgerank.com/about',
    images: [
      {
        url: 'https://burgerank.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BurgeRank - Rating hamburguesas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre BurgeRank',
    description: 'La comunidad definitiva de amantes de las hamburguesas',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <CookieBannerWrapper />
    </>
  )
}
