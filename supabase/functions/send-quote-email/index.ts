import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { company, name, email, phone, fuel_type, quantity, delivery_type, location, message } = await req.json();

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#CC0000;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">New Quote Request</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Submitted via relianceoilltd.com</p>
        </div>
        <div style="padding:32px;border:1px solid #f0f0f0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;width:40%;">Company / Organisation</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${company || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Contact Name</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${name || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Email</td>
              <td style="padding:12px 0;font-size:14px;"><a href="mailto:${email}" style="color:#CC0000;">${email || "—"}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Phone</td>
              <td style="padding:12px 0;font-size:14px;"><a href="tel:${phone}" style="color:#CC0000;">${phone || "—"}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Fuel / Product</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${fuel_type || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Quantity</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${quantity || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Delivery Preference</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${delivery_type || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;">Location / Region</td>
              <td style="padding:12px 0;color:#111;font-size:14px;">${location || "—"}</td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding:12px 0;font-weight:700;color:#555;font-size:13px;vertical-align:top;">Additional Notes</td>
              <td style="padding:12px 0;color:#111;font-size:14px;line-height:1.6;">${message}</td>
            </tr>` : ""}
          </table>
        </div>
        <div style="padding:20px 32px;background:#f9f9f9;border:1px solid #f0f0f0;border-top:none;">
          <p style="margin:0;color:#888;font-size:12px;">Reply directly to <a href="mailto:${email}" style="color:#CC0000;">${email}</a> or call <a href="tel:${phone}" style="color:#CC0000;">${phone}</a> to respond.</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Reliance Oil Quotes <onboarding@resend.dev>",
        to: ["relianceoil2018@gmail.com"],
        reply_to: email,
        subject: `New Quote Request — ${company || name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
