// Email sending utility - uses Resend or SendGrid for production
// Placeholder for future email integration

type EmailType = 'restaurant-contact' | 'general-contact' | 'welcome' | 'newsletter'

interface EmailData {
  to: string
  subject: string
  html: string
  type: EmailType
}

interface RestaurantContactData {
  restaurantName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  message?: string
}

interface GeneralContactData {
  name: string
  email: string
  subject: string
  message: string
}

// Initialize transporter (use environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Email Templates

const restaurantContactTemplate = (data: RestaurantContactData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #1f2937; }
      .value { color: #6b7280; margin-top: 5px; }
      .button { display: inline-block; background: #f59e0b; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
      .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Nueva Solicitud de Restaurante 🍔</h1>
      </div>
      <div class="content">
        <p>Hola,</p>
        <p>Has recibido una nueva solicitud de registro de un restaurante. Aquí están los detalles:</p>
        
        <div class="field">
          <div class="label">Restaurante:</div>
          <div class="value">${data.restaurantName}</div>
        </div>
        
        <div class="field">
          <div class="label">Nombre de Contacto:</div>
          <div class="value">${data.contactName}</div>
        </div>
        
        <div class="field">
          <div class="label">Email:</div>
          <div class="value">${data.email}</div>
        </div>
        
        <div class="field">
          <div class="label">Teléfono:</div>
          <div class="value">${data.phone}</div>
        </div>
        
        <div class="field">
          <div class="label">Dirección:</div>
          <div class="value">${data.address}, ${data.city}</div>
        </div>
        
        ${data.message ? `
        <div class="field">
          <div class="label">Mensaje:</div>
          <div class="value">${data.message}</div>
        </div>
        ` : ''}
        
        <p style="margin-top: 30px;">
          <a href="https://admin.burgerank.com/restaurants/${data.restaurantName.replace(/\s+/g, '-')}" class="button">
            Ver Solicitud Completa →
          </a>
        </p>
        
        <div class="footer">
          <p>Este es un email automatizado de BurgeRank. Por favor, no respondas a este email.</p>
          <p>Si tienes preguntas, contacta con el equipo de soporte.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`

const generalContactTemplate = (data: GeneralContactData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #1f2937; }
      .value { color: #6b7280; margin-top: 5px; }
      .message-box { background: #f3f4f6; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b; }
      .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Nuevo Mensaje de Contacto 📧</h1>
      </div>
      <div class="content">
        <p>Hola,</p>
        <p>Has recibido un nuevo mensaje de contacto. Aquí están los detalles:</p>
        
        <div class="field">
          <div class="label">Nombre:</div>
          <div class="value">${data.name}</div>
        </div>
        
        <div class="field">
          <div class="label">Email:</div>
          <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>
        
        <div class="field">
          <div class="label">Asunto:</div>
          <div class="value">${data.subject}</div>
        </div>
        
        <div class="field">
          <div class="label">Mensaje:</div>
          <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
        </div>
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Para responder, simplemente envía un email a <strong>${data.email}</strong>
        </p>
        
        <div class="footer">
          <p>Este es un email automatizado de BurgeRank. Por favor, no respondas a este email.</p>
          <p>Si tienes preguntas, contacta con el equipo de soporte.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`

const confirmationTemplate = (userName: string, type: 'restaurant' | 'general'): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
      .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; text-align: center; }
      .check-icon { font-size: 48px; margin-bottom: 10px; }
      .message { font-size: 18px; color: #1f2937; margin: 20px 0; }
      .subtext { color: #6b7280; margin-bottom: 30px; }
      .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; }
      .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="check-icon">✅</div>
        <h1>${type === 'restaurant' ? 'Solicitud Recibida' : 'Mensaje Recibido'}</h1>
      </div>
      <div class="content">
        <p>¡Hola ${userName}!</p>
        <p class="message">
          ${type === 'restaurant' 
            ? 'Hemos recibido tu solicitud de registro. Nuestro equipo revisará tus datos en las próximas 24 horas.' 
            : 'Gracias por tu mensaje. Te responderemos lo antes posible.'}
        </p>
        <p class="subtext">
          Mientras tanto, puedes explorar BurgeRank y descubrir las mejores hamburguesas.
        </p>
        
        <a href="https://burgerank.com" class="button">
          Ir a BurgeRank →
        </a>
        
        <div class="footer">
          <p>Si tienes preguntas urgentes, contacta con nuestro equipo de soporte: support@burgerank.com</p>
          <p>© 2024 BurgeRank. Todos los derechos reservados. • <a href="https://burgerank.com/legal/privacy" style="color: #9ca3af; text-decoration: none;">Política de Privacidad</a></p>
        </div>
      </div>
    </div>
  </body>
</html>
`

// Main send email function

export async function sendEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email configuration missing')
      return { success: false, message: 'Email service not configured' }
    }

    const result = await transporter.sendMail({
      from: `BurgeRank <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
      replyTo: 'support@burgerank.com',
    })

    console.log(`Email sent: ${result.messageId}`)
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, message: 'Failed to send email' }
  }
}

// Helper functions for specific email types

export async function sendRestaurantContactEmail(data: RestaurantContactData): Promise<{ success: boolean; message: string }> {
  // Send email to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'info@burgerank.com',
    subject: `Nueva solicitud de restaurante: ${data.restaurantName}`,
    html: restaurantContactTemplate(data),
    type: 'restaurant-contact',
  })

  // Send confirmation to user
  await sendEmail({
    to: data.email,
    subject: 'Solicitud recibida - BurgeRank',
    html: confirmationTemplate(data.contactName, 'restaurant'),
    type: 'restaurant-contact',
  })

  return { success: true, message: 'Emails sent successfully' }
}

export async function sendGeneralContactEmail(data: GeneralContactData): Promise<{ success: boolean; message: string }> {
  // Send email to admin
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'info@burgerank.com',
    subject: `Nuevo mensaje de contacto: ${data.subject}`,
    html: generalContactTemplate(data),
    type: 'general-contact',
  })

  // Send confirmation to user
  await sendEmail({
    to: data.email,
    subject: 'Mensaje recibido - BurgeRank',
    html: confirmationTemplate(data.name, 'general'),
    type: 'general-contact',
  })

  return { success: true, message: 'Emails sent successfully' }
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email verification failed:', error)
    return false
  }
}
