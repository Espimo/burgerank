import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const burgerId = searchParams.get("burger_id")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 20
    const offset = (page - 1) * limit

    let queryBuilder = supabase
      .from("ratings")
      .select("*, user:users(*)", { count: "exact" })

    if (burgerId) {
      queryBuilder = queryBuilder.eq("burger_id", burgerId)
    }

    const { data, error, count } = await queryBuilder
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count,
      page,
    })
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json(
      { success: false, error: "Error fetching ratings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("ratings")
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating rating:", error)
    return NextResponse.json(
      { success: false, error: "Error creating rating" },
      { status: 500 }
    )
  }
}
