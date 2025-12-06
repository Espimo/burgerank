import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | BurgeRank',
  description: 'Lee nuestros términos y condiciones de servicio',
  canonical: 'https://burgerank.com/legal/terms',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-gray-600 mb-8">Última actualización: Noviembre 2024</p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y usar BurgeRank, aceptas estar vinculado por estos Términos y Condiciones. Si no estás de acuerdo
              con alguna parte de estos términos, no debes usar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Descripción del Servicio</h2>
            <p>
              BurgeRank es una plataforma web y móvil que permite a los usuarios calificar hamburguesas, acceder a rankings,
              participar en un sistema de recompensas y conectar con restaurantes. El servicio es gratuito durante la fase beta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Elegibilidad</h2>
            <p>
              Debes tener al menos 13 años para usar BurgeRank. Si tienes menos de 18 años, necesitas consentimiento de tus padres
              o tutores legales. Al crear una cuenta, garantizas que toda la información proporcionada es precisa y completa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Conducta del Usuario</h2>
            <p>Acepta no usar BurgeRank para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Publicar contenido falso, engañoso, difamatorio u ofensivo</li>
              <li>Acosar o intimidar a otros usuarios</li>
              <li>Manipular o falsificar calificaciones</li>
              <li>Realizar spam o promoción no autorizada</li>
              <li>Violar la ley o derechos de terceros</li>
              <li>Intentar acceder a sistemas no autorizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contenido del Usuario</h2>
            <p>
              Eres responsable de todo el contenido que publiques, incluyendo calificaciones, comentarios y fotos. Al publicar
              contenido, otorgas a BurgeRank una licencia mundial, no exclusiva, libre de regalías para usar, reproducir y
              distribuir tu contenido en conexión con el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Derechos de Propiedad Intelectual</h2>
            <p>
              Todos los contenidos de BurgeRank, incluyendo logos, diseños, texto y gráficos, están protegidos por derechos de
              autor. No puedes copiar, modificar o distribuir nuestro contenido sin permiso explícito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              BurgeRank se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables por daños indirectos,
              incidentales, especiales o consecuentes derivados del uso de nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Modificaciones del Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar BurgeRank en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Terminación de Cuenta</h2>
            <p>
              Podemos terminar o suspender tu cuenta si violas estos términos o por cualquier otra razón a nuestra discreción.
              Puedes solicitar la eliminación de tu cuenta en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Cambios a los Términos</h2>
            <p>
              Podemos modificar estos Términos en cualquier momento. Los cambios entran en vigor cuando se publican en el sitio.
              Tu uso continuado constituye aceptación de los términos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Ley Aplicable</h2>
            <p>
              Estos Términos se rigen por las leyes de América Latina y cualquier disputa será resuelta en los tribunales competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contacto</h2>
            <p>
              Para preguntas sobre estos Términos, contacta con nosotros en <strong>legal@burgerank.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
