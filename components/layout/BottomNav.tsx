'use client'

import { useRouter } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()

  const handleNavigation = (page: string) => {
    router.push(`/${page}`)
  }

  return (
    <div className="bottom-nav">
      <a className="nav-item active" onClick={() => handleNavigation('ranking')}>
        <span style={{ fontSize: '1.5rem' }}>🏆</span>
        <span>Ranking</span>
      </a>
      <a className="nav-item" onClick={() => handleNavigation('rate')}>
        <span style={{ fontSize: '1.5rem' }}>⭐</span>
        <span>Valorar</span>
      </a>
      <a className="nav-item" onClick={() => handleNavigation('profile')}>
        <span style={{ fontSize: '1.5rem' }}>👤</span>
        <span>Perfil</span>
      </a>
    </div>
  )
}
