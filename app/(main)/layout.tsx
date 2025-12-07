"use client"

import React, { useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuthUser, useAuthStore } from "@/lib/stores/auth-store"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuthUser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) return

        const { data } = await supabase.auth.getUser()

        if (data.user) {
          // Obtener el perfil del usuario
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()

          // Acceder al store directamente sin usar hook, evitando ciclos infinitos
          useAuthStore.setState({
            user: {
              id: data.user.id,
              email: data.user.email || "",
            },
            profile,
            isAuthenticated: true,
            error: null,
          })
        }
      } catch (error) {
        console.error("Auth error:", error)
      }
    }

    checkAuth()
  }, [])

  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
