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

  // Fetch unread notifications count
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
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [authUser])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/ranking')
  }

  const handleAboutClick = () => {
    router.push('/about')
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="menu-btn" onClick={onMenuClick}>☰</button>
          <Link href="/ranking" className="logo-link">
            <div className="logo">🍔 BurgeRank</div>
          </Link>
        </div>
        <div className="top-bar-right">
          {authUser && (
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '1.25rem',
                marginRight: '0.5rem',
              }}
              title="Notificaciones"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false)
          // Refresh count after closing
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
