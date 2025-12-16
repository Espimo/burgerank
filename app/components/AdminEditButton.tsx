'use client';

import { useAdmin } from '@/app/contexts/AdminContext';

interface AdminEditButtonProps {
  label?: string;
  onClick: () => void;
  icon?: string;
}

export function AdminEditButton({ label = 'Editar', onClick, icon = '✏️' }: AdminEditButtonProps) {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <button
      onClick={onClick}
      className="admin-edit-button"
      title="Solo visible para admin"
    >
      {icon} {label}
    </button>
  );
}
