import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowRight, FaBalanceScale, FaBuilding, FaChartLine, FaClipboardCheck, FaHandshake, FaHome, FaKey, FaMapMarkedAlt, FaSearch, FaTags } from 'react-icons/fa';
import SEO from '../components/SEO';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

const services = [
  { icon: FaHome, title: 'Property Sales', desc: 'Verified residential, luxury, commercial, and industrial property sales supported by market insight, site coordination, negotiation guidance, and secure transaction workflows.' },
  { icon: FaKey, title: 'Rental Management', desc: 'End-to-end rental support covering tenant sourcing, inspections, lease coordination, maintenance tracking, rent collection oversight, and owner reporting.' },
  { icon: FaMapMarkedAlt, title: 'Land Acquisition', desc: 'Strategic land sourcing for residential, commercial, industrial, and mixed-use needs with location analysis, documentation review, and acquisition support.' },
  { icon: FaClipboardCheck, title: 'Project Consultancy', desc: 'Developer and buyer advisory for construction stages, project positioning, launch planning, buyer engagement, and handover readiness.' },
  { icon: FaTags, title: 'Property Valuation', desc: 'Practical property value assessments using local market comparables, location strength, asset condition, demand trends, and investment potential.' },
  { icon: FaChartLine, title: 'Investment Advisory', desc: 'Portfolio-focused guidance for investors seeking rental yield, capital appreciation, off-plan opportunities, commercial income, or long-term diversification.' },
];

const steps = [
  { title: 'Search & Discover', desc: 'Explore verified listings, locations, photos, maps, and property details.' },
  { title: 'View & Inspect', desc: 'Book inspections, review documentation, and compare options with an agent.' },
  { title: 'Make an Offer', desc: 'Submit interest, negotiate terms, and receive transaction guidance.' },
  { title: 'Close & Handover', desc: 'Complete documents, payments, and final handover with confidence.' },
];

const techItems = ['Next.js', 'Node.js', 'PostgreSQL', 'PostGIS', 'Redis', 'AWS S3', 'Service Workers', 'IndexedDB'];

export default function DunamisServices() {
  useEffect(() => {
    AOS.init({ offset: 80, duration: 800, once: true });
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <SEO title="Services — Dunamis Estates" description="Explore Dunamis Estates property services including sales, rentals, land acquisition, project consultancy, valuation, and investment advisory." path="/dunamis/services" />

      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)`, padding: '120px 0 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="rc" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span data-aos="fade-up" style={{ display: 'inline-block', color: ORANGE, fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '14px' }}>What We Do</span>
          <h1 data-aos="fade-up" data-aos-delay="80" style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1.08, marginBottom: '18px' }}>Our Services</h1>
          <p data-aos="fade-up" data-aos-delay="160" style={{ color: 'rgba(255,255,255,0.68)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '680px', margin: '0 auto' }}>Comprehensive property services for buyers, renters, landlords, developers, and investors seeking trusted real estate support across Ghana.</p>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Service Portfolio</span>
            <h2 style={{ color: NAVY, fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2 }}>Built for Every Property Need</h2>
          </div>
          <div className="rg3">
            {services.map((service, i) => (
              <div key={service.title} data-aos="fade-up" data-aos-delay={i * 70} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '30px 24px', border: '1px solid rgba(27,31,59,0.08)', boxShadow: '0 8px 30px rgba(27,31,59,0.07)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <service.icon size={23} style={{ color: '#ffffff' }} />
                </div>
                <h3 style={{ color: NAVY, fontSize: '1.05rem', fontWeight: '800', marginBottom: '10px' }}>{service.title}</h3>
                <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.72, marginBottom: '20px', flex: 1 }}>{service.desc}</p>
                <Link to="/dunamis/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: ORANGE, fontSize: '0.86rem', fontWeight: '800', textDecoration: 'none' }}>Learn More <FaArrowRight size={12} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)` }}>
        <div className="rc">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '58px' }}>
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>How It Works</span>
            <h2 style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2 }}>From Search to Handover</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '26px', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={step.title} data-aos="fade-up" data-aos-delay={i * 90} style={{ position: 'relative', textAlign: 'center' }}>
                {i < steps.length - 1 && <div style={{ position: 'absolute', top: '30px', left: 'calc(50% + 38px)', width: 'calc(100% - 76px)', height: '2px', backgroundColor: 'rgba(249,115,22,0.35)', display: 'block' }} />}
                <div style={{ width: '62px', height: '62px', borderRadius: '50%', backgroundColor: ORANGE, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.15rem', margin: '0 auto 20px', position: 'relative', zIndex: 2, boxShadow: '0 12px 32px rgba(249,115,22,0.32)' }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '800', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.86rem', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F9FF' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Platform Technology</span>
              <h2 style={{ color: NAVY, fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2, marginBottom: '18px' }}>A Smarter Real Estate Operating System</h2>
              <p style={{ color: '#666', fontSize: '0.98rem', lineHeight: 1.78, marginBottom: '18px' }}>Dunamis Estates is built for modern property teams working across dynamic environments. The platform supports offline-first field activity, spatial property maps, PostGIS-powered location intelligence, IndexedDB sync for cached data, and background sync for reliable updates after connectivity returns.</p>
              <p style={{ color: '#777', fontSize: '0.92rem', lineHeight: 1.75 }}>This gives agents, administrators, buyers, and investors a dependable workflow for discovery, inspection, documentation, and follow-up across Ghana’s real estate market.</p>
            </div>
            <div data-aos="fade-left" style={{ background: `linear-gradient(145deg, ${NAVY} 0%, #11152B 100%)`, borderRadius: '24px', padding: '34px', boxShadow: '0 28px 80px rgba(27,31,59,0.22)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: 'rgba(249,115,22,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaBuilding size={20} style={{ color: ORANGE }} />
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '800', marginBottom: '3px' }}>Tech Stack Visual</h3>
                  <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.82rem' }}>Fast, resilient, and location-aware</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {techItems.map(item => (
                  <span key={item} style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', padding: '10px 15px', fontSize: '0.84rem', fontWeight: '700' }}>{item}</span>
                ))}
              </div>
              <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { icon: FaSearch, label: 'Discovery' },
                  { icon: FaBalanceScale, label: 'Compliance' },
                  { icon: FaHandshake, label: 'Closing' },
                ].map(item => (
                  <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px 10px', textAlign: 'center' }}>
                    <item.icon size={18} style={{ color: ORANGE, marginBottom: '8px' }} />
                    <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.76rem', fontWeight: '700' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #EA6C0A 100%)` }}>
        <div className="rc rs-sm" style={{ textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2, marginBottom: '16px' }}>Need Property Support?</h2>
          <p data-aos="fade-up" data-aos-delay="100" style={{ color: 'rgba(255,255,255,0.86)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 30px' }}>Speak with Dunamis Estates and get expert help for sales, rentals, land, valuation, consultancy, or investment decisions.</p>
          <Link data-aos="fade-up" data-aos-delay="180" to="/dunamis/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: ORANGE, padding: '14px 30px', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.16)' }}>Contact Us <FaArrowRight size={13} /></Link>
        </div>
      </section>
    </div>
  );
}
