'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TrendingUp, MessageSquare, Gift, BarChart3 } from 'lucide-react'
import RestaurantContactForm from './restaurant-contact-form'

const [showForm, setShowForm] = React.useState(false)

export default function ForRestaurantsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Visibilidad',
      description: 'Aparece en el ranking de BurgeRank y llega a miles de burger lovers',
    },
    {
      icon: MessageSquare,
      title: 'Feedback Directo',
      description: 'Recibe opiniones honestas de clientes sobre tus hamburguesas',
    },
    {
      icon: Gift,
      title: 'Programa de Premios',
      description: 'Ofrece descuentos exclusivos a usuarios con puntos de BurgeRank',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Panel de control con estadísticas detalladas de tu rendimiento',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
            Para Restaurantes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crece tu negocio siendo parte de nuestra comunidad
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Tienes un restaurante con hamburguesas increíbles?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                BurgeRank es el lugar perfecto para que tus burgers brillen. Nuestros usuarios
                buscan constantemente nuevas opciones y están listos para probar lo que tienes
                para ofrecer.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900">Beneficios de asociarte:</h4>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {benefits.map((benefit, index) => (
                  <motion.div key={index} variants={itemVariants} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <benefit.icon size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{benefit.title}</p>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Cómo empezar:</h4>
              <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                <li>Completa el formulario con tus datos</li>
                <li>Nuestro equipo revisará tu solicitud</li>
                <li>Te contactaremos con los próximos pasos</li>
                <li>¡Tu restaurante aparecerá en BurgeRank!</li>
              </ol>
            </div>
          </motion.div>

          {/* Right - Benefits Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-lg border border-amber-200"
            >
              <div className="text-4xl font-bold text-amber-600 mb-2">50K+</div>
              <p className="text-gray-600">Usuarios buscando nuevas burgers cada mes</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
              <p className="text-gray-600">Opiniones verificadas de clientes reales</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
              <p className="text-gray-600">Ciudades en nuestra plataforma</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-600">Gratis para restaurantes durante Beta</p>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-12 text-center text-white mb-12"
        >
          <h3 className="text-3xl font-bold mb-4">Listo para crecer con nosotros?</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a cientos de restaurantes que ya están ganando visibilidad en BurgeRank
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Registra tu Restaurante
          </Button>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <RestaurantContactForm onClose={() => setShowForm(false)} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
