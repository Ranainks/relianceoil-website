import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SectionLabel from '../components/SectionLabel';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaArrowRight } from 'react-icons/fa';
import { FaLocationDot, FaClock } from 'react-icons/fa6';
import { supabase } from '../lib/supabase';

const inputStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '0.75rem',
  padding: '14px 16px',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  marginBottom: '16px',
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [s, setS] = useState({});

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        const map = {};
        data.forEach(row => { map[row.key] = row.value; });
        setS(map);
      }
    });
  }, []);

  const contactInfo = [
    { icon: FaLocationDot, title: 'Head Office', info: s.contact_address || 'Bortianor (Radiance), Winneba Road\nGS-0162-3129, Weija 162', sub: s.contact_address_hours || 'Mon–Sat, 8am–5pm' },
    { icon: FaPhone, title: 'Call Us', info: s.contact_phone || '+233 30 222 0000', sub: s.contact_phone_sub || '24/7 for emergencies' },
    { icon: FaEnvelope, title: 'Email Us', info: s.contact_email || 'info@relianceoilgh.com', sub: s.contact_email_sub || 'Response within 24hrs' },
    { icon: FaClock, title: 'Business Hours', info: s.contact_hours || 'Mon–Fri: 8am–6pm\nSat: 9am–4pm', sub: s.contact_hours_sub || 'Closed Sundays & holidays' },
  ];

  const hqCenter = { lat: parseFloat(s.hq_lat || '5.5502'), lng: parseFloat(s.hq_lng || '-0.3272') };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = true;
    if (!formData.email.trim()) e.email = true;
    if (!formData.subject.trim()) e.subject = true;
    if (!formData.message.trim()) e.message = true;
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormStatus('error');
      return;
    }
    setIsSubmitting(true);
    setFormStatus('idle');
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to our team for any inquiries, bulk fuel orders, or support."
        breadcrumb={[{ label: 'Contact', path: '/contact' }]}
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div className="rg4">
            {contactInfo.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: '1rem',
                    padding: '1.75rem',
                    transition: 'all 0.3s',
                  }}
                  className="card-hover"
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Icon style={{ fontSize: '1.25rem', color: '#CC0000' }} />
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>
                    {card.title}
                  </p>
                  <p
                    style={{ textAlign: 'center', fontSize: '0.875rem', color: '#888', lineHeight: 1.65, whiteSpace: 'pre-line' }}
                  >
                    {card.info}
                  </p>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#bbb', marginTop: '0.5rem' }}>
                    {card.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <h3
                style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D0D0D', marginBottom: '2rem' }}
              >
                Send Us a Message
              </h3>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      fontWeight: 700,
                      color: 'white',
                      backgroundColor: '#CC0000',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1,
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#990000'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#CC0000'; }}
                  >
                    {isSubmitting ? (
                      <>
                        <span style={{ display: 'inline-block', width: '1rem', height: '1rem', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaArrowRight size={12} />
                      </>
                    )}
                  </button>
                </form>

                {formStatus === 'success' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginTop: '1rem' }}>
                    Thank you! Your message has been sent. Our team will respond within 24 hours.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecaca', color: '#CC0000', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginTop: '1rem' }}>
                    Please fill in all required fields before submitting.
                  </div>
                )}
              </div>
            </div>

            <div data-aos="fade-left">
              <h3
                style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D0D0D', marginBottom: '1.5rem' }}
              >
                Our Headquarters
              </h3>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '350px' }}
                    center={hqCenter}
                    zoom={14}
                  >
                    <Marker position={hqCenter} />
                  </GoogleMap>
                ) : (
                  <div style={{ height: 350, backgroundColor: '#f3f4f6', borderRadius: '1rem' }} className="animate-pulse" />
                )}
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '1rem', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <FaLocationDot
                  style={{ flexShrink: 0, marginTop: '0.125rem', color: '#CC0000' }}
                  size={16}
                />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111' }}>
                    Head Office: {s.contact_address ? s.contact_address.replace(/\n/g, ', ') : 'Bortianor (Radiance), Winneba Road, GS-0162-3129, Weija 162'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                    Contact Office: Tema, Community 7, Greater Accra
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                    Postal: P.O. Box 164, Apam
                  </p>
                  <a
                    href="https://maps.google.com/?q=Bortianor+Winneba+Road+Weija+Ghana"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: '#CC0000', display: 'block', marginTop: '0.375rem' }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionLabel text="Follow Us" light={true} />
            <h2
              style={{
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.2rem)',
                color: '#0D0D0D',
                marginBottom: '1rem',
              }}
            >
              Stay Connected
            </h2>
            <p style={{ textAlign: 'center', color: '#888', maxWidth: '32rem', margin: '0 auto 3rem' }}>
              Follow Reliance Oil on social media for the latest news, promotions, and updates.
            </p>

            <div className="rf-center" style={{ marginBottom: '0' }}>
              <a href="#" target="_blank" rel="noreferrer">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#1877F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FaFacebookF style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#1DA1F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FaTwitter style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg,#E1306C,#F77737)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FaInstagram style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#0A66C2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FaLinkedinIn style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FaYoutube style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
