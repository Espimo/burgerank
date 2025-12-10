'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function RankingMethodologySection() {
  const [expandedFactor, setExpandedFactor] = useState<string | null>('promedio')

  const factors = [
    {
      id: 'promedio',
      title: 'Promedio Ponderado',
      weight: '40%',
      description:
        'La base del ranking es el promedio de puntuaciones (1-5 estrellas) de todos los usuarios',
      icon: '📊',
      details:
        'Se calcula usando la media aritmética de todas las valoraciones, pero con filtros para evitar manipulación.',
    },
    {
      id: 'verificadas',
      title: 'Reviews Verificadas',
      weight: '25%',
      description:
        'Mayor peso a reviews con foto/ticket del restaurante',
      icon: '✅',
      details:
        'Las opiniones con evidencia fotográfica o comprobante de compra tienen mayor peso (1.5x más impacto).',
    },
    {
      id: 'nivel',
      title: 'Nivel del Usuario',
      weight: '20%',
      description:
        'Usuarios con más experiencia tienen mayor influencia',
      icon: '⭐',
      details:
        'Los usuarios de nivel alto (críticos verificados) tienen sus opiniones ponderadas hasta 2x más que nuevos usuarios.',
    },
    {
      id: 'cantidad',
      title: 'Cantidad de Reviews',
      weight: '10%',
      description:
        'Penalización a burgers con pocas reviews (< 5)',
      icon: '🔢',
      details:
        'Se penaliza a hamburguesas con menos de 5 reviews para asegurar que el ranking sea confiable.',
    },
    {
      id: 'temporal',
      title: 'Boost Temporal',
      weight: '3%',
      description:
        'Hamburguesas nuevas reciben boost en primeros 30 días',
      icon: '⚡',
      details:
        'Las nuevas adiciones reciben un pequeño impulso inicial para darles oportunidad de ganar visibilidad.',
    },
    {
      id: 'elo',
      title: 'Match Score ELO',
      weight: '2%',
      description:
        'Bonus por rendimiento en el juego de Burger Match',
      icon: '🎮',
      details:
        'Las burgers que ganan más matchups en nuestro juego reciben un pequeño bonus de confianza.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Metodología de Ranking
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparencia total: así es cómo calculamos el ranking de hamburguesas
          </p>
        </motion.div>

        {/* Formula Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-200"
        >
          <h3 className="text-center font-mono text-sm md:text-base text-gray-600 mb-6">
            FÓRMULA DE RANKING FINAL
          </h3>
          <div className="overflow-x-auto">
            <div className="text-center font-mono bg-gray-900 text-green-400 p-6 rounded-lg text-xs md:text-sm inline-block min-w-full">
              <div>RANKING = (Promedio × 0.40) + (Verificado × 0.25) + (Nivel × 0.20)</div>
              <div>+ (Cantidad × 0.10) + (Boost × 0.03) + (ELO × 0.02)</div>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            * Valores normalizados en escala 0-100
          </p>
        </motion.div>

        {/* Factors Accordion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {factors.map((factor) => (
            <motion.div key={factor.id} variants={itemVariants}>
              <div
                onClick={() => setExpandedFactor(expandedFactor === factor.id ? null : factor.id)}
                className="group cursor-pointer"
              >
                {/* Header */}
                <div className="bg-white border border-gray-200 hover:border-amber-300 rounded-lg p-6 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">{factor.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{factor.title}</h3>
                        <p className="text-gray-600 text-sm">{factor.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">{factor.weight}</div>
                        <div className="text-xs text-gray-500">del ranking</div>
                      </div>
                      <ChevronDown
                        className={`text-gray-400 transition-transform ${
                          expandedFactor === factor.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedFactor === factor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-amber-50 border border-t-0 border-gray-200 rounded-b-lg p-6 text-gray-700 leading-relaxed"
                    >
                      {factor.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Transparency Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <h3 className="font-bold text-green-900 mb-2">🔓 Transparencia Total</h3>
          <p className="text-green-800">
            Nuestro algoritmo es 100% transparente y auditable. No usamos "secretos" ni
            manipulación. Cualquiera puede verificar cómo se calculan los rankings. ¡Incluso
            hemos publicado nuestro código fuente!
          </p>
        </motion.div>

        {/* Anti-Manipulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h4 className="font-bold text-gray-900 mb-2">Anti-Spam</h4>
            <p className="text-gray-600 text-sm">
              Detectamos y eliminamos automáticamente reviews de bots o usuarios maliciosos
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h4 className="font-bold text-gray-900 mb-2">Verificación Manual</h4>
            <p className="text-gray-600 text-sm">
              Nuestro equipo revisa casos sospechosos y patrones anómalos
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl mb-3">📈</div>
            <h4 className="font-bold text-gray-900 mb-2">Historial</h4>
            <p className="text-gray-600 text-sm">
              Guardamos el historial completo para auditoría y trasparencia
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
