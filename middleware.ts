import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Database } from "@/types/database.types"

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const pathname = requestUrl.pathname

  // Rutas públicas que no necesitan autenticación
  const publicRoutes = ["/", "/login", "/register", "/about", "/forgot-password"]

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/ranking", "/rate", "/rewards", "/profile", "/messages", "/follows"]

  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Obtener sesión
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Si el usuario está autenticado
    if (session?.user) {
      // Redirige a /ranking si intenta acceder a rutas de auth
      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/ranking", requestUrl))
      }

      // Si intenta acceder a /forgot-password cuando está autenticado
      if (pathname === "/forgot-password") {
        return NextResponse.redirect(new URL("/ranking", requestUrl))
      }

      // Continúa a la ruta solicitada
      return supabaseResponse
    }

    // Si el usuario NO está autenticado
    // Protege rutas que requieren autenticación
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", requestUrl))
    }

    // Continúa a rutas públicas
    return supabaseResponse
  } catch (error) {
    console.error("Middleware error:", error)
    // En caso de error, permite continuar
    return NextResponse.next()
  }
}

// Configura en qué rutas ejecutar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
