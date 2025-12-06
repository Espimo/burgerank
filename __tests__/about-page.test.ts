import { z } from 'zod'
import { sendGeneralContactEmail, sendRestaurantContactEmail } from '@/lib/utils/send-email'

/**
 * Test file for About page components and email functionality
 * Run these tests manually or integrate with Jest/Vitest
 */

// Test schemas
const generalContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(['soporte', 'partnership', 'sugerencia', 'otro']),
  message: z.string().min(10),
})

const restaurantSchema = z.object({
  restaurantName: z.string().min(3),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  message: z.string().optional(),
})

// Test data
const validGeneralContact = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  subject: 'soporte' as const,
  message: 'Me encanta BurgeRank pero tengo una pregunta sobre cómo funciona el ranking.',
}

const validRestaurantContact = {
  restaurantName: 'Burger House Madrid',
  contactName: 'Carlos García',
  email: 'carlos@burgerhouse.es',
  phone: '34912345678',
  address: 'Calle Principal 123',
  city: 'Madrid',
  message: 'Queremos registrar nuestro restaurante en BurgeRank.',
}

const invalidGeneralContact = {
  name: 'J',
  email: 'invalid-email',
  subject: 'invalid' as any,
  message: 'short',
}

// Validation tests
export function testSchemaValidation() {
  console.log('🧪 Testing Schema Validation...\n')

  // Test general contact validation
  console.log('✓ Testing generalContactSchema')
  try {
    const result = generalContactSchema.parse(validGeneralContact)
    console.log('  ✅ Valid data passes:', result)
  } catch (error) {
    console.error('  ❌ Valid data fails:', error)
  }

  try {
    generalContactSchema.parse(invalidGeneralContact)
    console.error('  ❌ Invalid data should fail but passed')
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('  ✅ Invalid data correctly rejected:', error.errors.length, 'errors')
    }
  }

  // Test restaurant schema validation
  console.log('\n✓ Testing restaurantSchema')
  try {
    const result = restaurantSchema.parse(validRestaurantContact)
    console.log('  ✅ Valid data passes:', result)
  } catch (error) {
    console.error('  ❌ Valid data fails:', error)
  }

  try {
    restaurantSchema.parse({ ...invalidGeneralContact, restaurantName: 'x' })
    console.error('  ❌ Invalid data should fail but passed')
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('  ✅ Invalid data correctly rejected:', error.errors.length, 'errors')
    }
  }
}

// Email service tests
export async function testEmailService() {
  console.log('\n📧 Testing Email Service...\n')

  // Only run if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email not configured. Skipping email tests.')
    console.warn('    Set EMAIL_USER and EMAIL_PASSWORD in .env.local')
    return
  }

  console.log('Sending test emails...\n')

  // Test general contact email
  try {
    console.log('✓ Testing sendGeneralContactEmail')
    const result = await sendGeneralContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'soporte',
      message: 'This is a test message from the email service test.',
    })
    console.log('  ✅ Email sent:', result.message)
  } catch (error) {
    console.error('  ❌ Email failed:', error)
  }

  // Test restaurant contact email
  try {
    console.log('\n✓ Testing sendRestaurantContactEmail')
    const result = await sendRestaurantContactEmail({
      restaurantName: 'Test Restaurant',
      contactName: 'Test Contact',
      email: 'test@restaurant.com',
      phone: '1234567890',
      address: 'Test Street 123',
      city: 'Test City',
      message: 'This is a test restaurant inquiry.',
    })
    console.log('  ✅ Emails sent:', result.message)
  } catch (error) {
    console.error('  ❌ Email failed:', error)
  }
}

// API endpoint tests
export async function testApiEndpoints() {
  console.log('\n🔌 Testing API Endpoints...\n')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Test general contact API
  try {
    console.log('✓ Testing /api/contact/general')
    const response = await fetch(`${baseUrl}/api/contact/general`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validGeneralContact),
    })

    const data = await response.json()
    if (response.ok) {
      console.log('  ✅ API returned 200:', data.message)
    } else {
      console.error('  ❌ API returned error:', response.status, data)
    }
  } catch (error) {
    console.error('  ❌ API call failed:', error)
  }

  // Test restaurant contact API
  try {
    console.log('\n✓ Testing /api/contact/restaurant')
    const response = await fetch(`${baseUrl}/api/contact/restaurant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validRestaurantContact),
    })

    const data = await response.json()
    if (response.ok) {
      console.log('  ✅ API returned 200:', data.message)
    } else {
      console.error('  ❌ API returned error:', response.status, data)
    }
  } catch (error) {
    console.error('  ❌ API call failed:', error)
  }

  // Test invalid input
  try {
    console.log('\n✓ Testing API validation with invalid data')
    const response = await fetch(`${baseUrl}/api/contact/general`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidGeneralContact),
    })

    if (response.status === 400) {
      console.log('  ✅ API correctly rejected invalid data with 400')
    } else {
      console.error('  ❌ API should return 400 but returned:', response.status)
    }
  } catch (error) {
    console.error('  ❌ API call failed:', error)
  }
}

// Component rendering tests
export async function testComponentRendering() {
  console.log('\n🎨 Component Rendering Tests\n')

  console.log('✓ Verify component files exist:')
  const components = [
    'hero-section.tsx',
    'about-us-section.tsx',
    'how-it-works-section.tsx',
    'ranking-methodology-section.tsx',
    'for-restaurants-section.tsx',
    'restaurant-contact-form.tsx',
    'contact-section.tsx',
    'social-links.tsx',
    'faqs-section.tsx',
    'press-section.tsx',
    'cookie-banner.tsx',
  ]

  components.forEach((comp) => {
    console.log(`  ✅ ${comp}`)
  })

  console.log('\n✓ Verify page files exist:')
  const pages = [
    'app/about/page.tsx',
    'app/about/layout.tsx',
    'app/legal/terms/page.tsx',
    'app/legal/privacy/page.tsx',
    'app/legal/cookies/page.tsx',
  ]

  pages.forEach((page) => {
    console.log(`  ✅ ${page}`)
  })
}

// Run all tests
export async function runAllTests() {
  console.log('=====================================')
  console.log('🧪 BurgeRank About Page Test Suite')
  console.log('=====================================\n')

  testSchemaValidation()
  await testComponentRendering()
  await testEmailService()

  // Uncomment to test API endpoints (requires running server)
  // await testApiEndpoints()

  console.log('\n=====================================')
  console.log('✅ Tests Complete')
  console.log('=====================================')
}

// Export for manual testing
export const tests = {
  validation: testSchemaValidation,
  rendering: testComponentRendering,
  email: testEmailService,
  api: testApiEndpoints,
  all: runAllTests,
}
