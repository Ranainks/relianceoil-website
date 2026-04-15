import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { FaShieldAlt, FaFire, FaBell, FaBolt, FaUsers, FaLeaf, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const measures = [
  { icon: FaFire, title: 'Fire Extinguishers', text: 'Installation of fire extinguishers at all stations.' },
  { icon: FaBell, title: 'Smoke Detectors & Fire Alarms', text: 'Smoke detectors and fire alarm systems at every station.' },
  { icon: FaBolt, title: 'Flame-Proof Electrical Equipment', text: 'All electrical equipment is flame-proof and explosion-protected.' },
  { icon: FaUsers, title: 'Regular Staff Safety Training', text: 'Regular safety training for all station staff and management.' },
  { icon: FaShieldAlt, title: 'GNFS Compliance', text: 'Compliance with Ghana National Fire Service standards.' },
];

const envStats = [
  { icon: FaLeaf, value: '100%', label: 'GNFS Compliant' },
  { icon: FaShieldAlt, value: '34+', label: 'Stations Monitored' },
  { icon: FaCheckCircle, value: 'Zero', label: 'Compromise on Safety' },
];

export default function Safety() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  return (
    <div>
      <SEO title="Safety & HSE" description="Reliance Oil Limited's commitment to Health, Safety and Environment (HSE). Our safety standards protect customers, staff and communities across Ghana." path="/safety" />
      <PageHero
        title="Safety & Sustainability"
        subtitle="Safety is at the core of everything we do at Reliance Oil Limited."
        breadcrumb={[{ label: 'Safety', path: '/safety' }]}
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <SectionLabel text="Health, Safety & Environment" light={true} />
              <h2 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: '1rem' }}>
                Safety is Our Highest Priority
              </h2>
              <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '1rem' }}>
                Safety is at the core of everything we do. Our operations follow strict local and international HSE standards to protect people, assets, and the environment.
              </p>
              <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '2rem' }}>
                We maintain full compliance with Ghana National Fire Service (GNFS) standards and all NPA regulatory requirements.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#444', fontWeight: 500 }}>GNFS Compliant Operations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#444', fontWeight: 500 }}>NPA Licensed & Regulated</span>
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <div style={{ height: 400, borderRadius: '1rem', background: 'linear-gradient(135deg,#0D0D0D,#1a0000 50%,#CC0000)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FaShieldAlt style={{ fontSize: '5rem', color: 'rgba(255,215,0,0.7)' }} />
                <p style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', marginTop: '1rem' }}>Safety First</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Our Core Value</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SectionLabel text="Our Safety Measures" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
              Comprehensive Safety Standards
            </h2>
          </div>
          <div className="rg3" style={{ marginTop: '3rem' }}>
            {measures.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="card-hover"
                  style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', textAlign: 'center' }}
                >
                  <div style={{ width: 56, height: 56, backgroundColor: '#FFF0F0', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#CC0000', margin: '0 auto 1.25rem' }}>
                    <Icon />
                  </div>
                  <p style={{ fontWeight: 700, color: '#111', marginBottom: '0.75rem' }}>{m.title}</p>
                  <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{m.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#111111' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <SectionLabel text="Environmental Responsibility" light={false} />
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', marginBottom: '1.25rem' }}>
                Committed to a Cleaner Ghana
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', lineHeight: 1.7 }}>
                We ensure compliance with environmental regulations through dedicated monitoring systems and staff awareness programs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Dedicated HSE officers',
                  'Continuous monitoring systems',
                  'Staff training and awareness programs',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <FaLeaf style={{ color: '#FFD700', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {envStats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, backgroundColor: 'rgba(204,0,0,0.15)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ color: '#FFD700' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '1.5rem', color: '#FFD700', lineHeight: 1 }}>{s.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#CC0000', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.1, pointerEvents: 'none' }} />
        <div className="rc" style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: '1rem' }}>
            Safety Starts With Every Refuel
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Visit any Reliance Oil station and experience world-class safety standards in Ghana's petroleum retail sector.
          </p>
          <Link
            to="/find-station"
            style={{ backgroundColor: '#FFD700', color: '#111', padding: '1rem 2.5rem', borderRadius: '9999px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Find a Station
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
