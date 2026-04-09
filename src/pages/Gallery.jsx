import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SectionLabel from '../components/SectionLabel';
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categories = ['All', 'Stations', 'Events', 'Community', 'Team'];

const galleryItems = [
  { id: 1, title: 'Accra Central Station', category: 'Stations', color: 'linear-gradient(135deg,#CC0000,#990000)' },
  { id: 2, title: 'Kumasi Main Station', category: 'Stations', color: 'linear-gradient(135deg,#AA0000,#660000)' },
  { id: 3, title: 'Annual Staff Event 2024', category: 'Events', color: 'linear-gradient(135deg,#1a1a6a,#111144)' },
  { id: 4, title: 'Community Clean-Up Drive', category: 'Community', color: 'linear-gradient(135deg,#006600,#003300)' },
  { id: 5, title: 'Leadership Team 2024', category: 'Team', color: 'linear-gradient(135deg,#4d3300,#1a1100)' },
  { id: 6, title: 'Takoradi Station', category: 'Stations', color: 'linear-gradient(135deg,#CC2200,#881100)' },
  { id: 7, title: 'Customer Appreciation Day', category: 'Events', color: 'linear-gradient(135deg,#002266,#001133)' },
  { id: 8, title: 'School Donation Program', category: 'Community', color: 'linear-gradient(135deg,#004400,#002200)' },
  { id: 9, title: 'Operations Team', category: 'Team', color: 'linear-gradient(135deg,#332200,#1a1100)' },
  { id: 10, title: 'Tamale North Station', category: 'Stations', color: 'linear-gradient(135deg,#BB1100,#770000)' },
  { id: 11, title: 'Safety Training Day', category: 'Events', color: 'linear-gradient(135deg,#1a0044,#0d0022)' },
  { id: 12, title: 'Tree Planting Initiative', category: 'Community', color: 'linear-gradient(135deg,#005500,#002200)' },
  { id: 13, title: 'Management Team Retreat', category: 'Team', color: 'linear-gradient(135deg,#442200,#221100)' },
  { id: 14, title: 'Tema Port Station', category: 'Stations', color: 'linear-gradient(135deg,#DD1100,#881100)' },
  { id: 15, title: 'Product Launch Event', category: 'Events', color: 'linear-gradient(135deg,#110044,#080022)' },
  { id: 16, title: 'Youth Empowerment Program', category: 'Community', color: 'linear-gradient(135deg,#007700,#003300)' },
  { id: 17, title: 'Service Team Champions', category: 'Team', color: 'linear-gradient(135deg,#553300,#221100)' },
  { id: 18, title: 'Ho Station Opening', category: 'Stations', color: 'linear-gradient(135deg,#CC0000,#880000)' },
  { id: 19, title: 'Sustainability Forum 2025', category: 'Events', color: 'linear-gradient(135deg,#220055,#110033)' },
  { id: 20, title: 'Community Health Fair', category: 'Community', color: 'linear-gradient(135deg,#006600,#004400)' },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  const filteredItems =
    activeFilter === 'All' ? galleryItems : galleryItems.filter((i) => i.category === activeFilter);

  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="A visual journey through Reliance Oil's stations, events, and community impact across Ghana."
        breadcrumb={[{ label: 'Gallery', path: '/gallery' }]}
      />

      <div className="rs-sm" style={{ backgroundColor: '#ffffff', position: 'sticky', top: '72px', zIndex: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="rc">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none',
                  ...(activeFilter === cat
                    ? { backgroundColor: '#0D0D0D', color: 'white' }
                    : { backgroundColor: '#F5F5F5', color: '#666' }),
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== cat) e.currentTarget.style.backgroundColor = '#EBEBEB';
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== cat) e.currentTarget.style.backgroundColor = '#F5F5F5';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="rs" style={{ backgroundColor: '#F8F8F8', minHeight: 500 }}>
        <div className="rc">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="masonry"
            >
              {filteredItems.map((item, i) => (
                <div
                  key={item.id}
                  className="masonry-item"
                  style={{
                    marginBottom: '1rem',
                    position: 'relative',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setLightboxIndex(filteredItems.indexOf(item));
                    setLightboxOpen(true);
                  }}
                >
                  <div
                    className="group"
                    style={{
                      position: 'relative',
                      background: item.color,
                      height: i % 2 === 0 ? '12rem' : '16rem',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <FaExpand size={20} color="white" />
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          backgroundColor: '#FFD700',
                          color: '#111',
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 500, textAlign: 'center', padding: '0 0.75rem' }}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: '48rem', width: '100%', margin: '0 1rem', position: 'relative' }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                }}
                onClick={() => setLightboxOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
              >
                <FaTimes />
              </button>

              <button
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                }}
                onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
              >
                <FaChevronLeft />
              </button>

              <button
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                }}
                onClick={() =>
                  setLightboxIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev))
                }
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
              >
                <FaChevronRight />
              </button>

              <div
                style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '65vh',
                  background: filteredItems[lightboxIndex]?.color,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
                  {filteredItems[lightboxIndex]?.title}
                </span>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1.125rem' }}>
                  {filteredItems[lightboxIndex]?.title}
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    backgroundColor: '#FFD700',
                    color: '#111',
                  }}
                >
                  {filteredItems[lightboxIndex]?.category}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
