import sharp from 'sharp'

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

export interface ResponsiveImageSizes {
  mobile: string // 640px
  tablet: string // 1024px
  desktop: string // 1536px
}

export interface BlurPlaceholderResult {
  placeholder: string // base64 data URL
  width: number
  height: number
}

/**
 * Generar placeholder desenfocado (LQIP - Low Quality Image Placeholder)
 */
export async function generateBlurPlaceholder(
  imageBuffer: Buffer,
  width: number = 20,
  height: number = 20
): Promise<BlurPlaceholderResult> {
  try {
    // Obtener dimensiones originales
    const metadata = await sharp(imageBuffer).metadata()
    const aspectRatio = (metadata.width || 1) / (metadata.height || 1)

    // Calcular altura basada en aspect ratio
    const placeholderHeight = Math.round(width / aspectRatio)

    // Crear imagen pequeña desenfocada
    const blurredBuffer = await sharp(imageBuffer)
      .resize(width, placeholderHeight, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .blur(10)
      .toBuffer()

    // Convertir a base64
    const placeholder = `data:image/jpeg;base64,${blurredBuffer.toString('base64')}`

    return {
      placeholder,
      width: metadata.width || width,
      height: metadata.height || placeholderHeight,
    }
  } catch (error) {
    console.error('Error generating blur placeholder:', error)
    // Retornar placeholder vacío en caso de error
    return {
      placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3N2Zz4=',
      width: 20,
      height: 20,
    }
  }
}

/**
 * Optimizar imagen para web
 */
export async function optimizeForWeb(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  try {
    const {
      width = 1200,
      height,
      quality = 80,
      format = 'webp',
      fit = 'cover',
    } = options

    let transform = sharp(imageBuffer)

    // Redimensionar
    if (width || height) {
      transform = transform.resize(width, height, {
        fit,
        withoutEnlargement: true,
      })
    }

    // Convertir formato
    switch (format) {
      case 'webp':
        transform = transform.webp({ quality })
        break
      case 'avif':
        transform = transform.avif({ quality })
        break
      case 'jpeg':
        transform = transform.jpeg({ quality, progressive: true })
        break
      case 'png':
        transform = transform.png({ compressionLevel: 9 })
        break
    }

    return await transform.toBuffer()
  } catch (error) {
    console.error('Error optimizing image:', error)
    return imageBuffer
  }
}

/**
 * Generar múltiples tamaños responsivos
 */
export async function generateResponsiveSizes(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<{
  mobile: Buffer
  tablet: Buffer
  desktop: Buffer
  original: Buffer
}> {
  try {
    const { quality = 80, format = 'webp', fit = 'cover' } = options

    const [mobile, tablet, desktop, original] = await Promise.all([
      // Mobile: 640px
      sharp(imageBuffer)
        .resize(640, undefined, {
          fit,
          withoutEnlargement: true,
        })
        .toFormat(format)
        .toBuffer(),

      // Tablet: 1024px
      sharp(imageBuffer)
        .resize(1024, undefined, {
          fit,
          withoutEnlargement: true,
        })
        .toFormat(format)
        .toBuffer(),

      // Desktop: 1536px
      sharp(imageBuffer)
        .resize(1536, undefined, {
          fit,
          withoutEnlargement: true,
        })
        .toFormat(format)
        .toBuffer(),

      // Original para fallback
      imageBuffer,
    ])

    return { mobile, tablet, desktop, original }
  } catch (error) {
    console.error('Error generating responsive sizes:', error)
    return {
      mobile: imageBuffer,
      tablet: imageBuffer,
      desktop: imageBuffer,
      original: imageBuffer,
    }
  }
}

/**
 * Convertir imagen a WebP
 */
export async function convertToWebP(
  imageBuffer: Buffer,
  quality: number = 80
): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .webp({ quality })
      .toBuffer()
  } catch (error) {
    console.error('Error converting to WebP:', error)
    return imageBuffer
  }
}

/**
 * Convertir imagen a AVIF (formato más moderno)
 */
export async function convertToAVIF(
  imageBuffer: Buffer,
  quality: number = 75
): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .avif({ quality })
      .toBuffer()
  } catch (error) {
    console.error('Error converting to AVIF:', error)
    return imageBuffer
  }
}

/**
 * Obtener metadatos de imagen
 */
export async function getImageMetadata(imageBuffer: Buffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata()
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: imageBuffer.length,
      aspectRatio: (metadata.width || 1) / (metadata.height || 1),
    }
  } catch (error) {
    console.error('Error getting image metadata:', error)
    return null
  }
}

/**
 * Generar srcset HTML
 */
export function generateSrcSet(basePath: string, sizes: ResponsiveImageSizes): string {
  return `
    ${basePath}?size=mobile 640w,
    ${basePath}?size=tablet 1024w,
    ${basePath}?size=desktop 1536w
  `.trim()
}

/**
 * Generar picture element para máximo soporte
 */
export function generatePictureElement(
  basePath: string,
  alt: string,
  sizes: ResponsiveImageSizes
): string {
  return `
    <picture>
      <source 
        srcset="${basePath}?format=avif&size=mobile 640w,
                ${basePath}?format=avif&size=tablet 1024w,
                ${basePath}?format=avif&size=desktop 1536w"
        type="image/avif"
      />
      <source 
        srcset="${basePath}?format=webp&size=mobile 640w,
                ${basePath}?format=webp&size=tablet 1024w,
                ${basePath}?format=webp&size=desktop 1536w"
        type="image/webp"
      />
      <img 
        src="${basePath}?size=desktop"
        alt="${alt}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `.trim()
}

/**
 * Lazy load images (client-side)
 */
export function setupLazyLoading(imageElements: NodeListOf<HTMLImageElement>): void {
  if (!('IntersectionObserver' in window)) {
    // Fallback para navegadores antiguos
    imageElements.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src
      }
    })
    return
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement

        // Cargar imagen
        if (img.dataset.src) {
          img.src = img.dataset.src
        }

        // Cargar srcset
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset
        }

        // Marcar como cargada
        img.classList.add('loaded')

        // Dejar de observar
        observer.unobserve(img)
      }
    })
  })

  imageElements.forEach((img) => imageObserver.observe(img))
}

/**
 * Obtener soporte de formato de imagen
 */
export async function checkImageFormatSupport(): Promise<{
  webp: boolean
  avif: boolean
  heic: boolean
}> {
  if (typeof window === 'undefined') {
    return { webp: true, avif: false, heic: false }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  return {
    webp: canvas.toDataURL('image/webp') !== canvas.toDataURL('image/png'),
    avif: false, // Detectar en runtime del navegador
    heic: false, // No soportado en web
  }
}

/**
 * Calcular peso de imagen optimizada
 */
export function calculateCompressionRatio(
  originalSize: number,
  optimizedSize: number
): number {
  if (originalSize === 0) return 0
  return ((originalSize - optimizedSize) / originalSize) * 100
}

/**
 * Generar srcset para resoluciones de densidad de píxeles (1x, 2x, 3x)
 */
export function generateDensitySrcSet(basePath: string): string {
  return `
    ${basePath}?dpr=1 1x,
    ${basePath}?dpr=2 2x,
    ${basePath}?dpr=3 3x
  `.trim()
}

/**
 * Validar imagen
 */
export async function validateImage(
  imageBuffer: Buffer
): Promise<{ valid: boolean; error?: string }> {
  try {
    const metadata = await sharp(imageBuffer).metadata()

    if (!metadata.width || !metadata.height) {
      return { valid: false, error: 'Invalid image dimensions' }
    }

    if (
      !['jpeg', 'png', 'webp', 'gif', 'avif', 'heic'].includes(
        metadata.format || ''
      )
    ) {
      return { valid: false, error: 'Unsupported image format' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: `Invalid image: ${error}` }
  }
}
