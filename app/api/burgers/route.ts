import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = page * limit

    // Build the query
    let query = supabase
      .from('burgers')
      .select(
        `
        id,
        name,
        description,
        burger_type,
        average_rating,
        total_ratings,
        price,
        image_url,
        is_special,
        created_at,
        restaurant:restaurant_id (
          id,
          name,
          slug
        )
      `,
        { count: 'exact' }
      )
      .order('average_rating', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    const city = searchParams.get('city')
    if (city) {
      query = query.eq('restaurant.city', city)
    }

    const types = searchParams.get('types')
    if (types) {
      const typeList = types.split(',')
      query = query.in('burger_type', typeList)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      hasMore: offset + limit < (count || 0),
      total: count,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
