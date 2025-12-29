import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

// Singleton para evitar múltiples instancias
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (browserClient) return browserClient;
  
  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return browserClient;
}

// Client without strict typing for admin operations (also singleton)
let adminBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createAdminClient() {
  if (adminBrowserClient) return adminBrowserClient;
  
  adminBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return adminBrowserClient;
}

// Utilidad para reiniciar clientes (útil para logout)
export function resetClients() {
  browserClient = null;
  adminBrowserClient = null;
}