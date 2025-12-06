'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      emoji: '🍔',
      title: 'Comes una Burger',
      description: 'Encuentra y prueba las mejores hamburguesas en restaurantes cerca de ti',
    },
    {
      number: '2',
      emoji: '⭐',
      title: 'La Calificas',
      description: 'Califica en la app con puntuaciones del 1-5 y cuéntanos qué te pareció',
    },
    {
      number: '3',
      emoji: '🎁',
      title: 'Ganas Premios',
      description: 'Acumula puntos, sube de nivel y desbloquea premios exclusivos',
    },
    {
      number: '4',
      emoji: '🗺️',
      title: 'Descubres Nuevas',
      description: 'Explora el ranking, sigue a otros usuarios y descubre nuevas burgers',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cómo Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde tu primera burger hasta convertirte en un experto burger critic
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="group relative">
                {/* Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all h-full hover:-translate-y-2">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>

                  {/* Emoji */}
                  <div className="text-6xl mb-4 text-center">{step.emoji}</div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-amber-500"
                    >
                      <ArrowRight size={32} strokeWidth={1} />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-12 border border-amber-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Características que hacen la diferencia
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h4 className="font-bold text-gray-900 mb-2">Verificado</h4>
              <p className="text-gray-600">
                Todas las opiniones se verifican para garantizar autenticidad
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h4 className="font-bold text-gray-900 mb-2">Gamificado</h4>
              <p className="text-gray-600">
                Gana puntos, sube niveles y desbloquea logros exclusivos
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h4 className="font-bold text-gray-900 mb-2">Global</h4>
              <p className="text-gray-600">
                Conecta con burger lovers de todo el mundo
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
