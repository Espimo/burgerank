'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function SocialLinks() {
  const socials = [
    {
      name: 'Instagram',
      icon: '📷',
      url: 'https://instagram.com/burgerank',
      color: 'hover:text-pink-600',
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      url: 'https://twitter.com/burgerank',
      color: 'hover:text-black',
    },
    {
      name: 'Facebook',
      icon: '👍',
      url: 'https://facebook.com/burgerank',
      color: 'hover:text-blue-600',
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://tiktok.com/@burgerank',
      color: 'hover:text-black',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      url: 'https://youtube.com/@burgerank',
      color: 'hover:text-red-600',
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Social Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4"
      >
        {socials.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl transition-all ${social.color}`}
            title={social.name}
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 text-center text-gray-300"
      >
        <a href="mailto:contacto@burgerank.com" className="flex items-center justify-center gap-2 hover:text-amber-400 transition">
          <Mail size={18} />
          <span>contacto@burgerank.com</span>
        </a>
      </motion.div>
    </div>
  )
}
