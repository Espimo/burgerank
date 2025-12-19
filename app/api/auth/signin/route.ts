import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const signinSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Se requiere contraseña'),
});

interface UserInsert {
  id: string;
  email: string;
  username: string;
  public_profile: boolean;
  points: number;
  category: string;
}

async function signin(formData: {
  email: string;
  password: string;
}) {
  try {
    // Validar datos
    const validated = signinSchema.parse(formData);

    const supabase = await createClient();

    // 1. Autenticar usuario
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo iniciar sesión');

    // 2. Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      // Si el usuario en auth existe pero no en la tabla users, crear el perfil
      if (userError.code === 'PGRST116') {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email || validated.email,
              username: authData.user.email?.split('@')[0] || 'usuario',
              public_profile: false,
              points: 0,
              category: 'Burger Fan',
            } as UserInsert,
          ])
          .select()
          .single();

        if (createError) throw createError;
        
        return {
          success: true,
          message: 'Sesión iniciada exitosamente',
          user: newUser,
        };
      }
      throw userError;
    }

    return {
      success: true,
      message: 'Sesión iniciada exitosamente',
      user: userData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      message,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await signin(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
