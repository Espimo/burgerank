'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUrlChange: (url: string) => void;
  currentUrl?: string;
  folder?: 'burgers' | 'restaurants';
  maxSize?: number;
}

export function ImageUploader({
  onUrlChange,
  currentUrl,
  folder = 'burgers',
  maxSize = 5,
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar cuando cambia currentUrl
  useEffect(() => {
    setImageUrl(currentUrl || '');
    setError(null);
    setSuccess(false);
  }, [currentUrl]);

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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la subida');
      }

      // Actualizar URL con la imagen subida
      setImageUrl(data.url);
      onUrlChange(data.url);
      setSuccess(true);

      // Limpiar éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
    // Reset input para permitir seleccionar el mismo archivo
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onUrlChange('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />

      {/* Preview de imagen actual */}
      {imageUrl && (
        <div style={{
          position: 'relative',
          marginBottom: '1rem',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: '2px solid #4b5563',
          backgroundColor: '#1f2937',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Imagen actual"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Área de upload */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed',
          borderColor: uploading ? '#3b82f6' : error ? '#dc2626' : success ? '#10b981' : '#4b5563',
          backgroundColor: uploading ? '#1e3a5f' : error ? '#450a0a' : success ? '#052e16' : '#1f2937',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={32} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: '#93c5fd', margin: 0 }}>Subiendo imagen...</p>
          </div>
        ) : success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
            <p style={{ fontSize: '0.875rem', color: '#6ee7b7', margin: 0 }}>¡Imagen subida correctamente!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Upload size={32} style={{ color: '#9ca3af' }} />
            <p style={{ fontSize: '0.875rem', color: '#e5e7eb', margin: 0 }}>
              Arrastra una imagen aquí
            </p>
            <button
              type="button"
              onClick={handleButtonClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Seleccionar archivo
            </button>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
              JPEG, PNG, WebP o GIF • Máximo {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: '#450a0a',
          border: '1px solid #dc2626',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <AlertCircle size={16} style={{ color: '#fca5a5', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: '#fca5a5', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* URL de la imagen */}
      {imageUrl && !error && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 0.25rem 0' }}>URL:</p>
          <code style={{ fontSize: '0.7rem', color: '#10b981', wordBreak: 'break-all' }}>{imageUrl}</code>
        </div>
      )}
    </div>
  );
}
