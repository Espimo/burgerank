"use client"

import { getSupabaseClient } from "./client"
import { UploadOptions, StorageError } from "@/types"

const BUCKET_CONFIGS = {
  avatars: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  "burger-photos": {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  receipts: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
}

/**
 * Sube una imagen a Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: "avatars" | "burger-photos" | "receipts",
  path: string
): Promise<{ url: string | null; error: StorageError | null }> {
  try {
    const config = BUCKET_CONFIGS[bucket]

    // Validar tamaño
    if (file.size > config.maxSize) {
      return {
        url: null,
        error: {
          message: `File size exceeds ${config.maxSize / 1024 / 1024}MB limit`,
          statusCode: 400,
        },
      }
    }

    // Validar tipo
    if (!config.allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: {
          message: `File type ${file.type} is not allowed`,
          statusCode: 400,
        },
      }
    }

    const supabase = getSupabaseClient()

    // Generar nombre único
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
    const fullPath = `${path}/${fileName}`

    // Subir archivo
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      url: publicUrlData.publicUrl,
      error: null,
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      url: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to upload image",
        statusCode: 500,
      },
    }
  }
}

/**
 * Elimina una imagen de Supabase Storage
 */
export async function deleteImage(
  path: string,
  bucket: "avatars" | "burger-photos" | "receipts"
): Promise<{ success: boolean; error: StorageError | null }> {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete image",
        statusCode: 500,
      },
    }
  }
}

/**
 * Obtiene la URL pública de una imagen
 */
export function getPublicUrl(
  path: string,
  bucket: "avatars" | "burger-photos" | "receipts"
): string {
  const supabase = getSupabaseClient()

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}

/**
 * Sube múltiples imágenes
 */
export async function uploadImages(
  files: File[],
  bucket: "avatars" | "burger-photos" | "receipts",
  path: string
): Promise<{ urls: string[]; errors: StorageError[] }> {
  const urls: string[] = []
  const errors: StorageError[] = []

  for (const file of files) {
    const { url, error } = await uploadImage(file, bucket, path)

    if (error) {
      errors.push(error)
    } else if (url) {
      urls.push(url)
    }
  }

  return { urls, errors }
}

/**
 * Valida si un archivo puede ser subido
 */
export function validateFile(
  file: File,
  bucket: "avatars" | "burger-photos" | "receipts"
): { valid: boolean; error?: string } {
  const config = BUCKET_CONFIGS[bucket]

  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${config.maxSize / 1024 / 1024}MB limit`,
    }
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(", ")}`,
    }
  }

  return { valid: true }
}
