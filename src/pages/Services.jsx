import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  FaGasPump,
  FaTruck,
  FaOilCan,
  FaFire,
  FaCar,
  FaShoppingCart,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function getServiceIcon(iconName) {
  switch (iconName) {
    case 'FaGasPump': return <FaGasPump />;
    case 'FaTruck': return <FaTruck />;
    case 'FaOilCan': return <FaOilCan />;
    case 'FaFire': return <FaFire />;
    case 'FaCar': return <FaCar />;
    case 'FaShoppingCart': return <FaShoppingCart />;
    case 'FaChartLine': return <FaChartLine />;
    default: return <FaGasPump />;
  }
}

const stats = [
  { value: '30+', label: 'Stations' },
  { value: '19+', label: 'Years' },
  { value: '50k+', label: 'Daily Customers' },
  { value: '15+', label: 'Products' },
];

export default function Services() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('services').select('*').order('order_index').then(({ data, error }) => {
      if (!error && data) setServicesData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive petroleum and energy solutions for individuals, businesses and fleets across Ghana."
        breadcrumb={[{ label: 'Services', path: '/services' }]}
        bgImage="https://images.unsplash.com/photo-1562757219-2ffc897f99e3?w=1600&q=85"
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="What We Offer" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              End-to-End Petroleum Solutions
            </h2>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Loading services...</div>
          ) : (
          <div className="rg3" style={{ marginTop: '48px' }}>
            {servicesData.map((service, index) => (
              <div
                key={service.id}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #f3f4f6',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '60px', height: '60px', backgroundColor: '#FFF0F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '24px', color: '#CC0000' }}>
                  {getServiceIcon(service.icon)}
                </div>
                <div style={{ fontWeight: 700, color: '#111', fontSize: '1.1rem', marginBottom: '12px' }}>{service.title}</div>
                <div style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>{service.description}</div>
                <div style={{ marginBottom: '24px' }}>
                  {service.features.map((feature, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FaCheckCircle style={{ fontSize: '12px', color: '#CC0000', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '24px', paddingTop: '24px' }}>
                  <Link
                    to="/contact"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#CC0000',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'gap 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.gap = '10px'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.gap = '6px'; }}
                  >
                    Enquire Now <FaArrowRight style={{ fontSize: '10px' }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#111111' }}>
        <div className="rc">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <SectionLabel text="Our Advantage" light={false} />
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#ffffff', lineHeight: 1.2, marginBottom: '20px' }}>
                Why Businesses Choose Reliance Oil
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: 1.7 }}>
                From individual consumers to large enterprises, Reliance Oil delivers consistent quality, nationwide reach, and dedicated support that businesses can depend on.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['GSA certified quality products', 'Nationwide coverage across all regions', '24/7 customer support', 'Flexible bulk supply contracts'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCheckCircle style={{ color: '#FFD700', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-aos="fade-left">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: '2rem', color: '#FFD700', marginBottom: '4px' }}>{stat.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#CC0000', textAlign: 'center' }}>
        <div className="rc">
          <h2 style={{ color: '#ffffff', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: '16px', lineHeight: 1.2 }}>
            Need Bulk Fuel Supply?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.125rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Contact us today for customized bulk fuel solutions for your business.
          </p>
          <Link
            to="/contact"
            style={{
              backgroundColor: '#FFD700',
              color: '#111',
              padding: '16px 40px',
              borderRadius: '9999px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'background-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFE033'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Get a Free Quote <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
