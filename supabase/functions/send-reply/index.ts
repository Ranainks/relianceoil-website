import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'info@relianceoilltd.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { to_email, to_name, subject, body } = await req.json();

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div style="background:#CC0000;padding:20px 28px;">
          <h2 style="color:#fff;margin:0;font-size:18px;">Reliance Oil Limited</h2>
          <p style="color:rgba(255,255,255,0.75);margin:3px 0 0;font-size:13px;">Reply to your enquiry</p>
        </div>
        <div style="padding:28px;">
          <p style="font-size:15px;color:#111;margin:0 0 18px;">Dear <strong>${to_name}</strong>,</p>
          <div style="font-size:14px;color:#333;line-height:1.8;white-space:pre-wrap;">${body}</div>
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f3f4f6;font-size:12px;color:#aaa;">
            Reliance Oil Limited &nbsp;•&nbsp; relianceoilltd.com &nbsp;•&nbsp; relianceoil2018@gmail.com
          </div>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to_email], reply_to: 'relianceoil2018@gmail.com', subject, html }),
    });

    if (!res.ok) throw new Error(await res.text());

    return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' }, status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { headers: { ...cors, 'Content-Type': 'application/json' }, status: 500 });
  }
});
