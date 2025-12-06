'use client'

import React from 'react'
import { Home, Search, Plus, Gift, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useScrollDirection } from '@/lib/hooks/use-scroll-direction'
import { useNotificationsStore } from '@/lib/stores/notifications-store'
import { Badge } from '@/components/ui/badge'
import { bottomNavIconVariants } from '@/lib/utils/animations'

export function BottomNav() {
  const pathname = usePathname()
  const scrollDirection = useScrollDirection()
  const { unreadCount: rewardsBadge } = useNotificationsStore()

  const navItems = [
    { icon: Home, label: 'Home', href: '/ranking' },
    { icon: Search, label: 'Buscar', href: '/search' },
    { icon: Plus, label: 'Calificar', href: '/rate', isCentral: true },
    { icon: Gift, label: 'Premios', href: '/rewards', badge: rewardsBadge > 0 },
    { icon: User, label: 'Perfil', href: '/profile' },
  ]

  const isActive = (href: string) => {
    if (href === '/ranking') {
      return pathname === '/ranking' || pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  // Hide on scroll down, show on scroll up
  const isVisible = scrollDirection === 'up' || pathname === '/rate'

  return (
    <motion.nav
      initial={false}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                variants={bottomNavIconVariants}
                whileTap="tap"
                whileHover="hover"
                animate="animate"
                className={`flex flex-col items-center justify-center min-h-16 relative
                  ${item.isCentral ? 'scale-125' : ''}
                  ${active ? 'text-primary' : 'text-muted-foreground'}
                  transition-colors duration-200`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs"
                    >
                      •
                    </Badge>
                  )}
                </div>

                {/* Underline indicator */}
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-1 w-6 h-0.5 bg-primary rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
