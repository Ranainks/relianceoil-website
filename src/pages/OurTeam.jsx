import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { FaLinkedinIn, FaTwitter, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const getInitials = (name) => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function OurTeam() {
  const [leadership, setLeadership] = useState([]);
  const [management, setManagement] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('team').select('*').order('order_index').then(({ data, error }) => {
      if (!error && data) {
        setLeadership(data.filter(m => m.is_leadership));
        setManagement(data.filter(m => !m.is_leadership));
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  return (
    <div>
      <SEO title="Our Team" description="Meet the leadership and management team behind Reliance Oil Limited — dedicated professionals driving Ghana's petroleum retail sector forward." path="/our-team" />
      <PageHero
        title="Our Team"
        subtitle="The dedicated professionals driving Reliance Oil's success across Ghana."
        breadcrumb={[{ label: 'Our Team', path: '/our-team' }]}
        bgImage="https://muutovkfdnabmeueqfiz.supabase.co/storage/v1/object/public/team/team-group.jpg.png"
        bgOpacity={0.45}
        bgPosition="center 20%"
      />

      {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Loading team...</div>}

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
            <SectionLabel text="Our Leadership" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Meet Our Executive Team
            </h2>
          </div>

          <div className="rg2" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            {leadership.map((member, index) => (
              <div
                key={member.id}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f3f4f6',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  display: 'flex',
                }}
                className="group card-hover"
              >
                <div
                  style={{
                    width: '12rem',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: 'linear-gradient(135deg,#0D0D0D,#1a0000 50%,#CC0000)',
                    overflow: 'hidden',
                  }}
                >
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        backgroundColor: '#FFD700',
                        fontWeight: 900,
                        fontSize: '1.3rem',
                        color: '#111',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 10,
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '1rem', gap: '0.75rem' }}
                  >
                    <button
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFD700';
                        e.currentTarget.style.color = '#111';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      <FaLinkedinIn size={12} />
                    </button>
                    <button
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFD700';
                        e.currentTarget.style.color = '#111';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      <FaTwitter size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontWeight: 800, color: '#0D0D0D', fontSize: '1.15rem', marginBottom: 4 }}>
                    {member.name}
                  </p>
                  <p
                    style={{ color: '#CC0000', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}
                  >
                    {member.role}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.65 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
            <SectionLabel text="Our Management" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Operational Leaders
            </h2>
          </div>

          <div className="rg4">
            {management.map((member, index) => (
              <div
                key={member.id}
                data-aos="zoom-in"
                data-aos-delay={index * 60}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}
                className="group card-hover"
              >
                <div
                  style={{
                    height: 224,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background:
                      index % 2 === 0
                        ? 'linear-gradient(135deg,#0D0D0D,#1a1a1a)'
                        : 'linear-gradient(135deg,#1a0000,#CC0000)',
                  }}
                >
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: '#FFD700',
                        fontWeight: 900,
                        color: '#111',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.125rem',
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div
                    style={{ position: 'absolute', bottom: '0.75rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <button
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#FFD700';
                        e.currentTarget.style.color = '#FFD700';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      <FaLinkedinIn size={10} />
                    </button>
                    <button
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#FFD700';
                        e.currentTarget.style.color = '#FFD700';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      <FaTwitter size={10} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111', marginBottom: '0.25rem' }}>
                    {member.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CC0000', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {member.role}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#bbb' }}>
                    {member.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#111111', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(204,0,0,0.1),transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 10, paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SectionLabel text="Join Our Team" light={false} />
          </div>
          <h2
            style={{
              color: 'white',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem,4vw,2.4rem)',
              marginBottom: '1rem',
            }}
          >
            Build Your Career at Reliance Oil
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem' }}>
            We're always looking for talented, passionate individuals to join our growing family.
          </p>
          <Link
            to="/careers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              backgroundColor: '#FFD700',
              color: '#111',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            View Open Positions
            <FaArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
