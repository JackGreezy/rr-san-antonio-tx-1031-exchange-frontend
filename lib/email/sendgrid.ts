import sgMail from '@sendgrid/mail'

const apiKey = process.env.SENDGRID_API_KEY
if (apiKey) {
  sgMail.setApiKey(apiKey)
}

interface Lead {
  name: string
  email: string
  phone?: string
  phone_plain?: string
  projectType: string
  property?: string
  estimatedCloseDate?: string
  city?: string
  company?: string
  timeline?: string
  message?: string
}

interface Brand {
  company: string
  phone: string
  email: string
  address: string
  website: string
  submitted_date?: string
}

export async function sendCustomerConfirmation(brand: Brand, lead: Lead): Promise<void> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured, skipping customer confirmation email')
    return
  }

  const message = {
    to: lead.email,
    from: {
      email: brand.email,
      name: brand.company,
    },
    subject: `Thank you for contacting ${brand.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0B3C5D;">Thank You for Reaching Out</h1>
        <p>Dear ${lead.name},</p>
        <p>Thank you for contacting ${brand.company}. We have received your inquiry about ${lead.projectType} and will review it promptly.</p>
        <p>A specialist will follow up with you within one business day to discuss your specific needs and answer any questions.</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #0B3C5D;">Your Information:</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
          <p><strong>Email:</strong> ${lead.email}</p>
          ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
          ${lead.city ? `<p><strong>City:</strong> ${lead.city}</p>` : ''}
          ${lead.timeline ? `<p><strong>Timeline:</strong> ${lead.timeline}</p>` : ''}
          ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
        </div>
        <p>If you have any immediate questions, please don't hesitate to call us at ${brand.phone}.</p>
        <p>Best regards,<br>The ${brand.company} Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          <strong>Educational Content Only:</strong> This is not tax, legal, or investment advice. Consult qualified professionals for your specific situation.
        </p>
      </div>
    `,
  }

  try {
    await sgMail.send(message)
  } catch (error) {
    console.error('SendGrid customer confirmation email failed:', error)
    throw error
  }
}

export async function sendInternalNotifications(brand: Brand, lead: Lead): Promise<void> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured, skipping internal notification email')
    return
  }

  const notificationEmails = [
    brand.email,
    process.env.CONTRACTOR_EMAIL,
  ].filter(Boolean)

  if (notificationEmails.length === 0) {
    console.warn('No notification email addresses configured')
    return
  }

  const message = {
    to: notificationEmails,
    from: {
      email: brand.email,
      name: brand.company,
    },
    subject: `New Lead: ${lead.name} - ${lead.projectType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0B3C5D;">New Lead Received</h1>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #0B3C5D;">Lead Details:</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          ${lead.phone ? `<p><strong>Phone:</strong> <a href="tel:${lead.phone_plain}">${lead.phone}</a></p>` : ''}
          <p><strong>Service:</strong> ${lead.projectType}</p>
          ${lead.property ? `<p><strong>Property:</strong> ${lead.property}</p>` : ''}
          ${lead.estimatedCloseDate ? `<p><strong>Estimated Close Date:</strong> ${lead.estimatedCloseDate}</p>` : ''}
          ${lead.city ? `<p><strong>City:</strong> ${lead.city}</p>` : ''}
          ${lead.timeline ? `<p><strong>Timeline:</strong> ${lead.timeline}</p>` : ''}
          ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
          ${brand.submitted_date ? `<p><strong>Submitted:</strong> ${brand.submitted_date}</p>` : ''}
        </div>
        <p>Please follow up with this lead within one business day.</p>
        <p><a href="mailto:${lead.email}" style="background-color: #C9A227; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply to Lead</a></p>
      </div>
    `,
  }

  try {
    await sgMail.send(message)
  } catch (error) {
    console.error('SendGrid internal notification email failed:', error)
    throw error
  }
}