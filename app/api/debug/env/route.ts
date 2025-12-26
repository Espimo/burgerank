import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const serviceKeyLength = process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    const serviceKeyPrefix = process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'none'
    
    // Intentar una consulta simple con el admin client
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('burgers')
      .select('count')
      .limit(1)
    
    return NextResponse.json({
      hasServiceKey,
      serviceKeyLength,
      serviceKeyPrefix: serviceKeyPrefix + '...',
      testQuery: {
        success: !error,
        error: error?.message || null,
        errorCode: error?.code || null,
        errorHint: error?.hint || null
      },
      env: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Error en diagnóstico',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
