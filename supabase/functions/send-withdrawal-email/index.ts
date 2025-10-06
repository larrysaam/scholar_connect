import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, to, data } = await req.json()

    if (type === 'withdrawal_success') {
      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Successful - ResearchWhoa</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .success-icon { text-align: center; margin-bottom: 30px; }
            .success-icon div { background-color: #10B981; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; }
            .withdrawal-details { background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #10B981; }
            .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-label { font-weight: 600; color: #374151; }
            .detail-value { color: #6b7280; }
            .amount { font-size: 24px; font-weight: bold; color: #10B981; text-align: center; margin: 20px 0; }
            .footer { background-color: #1f2937; color: #d1d5db; padding: 30px; text-align: center; }
            .footer p { margin: 5px 0; }
            .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: 600; }
            @media (max-width: 600px) {
              .container { margin: 0; }
              .content { padding: 20px; }
              .detail-row { flex-direction: column; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ResearchWhoa</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Withdrawal Successful</p>
            </div>
            
            <div class="content">
              <div class="success-icon">
                <div>✓</div>
              </div>
              
              <h2 style="text-align: center; color: #1f2937; margin-bottom: 10px;">Withdrawal Completed Successfully!</h2>
              <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">
                Hello ${data.name}, your withdrawal request has been processed successfully.
              </p>
              
              <div class="amount">${data.amount} XAF</div>
              
              <div class="withdrawal-details">
                <h3 style="margin-top: 0; color: #1f2937;">Withdrawal Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Withdrawal ID:</span>
                  <span class="detail-value">#${data.withdrawalId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value">${data.amount} XAF</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Mobile Operator:</span>
                  <span class="detail-value">${data.operator}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone Number:</span>
                  <span class="detail-value">${data.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${data.date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${data.time}</span>
                </div>
              </div>
              
              <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #3b82f6;">
                <h4 style="margin-top: 0; color: #1e40af;">What's Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>You should receive the funds in your mobile money account within a few minutes</li>
                  <li>If you don't receive the funds within 30 minutes, please contact our support team</li>
                  <li>Keep this email as a record of your withdrawal transaction</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="https://your-app-url.com/researcher-dashboard?tab=payments" class="btn">View Dashboard</a>
              </div>
              
              <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you have any questions or concerns, please don't hesitate to contact our support team.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>ResearchWhoa</strong></p>
              <p>Connecting Researchers and Students Worldwide</p>
              <p style="font-size: 12px; opacity: 0.8;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      const emailText = `
Withdrawal Successful - ResearchWhoa

Hello ${data.name},

Your withdrawal request has been processed successfully!

Withdrawal Details:
- Withdrawal ID: #${data.withdrawalId}
- Amount: ${data.amount} XAF
- Mobile Operator: ${data.operator}
- Phone Number: ${data.phone}
- Date: ${data.date}
- Time: ${data.time}

You should receive the funds in your mobile money account within a few minutes. If you don't receive the funds within 30 minutes, please contact our support team.

Keep this email as a record of your withdrawal transaction.

Best regards,
ResearchWhoa Team
      `

      // Send email using your preferred email service
      // This example uses a generic email service
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ResearchWhoa <noreply@researchwhoa.com>',
          to: [to],
          subject: 'Withdrawal Successful - ResearchWhoa',
          html: emailHTML,
          text: emailText,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Unknown email type')
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
