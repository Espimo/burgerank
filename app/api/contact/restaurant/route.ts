import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendRestaurantContactEmail } from '@/lib/utils/send-email'

const restaurantSchema = z.object({
  restaurantName: z.string().min(3),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = restaurantSchema.parse(body)

    // Send email
    const result = await sendRestaurantContactEmail({
      restaurantName: validatedData.restaurantName,
      contactName: validatedData.contactName,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      city: validatedData.city,
      message: validatedData.message,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Error sending email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Restaurant registration request sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in restaurant contact API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
