"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Flame,
  Search,
  Star,
  Gift,
  User,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/ranking", label: "Ranking", icon: Flame },
    { href: "/search", label: "Buscar", icon: Search },
    { href: "/rate", label: "Calificar", icon: Star },
    { href: "/rewards", label: "Premios", icon: Gift },
    { href: "/profile", label: "Perfil", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-0.5 text-xs transition-colors",
              pathname === href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
