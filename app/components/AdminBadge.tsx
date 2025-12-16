'use client';

import { useAdmin } from '@/app/contexts/AdminContext';
import './AdminBadge.css';

export function AdminBadge() {
  const { isAdmin, logoutAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="admin-badge">
      <span className="admin-badge-icon">👑</span>
      <span className="admin-badge-text">Modo Admin Activo</span>
      <button 
        className="admin-badge-logout" 
        onClick={logoutAdmin}
        title="Cerrar sesión admin"
      >
        ✕
      </button>
    </div>
  );
}
