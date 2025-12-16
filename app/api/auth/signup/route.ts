'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(20, 'Máximo 20 caracteres'),
});

export async function signup(formData: {
  email: string;
  password: string;
  username: string;
}) {
  try {
    // Validar datos
    const validated = signupSchema.parse(formData);

    const supabase = await createClient();

    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          username: validated.username,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo crear la cuenta');

    // 2. Crear perfil en users table
    const { error: profileError } = await (supabase.from('users').insert as any)({
      id: authData.user.id,
      email: validated.email,
      username: validated.username,
      public_profile: false,
      points: 0,
      category: 'Burger Fan',
    });

    if (profileError) throw profileError;

    return {
      success: true,
      message: 'Cuenta creada exitosamente. Verifica tu email para activarla.',
      userId: authData.user.id,
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
    const result = await signup(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
