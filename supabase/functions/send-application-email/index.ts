import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const TO_EMAIL = 'relianceoil2018@gmail.com';
const FROM_EMAIL = 'careers@relianceoilltd.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, phone, position, coverLetter, cvFileName } = await req.json();

    const appliedAt = new Date().toLocaleString('en-GB', {
      timeZone: 'Africa/Accra',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#CC0000;padding:24px 32px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">New Job Application</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Reliance Oil Limited — Careers Portal</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:10px 0;color:#666;width:140px;vertical-align:top;">Position</td><td style="padding:10px 0;font-weight:700;color:#111;">${position}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;vertical-align:top;">Applicant</td><td style="padding:10px 0;color:#111;">${name}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;vertical-align:top;">Email</td><td style="padding:10px 0;color:#111;"><a href="mailto:${email}" style="color:#CC0000;">${email}</a></td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;vertical-align:top;">Phone</td><td style="padding:10px 0;color:#111;">${phone}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;vertical-align:top;">CV</td><td style="padding:10px 0;color:#111;">${cvFileName || 'Not attached'}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;vertical-align:top;">Date</td><td style="padding:10px 0;color:#111;">${appliedAt}</td></tr>
          </table>
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f3f4f6;">
            <p style="font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Cover Letter</p>
            <p style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;">${coverLetter}</p>
          </div>
          <div style="margin-top:32px;padding:16px;background:#FFF8F8;border-radius:8px;font-size:13px;color:#888;">
            This application was submitted via <strong>relianceoilltd.com</strong>. Reply directly to this email to contact the applicant.
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
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Application: ${position} — ${name}`,
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
