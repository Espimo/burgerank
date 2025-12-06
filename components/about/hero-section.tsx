'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      {/* Background Burger Image Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-orange-900/30" />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%22200%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🍔%3C/text%3E%3C/svg%3E")',
            backgroundSize: '300px 300px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="text-8xl md:text-9xl inline-block">🍔</div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          BurgeRank
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-3xl text-amber-300 font-semibold mb-8"
        >
          La comunidad definitiva de amantes de las hamburguesas
        </motion.p>

        {/* Descripción */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Descubre, califica y comparte opiniones sobre las mejores hamburguesas. 
          Transparencia, comunidad y pasión por el burger perfecto.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg"
          >
            <Link href="/app/burgers">Empezar a Calificar</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-amber-300 text-amber-300 hover:bg-amber-300/10 px-8 py-6 text-lg"
          >
            <Link href="/app/ranking">Ver Ranking</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-3 gap-4 md:gap-8 text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400">10K+</div>
            <div className="text-gray-400 text-sm">Hamburguesas</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400">50K+</div>
            <div className="text-gray-400 text-sm">Usuarios</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-400">500K+</div>
            <div className="text-gray-400 text-sm">Reviews</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-amber-400"
      >
        <ChevronDown size={32} />
      </motion.div>
    </div>
  )
}
