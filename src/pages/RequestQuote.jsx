import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaArrowRight, FaCheckCircle, FaGasPump, FaTruck, FaFire, FaOilCan } from 'react-icons/fa';

const fuelTypes = ['Premium Petrol', 'Diesel', 'LPG', 'Lubricants & Engine Oils', 'Multiple Products'];
const quantities = ['Under 1,000 litres', '1,000 – 5,000 litres', '5,000 – 20,000 litres', '20,000 – 50,000 litres', 'Over 50,000 litres'];
const deliveryTypes = ['Station Pick-up', 'Delivery to Site', 'Both'];

const whyItems = [
  { icon: FaGasPump, text: 'NPA-licensed, GSA-certified fuel' },
  { icon: FaTruck, text: 'Nationwide delivery across all regions' },
  { icon: FaFire, text: 'Competitive bulk pricing' },
  { icon: FaOilCan, text: 'Dedicated account manager' },
];

export default function RequestQuote() {
  const recaptchaRef = useRef(null);
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', fuel_type: '', quantity: '', delivery_type: '', location: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const token = recaptchaRef.current?.getValue();
    if (!token) { setStatus('captcha'); return; }
    setStatus('loading');
    const { error } = await supabase.from('quotes').insert([{ ...form, submitted_at: new Date().toISOString() }]);
    if (error) { setStatus('error'); return; }
    setStatus('success');
    setForm({ company: '', name: '', email: '', phone: '', fuel_type: '', quantity: '', delivery_type: '', location: '', message: '' });
    recaptchaRef.current?.reset();
  };

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem', color: '#111', outline: 'none', backgroundColor: '#fff', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <SEO title="Request a Quote" description="Get a competitive bulk fuel supply quote from Reliance Oil Limited. Petrol, Diesel, LPG and lubricants delivered nationwide across Ghana." path="/quote" />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0D0D0D,#1a1a1a)', padding: '64px 24px' }}>
        <div className="rc">
          <div style={{ maxWidth: '600px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#CC0000', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block', marginBottom: '20px' }}>
              Free Quote
            </span>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
              Request a Bulk Fuel Quote
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
              Fill in the form and our team will respond within <strong style={{ color: '#FFD700' }}>2 business hours</strong> with a competitive price tailored to your volume and location.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
              {whyItems.map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(204,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: '#CC0000' }} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="rs" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="rc" style={{ maxWidth: '860px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            <div style={{ backgroundColor: '#CC0000', padding: '20px 32px' }}>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Quote Request Form</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: '4px 0 0' }}>All fields marked * are required</p>
            </div>

            {status === 'success' ? (
              <div style={{ padding: '64px 32px', textAlign: 'center' }}>
                <FaCheckCircle size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
                <h3 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', marginBottom: '8px' }}>Quote Request Received</h3>
                <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.7 }}>Thank you! Our team will contact you within 2 business hours with a tailored quote.</p>
                <button onClick={() => setStatus('idle')} style={{ backgroundColor: '#CC0000', color: '#fff', padding: '12px 28px', borderRadius: '9999px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Company / Organisation *</label>
                    <input name="company" value={form.company} onChange={handle} required placeholder="e.g. Accra Logistics Ltd" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Name *</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="Full name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@company.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="+233 XX XXX XXXX" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Fuel / Product Type *</label>
                    <select name="fuel_type" value={form.fuel_type} onChange={handle} required style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select product</option>
                      {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Estimated Quantity *</label>
                    <select name="quantity" value={form.quantity} onChange={handle} required style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select quantity</option>
                      {quantities.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Delivery Preference *</label>
                    <select name="delivery_type" value={form.delivery_type} onChange={handle} required style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select option</option>
                      {deliveryTypes.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Delivery Location / Region *</label>
                    <input name="location" value={form.location} onChange={handle} required placeholder="e.g. Tema, Greater Accra" style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Additional Requirements</label>
                  <textarea name="message" value={form.message} onChange={handle} rows={4} placeholder="Frequency of supply, special requirements, contract terms, etc." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
                  {status === 'captcha' && <p style={{ color: '#CC0000', fontSize: '0.8rem', marginTop: '6px' }}>Please complete the reCAPTCHA.</p>}
                  {status === 'error' && <p style={{ color: '#CC0000', fontSize: '0.8rem', marginTop: '6px' }}>Something went wrong. Please try again.</p>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>
                    Your information is kept confidential and used only to prepare your quote.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{ backgroundColor: '#CC0000', color: '#fff', padding: '14px 32px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    {status === 'loading' ? 'Submitting…' : <>Submit Quote Request <FaArrowRight size={13} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
            Prefer to call? Reach us on{' '}
            <a href="tel:+233209890002" style={{ color: '#CC0000', fontWeight: 600, textDecoration: 'none' }}>+233 20 989 0002</a>
            {' '}or{' '}
            <Link to="/contact" style={{ color: '#CC0000', fontWeight: 600, textDecoration: 'none' }}>send a message</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
