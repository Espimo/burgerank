'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import './RegistrationPromptModal.css'

interface RegistrationPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationPromptModal({
  isOpen,
  onClose,
}: RegistrationPromptModalProps) {
  const router = useRouter()
  const { authUser } = useAuth()

  if (!isOpen || authUser) return null

  const handleSignUp = () => {
    router.push('/auth/signup')
    onClose()
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
    onClose()
  }

  return (
    <div className="registration-modal-overlay" onClick={onClose}>
      <div className="registration-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>🍔 Bienvenido a BurgeRank</h2>
          <p>La comunidad definitiva de hamburguesas</p>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Únete a miles de amantes de las hamburguesas y comparte tus calificaciones favoritas.
          </p>

          <div className="modal-features">
            <div className="feature">
              <span className="feature-icon">⭐</span>
              <span>Califica tus hamburguesas favoritas</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Consulta rankings en tiempo real</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Comparte con la comunidad</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={handleSignUp}>
            Crear Cuenta
          </button>
          <button className="btn-secondary" onClick={handleSignIn}>
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  )
}
