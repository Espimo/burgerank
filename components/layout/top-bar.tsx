'use client'

import React from 'react'
import { Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useNotificationsStore } from '@/lib/stores/notifications-store'
import { Badge } from '@/components/ui/badge'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { unreadCount } = useNotificationsStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/ranking"
          className="font-bold text-lg text-primary hover:opacity-80 transition-opacity"
        >
          🍔 BurgeRank
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full"
            asChild
          >
            <Link href="/notifications">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
