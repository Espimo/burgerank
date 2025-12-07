import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Usar SERVICE_ROLE_KEY en el servidor para permisos completos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("No user created")

    // 2. Crear perfil en la tabla profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id,
          username,
          city,
          level: "burger_fan",
          total_points: 0,
          available_points: 0,
          total_reviews: 0,
          is_moderator: false,
          is_admin: false,
        },
      ])

    if (profileError) throw profileError

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
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
