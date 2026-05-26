import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const GMAIL_USER = Deno.env.get('GMAIL_USER')!;
const GMAIL_PASS = Deno.env.get('GMAIL_APP_PASS')!;
const TO_EMAIL   = 'relianceoil2018@gmail.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { name, email, phone, position, coverLetter, cvFileName } = await req.json();

    const appliedAt = new Date().toLocaleString('en-GB', {
      timeZone: 'Africa/Accra', dateStyle: 'full', timeStyle: 'short',
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
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;">Applicant</td><td style="padding:10px 0;color:#111;">${name}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;">Email</td><td style="padding:10px 0;color:#111;"><a href="mailto:${email}" style="color:#CC0000;">${email}</a></td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;">Phone</td><td style="padding:10px 0;color:#111;">${phone}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;">CV</td><td style="padding:10px 0;color:#111;">${cvFileName || 'Not attached'}</td></tr>
            <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#666;">Date</td><td style="padding:10px 0;color:#111;">${appliedAt}</td></tr>
          </table>
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f3f4f6;">
            <p style="font-size:13px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Cover Letter</p>
            <p style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;">${coverLetter}</p>
          </div>
        </div>
      </div>
    `;

    const client = new SmtpClient();
    await client.connectTLS({ hostname: 'smtp.gmail.com', port: 465, username: GMAIL_USER, password: GMAIL_PASS });
    await client.send({
      from: `Reliance Oil Careers <${GMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Application: ${position} — ${name}`,
      html,
    });
    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
