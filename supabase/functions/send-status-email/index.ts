import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'careers@relianceoilltd.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const statusConfig: Record<string, { label: string; color: string; message: string }> = {
  accepted: {
    label: 'Accepted',
    color: '#16a34a',
    message: `We are pleased to inform you that your application has been <strong>accepted</strong>. A member of our HR team will be in touch shortly with the next steps regarding your onboarding.`,
  },
  rejected: {
    label: 'Unsuccessful',
    color: '#CC0000',
    message: `Thank you for taking the time to apply to Reliance Oil Limited. After careful consideration, we regret to inform you that on this occasion your application was <strong>unsuccessful</strong>. We encourage you to apply for future opportunities that match your profile.`,
  },
  reviewed: {
    label: 'Under Review',
    color: '#1d4ed8',
    message: `We wanted to let you know that your application is currently <strong>under review</strong> by our hiring team. We will get back to you as soon as a decision has been made. Thank you for your patience.`,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { applicant_name, applicant_email, position, status } = await req.json();

    const cfg = statusConfig[status];
    if (!cfg) throw new Error(`Unknown status: ${status}`);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#CC0000;padding:24px 32px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">Reliance Oil Limited</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Careers — Application Update</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#111;margin:0 0 20px;">Dear <strong>${applicant_name}</strong>,</p>

          <div style="border-left:4px solid ${cfg.color};padding:16px 20px;background:#f9fafb;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <p style="margin:0;font-size:14px;color:#333;line-height:1.75;">${cfg.message}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:9px 0;color:#888;width:130px;">Position</td>
              <td style="padding:9px 0;font-weight:700;color:#111;">${position}</td>
            </tr>
            <tr>
              <td style="padding:9px 0;color:#888;">Application Status</td>
              <td style="padding:9px 0;">
                <span style="background:${cfg.color}20;color:${cfg.color};font-weight:700;font-size:12px;padding:3px 10px;border-radius:9999px;">${cfg.label}</span>
              </td>
            </tr>
          </table>

          <p style="font-size:13px;color:#555;line-height:1.7;margin:0 0 6px;">If you have any questions, please reply to this email or contact us at <a href="mailto:relianceoil2018@gmail.com" style="color:#CC0000;">relianceoil2018@gmail.com</a>.</p>
          <p style="font-size:13px;color:#555;margin:0;">Thank you for your interest in joining the Reliance Oil team.</p>

          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f3f4f6;font-size:12px;color:#aaa;">
            Reliance Oil Limited &nbsp;•&nbsp; relianceoilltd.com &nbsp;•&nbsp; Ghana
          </div>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [applicant_email],
        reply_to: 'relianceoil2018@gmail.com',
        subject: `Your Application Update — ${position} | Reliance Oil Limited`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
