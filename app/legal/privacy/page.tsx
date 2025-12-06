import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | BurgeRank',
  description: 'Lee nuestra política de privacidad y cómo protegemos tus datos',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-gray-600 mb-8">Última actualización: Noviembre 2024</p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introducción</h2>
            <p>
              En BurgeRank, la privacidad de tus datos es fundamental. Esta política explica cómo recopilamos, usamos, protegemos
              y compartimos tu información personal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Información que Recopilamos</h2>
            <p>Recopilamos los siguientes datos:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Información de Cuenta:</strong> Nombre, email, teléfono (opcional), ubicación</li>
              <li><strong>Información de Perfil:</strong> Avatar, biografía, preferencias de hamburguesas</li>
              <li><strong>Actividad:</strong> Calificaciones, comentarios, fotos que publicas</li>
              <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
              <li><strong>Cookies:</strong> Para mejora de la experiencia y análisis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cómo Usamos tu Información</h2>
            <p>Usamos tu información para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia</li>
              <li>Enviar actualizaciones y ofertas (con tu consentimiento)</li>
              <li>Prevenir fraude y actividad maliciosa</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Análisis de uso y estadísticas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Compartición de Datos</h2>
            <p>
              <strong>NO compartimos</strong> tus datos personales con terceros para marketing sin tu consentimiento explícito.
            </p>
            <p>Compartimos información limitada con:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proveedores de servicios (hosting, email, análisis)</li>
              <li>Autoridades legales cuando se requiere por ley</li>
              <li>Restaurantes (solo información que compartiste públicamente)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Seguridad de Datos</h2>
            <p>
              Usamos encriptación SSL/TLS, contraseñas hasheadas y autenticación de dos factores para proteger tu información.
              Sin embargo, ningún sistema es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Retención de Datos</h2>
            <p>
              Retenemos tus datos mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta en cualquier
              momento. Algunos datos pueden retenerse por obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Tus Derechos (GDPR/CCPA Compliant)</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Acceso:</strong> Solicitar una copia de tus datos</li>
              <li><strong>Rectificación:</strong> Corregir información inexacta</li>
              <li><strong>Eliminación:</strong> Solicitar que eliminemos tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato portable</li>
              <li><strong>Oposición:</strong> Optar por no recibir marketing</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, contacta con nosotros en <strong>privacy@burgerank.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies</h2>
            <p>
              Usamos cookies para mejorar tu experiencia. Puedes desactivarlas en la configuración de tu navegador, pero
              algunas características pueden no funcionar correctamente.
            </p>
            <p className="mt-2">
              Lee nuestra <a href="/legal/cookies" className="text-amber-600 hover:underline">política de cookies</a> para más detalles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política en cualquier momento. Los cambios entran en vigor cuando se publican.
              Notificaremos cambios significativos por email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política, contacta con nuestro Oficial de Privacidad:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> privacy@burgerank.com<br />
              <strong>Dirección:</strong> Recibido en formulario de contacto
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
