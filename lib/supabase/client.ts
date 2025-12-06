import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/database.types"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Obtiene o crea una instancia del cliente de Supabase para componentes cliente
 * Esta función debe usarse SOLO en Client Components
 */
export function getSupabaseClient() {
  if (typeof window === "undefined") return null

  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
}

/**
 * Reinicializa el cliente (útil para refrescar la sesión)
 */
export function resetSupabaseClient() {
  supabaseClient = null
}
