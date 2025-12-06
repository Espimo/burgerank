/**
 * Comprime una imagen redimensionándola y convirtiéndola a WebP si es posible
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Usar WebP si el navegador lo soporta, sino JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir imagen'))
              return
            }

            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Error al cargar imagen'))
      }

      img.src = event.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Error al leer archivo'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Comprime múltiples imágenes en paralelo
 */
export async function compressImages(
  files: File[],
  maxWidth?: number,
  maxHeight?: number,
  quality?: number
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, maxWidth, maxHeight, quality)))
}

/**
 * Calcula el tamaño de archivo en MB
 */
export function getFileSizeMB(file: File): number {
  return Math.round((file.size / 1024 / 1024) * 100) / 100
}
