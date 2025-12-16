'use client';

import { useState } from 'react';
import { useAdminData, Burger } from '@/app/hooks/useAdminData';
import './AdminEditBurgerModal.css';

interface AdminEditBurgerModalProps {
  burger: Burger;
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function AdminEditBurgerModal({
  burger,
  restaurantId,
  isOpen,
  onClose,
  onSave
}: AdminEditBurgerModalProps) {
  const { updateBurger } = useAdminData();
  const [formData, setFormData] = useState<Burger>(burger);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof Burger, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBurger(formData);
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
          <h2>🍔 Editar Hamburguesa</h2>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        {saved ? (
          <div className="admin-modal-success">
            ✅ Cambios guardados exitosamente
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-modal-form">
            <div className="admin-form-group">
              <label>Nombre de la Hamburguesa</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Descripción</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Tipo</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  placeholder="premium, clásica, vegana..."
                />
              </div>
              <div className="admin-form-group">
                <label>Calificación (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Tags (separados por comas)</label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
                placeholder="Jugosa, Premium, Carne Fresca..."
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
