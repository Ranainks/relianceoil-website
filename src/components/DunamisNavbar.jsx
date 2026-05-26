import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import DunamisLogo from './DunamisLogo';

const NAV = '#1B1F3B';
const ORANGE = '#F97316';

const navLinks = [
  { label: 'Home', path: '/dunamis' },
  { label: 'About', path: '/dunamis/about' },
  {
    label: 'Properties',
    path: '/dunamis/properties',
    dropdown: [
      { label: 'Buy Property', path: '/dunamis/properties?intent=Buy' },
      { label: 'Rent Property', path: '/dunamis/properties?intent=Rent' },
      { label: 'Lease Commercial', path: '/dunamis/properties?intent=Lease' },
      { label: 'Land Plots', path: '/dunamis/properties?type=Land+Plots' },
      { label: 'Luxury Homes', path: '/dunamis/properties?type=Luxury' },
    ],
  },
  {
    label: 'Services',
    path: '/dunamis/services',
    dropdown: [
      { label: 'Property Sales', path: '/dunamis/services' },
      { label: 'Rental Management', path: '/dunamis/services' },
      { label: 'Project Consultancy', path: '/dunamis/services' },
      { label: 'Valuations', path: '/dunamis/services' },
    ],
  },
  { label: 'Contact', path: '/dunamis/contact' },
];

export default function DunamisNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded({});
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobile = (label) => setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  const isActive = (path) => path !== '#' && location.pathname === path;

  return (
    <nav style={{
      backgroundColor: scrolled ? 'rgba(27,31,59,0.97)' : '#1B1F3B',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      position: 'sticky', top: 0, zIndex: 50, height: '72px',
      display: 'flex', alignItems: 'center',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(255,255,255,0.07)'
    }}>
      <div className="rc" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dunamis" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
          <DunamisLogo height={52} />
        </Link>

        <ul style={{ display: 'none', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }} className="de-nav">
          {navLinks.map((link) => (
            <li key={link.label} style={{ position: 'relative' }}
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}>
              {link.dropdown ? (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 12px', fontSize: '0.875rem', fontWeight: '500',
                  color: isActive(link.path) ? ORANGE : 'rgba(255,255,255,0.8)', transition: 'color 0.2s'
                }}
                  onMouseEnter={e => { if (!isActive(link.path)) e.currentTarget.style.color = ORANGE; }}
                  onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
                  {link.label}
                  <FaChevronDown size={9} style={{ transition: 'transform 0.2s', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
              ) : (
                <Link to={link.path} style={{
                  display: 'block', padding: '8px 12px', fontSize: '0.875rem', fontWeight: '500',
                  color: isActive(link.path) ? ORANGE : 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s'
                }}
                  onMouseEnter={e => { if (!isActive(link.path)) e.currentTarget.style.color = ORANGE; }}
                  onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
                  {link.label}
                </Link>
              )}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: '#1B1F3B', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(249,115,22,0.15)', minWidth: '210px', padding: '8px 0' }}>
                      {link.dropdown.map((item) => (
                        <Link key={item.label} to={item.path} style={{
                          display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: '0.875rem',
                          color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                          onMouseEnter={e => { e.currentTarget.style.color = ORANGE; e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ORANGE, marginRight: '10px', flexShrink: 0 }} />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/dunamis/properties" className="de-cta-2"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid rgba(255,255,255,0.25)', color: '#ffffff', padding: '7px 16px', borderRadius: '9999px', fontWeight: '600', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#ffffff'; }}>
            Browse Listings
          </Link>
          <Link to="/dunamis/contact" className="de-cta-1"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: ORANGE, color: '#ffffff', padding: '7px 18px', borderRadius: '9999px', fontWeight: '700', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EA6C0A'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ORANGE; e.currentTarget.style.transform = 'scale(1)'; }}>
            Book a Tour <FaArrowRight size={11} />
          </Link>

          <button className="de-hamburger" onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', padding: '8px' }}>
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.span key="c" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'block' }}><FaTimes size={20} /></motion.span>
                : <motion.span key="o" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'block' }}><FaBars size={20} /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="mob" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', backgroundColor: '#12162A', borderTop: '1px solid rgba(249,115,22,0.15)', position: 'absolute', top: '72px', left: 0, right: 0 }}>
            <div style={{ padding: '16px 24px' }}>
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <button onClick={() => toggleMobile(link.label)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '12px 0', fontSize: '0.875rem', fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' }}>
                        {link.label}
                        <FaChevronDown size={10} style={{ transition: 'transform 0.2s', transform: mobileExpanded[link.label] ? 'rotate(180deg)' : 'rotate(0deg)', color: 'rgba(255,255,255,0.4)' }} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded[link.label] && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                            {link.dropdown.map(item => (
                              <Link key={item.label} to={item.path} onClick={() => setMobileOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0 10px 16px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: ORANGE, flexShrink: 0 }} />
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to={link.path} onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', padding: '12px 0', fontSize: '0.875rem', fontWeight: '500', color: isActive(link.path) ? ORANGE : 'rgba(255,255,255,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => { if (!isActive(link.path)) e.currentTarget.style.color = ORANGE; }}
                      onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link to="/dunamis/contact" onClick={() => setMobileOpen(false)}
                style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: ORANGE, color: '#ffffff', borderRadius: '9999px', padding: '12px 0', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', marginTop: '16px' }}>
                Book a Tour
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .de-nav { display: flex !important; }
          .de-hamburger { display: none !important; }
          .de-cta-1, .de-cta-2 { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .de-nav { display: none !important; }
          .de-hamburger { display: block !important; }
          .de-cta-2 { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
