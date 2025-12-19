import { createClient } from '@/lib/supabase/server';

/**
 * Obtiene el usuario actual de la sesión
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;
    
    // Obtener datos del perfil
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }
    
    return {
      auth: user,
      profile: profile || null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user?.auth;
}

/**
 * Obtiene solo el usuario de auth
 */
export async function getAuthUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
  
  return user;
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Crea o actualiza el perfil de usuario
 */
export async function upsertUserProfile(userId: string, profileData: {
  username: string;
  email: string;
  public_profile?: boolean;
  points?: number;
  category?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
  
  return data;
}
