import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SEO from '../components/SEO';
import {
  FaTruck, FaCheckCircle, FaArrowRight, FaGasPump, FaIndustry,
  FaBuilding, FaLeaf, FaHardHat, FaShip, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaBolt,
} from 'react-icons/fa';

const industries = [
  { icon: FaTruck, label: 'Transport & Logistics' },
  { icon: FaBuilding, label: 'Real Estate & Construction' },
  { icon: FaIndustry, label: 'Manufacturing & Industry' },
  { icon: FaHardHat, label: 'Mining & Extraction' },
  { icon: FaLeaf, label: 'Agriculture & Farming' },
  { icon: FaShip, label: 'Marine & Aviation' },
];

const steps = [
  { num: '01', title: 'Submit a Quote Request', desc: 'Fill in our quick form with your fuel type, volume, and location. Takes under 2 minutes.' },
  { num: '02', title: 'Receive a Tailored Price', desc: 'Our team reviews your request and sends a competitive bulk rate within 2 business hours.' },
  { num: '03', title: 'Confirm & Schedule', desc: 'Accept the quote, sign a simple supply agreement, and set your delivery or pick-up schedule.' },
  { num: '04', title: 'Ongoing Supply', desc: 'Receive consistent, quality-assured fuel on your terms — weekly, monthly, or on-demand.' },
];

const benefits = [
  'Competitive bulk pricing below pump rates',
  'NPA-licensed and GSA-certified products',
  'Flexible delivery — site or station pick-up',
  'Dedicated account manager for your business',
  'Nationwide coverage across all 16 regions',
  'Flexible contract durations (monthly to annual)',
  'Emergency supply capability',
  'Invoice and credit terms available',
];

const products = [
  { name: 'Premium Petrol', desc: 'High-octane petrol for fleets requiring performance and efficiency.', color: '#CC0000' },
  { name: 'Standard Diesel', desc: 'High-volume diesel for trucks, generators, heavy machinery, and buses.', color: '#1d4ed8' },
  { name: 'LPG', desc: 'Bulk LPG for industrial kitchens, factories, and commercial users.', color: '#d97706' },
  { name: 'Lubricants & Oils', desc: 'Premium engine oils and industrial lubricants for all equipment types.', color: '#16a34a' },
];

const faqs = [
  { q: 'What is the minimum order for bulk supply?', a: 'Our minimum bulk order starts at 1,000 litres. Larger volumes attract progressively better rates.' },
  { q: 'Do you deliver to all regions of Ghana?', a: 'Yes. We supply across all 16 regions through our network of 33+ stations and delivery fleet.' },
  { q: 'How long does it take to set up a bulk supply account?', a: 'Once your quote is accepted, a supply agreement is signed and your first delivery can be arranged within 24–48 hours.' },
  { q: 'Are credit terms available?', a: 'Yes, credit facilities are available for verified businesses after an initial assessment. Contact us to discuss terms.' },
  { q: 'Is your fuel GSA certified?', a: 'All our petroleum products are certified by the Ghana Standards Authority and sourced through NPA-approved channels.' },
];

export default function BulkFuelSupply() {
  useEffect(() => {
    AOS.init({ offset: 80, duration: 700, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#fff' }}>
      <SEO
        title="Bulk Fuel Supply Ghana"
        description="Reliable bulk petrol, diesel and LPG supply for businesses, fleets and industries across Ghana. NPA-licensed. Competitive rates. Nationwide delivery."
        path="/bulk-fuel-supply"
      />

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg,#0D0D0D 0%,#1a1a1a 100%)', position: 'relative', overflow: 'hidden', padding: '80px 24px 96px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: 'linear-gradient(to left, rgba(204,0,0,0.09), transparent)', pointerEvents: 'none' }} />
        <div className="rc" style={{ position: 'relative', zIndex: 2 }}>
          <div className="rg2 center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '4px 14px', borderRadius: '9999px', backgroundColor: '#CC0000', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '24px' }}>
                Bulk Supply
              </span>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
                Reliable Bulk Fuel Supply<br />
                <span style={{ color: '#CC0000' }}>For Your Business</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '36px', maxWidth: '520px' }}>
                From SMEs to large enterprises — we deliver quality petrol, diesel, LPG and lubricants at competitive bulk rates, on your schedule, anywhere in Ghana.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/quote" style={{ backgroundColor: '#CC0000', color: '#fff', padding: '15px 32px', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Get a Free Quote <FaArrowRight size={13} />
                </Link>
                <a href="tel:+233209890002" style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#fff', padding: '15px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <FaPhone size={13} /> Call Us Now
                </a>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
                {['33+ Stations', 'All 16 Regions', 'NPA Licensed', '24/7 Support'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>
                    <FaCheckCircle size={12} style={{ color: '#FFD700' }} /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hero-right">
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Industries We Serve</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {industries.map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Icon size={16} style={{ color: '#CC0000', flexShrink: 0 }} />
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(204,0,0,0.12)', borderRadius: '10px', border: '1px solid rgba(204,0,0,0.2)' }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 4px' }}>Response within 2 hours</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Submit a quote and our team will reach out same business day.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section className="rs" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="rc">
          <div style={{ textAlign: 'center', marginBottom: '48px' }} data-aos="fade-up">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>What We Supply</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', color: '#111', marginTop: '8px' }}>Bulk Products Available</h2>
          </div>
          <div className="rg4">
            {products.map((p, i) => (
              <div key={p.name} data-aos="fade-up" data-aos-delay={i * 80} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #F0F0F0', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <FaGasPump size={18} style={{ color: p.color }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="rs" style={{ backgroundColor: '#fff' }}>
        <div className="rc">
          <div style={{ textAlign: 'center', marginBottom: '56px' }} data-aos="fade-up">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple Process</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', color: '#111', marginTop: '8px' }}>How It Works</h2>
          </div>
          <div className="rg4">
            {steps.map((s, i) => (
              <div key={s.num} data-aos="fade-up" data-aos-delay={i * 100} style={{ position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F0F0F0', lineHeight: 1, marginBottom: '16px', fontFamily: 'monospace' }}>{s.num}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ display: 'none', position: 'absolute', top: '20px', right: '-16px', color: '#ddd' }} className="step-arrow">
                    <FaArrowRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="rs" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why Reliance Oil</span>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', color: '#fff', marginTop: '8px', marginBottom: '12px', lineHeight: 1.2 }}>
                Why Businesses Choose Us for Bulk Supply
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '32px' }}>
                With over 33 stations across Ghana and a dedicated commercial team, we make bulk fuel simple, reliable, and cost-effective for your operations.
              </p>
              <Link to="/quote" style={{ backgroundColor: '#CC0000', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                Request a Quote <FaArrowRight size={12} />
              </Link>
            </div>
            <div data-aos="fade-left">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <FaCheckCircle size={13} style={{ color: '#FFD700', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rs" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="rc" style={{ maxWidth: '760px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} data-aos="fade-up">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FAQ</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.7rem,3.5vw,2.3rem)', color: '#111', marginTop: '8px' }}>Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((f, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 60} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #EBEBEB' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <FaBolt size={12} style={{ color: '#CC0000', marginTop: '3px', flexShrink: 0 }} />
                  {f.q}
                </h3>
                <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.75, margin: 0, paddingLeft: '22px' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: '#CC0000', padding: '72px 24px', textAlign: 'center' }}>
        <div className="rc">
          <div data-aos="fade-up">
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: '16px', lineHeight: 1.2 }}>
              Ready to Secure Your Bulk Fuel Supply?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', marginBottom: '40px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Join hundreds of businesses across Ghana who trust Reliance Oil for consistent, quality bulk fuel supply.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quote" style={{ backgroundColor: '#FFD700', color: '#111', padding: '16px 36px', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Get a Free Quote <FaArrowRight size={13} />
              </Link>
              <a href="tel:+233209890002" style={{ backgroundColor: 'transparent', color: '#fff', padding: '16px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.45)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FaPhone size={13} /> +233 20 989 0002
              </a>
              <a href="mailto:relianceoil2018@gmail.com" style={{ backgroundColor: 'transparent', color: '#fff', padding: '16px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.45)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope size={13} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
