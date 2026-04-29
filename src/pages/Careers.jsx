import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  FaBriefcase,
  FaUsers,
  FaShieldAlt,
  FaStar,
  FaMapMarkerAlt,
  FaChevronDown,
  FaUpload,
  FaArrowRight,
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from '@emailjs/browser';

const perks = [
  { icon: FaBriefcase, title: 'Continuous Learning', text: 'We invest in training and development programs to help our staff grow professionally.' },
  { icon: FaUsers, title: 'Team Collaboration', text: 'We foster a collaborative culture where every team member\'s contribution is valued.' },
  { icon: FaShieldAlt, title: 'Safety-First Culture', text: 'Safety is embedded in everything we do — protecting our people is our top priority.' },
  { icon: FaStar, title: 'Performance Driven', text: 'We recognise and reward excellence, creating a motivating environment for high performers.' },
];



export default function Careers() {
  const [expandedJob, setExpandedJob] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', position: '', coverLetter: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [jobs, setJobs] = useState([]);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
    supabase.from('jobs').select('*').eq('status', 'open').order('order_index').then(({ data }) => {
      if (data) setJobs(data);
    });
  }, []);

  const departments = ['All', ...Array.from(new Set(jobs.map(j => j.department)))];
  const filteredJobs = activeFilter === 'All' ? jobs : jobs.filter(j => j.department === activeFilter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, position, coverLetter } = formData;
    if (!name || !email || !phone || !position || !coverLetter) {
      setFormStatus('error');
      return;
    }
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setFormStatus('captcha');
      return;
    }
    setIsSubmitting(true);
    setFormStatus('idle');
    try {
      let cv_url = null;
      const cvFile = fileInputRef.current?.files[0];
      if (cvFile) {
        const fileName = `${Date.now()}_${cvFile.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('cvs').upload(fileName, cvFile);
        if (!uploadError) cv_url = fileName;
      }
      const { error } = await supabase.from('applications').insert({
        name,
        email,
        phone,
        position,
        cover_letter: coverLetter,
        cv_url,
      });
      if (error) throw error;

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            applicant_name: name,
            applicant_email: email,
            applicant_phone: phone,
            position,
            cover_letter: coverLetter,
            cv_info: cv_url ? `CV uploaded: ${cv_url}` : 'No CV attached',
            to_email: 'relianceoil2018@gmail.com',
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (_) {
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', position: '', coverLetter: '' });
      setCvFileName('');
      recaptchaRef.current?.reset();
    } catch {
      setFormStatus('submiterror');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '14px 16px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      <SEO title="Careers" description="Join the Reliance Oil Limited team. Browse open job vacancies across our stations and head office in Ghana and build a rewarding career in the petroleum industry." path="/careers" />
      <PageHero
        title="Careers"
        subtitle="At Reliance Oil Limited, we believe our people are our greatest asset. We are committed to training, developing, and retaining skilled professionals who share our values of excellence and safety."
        breadcrumb={[{ label: 'Careers', path: '/careers' }]}
        bgImage="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1600&q=85"
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
            <SectionLabel text="Why Join Us" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Build Your Future With Us
            </h2>
          </div>

          <div className="rg4">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                  }}
                  className="card-hover"
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Icon style={{ fontSize: '1.5rem', color: '#CC0000' }} />
                  </div>
                  <p style={{ fontWeight: 700, color: '#111', marginBottom: '0.75rem' }}>
                    {perk.title}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.6 }}>
                    {perk.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
            <SectionLabel text="Open Positions" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Current Opportunities
            </h2>
          </div>

          <div className="rf-center" style={{ marginBottom: '2.5rem' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveFilter(dept)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  ...(activeFilter === dept
                    ? { backgroundColor: '#0D0D0D', color: 'white', border: 'none' }
                    : { backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#666' }),
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '48rem', margin: '0 auto' }}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                data-aos="fade-up"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  border: '1px solid #f3f4f6',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem',
                  }}
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: '#111', fontSize: '1rem' }}>{job.title}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          backgroundColor: '#FFF0F0',
                          color: '#CC0000',
                        }}
                      >
                        {job.department}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                        <FaMapMarkerAlt size={9} />
                        {job.location}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                        }}
                      >
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <FaChevronDown
                    size={12}
                    style={{
                      color: '#9ca3af',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                      transform: expandedJob === job.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>

                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '1.25rem 1.5rem 1.5rem', borderTop: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                          {job.description}
                        </p>
                        <button
                          style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'white',
                            backgroundColor: '#CC0000',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#990000')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CC0000')}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, position: job.title }));
                            formRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" id="apply-form" style={{ backgroundColor: '#ffffff' }} ref={formRef}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
            <SectionLabel text="Apply Now" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Submit Your Application
            </h2>
          </div>

          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                      Position Applied For
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                      onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                      placeholder="Position title"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    rows={5}
                    value={formData.coverLetter}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
                    onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                    placeholder="Tell us why you'd be a great fit..."
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                    Attach CV
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => setCvFileName(e.target.files[0]?.name || '')}
                  />
                  <div
                    style={{
                      border: '2px dashed #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#CC0000')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  >
                    <FaUpload size={24} style={{ color: '#9ca3af', marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{cvFileName || 'Click to upload your CV'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>PDF, DOC, DOCX up to 5MB</span>
                  </div>
                </div>

                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  style={{ marginBottom: '16px' }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontWeight: 700,
                    fontSize: '1rem',
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
                      <span
                        style={{
                          display: 'inline-block',
                          width: '1rem',
                          height: '1rem',
                          borderRadius: '50%',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          animation: 'spin 0.7s linear infinite',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>

              {formStatus === 'success' && (
                <div style={{ marginTop: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                  Your application has been submitted successfully. We'll be in touch within 5 business days.
                </div>
              )}
              {formStatus === 'error' && (
                <div style={{ marginTop: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecaca', color: '#CC0000', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                  Please fill in all required fields before submitting.
                </div>
              )}
              {formStatus === 'captcha' && (
                <div style={{ marginTop: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecaca', color: '#CC0000', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                  Please complete the "I'm not a robot" check before submitting.
                </div>
              )}
              {formStatus === 'submiterror' && (
                <div style={{ marginTop: '1.5rem', backgroundColor: '#fff1f2', border: '1px solid #fecaca', color: '#CC0000', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
