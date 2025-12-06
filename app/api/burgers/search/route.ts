import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const city = searchParams.get("city")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 20
    const offset = (page - 1) * limit

    let queryBuilder = supabase
      .from("burgers")
      .select("*, restaurant:restaurants(*)", { count: "exact" })

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      )
    }

    if (city) {
      queryBuilder = queryBuilder.eq("restaurant.city", city)
    }

    const { data, error, count } = await queryBuilder
      .order("rating_average", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count,
      page,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { success: false, error: "Error searching burgers" },
      { status: 500 }
    )
  }
}
