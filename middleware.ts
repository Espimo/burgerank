import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Rutas de autenticación (solo acceso sin autenticación)
    const authRoutes = ['/auth/signin', '/auth/signup', '/auth/verify-email'];
    const isAuthRoute = authRoutes.some(route => 
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
    );

    // Rutas públicas - accesibles sin autenticación
    const publicRoutes = [
      '/auth/signin', 
      '/auth/signup', 
      '/auth/verify-email', 
      '/auth/reset-password', 
      '/ranking',           // Ranking es público
      '/about',             // About es público
      '/',
    ];
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
    );

    // Rutas que no requieren protección (imágenes, assets, etc)
    const unprotectedPaths = ['/_next/', '/favicon.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const isUnprotectedPath = unprotectedPaths.some(path => request.nextUrl.pathname.includes(path));

    // Rutas de API públicas
    const publicApiRoutes = ['/api/auth'];
    const isPublicApiRoute = publicApiRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Si NO está autenticado y accede a ruta PROTEGIDA, redirigir a ranking (pública)
    if (!user && !isPublicRoute && !isUnprotectedPath && !isPublicApiRoute && !request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/ranking', request.url));
    }

    // Si está autenticado y accede a rutas de AUTH (signup/signin), redirigir a ranking
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/ranking', request.url));
    }

    return supabaseResponse;
  } catch (error) {
    // En caso de error, permitir la solicitud pasar
    console.error('Middleware error:', error);
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    /*
     * Excluir:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

