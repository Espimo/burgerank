import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Rutas que siempre están permitidas (públicas)
  const publicRoutes = [
    '/ranking',
    '/about',
    '/auth/signin',
    '/auth/signup',
    '/auth/verify-email',
    '/auth/reset-password',
    '/',
  ];

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Rutas de API
  const isApiRoute = pathname.startsWith('/api/');

  // Si es ruta pública o API, permitir
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Para cualquier otra ruta, simplemente permitir
  // (El AuthContext en el cliente manejará la protección)
  return NextResponse.next();
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

