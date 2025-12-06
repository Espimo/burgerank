'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'

const pressItems = [
  {
    id: 1,
    date: '2024-11-15',
    outlet: 'TechCrunch',
    headline: 'BurgeRank: The Yelp for Burger Enthusiasts',
    description: 'A new platform is revolutionizing how food lovers discover and rate the best burgers in Latin America.',
    link: '#',
  },
  {
    id: 2,
    date: '2024-11-10',
    outlet: 'Startup Magazine',
    headline: 'Cómo BurgeRank está Gamificando la Gastronomía',
    description: 'Entrevista con el CEO sobre cómo el gamification está cambiando la forma en que comemos.',
    link: '#',
  },
  {
    id: 3,
    date: '2024-11-05',
    outlet: 'Forbes',
    headline: 'Los Jóvenes Emprendedores Latinoamericanos Están Innovando',
    description: 'BurgeRank es incluido en la lista de startups que están transformando la región.',
    link: '#',
  },
  {
    id: 4,
    date: '2024-10-28',
    outlet: 'Entrepreneur',
    headline: 'De Idea a 50K Usuarios en 6 Meses',
    description: 'El crecimiento viral de BurgeRank y cómo manejaron el escalamiento rápido.',
    link: '#',
  },
]

const mediaLogos = [
  { name: 'TechCrunch', logo: '🚀' },
  { name: 'Forbes', logo: '💼' },
  { name: 'Entrepreneur', logo: '🎯' },
  { name: 'Startup Magazine', logo: '📱' },
]

export default function PressSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">En la Prensa</h2>
          <p className="text-lg text-gray-600">
            Descubre qué dicen los medios sobre BurgeRank
          </p>
        </motion.div>

        {/* Media Logos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 p-8 bg-white rounded-lg border border-gray-200"
        >
          <p className="text-center text-sm text-gray-600 mb-6 font-medium">
            Han hablado de nosotros en:
          </p>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mediaLogos.map((media, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center gap-2"
              >
                <div className="text-5xl">{media.logo}</div>
                <span className="text-sm font-semibold text-gray-700 text-center">
                  {media.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Press Articles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4 mb-16"
        >
          {pressItems.map((item, index) => (
            <motion.div key={item.id} variants={itemVariants}>
              <motion.div
                whileHover={{ borderColor: 'rgb(217, 119, 6)' }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer bg-white"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        {item.outlet}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.headline}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === item.id ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight size={20} className="text-amber-500 flex-shrink-0" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Press Kit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Press Kit</h3>
              <p className="text-gray-700 mb-4">
                Descarga nuestro kit de prensa completo con logos, screenshots y datos sobre la empresa.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/press-kit.zip"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition"
              >
                <Download size={20} />
                Descargar Press Kit
              </motion.a>
            </div>
            <div className="hidden md:block text-6xl">📋</div>
          </div>
        </motion.div>

        {/* Contact for Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 mb-4">
            ¿Eres periodista o trabajas en un medio? Nos encantaría hablar contigo.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="mailto:press@burgerank.com"
            className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            press@burgerank.com
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
