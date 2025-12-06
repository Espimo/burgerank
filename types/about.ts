/**
 * Type definitions for About page components and services
 */

// Form types
export interface GeneralContactForm {
  name: string
  email: string
  subject: 'soporte' | 'partnership' | 'sugerencia' | 'otro'
  message: string
}

export interface RestaurantContactForm {
  restaurantName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  message?: string
}

// Email types
export interface EmailData {
  to: string
  subject: string
  html: string
  type: EmailType
}

export type EmailType = 'restaurant-contact' | 'general-contact' | 'welcome' | 'newsletter'

// Cookie types
export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

// FAQ types
export interface FAQ {
  id: number
  question: string
  answer: string
  category: 'general' | 'ranking' | 'rewards' | 'privacy' | 'restaurants'
}

// Press types
export interface PressItem {
  id: number
  date: string
  outlet: string
  headline: string
  description: string
  link: string
}

export interface MediaLogo {
  name: string
  logo: string
}

// Response types
export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface FormSubmitStatus {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

// Section props
export interface SectionProps {
  id?: string
  className?: string
}

// Animation config
export interface AnimationConfig {
  duration: number
  delay: number
  type: 'spring' | 'tween'
  ease: 'easeIn' | 'easeOut' | 'easeInOut' | 'circOut'
}
