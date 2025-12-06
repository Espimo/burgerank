'use client'

import React from 'react'
import CookieBanner from '@/components/about/cookie-banner'

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <CookieBanner />
    </>
  )
}
