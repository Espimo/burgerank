'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()

  const handleNavigation = (page: string) => {
    router.push(`/${page}`)
    onClose()
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
      </div>
    </>
  )
}
