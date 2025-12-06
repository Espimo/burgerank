import { getSupabaseRoute } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getSupabaseRoute()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    )
  }
}
