'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import Sidebar from '@/components/layout/Sidebar'

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({})

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const AccordionItem = ({ index, title, content }: { index: number; title: string; content: string }) => (
    <div className="accordion">
      <div
        className="accordion-header"
        onClick={() => toggleAccordion(index)}
        style={{ cursor: 'pointer' }}
      >
        <span>{title}</span>
        <span
          className="accordion-icon"
          style={{
            transform: openAccordions[index] ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </div>
      <div
        className={`accordion-content ${openAccordions[index] ? 'active' : ''}`}
        style={{
          maxHeight: openAccordions[index] ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.2s',
          padding: openAccordions[index] ? '1rem' : '0 1rem',
          backgroundColor: 'rgba(251, 191, 36, 0.05)',
        }}
      >
        {content}
      </div>
    </div>
  )

  return (
    <div className="container">
      <TopBar onMenuClick={handleMenuClick} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="main">
        <div style={{ maxWidth: '100%' }}>
          <h2 className="text-2xl font-bold mb-4">ℹ️ Acerca de BurgeRank</h2>

          {/* Qué es */}
          <div className="card mb-4">
            <h3 className="font-semibold mb-2">🎯 ¿Qué es BurgeRank?</h3>
            <p className="text-sm">
              BurgeRank es la plataforma definitiva para los amantes de las hamburguesas. Una comunidad donde
              puedes descubrir, valorar y compartir las mejores hamburguesas de tu ciudad. Nos ayudamos
              mutuamente a encontrar esos lugares especiales que sirven hamburguesas increíbles.
            </p>
          </div>

          {/* Cómo funciona */}
          <div className="card mb-4">
            <h3 className="font-semibold mb-2">⭐ ¿Cómo funciona la calificación?</h3>
            <p className="text-sm mb-3">Cuando calificas una hamburguesa, evaluamos 5 aspectos clave:</p>

            <AccordionItem
              index={0}
              title="🥖 Pan"
              content="Evaluamos el tipo de pan, si es fresco, crujiente y complementa bien la carne. Sesamo, brioche, mantequilla, sin gluten, etc."
            />
            <AccordionItem
              index={1}
              title="🥩 Carne"
              content="La calidad, jugosidad y sabor de la carne. Consideramos el tipo: ternera, pollo, smash, pescado, vegana, etc."
            />
            <AccordionItem
              index={2}
              title="🥗 Toppings"
              content="Los acompañamientos como bacon, queso, cebolla, lechuga, tomate. Frescura y cantidad son importantes."
            />
            <AccordionItem
              index={3}
              title="🍯 Salsa"
              content="La salsa debe complementar sin opacar. Evaluamos: BBQ, ketchup, mostaza, mayonesa, mayo trufa, sriracha, etc."
            />
            <AccordionItem
              index={4}
              title="🎯 Puntuación Final"
              content="La puntuación final es 70% de tu calificación general + 30% del promedio de las 4 secciones (pan, carne, toppings, salsa)."
            />
          </div>

          {/* Sistema de Recompensas */}
          <div className="card mb-4">
            <h3 className="font-semibold mb-2">🏅 Sistema de Recompensas y Categorías</h3>
            <p className="text-sm mb-3">Según tus puntos acumulados, asciendes de categoría:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: '600', color: '#fbbf24' }}>🔥 Burger Fan (0-100 puntos)</div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  Acabas de unirte a la comunidad BurgeRank
                </div>
              </div>
              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: '600', color: '#fbbf24' }}>❤️ Burger Lover (101-300 puntos)</div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  Ya eres un habitual y tu opinión es valiosa
                </div>
              </div>
              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '0.375rem',
                }}
              >
                <div style={{ fontWeight: '600', color: '#fbbf24' }}>👑 Burger Obsessed (300+ puntos)</div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  Eres un experto, tus valoraciones son oro puro
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ marginTop: '1rem', marginBottom: 0 }}>
              Desbloquea insignias especiales al alcanzar hitos: &quot;Primer Rating&quot;, &quot;Crítico
              Ardiente&quot;, &quot;Maestro de Sabores&quot;, &quot;Coleccionista&quot;, etc.
            </p>
          </div>

          {/* Contacto */}
          <div className="card">
            <h3 className="font-semibold mb-2">📧 Contacto</h3>
            <p className="text-sm mb-3">¿Preguntas, sugerencias o problemas?</p>
            <p style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.95rem' }}>📧 contacto@burgerank.com</p>
            <p className="text-xs text-muted" style={{ marginTop: '1rem' }}>
              Versión 1.0.0 | Última actualización: Diciembre 2024
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
