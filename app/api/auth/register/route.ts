import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar ANON_KEY es seguro aquí porque solo llamamos a signUp
// El perfil se crea automáticamente mediante trigger en la BD
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, city } = await request.json()

    // Validar campos requeridos
    if (!email || !password || !username || !city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Crear usuario en Auth con metadata
    // El perfil se crea automáticamente mediante el trigger handle_new_user()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          city,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify.",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error during registration",
      },
      { status: 500 }
    )
  }
}
