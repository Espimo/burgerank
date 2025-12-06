'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, Zap, Shield } from 'lucide-react'

export default function AboutUsSection() {
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

  const values = [
    {
      icon: Heart,
      title: 'Comunidad',
      description: 'Somos un movimiento de apasionados por las hamburguesas que se ayudan mutuamente',
      color: 'text-red-500',
    },
    {
      icon: Zap,
      title: 'Pasión por las Burgers',
      description: 'Creemos que la perfecta hamburguesa merece ser celebrada y compartida',
      color: 'text-amber-500',
    },
    {
      icon: Shield,
      title: 'Transparencia',
      description: 'Nuestro algoritmo de ranking es abierto y accesible para todos',
      color: 'text-blue-500',
    },
    {
      icon: Target,
      title: 'Honestidad',
      description: 'Valoraciones verificadas y sin manipulación de datos',
      color: 'text-green-500',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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
            Nuestra Historia
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            De una simple idea a una comunidad global de burger lovers
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              BurgeRank nació en 2023 de una pasión compartida por las hamburguesas y la necesidad de una plataforma honesta donde los burger lovers pudieran compartir sus opiniones. No queríamos simplemente un ranking más, sino una comunidad donde cada voz importara.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Comenzamos con un puñado de amigos rating burgers en nuestro barrio. Hoy, somos una plataforma con miles de usuarios comprometidos, descubriendo y compartiendo las mejores hamburguesas del mundo.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestra misión es simple pero poderosa: democratizar la información sobre hamburguesas. Queremos que cada restaurante tenga la oportunidad de brillar y que cada usuario encuentre su burger perfecta.
            </p>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Nuestros Números</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-amber-600">10K+</div>
                  <p className="text-gray-600">Hamburguesas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">50K+</div>
                  <p className="text-gray-600">Usuarios activos</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">500K+</div>
                  <p className="text-gray-600">Opiniones verificadas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">150+</div>
                  <p className="text-gray-600">Ciudades</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Values */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
              >
                <div className={`flex-shrink-0 ${value.color}`}>
                  <value.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Misión */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🎯 Nuestra Misión</h3>
            <p className="text-lg text-blue-800 leading-relaxed">
              Ayudar a descubrir las mejores hamburguesas del mundo a través de opiniones honestas, verificadas y de una comunidad apasionada. Creemos que información transparente y accesible cambia vidas.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-8 rounded-2xl border border-orange-200">
            <h3 className="text-2xl font-bold text-orange-900 mb-4">🚀 Nuestra Visión</h3>
            <p className="text-lg text-orange-800 leading-relaxed">
              Ser la referencia global en el mundo burger. Un lugar donde cada restaurante puede demostrar su pasión y donde cada usuario encuentra inspiración para su próxima comida perfecta.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
