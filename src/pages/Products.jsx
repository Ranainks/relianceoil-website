import productsData from '../data/products.json';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SectionLabel from '../components/SectionLabel';
import { FaGasPump, FaTruck, FaOilCan, FaAward, FaShieldAlt, FaLeaf } from 'react-icons/fa';

const tabs = [
  { id: 'petrol', label: 'Petrol', icon: FaGasPump },
  { id: 'diesel', label: 'Diesel', icon: FaTruck },
  { id: 'lubricants', label: 'Lubricants', icon: FaOilCan },
];

const tabGradients = {
  petrol: 'linear-gradient(135deg, #CC0000, #FF4444)',
  diesel: 'linear-gradient(135deg, #111, #333)',
  lubricants: 'linear-gradient(135deg, #CC0000, #FF8C00)',
};

const qualityItems = [
  { icon: FaAward, title: 'GSA Certified', text: 'All products certified by Ghana Standards Authority.' },
  { icon: FaShieldAlt, title: 'Quality Tested', text: 'Rigorous testing at every stage of supply chain.' },
  { icon: FaLeaf, title: 'Eco-Friendly', text: 'Committed to reducing environmental impact.' },
];

export default function Products() {
  const [activeTab, setActiveTab] = useState('petrol');

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  const ActiveTabIcon = tabs.find((t) => t.id === activeTab)?.icon || FaGasPump;

  return (
    <div>
      <PageHero
        title="Our Products"
        subtitle="Quality petroleum products meeting Ghana Standards Authority specifications."
        breadcrumb={[{ label: 'Products', path: '/products' }]}
        bgImage="https://images.unsplash.com/photo-1700051351886-7c9f812563da?w=1600&q=85"
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Product Range" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              Our Petroleum Products
            </h2>
          </div>

          <div className="rf-center" style={{ marginTop: '40px', marginBottom: '56px', gap: '12px', flexWrap: 'wrap' }}>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, color 0.2s',
                    backgroundColor: isActive ? '#0D0D0D' : '#F5F5F5',
                    color: isActive ? '#ffffff' : '#666',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#EBEBEB'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
                >
                  <TabIcon />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rg3"
            >
              {productsData[activeTab].map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #f3f4f6',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '176px', background: tabGradients[activeTab], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ActiveTabIcon style={{ fontSize: '3.75rem', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111', marginBottom: '8px' }}>{product.name}</div>
                    <div style={{ color: '#888', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.6 }}>{product.description}</div>
                    <div style={{ backgroundColor: '#F8F8F8', borderRadius: '12px', padding: '16px' }}>
                      <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                        <tbody>
                          {Object.entries(product.specs).map(([key, value]) => (
                            <tr key={key}>
                              <td style={{ color: '#9ca3af', paddingTop: '6px', paddingBottom: '6px' }}>{key}</td>
                              <td style={{ color: '#374151', fontWeight: 500, textAlign: 'right', paddingTop: '6px', paddingBottom: '6px' }}>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
            <div style={{ width: 'fit-content' }}>
              <SectionLabel text="Quality First" light={true} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center', lineHeight: 1.2 }}>
              Our Quality Guarantee
            </h2>
          </div>
          <div className="rg3">
            {qualityItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#FFF0F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', color: '#CC0000' }}>
                    <Icon />
                  </div>
                  <div style={{ fontWeight: 700, color: '#111', marginBottom: '12px' }}>{item.title}</div>
                  <div style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
