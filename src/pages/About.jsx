import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  FaBullseye,
  FaEye,
  FaHandshake,
  FaAward,
  FaShieldAlt,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
  FaCog,
  FaBuilding,
  FaTruck,
  FaLeaf,
} from 'react-icons/fa';

const coreValues = [
  { icon: FaHandshake, title: 'Respect for People', desc: 'We value every individual — our staff, customers, and communities — treating all with dignity and fairness.' },
  { icon: FaShieldAlt, title: 'Safety First', desc: 'Safety is non-negotiable. We maintain strict HSE standards across all our operations and stations.' },
  { icon: FaAward, title: 'Value for Money', desc: 'We deliver premium petroleum products and services at fair, competitive prices that benefit our customers.' },
  { icon: FaUsers, title: 'Teamwork & Collaboration', desc: 'Our strength lies in our people. We foster a collaborative culture that drives performance and innovation.' },
  { icon: FaCog, title: 'Operational Efficiency', desc: 'We continuously improve our systems and processes to deliver reliable, consistent service across all locations.' },
];

const milestones = [
  { year: '2020', title: 'Company Licensed', desc: 'Reliance Oil Limited receives NPA licence to operate as an Oil Marketing Company in Ghana.' },
  { year: '2020', title: 'First Stations Open', desc: 'Operations commence with initial filling stations in the Greater Accra and Central regions.' },
  { year: '2021', title: 'Regional Expansion', desc: 'Network expands into Western and Eastern regions, establishing a multi-regional presence.' },
  { year: '2023', title: 'Growing Network', desc: 'Continued growth sees stations established in Ashanti and Bono East regions.' },
  { year: '2025', title: '34+ Stations', desc: 'Reliance Oil now operates 34+ stations across 6 regions of Ghana with more under development.' },
];

const growthStrategy = [
  { icon: FaBuilding, title: 'Strategic Station Development', desc: 'Expanding our network with well-positioned stations across all major regions of Ghana.' },
  { icon: FaTruck, title: 'Efficient Supply Chain Systems', desc: 'Maintaining a reliable, timely, and cost-effective petroleum supply and distribution network.' },
  { icon: FaUsers, title: 'Customer-Focused Service Delivery', desc: 'Prioritising customer satisfaction through trained staff and quality service at every touchpoint.' },
  { icon: FaLeaf, title: 'Sustainable Operational Practices', desc: 'Upholding environmental standards and responsible practices across all our operations.' },
];

export default function About() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  return (
    <div>
      <SEO title="About Us" description="Learn about Reliance Oil Limited — NPA licensed petroleum company founded in 2020, operating 33+ stations across 6 regions in Ghana." path="/about" />
      <PageHero
        title="About Us"
        subtitle="Powering Ghana's growth through quality petroleum products and exceptional service since 2020."
        breadcrumb={[{ label: 'About Us', path: '/about' }]}
        bgImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=85"
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <SectionLabel text="Our Story" light={true} />
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#0D0D0D', marginBottom: '16px', lineHeight: 1.2 }}>
                Built on Integrity, Driven by Excellence
              </h2>
              <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '16px', fontSize: '0.95rem' }}>
                Reliance Oil Limited is a private limited liability company incorporated under the Companies Code, 1963 (Act 179). Licensed by the National Petroleum Authority (NPA) since January 2020, we operate as an Oil Marketing Company in Ghana's downstream petroleum sector.
              </p>
              <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '16px', fontSize: '0.95rem' }}>
                Our operations span multiple regions, delivering petroleum products through a strategically positioned network of fuel stations. We are driven by excellence, safety, and a strong commitment to national development.
              </p>
              <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '28px', fontSize: '0.95rem' }}>
                With 34+ stations and a rapidly growing presence across 6 regions of Ghana, Reliance Oil Limited continues to expand its capacity to serve individuals, businesses, and industries with reliable and quality petroleum products.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0 }} />
                  <span style={{ color: '#444', fontSize: '0.9rem' }}>34+ stations across 6 regions of Ghana</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0 }} />
                  <span style={{ color: '#444', fontSize: '0.9rem' }}>NPA-licensed and GSA-certified petroleum products</span>
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <div
                style={{
                  height: '420px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #0D0D0D, #1a0000 50%, #CC0000)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '6rem', color: 'rgba(255,215,0,0.2)', lineHeight: 1 }}>★</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '8px' }}>NPA Licensed Since</span>
                <span style={{ fontWeight: 900, fontSize: '4rem', color: '#FFD700', lineHeight: 1.1 }}>2020</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', letterSpacing: '0.1em', marginTop: '4px' }}>Reliance Oil</span>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  {[{ value: '34+', label: 'Stations' }, { value: '5+', label: 'Years' }, { value: '6', label: 'Regions' }].map((stat) => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#FFD700', fontSize: '1.25rem' }}>{stat.value}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Our Purpose" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              What Drives Us Forward
            </h2>
          </div>
          <div className="rg2">
            <div
              data-aos="zoom-in"
              data-aos-delay="0"
              style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
            >
              <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF2F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FaBullseye style={{ fontSize: '1.875rem', color: '#CC0000' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: '#CC0000', borderRadius: '2px' }} />
                <span style={{ color: '#CC0000', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>OUR MISSION</span>
              </div>
              <h3 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: '1.25rem', marginBottom: '16px' }}>Leading Supplier of Petroleum Products</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>
                To become a leading supplier of petroleum products in Ghana while contributing to economic growth and transformation.
              </p>
            </div>

            <div
              data-aos="zoom-in"
              data-aos-delay="100"
              style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}
            >
              <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF2F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FaEye style={{ fontSize: '1.875rem', color: '#CC0000' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: '#CC0000', borderRadius: '2px' }} />
                <span style={{ color: '#CC0000', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>OUR VISION</span>
              </div>
              <h3 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: '1.25rem', marginBottom: '16px' }}>Leading Oil Marketing Company in Ghana</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>
                To be the leading Oil Marketing Company in Ghana and a centre of excellence in petroleum retailing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Core Values" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              The Principles That Guide Us
            </h2>
          </div>
          <div className="rg3">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    backgroundColor: '#F8F8F8',
                    borderRadius: '16px',
                    padding: '32px',
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Icon style={{ fontSize: '1.25rem', color: '#CC0000' }} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem', marginBottom: '8px' }}>{val.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{val.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#111111' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Our Journey" light={false} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#ffffff', textAlign: 'center', lineHeight: 1.2 }}>
              Milestones That Define Us
            </h2>
          </div>
          <div className="rc" style={{ maxWidth: '48rem' }}>
            {milestones.map((item, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '40px' }}
              >
                <span style={{ backgroundColor: '#CC0000', color: '#fff', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, marginTop: '2px' }}>
                  {item.year}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Growth Strategy" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              Our Growth Strategy
            </h2>
          </div>
          <div className="rg2">
            {growthStrategy.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '36px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                >
                  <div style={{ width: '52px', height: '52px', backgroundColor: '#FEF2F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ fontSize: '1.25rem', color: '#CC0000' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0D0D0D', fontSize: '1rem', marginBottom: '8px' }}>{item.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Business Location" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              Where to Find Us
            </h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              data-aos="zoom-in"
              style={{
                backgroundColor: '#F8F8F8',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '560px',
                width: '100%',
                border: '1px solid #f0f0f0',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, color: '#CC0000', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Head Office</div>
                <div style={{ color: '#0D0D0D', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Bortianor (Raliance), Winneba road,<br />
                  Tokusemitsigani/Weija 162
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, color: '#CC0000', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Digital Address</div>
                <div style={{ color: '#0D0D0D', fontWeight: 600, fontSize: '0.95rem' }}>GS-0162-3129</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, color: '#CC0000', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Postal Address</div>
                <div style={{ color: '#0D0D0D', fontWeight: 600, fontSize: '0.95rem' }}>P.O. Box 164, Apam</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#CC0000', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Contact Office</div>
                <div style={{ color: '#0D0D0D', fontWeight: 600, fontSize: '0.95rem' }}>Tema, Community 7</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/contact"
              style={{
                backgroundColor: '#FFD700',
                color: '#111',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFE033'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Get In Touch <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
