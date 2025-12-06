'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { pageVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/utils/animations'
import Link from 'next/link'
import { Github, Mail, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">🍔 BurgeRank</h1>
        <p className="text-xl text-muted-foreground">
          La plataforma definitiva para valorar y descubrir las mejores hamburguesas
        </p>
      </div>

      {/* About */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.div variants={staggerItemVariants}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">¿Qué es BurgeRank?</h2>
            <p className="text-muted-foreground leading-relaxed">
              BurgeRank es una comunidad apasionada por las hamburguesas. Aquí puedes descubrir,
              valorar y compartir tus experiencias con las mejores hamburguesas de tu ciudad. Desde
              clásicas hasta gourmet, fuimos, fuera o veganas, en BurgeRank encontrarás todo lo que
              necesitas.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Características</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span>✨</span>
                <span>Descubre hamburguesas cerca de ti</span>
              </li>
              <li className="flex gap-2">
                <span>⭐</span>
                <span>Valora y comenta tus experiencias</span>
              </li>
              <li className="flex gap-2">
                <span>🏆</span>
                <span>Sube de nivel y gana premios</span>
              </li>
              <li className="flex gap-2">
                <span>👥</span>
                <span>Sigue a otros amantes de las hamburguesas</span>
              </li>
              <li className="flex gap-2">
                <span>🎁</span>
                <span>Desbloquea recompensas exclusivas</span>
              </li>
            </ul>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Nuestro Objetivo</h2>
            <p className="text-muted-foreground leading-relaxed">
              Crear una comunidad global de entusiastas de las hamburguesas donde todos puedan
              compartir sus hallazgos, aprender de otros y descubrir nuevas experiencias culinarias.
              Queremos que BurgeRank sea el lugar de referencia para cualquiera que busque la
              hamburguesa perfecta.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Contacto</h2>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="justify-start gap-2" asChild>
                <a href="mailto:info@burgerank.com">
                  <Mail className="w-4 h-4" />
                  info@burgerank.com
                </a>
              </Button>
              <Button variant="outline" className="justify-start gap-2" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  GitHub
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <p className="text-sm text-muted-foreground text-center">
              Hecho con ❤️ para los amantes de las hamburguesas
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
