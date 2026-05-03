export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, position, coverLetter, cvInfo, appliedAt } = req.body;

  if (!name || !email || !position) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <div style="background:#CC0000;padding:24px 32px">
        <h2 style="color:#fff;margin:0;font-size:1.25rem">New Job Application</h2>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.875rem">Reliance Oil Limited — Careers</p>
      </div>
      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem;width:130px">Applicant</td><td style="padding:8px 0;font-weight:600;color:#111">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem">Email</td><td style="padding:8px 0;color:#111"><a href="mailto:${email}" style="color:#CC0000">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem">Phone</td><td style="padding:8px 0;color:#111">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem">Position</td><td style="padding:8px 0;font-weight:700;color:#CC0000">${position}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem">Applied</td><td style="padding:8px 0;color:#111">${appliedAt}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:0.875rem">CV</td><td style="padding:8px 0;color:#111">${cvInfo}</td></tr>
        </table>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f3f4f6">
          <p style="color:#6b7280;font-size:0.875rem;margin:0 0 8px">Cover Letter</p>
          <div style="background:#f9f9f9;border-radius:6px;padding:16px;color:#333;font-size:0.9rem;line-height:1.7;white-space:pre-wrap">${coverLetter}</div>
        </div>
      </div>
      <div style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #e5e7eb">
        <p style="color:#9ca3af;font-size:0.75rem;margin:0">Sent from relianceoilltd.com careers page</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Reliance Oil Careers <onboarding@resend.dev>',
        to: ['relianceoil2018@gmail.com'],
        subject: `New Application: ${position} — ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
