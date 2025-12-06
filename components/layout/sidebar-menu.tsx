'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  LogOut,
  User,
  Award,
  ClipboardList,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getInitials } from '@/lib/utils/format'

interface SidebarMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SidebarMenu({ open, onOpenChange }: SidebarMenuProps) {
  const { user } = useAuthStore()
  const profile = user?.profile

  const handleLogout = async () => {
    // TODO: Implementar logout
    onOpenChange(false)
  }

  const menuItems = [
    { icon: User, label: 'Mi perfil', href: '/profile' },
    { icon: ClipboardList, label: 'Mis valoraciones', href: '/profile?tab=reviews' },
    { icon: Award, label: 'Mis premios', href: '/rewards' },
    { icon: Settings, label: 'Configuración', href: '/profile/settings' },
    { icon: Info, label: 'Sobre el proyecto', href: '/about' },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          
          {/* User Info */}
          <div className="flex items-center gap-4 pt-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
              <AvatarFallback>{getInitials(profile?.full_name || 'U')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{profile?.full_name || 'Usuario'}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {profile?.level || 'Novato'}
              </Badge>
            </div>
          </div>

          {/* Points */}
          <div className="mt-4 p-3 bg-accent rounded-lg text-left">
            <p className="text-xs text-muted-foreground">Puntos disponibles</p>
            <p className="text-xl font-bold">{profile?.points || 0}</p>
          </div>
        </SheetHeader>

        {/* Menu Items */}
        <div className="flex flex-col gap-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
