import { MetadataRoute } from 'next'

interface SitemapURL {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/**
 * Generar sitemap dinámico
 * Se ejecuta en el servidor Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://burgerank.com'

  // URLs estáticas
  const staticUrls: SitemapURL[] = [
    {
      url: '',
      priority: 1.0,
      changeFrequency: 'daily',
    },
    {
      url: '/ranking',
      priority: 0.9,
      changeFrequency: 'hourly',
    },
    {
      url: '/search',
      priority: 0.8,
      changeFrequency: 'daily',
    },
    {
      url: '/about',
      priority: 0.7,
      changeFrequency: 'monthly',
    },
    {
      url: '/contact',
      priority: 0.6,
      changeFrequency: 'monthly',
    },
    {
      url: '/blog',
      priority: 0.7,
      changeFrequency: 'weekly',
    },
    {
      url: '/faq',
      priority: 0.6,
      changeFrequency: 'monthly',
    },
  ]

  // Obtener top burgers (dinámico)
  const topBurgers = await fetchTopBurgers(100)
  const burgerUrls: SitemapURL[] = topBurgers.map((burger) => ({
    url: `/burger/${burger.id}`,
    priority: Math.min(0.8, 0.5 + (burger.rating / 10) * 0.3),
    changeFrequency: 'weekly',
  }))

  // Obtener todos los restaurantes
  const restaurants = await fetchRestaurants()
  const restaurantUrls: SitemapURL[] = restaurants.map((restaurant) => ({
    url: `/restaurant/${restaurant.id}`,
    priority: 0.7,
    changeFrequency: 'weekly',
  }))

  // Obtener artículos del blog
  const blogPosts = await fetchBlogPosts()
  const blogUrls: SitemapURL[] = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    priority: 0.6,
    changeFrequency: 'weekly',
  }))

  // Combinar todas las URLs
  const allUrls = [...staticUrls, ...burgerUrls, ...restaurantUrls, ...blogUrls]

  // Convertir a formato esperado
  return allUrls.map((item) => ({
    url: `${baseUrl}${item.url}`,
    lastModified: item.lastModified || new Date(),
    changeFrequency: item.changeFrequency || 'weekly',
    priority: item.priority || 0.5,
  }))
}

/**
 * Obtener top burgers de la base de datos
 */
async function fetchTopBurgers(limit: number = 100) {
  try {
    // Aquí va la llamada a tu base de datos (Supabase)
    // Ejemplo:
    /*
    const { data } = await supabase
      .from('burgers')
      .select('id, name, rating')
      .order('rating', { ascending: false })
      .limit(limit)

    return data || []
    */

    // Para esta demostración, retornar array vacío
    return []
  } catch (error) {
    console.error('Error fetching top burgers for sitemap:', error)
    return []
  }
}

/**
 * Obtener todos los restaurantes
 */
async function fetchRestaurants() {
  try {
    // Llamada a base de datos
    /*
    const { data } = await supabase
      .from('restaurants')
      .select('id, name')
      .order('created_at', { ascending: false })

    return data || []
    */

    return []
  } catch (error) {
    console.error('Error fetching restaurants for sitemap:', error)
    return []
  }
}

/**
 * Obtener posts del blog
 */
async function fetchBlogPosts() {
  try {
    // Llamada a base de datos o CMS
    /*
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug')
      .eq('published', true)
      .order('created_at', { ascending: false })

    return data || []
    */

    return []
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    return []
  }
}
