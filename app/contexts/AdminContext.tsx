'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminUsername: string | null;
  loginAdmin: (username: string) => void;
  logoutAdmin: () => void;
  checkAdminStatus: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  // Verificar estado de admin al cargar
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('burgerankAdminSession');
      if (adminSession) {
        try {
          const { username, timestamp } = JSON.parse(adminSession);
          // Sesión válida por 24 horas
          const hoursPassed = (Date.now() - timestamp) / (1000 * 60 * 60);
          if (hoursPassed < 24) {
            setIsAdmin(true);
            setAdminUsername(username);
          } else {
            localStorage.removeItem('burgerankAdminSession');
            setIsAdmin(false);
            setAdminUsername(null);
          }
        } catch (error) {
          localStorage.removeItem('burgerankAdminSession');
          setIsAdmin(false);
          setAdminUsername(null);
        }
      }
    }
  };

  const loginAdmin = (username: string) => {
    if (typeof window !== 'undefined') {
      const adminSession = {
        username,
        timestamp: Date.now()
      };
      localStorage.setItem('burgerankAdminSession', JSON.stringify(adminSession));
      setIsAdmin(true);
      setAdminUsername(username);
    }
  };

  const logoutAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('burgerankAdminSession');
    }
    setIsAdmin(false);
    setAdminUsername(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminUsername, loginAdmin, logoutAdmin, checkAdminStatus }}>
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
