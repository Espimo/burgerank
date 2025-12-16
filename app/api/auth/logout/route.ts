import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
