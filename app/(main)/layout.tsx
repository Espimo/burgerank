"use client"

import React, { useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuthUser, useAuthActions } from "@/lib/stores/auth-store"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuthUser()
  const { setAuthState } = useAuthActions()

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

          setAuthState(
            {
              id: data.user.id,
              email: data.user.email || "",
            },
            profile
          )
        }
      } catch (error) {
        console.error("Auth error:", error)
      }
    }

    checkAuth()
  }, [setAuthState])

  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
