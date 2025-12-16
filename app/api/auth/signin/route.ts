'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const signinSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Se requiere contraseña'),
});

export async function signin(formData: {
  email: string;
  password: string;
}) {
  try {
    // Validar datos
    const validated = signinSchema.parse(formData);

    const supabase = await createClient();

    // 1. Autenticar usuario
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    // 2. Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

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
