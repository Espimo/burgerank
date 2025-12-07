"use client"

import { getSupabaseClient } from "./client"
import { SignUpForm, SignInForm, Profile, AuthError } from "@/types"

/**
 * Registra un nuevo usuario usando Supabase Auth
 * El perfil se crea automáticamente mediante un trigger de BD
 */
export async function signUp(
  email: string,
  password: string,
  username: string,
  city: string
) {
  try {
    const supabase = getSupabaseClient()

    // Crear usuario en Auth con metadata
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          city,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (authError) throw authError
    if (!data.user) throw new Error("No user returned from signup")

    // El perfil se crea automáticamente por el trigger en Supabase
    // No necesitamos hacer nada aquí

    return {
      success: true,
      user: data.user,
      message: "Account created successfully. Please check your email to verify.",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to sign up",
    }
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(email: string, password: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.session) throw new Error("No session returned")

    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to sign in",
    }
  }
}

/**
 * Cierra la sesión del usuario actual
 */
export async function signOut() {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to sign out",
    }
  }
}

/**
 * Envía email de recuperación de contraseña
 */
export async function resetPassword(email: string) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) throw error

    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send reset email",
    }
  }
}

/**
 * Actualiza la contraseña del usuario actual
 */
export async function updatePassword(newPassword: string) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error) {
    console.error("Update password error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update password",
    }
  }
}

/**
 * Obtiene el usuario actual con su perfil completo
 */
export async function getCurrentUser(): Promise<{
  user: any
  profile: Profile | null
  error: AuthError | null
}> {
  try {
    const supabase = getSupabaseClient()

    // Obtener sesión actual
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        user: null,
        profile: null,
        error: userError ? { code: userError.name, message: userError.message } : null,
      }
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 = no rows found
      throw profileError
    }

    return {
      user,
      profile: profile as Profile | null,
      error: null,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return {
      user: null,
      profile: null,
      error: {
        code: "GET_USER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to get current user",
      },
    }
  }
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string
    bio?: string
    city?: string
    avatar_url?: string
  }
) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      profile: data as Profile,
    }
  } catch (error) {
    console.error("Update profile error:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

/**
 * Verifica si un username está disponible
 */
export async function checkUsernameAvailability(username: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (error && error.code === "PGRST116") {
      // No existe, está disponible
      return { available: true }
    }

    if (data) {
      return { available: false }
    }

    return { available: true }
  } catch (error) {
    console.error("Check username error:", error)
    return { available: false }
  }
}
