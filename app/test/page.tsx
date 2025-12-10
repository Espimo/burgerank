'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestPage() {
  const [testUser] = useState({
    id: 'test-user-123',
    email: 'test@example.com',
  })

  const simulateLogin = () => {
    // Guardar usuario simulado en localStorage para testing
    localStorage.setItem('test-user', JSON.stringify(testUser))
    alert('Usuario de prueba guardado en localStorage. Recarga la página.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🧪 Página de Testing</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Opciones de Prueba</h2>

          <div className="space-y-4">
            {/* Test Pages */}
            <div className="border-l-4 border-amber-500 pl-4 py-4">
              <h3 className="font-bold text-gray-900 mb-3">Páginas para Probar:</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    ✅ /about - Página Sobre Nosotros (SIN autenticación)
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Debería mostrar: Hero Section, Metodología de Ranking con accordions,
                    FAQs, etc.
                  </p>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    ❌ /profile - Perfil de Usuario (REQUIERE autenticación)
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Actualmente mostrará: "Debes iniciar sesión para ver tu perfil"
                  </p>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    🍔 / - Página Principal (ranking de burgers)
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Debería mostrar: clasificación de hamburguesas con badges de tipo
                  </p>
                </li>
              </ul>
            </div>

            {/* Issue Summary */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-bold text-yellow-900 mb-2">📋 Resumen de Problemas:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>✅ Issue #1: Burger type badges - FIJO en burger-card.tsx</li>
                <li>✅ Issue #2: Submit button webhook - FIJO en submit-burger.ts</li>
                <li>✅ Issue #3: Profile loading - FIJO con useAuthUser hook</li>
                <li>✅ Issue #4: React error #321 - FIJO con unique IDs en about page</li>
              </ul>
            </div>

            {/* Environment Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">🌐 Información del Entorno:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <strong>Servidor:</strong> http://localhost:3000 ✅ Activo
                </li>
                <li>
                  <strong>Supabase:</strong> Configurado en .env.local ✅
                </li>
                <li>
                  <strong>Base de datos:</strong> PostgreSQL via Supabase ✅
                </li>
              </ul>
            </div>

            {/* Auth Simulation */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-bold text-green-900 mb-2">🔐 Simulación de Autenticación:</h3>
              <p className="text-sm text-green-800 mb-3">
                Para testing local, puedes simular un usuario autenticado (nota: esto es solo
                local, no crea usuario real en Supabase):
              </p>
              <button
                onClick={simulateLogin}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Crear Usuario de Prueba Local
              </button>
              <p className="text-xs text-green-700 mt-2">
                Esto guardará un usuario ficticio en localStorage para testing local.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Checks */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Checklist de Verificación</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Burger Type Badges</strong>
                <p className="text-sm text-gray-600">
                  En la página principal, las hamburguesas deben mostrar un badge con su tipo
                  (clásica, doble, vegana, pollo, cerdo) en color ámbar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Ranking Methodology</strong>
                <p className="text-sm text-gray-600">
                  En /about, deberías ver la sección "Metodología de Ranking" con 6 factores
                  expandibles (Promedio, Verificadas, Nivel, Cantidad, Boost, ELO)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Profile Page (si autenticado)</strong>
                <p className="text-sm text-gray-600">
                  En /profile, debe mostrar los datos del usuario autenticado sin errores
                  de React
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>No React Errors</strong>
                <p className="text-sm text-gray-600">
                  Abre la consola (F12) y verifica que no hay errores de React en cualquier
                  página
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
