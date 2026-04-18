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
    supabase.from('services').select('*').not('slug', 'in', '("lpg-supply","lubricants-oils")').order('order_index').then(({ data, error }) => {
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
        bgImage="https://muutovkfdnabmeueqfiz.supabase.co/storage/v1/object/public/hero_slides/services-hero.jpg.JPG"
      />

      <section className="rs" style={{ backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>

        <svg aria-hidden="true" style={{ position: 'absolute', top: '-80px', right: '-120px', width: '520px', height: '520px', opacity: 0.055, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#CC0000" d="M44,-65C56.5,-56.3,65.7,-42.8,70.8,-27.8C75.9,-12.8,76.9,3.8,72.4,19.1C67.9,34.4,57.9,48.5,44.6,58.2C31.3,67.9,14.7,73.2,-1.5,75C-17.7,76.8,-33.4,75.1,-46.4,67.3C-59.4,59.5,-69.7,45.6,-74.1,29.9C-78.5,14.2,-77,3.4,-71.9,-13.2C-66.8,-29.8,-58.1,-46.1,-45.3,-54.8C-32.5,-63.5,-15.4,-64.5,0.8,-65.6C17,-66.7,31.5,-73.7,44,-65Z" transform="translate(100 100)" />
        </svg>

        <svg aria-hidden="true" style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '480px', height: '480px', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFD700" d="M39.5,-52.8C50.3,-44.8,57.5,-31.5,62.4,-16.7C67.3,-1.9,69.9,14.3,65.6,28.7C61.3,43.1,50.1,55.7,36.4,63.1C22.7,70.5,6.5,72.7,-9.4,71C-25.3,69.3,-40.9,63.7,-52.3,53.3C-63.7,42.9,-71,27.6,-72.6,11.6C-74.2,-4.4,-70.1,-21.1,-61.3,-34.2C-52.5,-47.3,-39,-56.8,-25,-61.1C-11,-65.4,3.5,-64.5,17.5,-60.5C31.5,-56.5,28.7,-60.8,39.5,-52.8Z" transform="translate(100 100)" />
        </svg>

        <svg aria-hidden="true" style={{ position: 'absolute', top: '40%', right: '-60px', width: '280px', height: '280px', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#CC0000" d="M53.5,-63.1C67.7,-52.7,76.5,-34.8,78.1,-16.7C79.7,1.4,74.1,19.7,64.1,34.8C54.1,49.9,39.7,61.8,22.9,69.3C6.1,76.8,-13.1,79.9,-29.1,74.3C-45.1,68.7,-57.9,54.4,-66.2,38C-74.5,21.6,-78.3,3.1,-75,-14C-71.7,-31.1,-61.3,-46.8,-47.3,-57.3C-33.3,-67.8,-15.6,-73.1,2.4,-75.9C20.4,-78.7,39.3,-73.5,53.5,-63.1Z" transform="translate(100 100)" />
        </svg>

        <svg aria-hidden="true" style={{ position: 'absolute', top: '15%', left: '30%', width: '180px', height: '180px', opacity: 0.035, pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFD700" d="M47.3,-58.2C59.1,-47.4,64.9,-30.4,67.8,-12.8C70.7,4.8,70.7,23,63,37.4C55.3,51.8,39.9,62.4,22.9,68.4C5.9,74.4,-12.7,75.8,-29.1,69.8C-45.5,63.8,-59.7,50.4,-67.8,33.7C-75.9,17,-77.9,-3,-72.9,-20.6C-67.9,-38.2,-55.9,-53.4,-41.5,-64.1C-27.1,-74.8,-10.3,-80.9,4.8,-86.8C19.9,-92.7,35.5,-69,47.3,-58.2Z" transform="translate(100 100)" />
        </svg>

        <div className="rc" style={{ position: 'relative', zIndex: 1 }}>
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
                    to={`/services/${service.slug}`}
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
                    Read More <FaArrowRight style={{ fontSize: '10px' }} />
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
