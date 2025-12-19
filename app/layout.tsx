import './globals.css'
import type { Metadata } from 'next'
import { AdminProvider } from './contexts/AdminContext'
import { AuthProvider } from './contexts/AuthContext'

export const metadata: Metadata = {
  title: 'BurgeRank - Ranking de Hamburguesas',
  description: 'La mejor plataforma de ranking de hamburguesas'
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
