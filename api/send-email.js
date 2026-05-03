import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = 'info@relianceoilltd.com';
const FROM = 'Reliance Oil Limited <onboarding@resend.dev>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name, email, phone, position, coverLetter, cvInfo, subject, message } = req.body;

  try {
    if (type === 'application') {
      await resend.emails.send({
        from: FROM,
        to: TO,
        subject: `New Job Application: ${position}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#CC0000;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">New Job Application</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td style="padding:8px 0;font-weight:600;color:#111">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;color:#111"><a href="mailto:${email}" style="color:#CC0000">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;color:#111">${phone}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Position</td><td style="padding:8px 0;font-weight:700;color:#CC0000">${position}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
              <p style="color:#666;margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Cover Letter</p>
              <p style="color:#333;line-height:1.7;white-space:pre-line">${coverLetter}</p>
              ${cvInfo ? `<p style="color:#666;font-size:13px;margin-top:16px"><strong>CV:</strong> ${cvInfo}</p>` : ''}
            </div>
          </div>`,
      });

      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Application Received — Reliance Oil Limited',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#CC0000;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Application Received</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <p style="color:#333">Dear <strong>${name}</strong>,</p>
              <p style="color:#333;line-height:1.7">Thank you for applying for the <strong>${position}</strong> position at Reliance Oil Limited. We have received your application and our HR team will review it shortly.</p>
              <p style="color:#333;line-height:1.7">We will be in touch within <strong>5 business days</strong>.</p>
              <br>
              <p style="color:#888;font-size:13px">Best regards,<br><strong>HR Team</strong><br>Reliance Oil Limited<br>info@relianceoilltd.com</p>
            </div>
          </div>`,
      });

    } else if (type === 'contact') {
      await resend.emails.send({
        from: FROM,
        to: TO,
        subject: `Website Message: ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#CC0000;padding:24px;border-radius:8px 8px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">New Contact Message</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#666;width:100px">From</td><td style="padding:8px 0;font-weight:600;color:#111">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;color:#111"><a href="mailto:${email}" style="color:#CC0000">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0;font-weight:700;color:#CC0000">${subject}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0">
              <p style="color:#666;margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Message</p>
              <p style="color:#333;line-height:1.7;white-space:pre-line">${message}</p>
            </div>
          </div>`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: err.message });
  }
}
