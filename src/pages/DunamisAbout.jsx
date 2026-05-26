import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowRight, FaBuilding, FaHandshake, FaShieldAlt, FaStar, FaUsers, FaWifi } from 'react-icons/fa';
import SEO from '../components/SEO';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

const values = [
  { icon: FaShieldAlt, title: 'Trust & Transparency', desc: 'Verified listings, clear documentation, and honest guidance at every stage of the property journey.' },
  { icon: FaUsers, title: 'Client-First Approach', desc: 'Every recommendation is shaped around each buyer, tenant, investor, and developer we serve.' },
  { icon: FaBuilding, title: 'Innovation & Technology', desc: 'Modern digital tools make property discovery, inspection, and transaction management seamless.' },
  { icon: FaStar, title: 'Market Excellence', desc: 'Deep local insight helps clients identify strong opportunities across Ghana’s property market.' },
  { icon: FaWifi, title: 'Offline Resilience', desc: 'Field-ready workflows keep agents productive in low-connectivity locations and sync when online.' },
  { icon: FaHandshake, title: 'Legal Compliance', desc: 'Document checks, due diligence, and compliant processes protect buyers, sellers, and partners.' },
];

const team = [
  { initials: 'KA', name: 'Kwame Asante-Boateng', role: 'CEO', desc: 'Leads Dunamis Estates with a focus on trusted partnerships, premium growth, and client confidence.' },
  { initials: 'AO', name: 'Abena Owusu', role: 'Head of Sales', desc: 'Guides buyers, tenants, and investors through smooth negotiations and property decisions.' },
  { initials: 'KM', name: 'Kofi Mensah-Darko', role: 'CTO', desc: 'Builds the digital platform powering listings, field operations, maps, and resilient sync workflows.' },
];

const stats = [
  { value: '12+', label: 'Years' },
  { value: '500+', label: 'Properties' },
  { value: '1,200+', label: 'Clients' },
  { value: '98%', label: 'Satisfaction' },
];

export default function DunamisAbout() {
  useEffect(() => {
    AOS.init({ offset: 80, duration: 800, once: true });
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <SEO title="About Dunamis Estates" description="Learn about Dunamis Estates, Ghana's premier real estate ecosystem for property buyers, tenants, developers, and investors." path="/dunamis/about" />

      <section className="gradient-navy" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)`, padding: '120px 0 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.08) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="rc" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span data-aos="fade-up" style={{ display: 'inline-block', color: ORANGE, fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '14px' }}>Our Story</span>
          <h1 data-aos="fade-up" data-aos-delay="80" style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1.08, marginBottom: '18px' }}>About Dunamis Estates</h1>
          <p data-aos="fade-up" data-aos-delay="160" style={{ color: 'rgba(255,255,255,0.68)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '680px', margin: '0 auto' }}>Ghana's premier real estate ecosystem connecting discerning buyers, tenants, developers, and investors to verified opportunities through trusted people and resilient technology.</p>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right" style={{ borderRadius: '22px', overflow: 'hidden', minHeight: '480px', boxShadow: '0 28px 80px rgba(27,31,59,0.16)' }}>
              <img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80" alt="Dunamis Estates mission and vision" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div data-aos="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {[
                { number: '01', title: 'Mission', text: 'To simplify property discovery and transactions across Ghana by combining verified listings, expert advisory, and technology that works wherever clients and field agents need it.' },
                { number: '02', title: 'Vision', text: 'To become West Africa’s most trusted real estate ecosystem, empowering people to buy, rent, lease, manage, and invest in property with confidence.' },
              ].map(item => (
                <div key={item.number} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(27,31,59,0.08)', borderRadius: '18px', padding: '30px', boxShadow: '0 8px 32px rgba(27,31,59,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <span style={{ color: ORANGE, fontWeight: '900', fontSize: '1.85rem', lineHeight: 1 }}>{item.number}</span>
                    <h2 style={{ color: NAVY, fontSize: '1.35rem', fontWeight: '800' }}>{item.title}</h2>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.96rem', lineHeight: 1.75 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F9FF' }}>
        <div className="rc">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Core Values</span>
            <h2 style={{ color: NAVY, fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2 }}>What Guides Our Work</h2>
          </div>
          <div className="rg3">
            {values.map((value, i) => (
              <div key={value.title} data-aos="fade-up" data-aos-delay={i * 70} style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '28px 24px', border: '1px solid rgba(27,31,59,0.07)', boxShadow: '0 6px 24px rgba(27,31,59,0.06)' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <value.icon size={23} style={{ color: '#ffffff' }} />
                </div>
                <h3 style={{ color: NAVY, fontSize: '1.02rem', fontWeight: '800', marginBottom: '9px' }}>{value.title}</h3>
                <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.68 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div data-aos="fade-up" style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Our People</span>
            <h2 style={{ color: NAVY, fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2 }}>Meet the Dunamis Team</h2>
          </div>
          <div className="rg3">
            {team.map((member, i) => (
              <div key={member.name} data-aos="fade-up" data-aos-delay={i * 90} style={{ textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', padding: '34px 26px', border: '1px solid rgba(27,31,59,0.08)', boxShadow: '0 10px 36px rgba(27,31,59,0.08)' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: ORANGE, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.45rem', margin: '0 auto 20px' }}>{member.initials}</div>
                <h3 style={{ color: NAVY, fontSize: '1.06rem', fontWeight: '800', marginBottom: '5px' }}>{member.name}</h3>
                <div style={{ color: ORANGE, fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>{member.role}</div>
                <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.68 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)` }}>
        <div className="rc rs-sm">
          <div className="rg4">
            {stats.map((stat, i) => (
              <div key={stat.label} data-aos="fade-up" data-aos-delay={i * 80} style={{ textAlign: 'center', padding: '26px 12px' }}>
                <div style={{ color: ORANGE, fontSize: 'clamp(2.2rem,5vw,3.2rem)', fontWeight: '900', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600', marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #EA6C0A 100%)` }}>
        <div className="rc rs-sm" style={{ textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ color: '#ffffff', fontWeight: '900', fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.2, marginBottom: '16px' }}>Ready to Move Forward With Dunamis?</h2>
          <p data-aos="fade-up" data-aos-delay="100" style={{ color: 'rgba(255,255,255,0.86)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 30px' }}>Connect with our team or explore verified property opportunities across Ghana today.</p>
          <div data-aos="fade-up" data-aos-delay="180" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dunamis/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: ORANGE, padding: '14px 30px', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.16)' }}>Contact Us <FaArrowRight size={13} /></Link>
            <Link to="/dunamis/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ffffff', padding: '14px 30px', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.65)' }}>View Properties</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
