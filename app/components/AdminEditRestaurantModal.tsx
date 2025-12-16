'use client';

import { useState } from 'react';
import { useAdminData, Restaurant } from '@/app/hooks/useAdminData';
import './AdminEditRestaurantModal.css';

interface AdminEditRestaurantModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function AdminEditRestaurantModal({
  restaurant,
  isOpen,
  onClose,
  onSave
}: AdminEditRestaurantModalProps) {
  const { updateRestaurant } = useAdminData();
  const [formData, setFormData] = useState<Restaurant>(restaurant);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof Restaurant, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      onSave?.();
    }, 1500);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>✏️ Editar Restaurante</h2>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        {saved ? (
          <div className="admin-modal-success">
            ✅ Cambios guardados exitosamente
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-modal-form">
            <div className="admin-form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Horario</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  placeholder="12:00-23:30"
                />
              </div>
              <div className="admin-form-group">
                <label>Sitio Web</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="www.example.es"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Descripción</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="admin-modal-buttons">
              <button type="submit" className="admin-btn-save">
                💾 Guardar Cambios
              </button>
              <button type="button" className="admin-btn-cancel" onClick={onClose}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
