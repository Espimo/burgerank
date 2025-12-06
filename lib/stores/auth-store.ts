"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Profile, AuthError } from "@/types"

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: AuthError | null

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: AuthError | null) => void
  setAuthState: (user: User | null, profile: Profile | null) => void
  clearAuth: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setProfile: (profile) => {
        set({ profile })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      setError: (error) => {
        set({ error })
      },

      setAuthState: (user, profile) => {
        set({
          user,
          profile,
          isAuthenticated: !!user,
          error: null,
        })
      },

      clearAuth: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        })
      },

      refreshUser: async () => {
        try {
          set({ isLoading: true })

          const response = await fetch("/api/auth/me")
          if (!response.ok) {
            throw new Error("Failed to refresh user")
          }

          const data = await response.json()
          set({
            user: data.user,
            profile: data.profile,
            isAuthenticated: !!data.user,
            error: null,
          })
        } catch (error) {
          set({
            error: {
              code: "REFRESH_ERROR",
              message:
                error instanceof Error ? error.message : "Failed to refresh user",
            },
          })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: "auth-store",
      // No persiste el estado por defecto, ya que la sesión viene de Supabase
      skipHydration: true,
    }
  )
)

// Hook para obtener solo lo necesario
export const useAuthUser = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuthStore()
  return { user, profile, isAuthenticated, isLoading }
}

// Hook para obtener solo el usuario
export const useUser = () => {
  return useAuthStore((state) => state.user)
}

// Hook para obtener solo el perfil
export const useProfile = () => {
  return useAuthStore((state) => state.profile)
}

// Hook para obtener acciones de auth
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    setUser: state.setUser,
    setProfile: state.setProfile,
    setLoading: state.setLoading,
    setError: state.setError,
    setAuthState: state.setAuthState,
    clearAuth: state.clearAuth,
    refreshUser: state.refreshUser,
  }))
}
