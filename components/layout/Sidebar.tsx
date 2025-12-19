'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const { authUser, logout, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleNavigation = (page: string) => {
    router.push(`/${page}`)
    onClose()
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      router.push('/auth/signin')
      onClose()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
          <div style={{ clear: 'both', fontWeight: 'bold', marginTop: '1rem' }}>
            Menú
          </div>
        </div>
        <div className="sidebar-menu">
          <a
            href="#ranking"
            onClick={(e) => {
              e.preventDefault()
              handleNavigation('ranking')
            }}
            className="active"
          >
            🏆 Ranking
          </a>
          <a
            href="#rate"
            onClick={(e) => {
              e.preventDefault()
              handleNavigation('rate')
            }}
          >
            ⭐ Valorar
          </a>
          <a
            href="#profile"
            onClick={(e) => {
              e.preventDefault()
              handleNavigation('profile')
            }}
          >
            👤 Perfil
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              handleNavigation('about')
            }}
          >
            ℹ️ Como nació BurgeRank
          </a>
        </div>

        {authUser && (
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut || loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: isLoggingOut || loading ? 'not-allowed' : 'pointer',
                opacity: isLoggingOut || loading ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {isLoggingOut || loading ? '🔄 Cerrando...' : '🚪 Cerrar Sesión'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
