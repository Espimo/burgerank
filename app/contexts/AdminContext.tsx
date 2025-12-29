'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Usar ref para el cliente (singleton)
  const supabaseRef = useRef(createAdminClient());
  const lastCheckedUserId = useRef<string | null>(null);

  const checkAdminStatus = useCallback(async () => {
    if (!authUser) {
      console.log('[Admin] No authUser, setting isAdmin=false');
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    // Evitar verificaciones repetidas para el mismo usuario
    if (lastCheckedUserId.current === authUser.id && !adminLoading) {
      return;
    }

    console.log('[Admin] Checking status for:', authUser.id);
    lastCheckedUserId.current = authUser.id;

    try {
      // Query con timeout manual
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      );
      
      const queryPromise = supabaseRef.current
        .from('users')
        .select('is_admin')
        .eq('id', authUser.id)
        .single();

      const result = await Promise.race([queryPromise, timeoutPromise]);
      
      if (!result || 'error' in result && result.error) {
        console.error('[Admin] Error:', (result as any)?.error?.message || 'Unknown');
        setIsAdmin(false);
      } else if (result && 'data' in result) {
        const adminStatus = result.data?.is_admin || false;
        console.log('[Admin] Status:', adminStatus);
        setIsAdmin(adminStatus);
      }
    } catch (error: any) {
      console.error('[Admin] Exception:', error.message);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }, [authUser, adminLoading]);

  // Verificar estado de admin cuando cambia el usuario autenticado
  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authUser, authLoading, checkAdminStatus]);

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
