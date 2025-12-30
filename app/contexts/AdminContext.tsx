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
  // Ref para cancelar operaciones pendientes
  const abortRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const checkAdminStatus = useCallback(async () => {
    // Reset abort flag
    abortRef.current = false;
    
    if (!authUser) {
      console.log('[Admin] No authUser, setting isAdmin=false');
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    // Evitar queries duplicadas para el mismo usuario
    if (lastUserIdRef.current === authUser.id && !adminLoading) {
      return;
    }
    lastUserIdRef.current = authUser.id;

    console.log('[Admin] Checking status for:', authUser.id);
    setAdminLoading(true);

    try {
      // Query con timeout más corto para evitar bloqueos largos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const { data, error } = await supabaseRef.current
        .from('users')
        .select('is_admin')
        .eq('id', authUser.id)
        .single();
      
      clearTimeout(timeoutId);
      
      // Si la operación fue abortada, no actualizar estado
      if (abortRef.current) return;
      
      if (error) {
        console.error('[Admin] Error:', error.message);
        setIsAdmin(false);
      } else {
        const adminStatus = data?.is_admin || false;
        console.log('[Admin] Status:', adminStatus);
        setIsAdmin(adminStatus);
      }
    } catch (error: any) {
      if (abortRef.current) return;
      console.error('[Admin] Exception:', error.message);
      setIsAdmin(false);
    } finally {
      if (!abortRef.current) {
        setAdminLoading(false);
      }
    }
  }, [authUser, adminLoading]);

  // Verificar estado de admin cuando cambia el usuario autenticado
  useEffect(() => {
    // Abortar cualquier operación pendiente cuando cambie el usuario
    abortRef.current = true;
    
    if (!authLoading) {
      checkAdminStatus();
    }
    
    return () => {
      abortRef.current = true;
    };
  }, [authUser?.id, authLoading, checkAdminStatus]);

  return (
    <AdminContext.Provider value={{ isAdmin, adminLoading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

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
