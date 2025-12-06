import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from("burgers")
      .select("*, restaurant:restaurants(*)")
      .eq("id", id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Burger not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching burger:", error)
    return NextResponse.json(
      { success: false, error: "Error fetching burger" },
      { status: 500 }
    )
  }
}
