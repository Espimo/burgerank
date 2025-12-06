'use client'

import React, { useState } from 'react'
import { TopBar } from './top-bar'
import { BottomNav } from './bottom-nav'
import { SidebarMenu } from './sidebar-menu'
import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/utils/animations'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar Menu */}
      <SidebarMenu open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-14 pb-20 px-4 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
