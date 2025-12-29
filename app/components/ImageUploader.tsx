'use client';

import React, { useState, useRef } from 'react';
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
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
          <div className={`relative w-full ${aspectRatios[aspect]} bg-gray-100`}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                setError('No se puede cargar la imagen');
              }}
            />
          </div>
          <button
            onClick={() => {
              setPreview(null);
              onUrlChange('');
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          uploading
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-400 bg-red-50'
            : success
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
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
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={32} className="text-green-500" />
            <p className="text-sm text-green-600">¡Imagen subida correctamente!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Arrastra una imagen aquí o{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-blue-500 hover:underline font-semibold"
                type="button"
              >
                selecciona una
              </button>
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG, WebP o GIF • Máximo {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* URL Display */}
      {preview && !uploading && !error && (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">URL de la imagen:</p>
          <code className="text-xs text-gray-700 break-all">{preview}</code>
        </div>
      )}
    </div>
  );
}
