import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { applicant_name, applicant_email, position, status } = await req.json()

    if (!applicant_email || !status) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const isAccepted = status === 'accepted'

    const subject = isAccepted
      ? `Congratulations! Your Application for ${position} has been Accepted`
      : `Update on Your Application for ${position} — Reliance Oil Limited`

    const statusMessage = isAccepted
      ? `We are pleased to inform you that your application for the <strong>${position}</strong> position has been reviewed and we would like to move forward with your candidacy.<br><br>Our HR team will be in touch with you shortly with further details on the next steps of our recruitment process.`
      : `After careful review of all applications, we regret to inform you that we will not be moving forward with your application for the <strong>${position}</strong> position at this time.<br><br>We truly appreciate the time and effort you put into your application and encourage you to apply for future opportunities that match your qualifications.`

    const statusColor = isAccepted ? '#16a34a' : '#dc2626'
    const statusLabel = isAccepted ? 'Application Accepted' : 'Application Unsuccessful'

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">
                <tr>
                  <td style="background:#CC0000;padding:28px 32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:1px;">RELIANCE OIL LIMITED</h1>
                    <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">HR Department</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <div style="display:inline-block;background:${statusColor}20;border:1px solid ${statusColor}40;border-radius:6px;padding:8px 16px;margin-bottom:24px;">
                      <span style="color:${statusColor};font-weight:700;font-size:13px;">${statusLabel}</span>
                    </div>
                    <p style="font-size:16px;color:#111;margin:0 0 16px;">Dear <strong>${applicant_name}</strong>,</p>
                    <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 20px;">
                      Thank you for applying for the <strong>${position}</strong> position at Reliance Oil Limited.
                    </p>
                    <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 28px;">${statusMessage}</p>
                    <div style="border-top:1px solid #f0f0f0;padding-top:24px;margin-top:8px;">
                      <p style="font-size:13px;color:#888;margin:0 0 4px;">If you have any questions, please contact us:</p>
                      <a href="mailto:relianceoil2018@gmail.com" style="color:#CC0000;font-size:13px;font-weight:600;">relianceoil2018@gmail.com</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #f0f0f0;">
                    <p style="margin:0;font-size:13px;color:#666;">Best regards,</p>
                    <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#111;">HR Department — Reliance Oil Limited</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#aaa;">This is an automated email. Please do not reply directly to this message.</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Reliance Oil Limited <onboarding@resend.dev>',
        to: [applicant_email],
        reply_to: 'relianceoil2018@gmail.com',
        subject,
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Resend error' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
