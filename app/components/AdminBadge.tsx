'use client';

import { useAdmin } from '@/app/contexts/AdminContext';
import Link from 'next/link';
import './AdminBadge.css';

export function AdminBadge() {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className="admin-badge">
      <span className="admin-badge-icon">👑</span>
      <span className="admin-badge-text">Admin</span>
    </Link>
  );
}
