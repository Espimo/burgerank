import { Metadata } from 'next'
import { Suspense } from 'react'
import { RankingClient } from './ranking-client'

export const metadata: Metadata = {
  title: 'Ranking de Hamburguesas | BurgeRank',
  description: 'Descubre las mejores hamburguesas de tu ciudad. Compara, califica y comparte tus favoritas.',
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Cargando ranking...</p>
    </div>
  )
}

export default function RankingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RankingClient />
    </Suspense>
  )
}
