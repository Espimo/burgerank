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

    // Rutas públicas
    const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/verify-email', '/auth/reset-password', '/'];
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'));

    // Rutas que no requieren protección (imágenes, assets, etc)
    const unprotectedPaths = ['/_next/', '/favicon.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const isUnprotectedPath = unprotectedPaths.some(path => request.nextUrl.pathname.includes(path));

    // Rutas de API públicas
    const publicApiRoutes = ['/api/auth'];
    const isPublicApiRoute = publicApiRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Si es una ruta protegida y no está autenticado, redirigir a login
    if (!user && !isPublicRoute && !isUnprotectedPath && !isPublicApiRoute && !request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Si está autenticado y accede a rutas de auth, redirigir a ranking
    if (user && isPublicRoute && request.nextUrl.pathname !== '/') {
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

