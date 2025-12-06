export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  image?: string
  url: string
  type: 'website' | 'article' | 'product'
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

/**
 * Generar metadata para página
 */
export function generateMetadata(
  title: string,
  description: string,
  options: {
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article' | 'product'
    author?: string
    publishedDate?: string
  } = {}
): SEOMetadata {
  return {
    title,
    description,
    keywords: options.keywords || [],
    image: options.image,
    url: options.url || '',
    type: options.type || 'website',
    author: options.author,
    publishedDate: options.publishedDate,
    modifiedDate: new Date().toISOString(),
  }
}

/**
 * Generar structured data para Organization
 */
export function generateOrganizationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BurgeRank',
    description: 'Ranking de hamburguesas más deliciosas',
    url: 'https://burgerank.com',
    logo: 'https://burgerank.com/logo.png',
    sameAs: [
      'https://twitter.com/burgerank',
      'https://instagram.com/burgerank',
      'https://facebook.com/burgerank',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@burgerank.com',
    },
  }
}

/**
 * Generar structured data para Burger
 */
export function generateBurgerStructuredData(burger: {
  id: string
  name: string
  description: string
  image: string
  rating: number
  ratingCount: number
  restaurantName: string
  price?: number
  currency?: string
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: burger.name,
    description: burger.description,
    image: burger.image,
    brand: {
      '@type': 'Brand',
      name: burger.restaurantName,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: burger.rating,
      ratingCount: burger.ratingCount,
      bestRating: '10',
      worstRating: '1',
    },
    ...(burger.price && {
      offers: {
        '@type': 'Offer',
        price: burger.price,
        priceCurrency: burger.currency || 'USD',
      },
    }),
  }
}

/**
 * Generar structured data para Restaurant
 */
export function generateRestaurantStructuredData(restaurant: {
  id: string
  name: string
  description: string
  image: string
  address: string
  phone: string
  url?: string
  rating: number
  ratingCount: number
  priceRange?: string
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
    },
    telephone: restaurant.phone,
    url: restaurant.url || `https://burgerank.com/restaurant/${restaurant.id}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      ratingCount: restaurant.ratingCount,
      bestRating: '10',
      worstRating: '1',
    },
    ...(restaurant.priceRange && {
      priceRange: restaurant.priceRange,
    }),
  }
}

/**
 * Generar structured data para Review
 */
export function generateReviewStructuredData(review: {
  id: string
  burgerId: string
  burgerName: string
  authorName: string
  rating: number
  text: string
  datePublished: string
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: review.burgerName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '10',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: review.authorName,
    },
    reviewBody: review.text,
    datePublished: review.datePublished,
  }
}

/**
 * Generar structured data para FAQPage
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generar structured data para BreadcrumbList
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generar sitemap.xml
 */
export function generateSitemap(urls: Array<{
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}>): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://burgerank.com'

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    ${item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : ''}
    ${item.priority ? `<priority>${item.priority}</priority>` : '<priority>0.5</priority>'}
  </url>`
    )
    .join('\n')}
</urlset>`
}

/**
 * Generar robots.txt
 */
export function generateRobotsTxt(sitemapUrl: string = '/sitemap.xml'): string {
  return `# BurgeRank Robots.txt
User-agent: *
Allow: /
Allow: /ranking
Allow: /search
Allow: /about
Allow: /restaurant/*
Allow: /burger/*

Disallow: /profile/settings
Disallow: /admin
Disallow: /api/
Disallow: /_next/
Disallow: /internal/
Disallow: /rate (allow authenticated only)

# Crawl delay
Crawl-delay: 0.1

# Sitemap
Sitemap: https://burgerank.com${sitemapUrl}

# Google Search Console
User-agent: Googlebot
Crawl-delay: 0.05
Allow: /

# Bing
User-agent: Bingbot
Crawl-delay: 1
Allow: /
`
}

/**
 * Inyectar meta tags en head
 */
export function injectMetaTags(metadata: SEOMetadata): void {
  if (typeof document === 'undefined') return

  const head = document.head

  // Title
  const titleTag = document.querySelector('title')
  if (titleTag) {
    titleTag.textContent = metadata.title
  }

  // Description
  setOrCreateMetaTag('description', metadata.description)

  // Keywords
  if (metadata.keywords.length > 0) {
    setOrCreateMetaTag('keywords', metadata.keywords.join(', '))
  }

  // Open Graph
  setOrCreateMetaTag('og:title', metadata.title, 'property')
  setOrCreateMetaTag('og:description', metadata.description, 'property')
  if (metadata.image) {
    setOrCreateMetaTag('og:image', metadata.image, 'property')
  }
  setOrCreateMetaTag('og:url', metadata.url, 'property')
  setOrCreateMetaTag('og:type', metadata.type, 'property')

  // Twitter
  setOrCreateMetaTag('twitter:title', metadata.title, 'name')
  setOrCreateMetaTag('twitter:description', metadata.description, 'name')
  if (metadata.image) {
    setOrCreateMetaTag('twitter:image', metadata.image, 'name')
  }
  setOrCreateMetaTag('twitter:card', 'summary_large_image', 'name')

  // Article specific
  if (metadata.type === 'article') {
    if (metadata.publishedDate) {
      setOrCreateMetaTag('article:published_time', metadata.publishedDate, 'property')
    }
    if (metadata.modifiedDate) {
      setOrCreateMetaTag('article:modified_time', metadata.modifiedDate, 'property')
    }
    if (metadata.author) {
      setOrCreateMetaTag('article:author', metadata.author, 'property')
    }
  }
}

/**
 * Helper para crear/actualizar meta tag
 */
function setOrCreateMetaTag(
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name'
): void {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

/**
 * Inyectar structured data
 */
export function injectStructuredData(data: StructuredData): void {
  if (typeof document === 'undefined') return

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Generar canonical link
 */
export function setCanonicalUrl(url: string): void {
  if (typeof document === 'undefined') return

  let link = document.querySelector('link[rel="canonical"]')

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', url)
}

/**
 * Validar SEO de página
 */
export function validatePageSEO(metadata: SEOMetadata): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Title
  if (!metadata.title || metadata.title.length === 0) {
    issues.push('❌ Title is missing')
  } else if (metadata.title.length < 30) {
    issues.push('⚠️ Title is too short (< 30 chars)')
  } else if (metadata.title.length > 60) {
    issues.push('⚠️ Title is too long (> 60 chars)')
  }

  // Description
  if (!metadata.description || metadata.description.length === 0) {
    issues.push('❌ Meta description is missing')
  } else if (metadata.description.length < 120) {
    issues.push('⚠️ Meta description is too short (< 120 chars)')
  } else if (metadata.description.length > 160) {
    issues.push('⚠️ Meta description is too long (> 160 chars)')
  }

  // Keywords
  if (metadata.keywords.length === 0) {
    issues.push('⚠️ Keywords are missing')
  } else if (metadata.keywords.length > 10) {
    issues.push('⚠️ Too many keywords (> 10)')
  }

  // Image
  if (!metadata.image) {
    issues.push('⚠️ OG image is missing')
  }

  // URL
  if (!metadata.url) {
    issues.push('❌ URL is missing')
  }

  return {
    valid: issues.filter((i) => i.startsWith('❌')).length === 0,
    issues,
  }
}
