import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaPhone } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import Logo from './Logo';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    dropdown: [
      { label: 'Fuel Retail', path: '/services' },
      { label: 'Bulk Supply', path: '/services' },
      { label: 'Car Wash', path: '/services' },
      { label: 'Fleet Management', path: '/services' },
    ],
  },
  {
    label: 'Products',
    path: '/products',
    dropdown: [
      { label: 'Petrol', path: '/products' },
      { label: 'Diesel', path: '/products' },
    ],
  },
  { label: 'Find a Station', path: '/find-station' },
  { label: 'News', path: '/news' },
  {
    label: 'More',
    path: '#',
    dropdown: [
      { label: 'Our Team', path: '/our-team' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Careers', path: '/careers' },
      { label: 'Safety & HSE', path: '/safety' },
    ],
  },
];

const mobileExpandable = ['Services', 'Products', 'More'];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded({});
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMobileSection = (label) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path) => path !== '#' && location.pathname === path;

  return (
    <nav style={{ backgroundColor: '#0D0D0D', position: 'sticky', top: 0, zIndex: 50, height: '72px', display: 'flex', alignItems: 'center' }}>
      <div className="rc" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo height={58} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '0.875rem' }}>Reliance Oil</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Limited</span>
          </div>
        </Link>

        <ul style={{ display: 'none', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }} className="desktop-nav">
          {navLinks.map((link) => (
            <li
              key={link.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
            >
              {link.dropdown ? (
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', fontSize: '0.875rem', fontWeight: '500', color: isActive(link.path) ? '#FFD700' : 'rgba(255,255,255,0.75)', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = '#FFD700'; }}
                  onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  {link.label}
                  <FaChevronDown size={9} style={{ transition: 'transform 0.2s', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
              ) : (
                <Link
                  to={link.path}
                  style={{ display: 'block', padding: '8px 12px', fontSize: '0.875rem', fontWeight: '500', color: isActive(link.path) ? '#FFD700' : 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = '#FFD700'; }}
                  onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  {link.label}
                </Link>
              )}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', backgroundColor: '#1a1a1a', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)', minWidth: '192px', padding: '8px 0' }}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s, background-color 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD700'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#CC0000', marginRight: '8px', flexShrink: 0 }} />
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/quote"
            className="cta-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#CC0000', color: '#ffffff', padding: '7px 14px', borderRadius: '9999px', fontWeight: '700', fontSize: '0.8rem', textDecoration: 'none', transition: 'background-color 0.2s, transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#aa0000'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#CC0000'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Request Quote
            <FaArrowRight size={12} />
          </Link>

          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', padding: '8px' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }} style={{ display: 'block' }}>
                  <FaTimes size={20} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }} style={{ display: 'block' }}>
                  <FaBars size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'absolute', top: '72px', left: 0, right: 0 }}
          >
            <div style={{ padding: '16px 24px' }}>
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileSection(link.label)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.75)', padding: '12px 0', fontSize: '0.875rem', fontWeight: '500', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' }}
                      >
                        {link.label}
                        <FaChevronDown size={10} style={{ transition: 'transform 0.2s', transform: mobileExpanded[link.label] ? 'rotate(180deg)' : 'rotate(0deg)', color: 'rgba(255,255,255,0.4)' }} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded[link.label] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0 10px 16px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                              >
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#CC0000', flexShrink: 0 }} />
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', padding: '12px 0', fontSize: '0.875rem', fontWeight: '500', color: isActive(link.path) ? '#FFD700' : 'rgba(255,255,255,0.75)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = '#FFD700'; }}
                      onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                to="/quote"
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#CC0000', color: '#ffffff', borderRadius: '9999px', padding: '12px 0', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', marginTop: '16px' }}
              >
                Request Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
          .cta-btn { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
