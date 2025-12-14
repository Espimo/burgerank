'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [publicProfileChecked, setPublicProfileChecked] = useState(false)
  const [profileName, setProfileName] = useState('Cristhian Guzmán')
  const [profileEmail, setProfileEmail] = useState('cristhian@example.com')

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const showBadgeInfo = (badgeName: string, description: string) => {
    alert(`🏅 ${badgeName}\n\n${description}`)
  }

  const showRewardInfo = (rewardName: string, description: string, points: number) => {
    alert(`🎁 ${rewardName}\n\n${description}\n\nCosto: ${points} puntos`)
  }

  const togglePublicLink = () => {
    setPublicProfileChecked(!publicProfileChecked)
  }

  const copyToClipboard = () => {
    const link = document.querySelector('#publicLink input') as HTMLInputElement
    if (link) {
      link.select()
      document.execCommand('copy')
      alert('Enlace copiado al portapapeles')
    }
  }

  const saveSettings = () => {
    alert('Configuración guardada correctamente')
    setShowSettings(false)
  }

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="text-2xl font-bold">👤 Mi Perfil</h2>
          </div>
          <button
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={() => setShowSettings(!showSettings)}
            title="Editar perfil"
          >
            ✏️
          </button>
        </div>

        {/* User Header */}
        <div className="card mb-4">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div
              className="avatar avatar-lg"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              CG
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="text-lg font-bold">Cristhian Guzmán</h3>
              <div className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>
                @cristhian_guzman
              </div>
              <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.9rem' }}>🔥 Burger Obsessed</div>
            </div>
          </div>

          {/* Insignias en Header */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.5rem' }}>
              Insignias Desbloqueadas (7)
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Primer Rating"
                onClick={() => showBadgeInfo('Primer Rating', 'Realiza tu primera valoración')}
              >
                ⭐
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Crítico Ardiente"
                onClick={() => showBadgeInfo('Crítico Ardiente', 'Valora 10 hamburguesas')}
              >
                🔥
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Maestro de Sabores"
                onClick={() => showBadgeInfo('Maestro de Sabores', 'Valora 25 hamburguesas')}
              >
                👑
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Coleccionista"
                onClick={() => showBadgeInfo('Coleccionista', 'Valora 50 hamburguesas')}
              >
                🏆
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Explorador de Ciudades"
                onClick={() => showBadgeInfo('Explorador de Ciudades', 'Valora burgers en 5 ciudades')}
              >
                🗺️
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Paladar Exigente"
                onClick={() => showBadgeInfo('Paladar Exigente', 'Promedio de 4.5+ en ratings')}
              >
                💎
              </div>
              <div
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                title="Crítico Leyenda"
                onClick={() => showBadgeInfo('Crítico Leyenda', 'Valora 100 hamburguesas')}
              >
                🌟
              </div>
              <div
                style={{ fontSize: '1.5rem', opacity: 0.3, cursor: 'pointer' }}
                title="Próxima insignia bloqueada"
                onClick={() => showBadgeInfo('Bloqueado', 'Gana más puntos para desbloquear')}
              >
                ⏰
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>340</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Puntos</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>48</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Valoraciones</div>
            </div>
          </div>
        </div>

        {/* Próxima Recompensa */}
        <div className="card mb-4">
          <div className="font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
            🎁 Próxima Recompensa
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🍔</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>Hamburguesa Gratis</div>
                <div className="text-xs text-muted" style={{ fontSize: '0.65rem' }}>
                  Restaurante favorito
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.75rem' }}>+250</div>
              </div>
            </div>
            <div
              style={{
                background: '#4b5563',
                height: '4px',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.3rem',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                  height: '100%',
                  width: '68%',
                }}
              />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#9ca3af' }}>68/100 • 32 pts</div>
          </div>
        </div>

        {/* Recompensas Disponibles */}
        <div className="card mb-4">
          <div className="font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
            💰 Recompensas
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #fbbf24',
                minWidth: '120px',
                cursor: 'pointer',
              }}
              onClick={() => showRewardInfo('10% Descuento', '10% en tu próxima burger', 50)}
            >
              <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.75rem' }}>10% 🏷️</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>50 pts</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #fbbf24',
                minWidth: '120px',
                cursor: 'pointer',
              }}
              onClick={() => showRewardInfo('Bebida Gratis', 'Una bebida con tu burger', 75)}
            >
              <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.75rem' }}>Bebida 🥤</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>75 pts</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #fbbf24',
                minWidth: '120px',
                cursor: 'pointer',
              }}
              onClick={() => showRewardInfo('Aperitivo Gratis', 'Papas, nachos o alitas', 100)}
            >
              <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.75rem' }}>Aperitivo 🍟</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>100 pts</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #fbbf24',
                minWidth: '120px',
                cursor: 'pointer',
              }}
              onClick={() => showRewardInfo('Hamburguesa Gratis', 'Una hamburguesa completa', 150)}
            >
              <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.75rem' }}>Burger 🍔</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>150 pts</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #fbbf24',
                minWidth: '120px',
                cursor: 'pointer',
              }}
              onClick={() => showRewardInfo('50% Descuento', '50% en menú completo', 200)}
            >
              <div style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.75rem' }}>50% 🎉</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>200 pts</div>
            </div>
          </div>
        </div>

        {/* Mi Ranking Personal */}
        <div className="card mb-4">
          <div className="font-semibold" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            📊 Mi Top 3
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}
          >
            Ver Todo →
          </button>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '0.375rem', borderLeft: '3px solid #fbbf24', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🥇 </span>The King
              </div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.8rem' }}>9.2</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '0.375rem', borderLeft: '3px solid #f59e0b', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>🥈 </span>Smoky BBQ
              </div>
              <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.8rem' }}>8.5</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '0.375rem', borderLeft: '3px solid #d97706', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#d97706', fontWeight: 'bold' }}>🥉 </span>Doble Sabor
              </div>
              <div style={{ color: '#d97706', fontWeight: 'bold', fontSize: '0.8rem' }}>8.0</div>
            </div>
          </div>
        </div>

        {/* Últimas Valoraciones */}
        <div className="card mb-4">
          <div className="font-semibold" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            ⭐ Últimas
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}
          >
            Ver Todo →
          </button>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563',
                minWidth: '120px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '0.75rem' }}>The King</div>
              <div style={{ color: '#fbbf24', fontSize: '0.7rem', margin: '0.2rem 0' }}>★★★★★</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>2 días</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563',
                minWidth: '120px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '0.75rem' }}>Smoky BBQ</div>
              <div style={{ color: '#fbbf24', fontSize: '0.7rem', margin: '0.2rem 0' }}>★★★★☆</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>5 días</div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '0.6rem',
                background: 'rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563',
                minWidth: '120px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '0.75rem' }}>Doble Sabor</div>
              <div style={{ color: '#fbbf24', fontSize: '0.7rem', margin: '0.2rem 0' }}>★★★★☆</div>
              <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>1 semana</div>
            </div>
          </div>
        </div>

        {/* Configuración */}
        {showSettings && (
          <div className="card">
            <div className="font-semibold mb-3">⚙️ Configuración</div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="publicProfile"
                  checked={publicProfileChecked}
                  onChange={togglePublicLink}
                />
                Perfil Público
              </label>
            </div>
            {publicProfileChecked && (
              <div id="publicLink" style={{ padding: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <div className="text-xs text-muted mb-2">Comparte tu perfil:</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value="https://burgerank.com/profile/cristhian_guzman"
                    readOnly
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    className="btn btn-secondary"
                    style={{ flex: '0 0 auto' }}
                    onClick={copyToClipboard}
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
            )}
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={saveSettings}>
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
