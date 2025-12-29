'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  points: number;
  category: string;
  public_profile: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  authUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para el cliente Supabase (singleton)
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const initRef = useRef(false);

  // Obtener perfil 
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[Auth] Error fetching profile:', profileError);
        return null;
      }
      return profile;
    } catch (err) {
      console.error('[Auth] Profile fetch error:', err);
      return null;
    }
  }, [supabase]);

  // Inicializar auth
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initializeAuth = async () => {
      console.log('[Auth] Inicializando...');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.log('[Auth] No hay sesión activa');
          setLoading(false);
          return;
        }
        
        if (user) {
          console.log('[Auth] Usuario encontrado:', user.email);
          setAuthUser(user);
          const profile = await fetchProfile(user.id);
          if (profile) setUserProfile(profile);
        }
      } catch (err) {
        console.error('[Auth] Error initializing:', err);
        setError(err instanceof Error ? err.message : 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State change:', event);
        if (session?.user) {
          setAuthUser(session.user);
          const profile = await fetchProfile(session.user.id);
          if (profile) setUserProfile(profile);
        } else {
          setAuthUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signin = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }

      // Refrescar el estado del usuario
      await refreshUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al registrarse');
      }

      // Refrescar el estado del usuario
      await refreshUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al cerrar sesión');
      }

      setAuthUser(null);
      setUserProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        setAuthUser(user);
        
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        userProfile,
        loading,
        error,
        signin,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
