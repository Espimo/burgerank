import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Database } from "@/types/database.types"

/**
 * Obtiene cliente de Supabase para Server Components y Route Handlers
 */
export function getSupabaseServer() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (cookieStore as any).getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              (cookieStore as any).set(name, value, options)
            )
          } catch {
            // Handle error setting cookies
          }
        },
      },
    }
  )
}

/**
 * Obtiene cliente de Supabase para Route Handlers (API routes)
 * (Es el mismo que getSupabaseServer en la nueva API)
 */
export function getSupabaseRoute() {
  return getSupabaseServer()
}

/**
 * Obtiene la sesión actual en un Server Component
 */
export async function getAuthSession() {
  const supabase = getSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Obtiene el usuario actual en un Server Component
 */
export async function getCurrentUser() {
  const session = await getAuthSession()
  if (!session?.user) return null

  const supabase = getSupabaseServer()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email || "",
    profile,
  }
}
