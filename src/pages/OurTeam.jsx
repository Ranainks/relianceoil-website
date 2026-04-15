import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const getInitials = (name) => {
  const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Miss|Ms\.)\s+/i, '').trim();
  const parts = clean.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarGradients = [
  'linear-gradient(135deg,#CC0000,#7f1d1d)',
  'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'linear-gradient(135deg,#166534,#14532d)',
  'linear-gradient(135deg,#92400e,#78350f)',
  'linear-gradient(135deg,#4c1d95,#2e1065)',
  'linear-gradient(135deg,#0f766e,#134e4a)',
  'linear-gradient(135deg,#9f1239,#881337)',
  'linear-gradient(135deg,#1e40af,#312e81)',
];

const getAvatarGradient = (name, index) => {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarGradients[hash % avatarGradients.length];
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function ExecutiveCard({ member, index }) {
  const isCEO = index === 0;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: hovered ? '0 20px 50px rgba(204,0,0,0.18)' : '0 4px 20px rgba(0,0,0,0.08)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.35s ease',
        border: isCEO ? '2px solid #FFD700' : '1px solid #f3f4f6',
        backgroundColor: '#fff',
        position: 'relative',
      }}
    >
      {isCEO && (
        <div style={{ position: 'absolute', top: 14, right: 14, backgroundColor: '#FFD700', color: '#111', fontSize: '0.6rem', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.08em', zIndex: 2 }}>
          CEO
        </div>
      )}
      <div style={{
        height: isCEO ? '180px' : '150px',
        background: isCEO
          ? 'linear-gradient(135deg,#111 0%,#7f1d1d 50%,#CC0000 80%,#FFD700 100%)'
          : 'linear-gradient(135deg,#111 0%,#1a0000 50%,#CC0000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center,rgba(255,255,255,0.06),transparent 70%)',
        }} />
        <div style={{
          width: isCEO ? 90 : 72,
          height: isCEO ? 90 : 72,
          borderRadius: '50%',
          background: '#FFD700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isCEO ? '2rem' : '1.5rem',
          fontWeight: 900,
          color: '#111',
          boxShadow: '0 0 0 4px rgba(255,215,0,0.25)',
          position: 'relative',
          zIndex: 1,
        }}>
          {getInitials(member.name)}
        </div>
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontWeight: 800, color: '#0D0D0D', fontSize: isCEO ? '1.1rem' : '1rem', marginBottom: 4, lineHeight: 1.3 }}>
          {member.name}
        </p>
        <p style={{ color: '#CC0000', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          {member.role}
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: '#888',
          lineHeight: 1.7,
          flex: 1,
          maxHeight: hovered ? '200px' : '60px',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}>
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

function ManagementCard({ member, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 32px rgba(204,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        border: '1px solid #f3f4f6',
      }}
    >
      <div style={{
        height: 140,
        background: getAvatarGradient(member.name, index),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center,rgba(255,255,255,0.08),transparent 70%)',
        }} />
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '2px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 900,
          color: '#fff',
          position: 'relative',
          zIndex: 1,
        }}>
          {getInitials(member.name)}
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', marginBottom: 3, lineHeight: 1.3 }}>
          {member.name}
        </p>
        <p style={{ fontSize: '0.7rem', color: '#CC0000', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          {member.role}
        </p>
        <div style={{
          maxHeight: hovered ? '120px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}>
          <p style={{ fontSize: '0.72rem', color: '#888', lineHeight: 1.6, paddingTop: 6, borderTop: '1px solid #f3f4f6' }}>
            {member.bio}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CompactCard({ member, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '0.875rem',
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 24px rgba(204,0,0,0.10)' : '0 1px 6px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        border: hovered ? '1px solid rgba(204,0,0,0.2)' : '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.875rem',
      }}
    >
      <div style={{
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: getAvatarGradient(member.name, index),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        fontWeight: 900,
        color: '#fff',
        flexShrink: 0,
      }}>
        {getInitials(member.name)}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111', marginBottom: 2, lineHeight: 1.3 }}>
          {member.name}
        </p>
        <p style={{ fontSize: '0.68rem', color: '#CC0000', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.3 }}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

export default function OurTeam() {
  const [groups, setGroups] = useState({ executive: [], senior: [], middle: [], operational: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ offset: 80, duration: 700, once: true });
    supabase.from('team').select('*').order('order_index').then(({ data }) => {
      if (data) {
        setGroups({
          executive: data.filter(m => m.department === 'Executive Leadership'),
          senior: data.filter(m => m.department === 'Senior Management'),
          middle: data.filter(m => m.department === 'Middle Management'),
          operational: data.filter(m => m.department === 'Operational Staff'),
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <SEO title="Our Team" description="Meet the executive leadership and operational team behind Reliance Oil Limited — dedicated professionals driving Ghana's petroleum retail sector forward." path="/our-team" />
      <PageHero
        title="Our Executive Team & Operational Leaders"
        subtitle="The dedicated professionals powering Reliance Oil's growth across Ghana."
        breadcrumb={[{ label: 'Our Team', path: '/our-team' }]}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
      )}

      {!loading && (
        <>
          <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
            <div className="rc">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Executive Leadership" light={true} />
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D' }}>
                  Leading with Vision & Purpose
                </h2>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
                  gap: '1.5rem',
                  maxWidth: '1000px',
                  margin: '0 auto',
                }}
              >
                {groups.executive.map((member, i) => (
                  <ExecutiveCard key={member.id} member={member} index={i} />
                ))}
              </motion.div>
            </div>
          </section>

          <section style={{ backgroundColor: '#F8F8F8', padding: '80px 0' }}>
            <div className="rc">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Senior Management" light={true} />
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D' }}>
                  Driving Operational Excellence
                </h2>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))',
                  gap: '1.25rem',
                }}
              >
                {groups.senior.map((member, i) => (
                  <ManagementCard key={member.id} member={member} index={i} />
                ))}
              </motion.div>
            </div>
          </section>

          <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
            <div className="rc">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Middle Management" light={true} />
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D' }}>
                  Officers & Specialists
                </h2>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                  gap: '1rem',
                }}
              >
                {groups.middle.map((member, i) => (
                  <ManagementCard key={member.id} member={member} index={i} />
                ))}
              </motion.div>
            </div>
          </section>

          <section style={{ backgroundColor: '#F8F8F8', padding: '80px 0' }}>
            <div className="rc">
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Operational Staff" light={true} />
                <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D' }}>
                  Our Frontline Team
                </h2>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
                  gap: '0.875rem',
                }}
              >
                {groups.operational.map((member, i) => (
                  <CompactCard key={member.id} member={member} index={i} />
                ))}
              </motion.div>
            </div>
          </section>

          <section style={{ backgroundColor: '#111111', padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(204,0,0,0.12),transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 10, padding: '0 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SectionLabel text="Join Our Team" light={false} />
              </div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.4rem)', marginBottom: '1rem' }}>
                Build Your Career at Reliance Oil
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem' }}>
                We're always looking for talented, passionate individuals to join our growing family.
              </p>
              <Link
                to="/careers"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '9999px', fontWeight: 700, backgroundColor: '#FFD700', color: '#111', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                View Open Positions <FaArrowRight size={13} />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
