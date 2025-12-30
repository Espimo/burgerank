'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useAdmin } from '@/app/contexts/AdminContext'
import Image from 'next/image'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { authUser, logout, loading } = useAuth()
  const { isAdmin } = useAdmin()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const firstFocusable = sidebarRef.current.querySelector('button, a') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isOpen])

  const handleNavigation = (path: string) => {
    router.push(path)
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

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { path: '/ranking', icon: '🏆', label: 'Ranking' },
    { path: '/rate', icon: '⭐', label: 'Valorar' },
    { path: '/profile', icon: '👤', label: 'Mi Perfil' },
    { path: '/about', icon: 'ℹ️', label: 'Sobre BurgeRank' },
  ]

  // Solo mostrar Admin si el usuario es admin
  if (isAdmin) {
    menuItems.push({ path: '/admin', icon: '⚙️', label: 'Admin Panel' })
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image 
              src="/icons/logo-small.svg" 
              alt="BurgeRank Logo" 
              width={28} 
              height={28}
              style={{ borderRadius: '6px' }}
            />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>
              Menú
            </span>
          </div>
          <button 
            className="sidebar-close" 
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* User info */}
        {authUser && (
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(251, 191, 36, 0.05)',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem' 
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: 'white',
                fontWeight: 700,
              }}>
                {authUser.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#e5e7eb' }}>
                  {authUser.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {authUser.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="sidebar-menu" role="navigation">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault()
                handleNavigation(item.path)
              }}
              className={isActive(item.path) ? 'active' : ''}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Logout button */}
        {authUser && (
          <div style={{ 
            padding: '1rem 1.5rem',
            marginTop: 'auto',
            borderTop: '1px solid var(--border)',
          }}>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut || loading}
              style={{
                width: '100%',
                minHeight: '2.75rem',
                padding: '0.75rem',
                background: isLoggingOut || loading 
                  ? 'rgba(239, 68, 68, 0.5)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.625rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: isLoggingOut || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {isLoggingOut || loading ? '🔄 Cerrando...' : '🚪 Cerrar Sesión'}
            </button>
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!authUser && (
          <div style={{ 
            padding: '1rem 1.5rem',
            marginTop: 'auto',
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#9ca3af', 
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
              Inicia sesión para valorar hamburguesas y guardar tus favoritas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => handleNavigation('/auth/signin')}
                style={{
                  width: '100%',
                  minHeight: '2.75rem',
                  padding: '0.75rem',
                  background: 'transparent',
                  color: '#fbbf24',
                  border: '2px solid #fbbf24',
                  borderRadius: '0.625rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleNavigation('/auth/signup')}
                style={{
                  width: '100%',
                  minHeight: '2.75rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '0.625rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
