import crypto from 'crypto'

export interface QRData {
  code: string
  timestamp: number
  expiresAt: number
}

/**
 * Genera un código QR único para un premio canjeado
 */
export function generateQRCode(rewardId: string, userId: string): QRData {
  const timestamp = Date.now()
  const expiresAt = timestamp + 30 * 24 * 60 * 60 * 1000 // 30 días

  // Generar token aleatorio único
  const randomBytes = crypto.randomBytes(16).toString('hex')
  const code = `BURGER-RANK-${rewardId}-${userId}-${timestamp}-${randomBytes}`.toUpperCase()

  return {
    code,
    timestamp,
    expiresAt,
  }
}

/**
 * Valida el formato de un código QR
 */
export function validateQRCode(code: string): boolean {
  // Formato: BURGER-RANK-{rewardId}-{userId}-{timestamp}-{randomBytes}
  const pattern = /^BURGER-RANK-[A-Z0-9]+-[A-Z0-9]+-\d+-[A-F0-9]+$/

  if (!pattern.test(code)) {
    return false
  }

  try {
    const parts = code.split('-')
    if (parts.length < 5) return false

    // Validar timestamp
    const timestamp = parseInt(parts[3], 10)
    if (isNaN(timestamp)) return false

    return true
  } catch {
    return false
  }
}

/**
 * Extrae información del código QR
 */
export function decodeQRCode(code: string): {
  rewardId: string
  userId: string
  timestamp: number
} | null {
  if (!validateQRCode(code)) {
    return null
  }

  try {
    const parts = code.split('-')
    return {
      rewardId: parts[2],
      userId: parts[3],
      timestamp: parseInt(parts[4], 10),
    }
  } catch {
    return null
  }
}

/**
 * Verifica si un código QR ha expirado
 */
export function isQRExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt
}

/**
 * Calcula días restantes antes de expiración
 */
export function getDaysUntilExpiration(expiresAt: number): number {
  const daysMs = expiresAt - Date.now()
  return Math.max(0, Math.ceil(daysMs / (24 * 60 * 60 * 1000)))
}
