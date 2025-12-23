'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createAdminClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  adminLoading: boolean;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const { authUser, loading: authLoading } = useAuth();

  const checkAdminStatus = async () => {
    if (!authUser) {
      console.log('[AdminContext] No authUser, setting isAdmin=false');
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    console.log('[AdminContext] Checking admin status for user:', authUser.id);

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', authUser.id)
        .single();

      console.log('[AdminContext] Query result:', { data, error });

      if (error) {
        console.error('[AdminContext] Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        const adminStatus = data?.is_admin || false;
        console.log('[AdminContext] Setting isAdmin to:', adminStatus);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error('[AdminContext] Exception checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  // Verificar estado de admin cuando cambia el usuario autenticado
  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authUser, authLoading]);

  return (
    <AdminContext.Provider value={{ isAdmin, adminLoading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
