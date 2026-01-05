'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUrlChange: (url: string) => void;
  currentUrl?: string;
  folder?: 'burgers' | 'restaurants'; // burgers o restaurants
  maxSize?: number; // en MB
  aspect?: 'square' | 'banner' | 'auto'; // Para preview
}

export function ImageUploader({
  onUrlChange,
  currentUrl,
  folder = 'burgers',
  maxSize = 5,
  aspect = 'auto',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar preview cuando cambia currentUrl (ej: al editar otro item)
  useEffect(() => {
    setPreview(currentUrl || null);
    setError(null);
    setSuccess(false);
  }, [currentUrl]);

  const aspectRatios = {
    square: 'aspect-square',
    banner: 'aspect-video',
    auto: 'aspect-auto',
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSuccess(false);

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten JPEG, PNG, WebP y GIF');
      return;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`El archivo es muy grande. Máximo ${maxSize}MB`);
      return;
    }

    // Mostrar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error en la subida');
      }

      const data = await response.json();
      onUrlChange(data.url);
      setSuccess(true);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Preview */}
      {preview && (
        <div 
          className="relative rounded-lg overflow-hidden border-2 border-gray-600" 
          style={{ backgroundColor: '#374151' }}
          onClick={(e) => {
            // Prevenir que clicks en la preview abran el selector de archivos
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={`relative w-full ${aspectRatios[aspect]} min-h-[150px]`} style={{ backgroundColor: '#1f2937' }}>
            {/* Usar img nativo para data URLs y Image para URLs remotas */}
            {preview.startsWith('data:') ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                style={{ maxHeight: '250px', pointerEvents: 'none' }}
              />
            ) : (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={preview.startsWith('data:')}
                style={{ pointerEvents: 'none' }}
                onError={() => {
                  setError('No se puede cargar la imagen');
                }}
              />
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreview(null);
              onUrlChange('');
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors z-10"
            type="button"
            style={{ pointerEvents: 'auto' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area - Adaptado para tema oscuro */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed',
          borderColor: uploading ? '#3b82f6' : error ? '#dc2626' : success ? '#10b981' : '#4b5563',
          backgroundColor: uploading ? '#1e3a5f' : error ? '#450a0a' : success ? '#052e16' : '#1f2937',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!uploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={32} style={{ color: '#3b82f6' }} className="animate-spin" />
            <p style={{ fontSize: '0.875rem', color: '#93c5fd' }}>Subiendo imagen...</p>
          </div>
        ) : success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
            <p style={{ fontSize: '0.875rem', color: '#6ee7b7' }}>¡Imagen subida correctamente!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={32} style={{ color: '#9ca3af' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e5e7eb' }}>
              Arrastra una imagen aquí o{' '}
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                haz clic para seleccionar
              </span>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              JPEG, PNG, WebP o GIF • Máximo {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          backgroundColor: '#450a0a', 
          border: '1px solid #dc2626', 
          borderRadius: '0.5rem', 
          padding: '0.75rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: '#fca5a5' }}>{error}</p>
        </div>
      )}

      {/* URL Display - Solo mostrar si es una URL real, no data: */}
      {preview && !uploading && !error && !preview.startsWith('data:') && (
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '0.5rem', 
          padding: '0.75rem',
          border: '1px solid #374151'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>URL de la imagen:</p>
          <code style={{ fontSize: '0.75rem', color: '#10b981', wordBreak: 'break-all' }}>{preview}</code>
        </div>
      )}
    </div>
  );
}
