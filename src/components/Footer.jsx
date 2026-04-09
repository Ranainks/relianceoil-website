import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaLocationDot, FaArrowRight } from 'react-icons/fa6';
import Logo from './Logo';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Services', path: '/services' },
  { label: 'Find a Station', path: '/find-station' },
  { label: 'News', path: '/news' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact Us', path: '/contact' },
];

const hseLinks = [
  { label: 'Safety & HSE', path: '/safety' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms & Conditions', path: '/terms' },
];

const socialIcons = [
  { Icon: FaFacebookF, url: 'https://www.facebook.com/reubeeni.annan', label: 'Facebook' },
  { Icon: FaTwitter, url: 'https://x.com/ranainks_brandi', label: 'X' },
  { Icon: FaInstagram, url: 'https://www.instagram.com/ranainks_brandi', label: 'Instagram' },
  { Icon: FaLinkedinIn, url: 'https://www.linkedin.com/in/reuben-annang-aa5082191/', label: 'LinkedIn' },
  { Icon: FaYoutube, url: 'https://www.youtube.com/@claysavvy', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D0D0D', color: '#ffffff' }}>
      <div className="rc footer-grid" style={{ padding: '64px 24px', gap: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo height={42} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1rem' }}>Reliance Oil</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Limited</span>
            </div>
          </div>
          <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', maxWidth: '20rem', lineHeight: 1.65 }}>
            Licensed by the National Petroleum Authority (NPA), powering Ghana's growth through quality fuel and service across 34+ stations.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {socialIcons.map(({ Icon, url, label }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Quick Links</h4>
          <nav>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                <FaArrowRight size={10} style={{ color: '#CC0000', flexShrink: 0 }} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Safety & HSE</h4>
          <nav>
            {hseLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                <FaArrowRight size={10} style={{ color: '#CC0000', flexShrink: 0 }} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Contact Us</h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <FaLocationDot size={14} style={{ color: '#CC0000', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Bortianor (Radiance), Winneba Road, Weija 162, Ghana</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FaPhone size={13} style={{ color: '#CC0000', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>+233 30 222 0000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaEnvelope size={13} style={{ color: '#CC0000', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>info@relianceoilgh.com</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Stay Updated</p>
            <div style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Your email"
                style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', borderRadius: '9999px 0 0 9999px', padding: '10px 16px', fontSize: '0.875rem', color: '#ffffff', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FFD700'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                style={{ backgroundColor: '#FFD700', color: '#000000', padding: '10px 20px', borderRadius: '0 9999px 9999px 0', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE033'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD700'}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>© 2025 Reliance Oil Limited. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link
              to="/privacy"
              style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              Privacy Policy
            </Link>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}> · </span>
            <Link
              to="/terms"
              style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
}
