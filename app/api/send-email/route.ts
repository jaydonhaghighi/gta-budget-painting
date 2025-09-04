import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, customerName } = await request.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    let emailSent = false

    // Try different email services in order of preference
    
    // Option 1: Resend (Recommended for production)
    if (process.env.RESEND_API_KEY && !emailSent) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        const result = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'GTA Budget Painting <onboarding@resend.dev>',
          to: [to],
          subject: subject,
          html: html,
        })
        
        emailSent = true
        console.log('Email sent via Resend to:', to, 'ID:', result.data?.id)
      } catch (error) {
        console.error('Resend failed:', error)
      }
    }

    // Option 2: Gmail SMTP with Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && !emailSent) {
      try {
        // Uncomment these lines when you install nodemailer
        /*
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        })

        await transporter.sendMail({
          from: `"GTA Budget Painting" <${process.env.GMAIL_USER}>`,
          to: to,
          subject: subject,
          html: html
        })
        
        emailSent = true
        console.log('Email sent via Gmail to:', to)
        */
      } catch (error) {
        console.error('Gmail SMTP failed:', error)
      }
    }

    // Option 3: SendGrid
    if (process.env.SENDGRID_API_KEY && !emailSent) {
      try {
        // Uncomment these lines when you install @sendgrid/mail
        /*
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        await sgMail.send({
          to: to,
          from: process.env.FROM_EMAIL || 'noreply@gtabudgetpainting.com',
          subject: subject,
          html: html,
        })
        
        emailSent = true
        console.log('Email sent via SendGrid to:', to)
        */
      } catch (error) {
        console.error('SendGrid failed:', error)
      }
    }

    // Development mode - just log the email
    if (!emailSent) {
      console.log('=== DEVELOPMENT MODE - EMAIL NOT ACTUALLY SENT ===')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('Customer:', customerName)
      console.log('HTML Length:', html.length)
      console.log('=== END EMAIL LOG ===')
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Also send a copy to the business (optional)
    const businessEmail = process.env.COMPANY_EMAIL
    if (businessEmail && emailSent && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        const businessSubject = `New Quote Request - ${subject}`
        const businessHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #000;">New Quote Request Received</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer's Receipt (copy):</h3>
              <hr>
              ${html}
            </div>
          </div>
        `
        
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'GTA Budget Painting <onboarding@resend.dev>',
          to: [businessEmail],
          subject: businessSubject,
          html: businessHtml,
        })
        
        console.log('Business notification sent to:', businessEmail)
      } catch (error) {
        console.error('Failed to send business notification:', error)
        // Don't fail the whole request if business notification fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: emailSent ? 'Email sent successfully' : 'Email logged (development mode)',
      recipient: to,
      environment: emailSent ? 'production' : 'development'
    })

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process email request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
