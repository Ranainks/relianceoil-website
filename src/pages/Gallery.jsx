import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight, FaImages } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const categories = ['All', 'Events', 'Stations', 'Community', 'Team'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
    supabase.from('gallery').select('*').order('order_index').then(({ data, error }) => {
      if (!error && data) setGalleryItems(data);
      setLoading(false);
    });
  }, []);

  const filteredItems = activeFilter === 'All' ? galleryItems : galleryItems.filter((i) => i.category === activeFilter);

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () => setLightboxIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
  const nextImage = () => setLightboxIndex((i) => (i + 1) % filteredItems.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, filteredItems.length]);

  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="A visual journey through Reliance Oil's stations, events, and community impact across Ghana."
        breadcrumb={[{ label: 'Gallery', path: '/gallery' }]}
        bgImage="https://images.unsplash.com/photo-1562757219-2ffc897f99e3?w=1600&q=85"
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
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none',
                  ...(activeFilter === cat
                    ? { backgroundColor: '#CC0000', color: 'white' }
                    : { backgroundColor: '#F5F5F5', color: '#666' }),
                }}
                onMouseEnter={(e) => { if (activeFilter !== cat) e.currentTarget.style.backgroundColor = '#EBEBEB'; }}
                onMouseLeave={(e) => { if (activeFilter !== cat) e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
              >
                {cat}
                {cat !== 'All' && (
                  <span style={{ marginLeft: '6px', fontSize: '0.7rem', opacity: 0.7 }}>
                    ({galleryItems.filter(i => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="rs" style={{ backgroundColor: '#F8F8F8', minHeight: 500 }}>
        <div className="rc">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <FaImages size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <FaImages size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No images in this category yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="masonry"
              >
                {filteredItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="masonry-item"
                    data-aos="fade-up"
                    data-aos-delay={i * 40}
                    style={{ marginBottom: '1rem', position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => openLightbox(i)}
                  >
                    <div style={{ position: 'relative', height: i % 3 === 0 ? '16rem' : i % 3 === 1 ? '12rem' : '14rem' }}>
                      <img
                        src={item.image_url}
                        alt={item.caption}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                          opacity: 0, transition: 'opacity 0.3s',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                      >
                        <FaExpand size={20} color="white" />
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase', backgroundColor: '#FFD700', color: '#111' }}>
                          {item.category}
                        </span>
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}>
                        <p style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{item.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
          >
            <button onClick={closeLightbox} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <FaTimes size={16} />
            </button>
            <button onClick={prevImage} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaChevronLeft size={16} />
            </button>
            <button onClick={nextImage} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaChevronRight size={16} />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: '900px', maxHeight: '85vh', width: '90%', position: 'relative' }}
            >
              <img
                src={filteredItems[lightboxIndex].image_url}
                alt={filteredItems[lightboxIndex].caption}
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }}
              />
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{filteredItems[lightboxIndex].caption}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {lightboxIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
