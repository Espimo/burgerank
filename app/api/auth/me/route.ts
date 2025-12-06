import { getSupabaseRoute, getCurrentUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    return NextResponse.json({
      user: user?.id ? { id: user.id, email: user.email } : null,
      profile: user?.profile || null,
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 500 }
    )
  }
}
