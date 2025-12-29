'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NotificationPanel from '@/app/components/NotificationPanel'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { authUser, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!authUser) {
        setUnreadCount(0)
        return
      }
      
      try {
        const response = await fetch('/api/notifications?unread=true&limit=1')
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching notifications count:', error)
      }
    }

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [authUser])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/ranking')
  }

  return (
    <>
      <header className="top-bar">
        <div className="top-bar-left">
          <button 
            className="menu-btn" 
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <Link href="/ranking" className="logo-link">
            <span className="logo">■ BurgeRank</span>
          </Link>
        </div>
        
        <div className="top-bar-right">
          {/* Notifications */}
          {authUser && (
            <button
              onClick={() => setShowNotifications(true)}
              className="notification-btn"
              aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.75rem',
                height: '2.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                borderRadius: '0.375rem',
              }}
            >
              ◆
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    minWidth: '1rem',
                    height: '1rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          
          {authUser ? (
            <>
              <span className="user-name">
                {authUser.email?.split('@')[0]}
              </span>
              <button
                className="btn-logout"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '...' : 'Salir'}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-signin">
                Entrar
              </Link>
              <Link href="/auth/signup" className="btn-signup">
                Registro
              </Link>
            </>
          )}
          
          {/* About button */}
          <button
            onClick={() => router.push('/about')}
            aria-label="Sobre el proyecto"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: 'none',
              borderRadius: '50%',
              color: '#1a1a1a',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            ?
          </button>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false)
          if (authUser) {
            fetch('/api/notifications?unread=true&limit=1')
              .then(r => r.json())
              .then(d => setUnreadCount(d.unreadCount || 0))
              .catch(() => {})
          }
        }}
        userId={authUser?.id || null}
      />
    </>
  )
}
