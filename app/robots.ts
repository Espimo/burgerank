import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://burgerank.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ranking',
          '/search',
          '/about',
          '/restaurant/',
          '/burger/',
          '/blog/',
        ],
        disallow: [
          '/profile/settings',
          '/admin',
          '/api/',
          '/internal/',
          '/_next/',
          '/rate', // Requiere autenticación
          '/profile/edit',
          '/notifications',
          '/.well-known/admin.json',
          '/private',
        ],
      },
      // Reglas específicas para Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/ranking',
          '/search',
          '/about',
          '/restaurant/',
          '/burger/',
          '/blog/',
        ],
        disallow: ['/admin', '/api/', '/internal/'],
        crawlDelay: 0.5,
      },
      // Reglas específicas para Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/ranking',
          '/search',
          '/about',
          '/restaurant/',
          '/burger/',
          '/blog/',
        ],
        disallow: ['/admin', '/api/', '/internal/'],
        crawlDelay: 1,
      },
      // Bloquear bots maliciosos conocidos
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
