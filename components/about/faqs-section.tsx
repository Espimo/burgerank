'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: '¿Es gratis usar BurgeRank?',
    answer:
      'Sí, BurgeRank es completamente gratis para usuarios. No hay cargos por crear cuenta, calificar hamburguesas o explorar el ranking. Nuestro objetivo es democratizar el acceso a información de calidad sobre las mejores hamburguesas.',
    category: 'general',
  },
  {
    id: 2,
    question: '¿Cómo se calcula el ranking de hamburguesas?',
    answer:
      'Nuestro algoritmo considera múltiples factores: promedio de calificaciones (40%), reviews verificadas (25%), nivel del usuario (20%), cantidad de reviews (10%), boost temporal (3%) y match score ELO (2%). Esto asegura que las mejores hamburguesas siempre estén en el top.',
    category: 'ranking',
  },
  {
    id: 3,
    question: '¿Puedo confiar en las calificaciones?',
    answer:
      'Absolutamente. Contamos con sistemas anti-spam sofisticados, verificación manual de reviews sospechosas e historial de todas las calificaciones. Además, solo las reviews verificadas tienen mayor peso en el ranking.',
    category: 'ranking',
  },
  {
    id: 4,
    question: '¿Cómo funciona el sistema de recompensas?',
    answer:
      'A medida que califiques hamburguesas, ganarás puntos que puedes canjear por descuentos en restaurantes participantes, acceso a eventos exclusivos y reconocimientos en nuestro hall de la fama.',
    category: 'rewards',
  },
  {
    id: 5,
    question: '¿Qué datos recopilan sobre mí?',
    answer:
      'Solo recopilamos información necesaria para tu experiencia: nombre, email, locación y tus calificaciones. Nunca compartimos tu información con terceros. Consulta nuestra política de privacidad para más detalles.',
    category: 'privacy',
  },
  {
    id: 6,
    question: '¿Cómo puedo registrar mi restaurante?',
    answer:
      'Ve a la sección "Para Restaurantes" en esta página y completa el formulario. Nuestro equipo revisará tu solicitud y te contactará en las próximas 24 horas con detalles sobre cómo empezar.',
    category: 'restaurants',
  },
  {
    id: 7,
    question: '¿Cuál es el costo para restaurantes?',
    answer:
      'Es completamente gratis durante la fase beta. Los restaurantes reciben visibilidad, feedback de usuarios reales y acceso a herramientas de análisis sin costo alguno.',
    category: 'restaurants',
  },
  {
    id: 8,
    question: '¿Puedo exportar mis datos?',
    answer:
      'Sí. Puedes descargar todos tus datos personales en formato JSON desde tu página de perfil. Esto incluye tu historial de calificaciones y estadísticas.',
    category: 'privacy',
  },
  {
    id: 9,
    question: '¿En qué ciudades está disponible BurgeRank?',
    answer:
      'Estamos en más de 150 ciudades en América Latina. Si tu ciudad no aparece, puedes solicitarla a través del formulario de contacto y trabajaremos para incluirla pronto.',
    category: 'general',
  },
  {
    id: 10,
    question: '¿Cómo reporto una hamburguesa o review inapropiada?',
    answer:
      'Usa el botón "Reportar" en cualquier hamburguesa o review. Nuestro equipo de moderación revisará el reporte en las próximas 24 horas y tomará las acciones necesarias.',
    category: 'general',
  },
]

export default function FAQsSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // JSON-LD Schema Markup
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">
              Encuentra respuestas a las preguntas más comunes sobre BurgeRank
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Busca una pregunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </motion.div>

          {/* FAQs Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-amber-300 transition-colors"
                >
                  <motion.button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex-1">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-amber-500 flex-shrink-0" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500"
              >
                No se encontraron preguntas que coincidan con "{searchQuery}"
              </motion.div>
            )}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center"
          >
            <p className="text-gray-700 mb-4">
              ¿No encontraste la respuesta que buscas?
            </p>
            <a
              href="#contact"
              className="inline-block px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Contacta al Equipo
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
