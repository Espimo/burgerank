'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { authUser, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/ranking')
  }

  const handleAboutClick = () => {
    // showPage('about') - será manejado por el padre
  }

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="menu-btn" onClick={onMenuClick}>☰</button>
        <Link href="/ranking" className="logo-link">
          <div className="logo">🍔 BurgeRank</div>
        </Link>
      </div>
      <div className="top-bar-right">
        {authUser ? (
          <>
            <span className="user-name">{authUser.email?.split('@')[0]}</span>
            <button
              className="btn-logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="btn-signin">
              Iniciar Sesión
            </Link>
            <Link href="/auth/signup" className="btn-signup">
              Registrarse
            </Link>
          </>
        )}
        <button
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#1a1a1a',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(251, 191, 36, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
          onClick={handleAboutClick}
          title="Sobre el Proyecto"
        >
          ?
        </button>
      </div>
    </div>
  )
}
