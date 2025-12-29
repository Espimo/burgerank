'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { id: 'ranking', icon: '🏆', label: 'Ranking', path: '/ranking' },
    { id: 'rate', icon: '⭐', label: 'Valorar', path: '/rate' },
    { id: 'profile', icon: '👤', label: 'Perfil', path: '/profile' },
  ]

  const isActive = (path: string) => {
    if (path === '/ranking') {
      return pathname === '/' || pathname === '/ranking' || pathname?.startsWith('/rankings')
    }
    return pathname?.startsWith(path)
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => router.push(item.path)}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          aria-label={item.label}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
