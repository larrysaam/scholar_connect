import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  template?: string
  templateData?: Record<string, any>
  userId?: string
  notificationType?: string
}

// Email templates
const emailTemplates = {
  consultation_confirmed: {
    subject: "Consultation Booking Confirmed - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Your Academic Success Partner</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Consultation Confirmed!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your consultation booking has been confirmed.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> {{date}}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> {{time}}</p>
            <p style="margin: 5px 0;"><strong>Researcher:</strong> {{researcherName}}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceName}}</p>
            {{#if meetingLink}}
            <p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="{{meetingLink}}" style="color: #667eea;">Join Meeting</a></p>
            {{/if}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you need to reschedule or have any questions, please contact us through your dashboard.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  payment_received: {
    subject: "Payment Confirmation - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Payment Confirmation</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">💳 Payment Received</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We've successfully received your payment. Thank you!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Payment Details:</h3>
            <p style="margin: 5px 0;"><strong>Amount:</strong> {{amount}} {{currency}}</p>
            <p style="margin: 5px 0;"><strong>Transaction ID:</strong> {{transactionId}}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> {{date}}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceName}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Transaction Details
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  job_application_accepted: {
    subject: "Job Application Accepted - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Job Application Update</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Application Accepted!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! Your job application has been accepted.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Job Details:</h3>
            <p style="margin: 5px 0;"><strong>Position:</strong> {{jobTitle}}</p>
            <p style="margin: 5px 0;"><strong>Client:</strong> {{clientName}}</p>
            <p style="margin: 5px 0;"><strong>Budget:</strong> {{budget}} {{currency}}</p>
            <p style="margin: 5px 0;"><strong>Start Date:</strong> {{startDate}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Job Details
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            The client will contact you soon with further details. Good luck with your new project!
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  coauthor_invitation: {
    subject: "Collaboration Invitation - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Collaboration Opportunity</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">🤝 Collaboration Invitation</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You've been invited to collaborate on an exciting research project!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Project Details:</h3>
            <p style="margin: 5px 0;"><strong>Project:</strong> {{projectTitle}}</p>
            <p style="margin: 5px 0;"><strong>Invited by:</strong> {{inviterName}}</p>
            <p style="margin: 5px 0;"><strong>Role:</strong> {{role}}</p>
            <p style="margin: 10px 0 0 0;"><strong>Description:</strong></p>
            <p style="margin: 5px 0; color: #666;">{{projectDescription}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{acceptUrl}}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Accept Invitation
            </a>
            <a href="{{dashboardUrl}}" 
               style="background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Details
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  booking_reminder: {
    subject: "Upcoming Consultation Reminder - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Consultation Reminder</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">⏰ Upcoming Consultation</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This is a friendly reminder about your upcoming consultation scheduled for {{timeUntil}}.
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">Consultation Details:</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> {{date}}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> {{time}}</p>
            <p style="margin: 5px 0;"><strong>Researcher:</strong> {{researcherName}}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceName}}</p>
            {{#if meetingLink}}
            <p style="margin: 15px 0 5px 0;"><strong>Meeting Link:</strong></p>
            <a href="{{meetingLink}}" 
               style="background: #667eea; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Join Meeting
            </a>
            {{/if}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Please be on time for your consultation. If you need to reschedule, please do so at least 2 hours in advance.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `  },

  'booking-cancelled-researcher': {
    subject: "Booking Cancelled - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Booking Update</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">📅 Booking Cancelled</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            A booking for your consultation service has been cancelled by the student.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceTitle}}</p>
            <p style="margin: 5px 0;"><strong>Student:</strong> {{studentName}}</p>
            {{#if refundMessage}}
            <p style="margin: 15px 0 5px 0; color: #28a745;"><strong>Refund Status:</strong> {{refundMessage}}</p>
            {{/if}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            You can now schedule this time slot for other students or adjust your availability as needed.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  'booking-cancelled-student': {
    subject: "Booking Cancelled - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Booking Update</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">📅 Booking Cancelled</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your consultation booking has been successfully cancelled.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details:</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceTitle}}</p>
            <p style="margin: 5px 0;"><strong>Researcher:</strong> {{researcherName}}</p>
            {{#if refundMessage}}
            <p style="margin: 15px 0 5px 0; color: #28a745;"><strong>Refund Status:</strong> {{refundMessage}}</p>
            {{/if}}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            {{#if refundMessage}}
            The refunded amount has been added back to your wallet and is available for future bookings.
            {{else}}
            If you have any questions about this cancellation, please contact our support team.
            {{/if}}
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  'refund-processed': {
    subject: "Refund Processed - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">Refund Confirmation</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">💰 Refund Processed Successfully</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your refund has been processed and credited to your wallet.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Refund Details:</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceTitle}}</p>
            <p style="margin: 5px 0;"><strong>Researcher:</strong> {{researcherName}}</p>
            <p style="margin: 5px 0;"><strong>Refund Amount:</strong> {{refundAmount}} XAF</p>
            <p style="margin: 15px 0 5px 0; color: #28a745;"><strong>Status:</strong> Credited to your wallet</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Wallet Balance
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            The refunded amount is now available in your wallet and can be used for future bookings.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  },

  generic: {
    subject: "{{subject}} - ResearchWow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ResearchWow</h1>
          <p style="margin: 5px 0 0 0;">{{subtitle}}</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">{{title}}</h2>
          
          <div style="color: #666; line-height: 1.6;">
            {{content}}
          </div>
          
          {{#if actionUrl}}
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{actionUrl}}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              {{actionLabel}}
            </a>
          </div>
          {{/if}}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">© 2024 ResearchWow. All rights reserved.</p>
        </div>
      </div>
    `
  }
}

// Handlebars-style template rendering function
function renderTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    return data[key] ? content : '';
  }).replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, subject, html, template, templateData, userId, notificationType }: EmailRequest = await req.json()

    // Validate required fields
    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Email recipient is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has email notifications enabled (if userId provided)
    if (userId) {
      const { data: preferences } = await supabaseClient
        .from('notification_preferences')
        .select('email_notifications')
        .eq('user_id', userId)
        .single()

      if (preferences && !preferences.email_notifications) {
        return new Response(
          JSON.stringify({ message: 'Email notifications disabled for user', skipped: true }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Prepare email content
    let emailSubject = subject
    let emailHtml = html

    // Use template if specified
    if (template && emailTemplates[template as keyof typeof emailTemplates]) {
      const templateConfig = emailTemplates[template as keyof typeof emailTemplates]
      emailSubject = renderTemplate(templateConfig.subject, templateData || {})
      emailHtml = renderTemplate(templateConfig.html, templateData || {})
    }

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'ResearchWow <notifications@ResearchWow.com>',
        to: [to],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const emailResult = await emailResponse.json()

    if (!emailResponse.ok) {
      throw new Error(`Email sending failed: ${emailResult.message || 'Unknown error'}`)
    }

    // Log email notification in database
    if (userId && notificationType) {
      await supabaseClient
        .from('email_logs')
        .insert({
          user_id: userId,
          email: to,
          subject: emailSubject,
          notification_type: notificationType,
          template_used: template,
          status: 'sent',
          external_id: emailResult.id,
          sent_at: new Date().toISOString()
        })
    }

    return new Response(
      JSON.stringify({ 
        message: 'Email sent successfully', 
        emailId: emailResult.id,
        success: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
