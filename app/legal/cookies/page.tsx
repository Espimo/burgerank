import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | BurgeRank',
  description: 'Lee nuestra política de cookies y cómo las usamos',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
        <p className="text-gray-600 mb-8">Última actualización: Noviembre 2024</p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.
              Nos ayudan a recordar tus preferencias y mejorar tu experiencia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tipos de Cookies que Usamos</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">🔒 Cookies Esenciales (Obligatorias)</h3>
            <p>
              Necesarias para que BurgeRank funcione. Incluyen autenticación y preferencias básicas.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>sessionid - Identifica tu sesión</li>
              <li>csrf_token - Protección contra ataques CSRF</li>
              <li>user_preferences - Idioma y tema</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">📊 Cookies de Análisis</h3>
            <p>
              Ayudan a entender cómo usas BurgeRank para mejorar el servicio. Requieren consentimiento.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>_ga - Google Analytics (identificador único)</li>
              <li>_gat - Google Analytics (limitador de velocidad)</li>
              <li>_gid - Google Analytics (sesión actual)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">📢 Cookies de Marketing</h3>
            <p>
              Usadas para publicidad personalizada y seguimiento de campañas. Requieren consentimiento.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>facebook_pixel - Facebook Pixel para conversiones</li>
              <li>utm_* - Parámetros de campaña</li>
              <li>affiliate_id - Tracking de afiliados</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">🍪 Cookies de Terceros</h3>
            <p>
              Establecidas por plataformas que usamos (Google, Facebook, etc.). Ver sus políticas:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><a href="https://policies.google.com/technologies/cookies" className="text-amber-600 hover:underline">Política de cookies de Google</a></li>
              <li><a href="https://www.facebook.com/policies/cookies/" className="text-amber-600 hover:underline">Política de cookies de Facebook</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Control de Cookies</h2>
            <p>Puedes controlar las cookies de varias formas:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Opción 1: Banner de Cookies</h3>
            <p>
              Cuando visitas BurgeRank por primera vez, aparece un banner donde puedes personalizar tus preferencias.
              Acepta todas, rechaza no-esenciales o personaliza según prefieras.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Opción 2: Configuración del Navegador</h3>
            <p>
              La mayoría de navegadores permiten desactivar cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chrome: Configuración → Privacidad → Cookies</li>
              <li>Firefox: Preferencias → Privacidad → Cookies</li>
              <li>Safari: Preferencias → Privacidad → Cookies</li>
              <li>Edge: Configuración → Privacidad → Cookies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Opción 3: Do Not Track</h3>
            <p>
              Si habilitas "Do Not Track" en tu navegador, respetaremos tu preferencia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Duración de las Cookies</h2>
            <p>
              Las cookies esenciales se mantienen mientras usas BurgeRank. Las cookies de análisis y marketing
              generalmente duran entre 30 días y 2 años.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Consentimiento</h2>
            <p>
              Al hacer clic en "Aceptar Todo" en nuestro banner, das consentimiento para todas las cookies.
              Puedes cambiar tus preferencias en cualquier momento desde tu perfil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Impacto de Desactivar Cookies</h2>
            <p>
              Si desactivas cookies no-esenciales:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>BurgeRank funcionará correctamente (las esenciales siempre estarán activas)</li>
              <li>No recibirás publicidad personalizada</li>
              <li>No podremos mejorar la experiencia basándonos en tu comportamiento</li>
              <li>Algunos elementos pueden funcionar de forma subóptima</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política en cualquier momento. Notificaremos cambios significativos
              por email o a través de nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Preguntas</h2>
            <p>
              Si tienes preguntas sobre cookies en BurgeRank, contacta con nosotros:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> privacy@burgerank.com
            </p>
          </section>

          <section className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              <strong>ℹ️ Nota Legal:</strong> Esta política cumple con GDPR (Reglamento General de Protección de Datos) y CCPA
              (Ley de Privacidad del Consumidor de California).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
