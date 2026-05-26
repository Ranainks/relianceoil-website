import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import SEO from '../components/SEO';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

export default function DunamisContact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', intent: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = form.name.trim() && form.email.trim() && form.phone.trim() && form.intent && form.message.trim();
    setStatus(isValid ? 'success' : 'error');
  };

  const contactCards = [
    { icon: FaLocationDot, title: 'Address', text: '15 Estates Boulevard, Airport City, Accra, Ghana' },
    { icon: FaPhone, title: 'Phone', text: '+233 (0) 30 290 0000' },
    { icon: FaEnvelope, title: 'Email', text: 'info@dunamisestates.com' },
    { icon: FaClock, title: 'Office Hours', text: 'Mon-Fri 8AM-6PM, Sat 9AM-3PM' },
  ];

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(27,31,59,0.14)',
    outline: 'none',
    fontSize: '0.95rem',
    color: NAVY,
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  };

  return (
    <>
      <SEO title="Dunamis Estates Contact" description="Speak with a Dunamis Estates agent about buying, renting, leasing, or investing in premium Ghana real estate." path="/dunamis/contact" keywords="Dunamis Estates contact, Accra real estate agent, Ghana property inquiry" />
      <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #111529 100%)`, color: '#fff', padding: '110px 20px 90px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ color: ORANGE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '16px', fontSize: '0.85rem' }}>Contact Us</div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: 1, margin: '0 0 22px', fontWeight: 900 }}>Get In Touch</h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.7, margin: 0 }}>Speak with a Dunamis agent about your next home, investment property, land purchase, rental, or commercial lease.</p>
          </motion.div>
        </section>

        <section style={{ padding: '80px 20px', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '34px', alignItems: 'start' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ padding: '30px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(27,31,59,0.10)', border: '1px solid rgba(27,31,59,0.08)' }}>
              <h2 style={{ color: NAVY, fontSize: '2rem', margin: '0 0 10px', fontWeight: 900 }}>Send a Message</h2>
              <p style={{ color: '#667085', margin: '0 0 26px', lineHeight: 1.6 }}>Complete the form and our property advisory team will respond shortly.</p>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" style={inputStyle} />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" style={inputStyle} />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
                <select name="intent" value={form.intent} onChange={handleChange} style={inputStyle}>
                  <option value="">Intent</option>
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                  <option value="Lease">Lease</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows="6" style={{ ...inputStyle, resize: 'vertical' }} />
                <button type="submit" style={{ width: '100%', border: 'none', borderRadius: '14px', padding: '16px 20px', color: '#fff', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', background: `linear-gradient(135deg, ${ORANGE}, #FB923C)`, boxShadow: '0 14px 28px rgba(249,115,22,0.28)' }}>Submit Inquiry</button>
                {status === 'success' && <div style={{ color: '#16A34A', fontWeight: 700 }}>Thank you. A Dunamis agent will contact you soon.</div>}
                {status === 'error' && <div style={{ color: '#DC2626', fontWeight: 700 }}>Please complete all fields before submitting.</div>}
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }} style={{ display: 'grid', gap: '16px' }}>
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '22px', borderRadius: '20px', backgroundColor: '#fff', border: '1px solid rgba(27,31,59,0.08)', boxShadow: '0 12px 36px rgba(27,31,59,0.08)' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: 'rgba(249,115,22,0.12)', color: ORANGE, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={20} /></div>
                    <div>
                      <h3 style={{ margin: '0 0 6px', color: NAVY, fontSize: '1.05rem', fontWeight: 900 }}>{card.title}</h3>
                      <p style={{ margin: 0, color: '#667085', lineHeight: 1.55 }}>{card.text}</p>
                    </div>
                  </div>
                );
              })}
              <div style={{ minHeight: '240px', borderRadius: '24px', background: `linear-gradient(135deg, ${NAVY}, #101427)`, color: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '26px', boxShadow: '0 20px 60px rgba(27,31,59,0.20)' }}>
                <div>
                  <FaMapMarkerAlt size={42} style={{ color: ORANGE, marginBottom: '18px' }} />
                  <div style={{ fontWeight: 900, fontSize: '1.15rem' }}>Interactive Map — Connect API Key to activate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ padding: '54px 20px', backgroundColor: NAVY, color: '#fff' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900 }}>Talk to a Live Agent</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem' }}>Our property specialists are available 24/7 for urgent viewing requests and investment inquiries.</p>
            </div>
            <a href="https://wa.me/233302900000" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff', backgroundColor: '#25D366', padding: '15px 22px', borderRadius: '999px', fontWeight: 900, boxShadow: '0 14px 34px rgba(37,211,102,0.28)' }}><FaWhatsapp size={20} /> Chat on WhatsApp</a>
          </div>
        </section>
      </main>
    </>
  );
}
