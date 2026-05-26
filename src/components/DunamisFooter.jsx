import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaLocationDot, FaArrowRight } from 'react-icons/fa6';
import DunamisLogo from './DunamisLogo';

const ORANGE = '#F97316';

const quickLinks = [
  { label: 'Home', path: '/dunamis' },
  { label: 'Buy Property', path: '/dunamis/properties?intent=Buy' },
  { label: 'Rent Property', path: '/dunamis/properties?intent=Rent' },
  { label: 'Our Services', path: '/dunamis/services' },
  { label: 'About Us', path: '/dunamis/about' },
  { label: 'Contact', path: '/dunamis/contact' },
];

const propertyTypes = [
  { label: 'Residential Homes', path: '/dunamis/properties?type=Residential' },
  { label: 'Luxury Estates', path: '/dunamis/properties?type=Luxury' },
  { label: 'Industrial / Commercial', path: '/dunamis/properties?type=Industrial' },
  { label: 'Land Plots', path: '/dunamis/properties?type=Land+Plots' },
];

const socials = [
  { Icon: FaFacebookF, url: '#', label: 'Facebook' },
  { Icon: FaTwitter, url: '#', label: 'X / Twitter' },
  { Icon: FaInstagram, url: '#', label: 'Instagram' },
  { Icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
  { Icon: FaYoutube, url: '#', label: 'YouTube' },
];

export default function DunamisFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = () => {
    const t = email.trim();
    if (!t || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) { setStatus('invalid'); return; }
    setStatus('success');
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#0F1020', color: '#ffffff' }}>
      <div className="rc footer-grid" style={{ padding: '64px 24px', gap: '40px' }}>
        <div>
          <DunamisLogo height={56} />
          <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', maxWidth: '22rem', lineHeight: 1.7 }}>
            Dunamis Estates is a premier property and project development ecosystem connecting buyers, renters, and investors with world-class real estate across Ghana and beyond.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {socials.map(({ Icon, url, label }, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Quick Links</h4>
          <nav>
            {quickLinks.map(link => (
              <Link key={link.label} to={link.path}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                <FaArrowRight size={10} style={{ color: ORANGE, flexShrink: 0 }} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Property Types</h4>
          <nav>
            {propertyTypes.map(link => (
              <Link key={link.label} to={link.path}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                <FaArrowRight size={10} style={{ color: ORANGE, flexShrink: 0 }} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Get In Touch</h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
            <FaLocationDot size={14} style={{ color: ORANGE, flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>15 Estates Boulevard, Airport City, Accra, Ghana</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <FaPhone size={13} style={{ color: ORANGE, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>+233 (0) 30 290 0000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <FaEnvelope size={13} style={{ color: ORANGE, flexShrink: 0 }} />
            <a href="mailto:info@dunamisestates.com" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = ORANGE}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              info@dunamisestates.com
            </a>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Stay Updated</p>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="Your email address" value={email}
              onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', borderRadius: '9999px 0 0 9999px', padding: '10px 16px', fontSize: '0.875rem', color: '#ffffff', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = ORANGE}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
            <button onClick={handleSubscribe}
              style={{ backgroundColor: ORANGE, color: '#ffffff', padding: '10px 20px', borderRadius: '0 9999px 9999px 0', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EA6C0A'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = ORANGE}>
              →
            </button>
          </div>
          {status === 'success' && <p style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '8px' }}>Subscribed! Thank you.</p>}
          {status === 'invalid' && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '8px' }}>Enter a valid email.</p>}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>© {new Date().getFullYear()} Dunamis Estates. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link to="/dunamis/privacy" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>Privacy Policy</Link>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}> · </span>
            <Link to="/dunamis/terms" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr !important; } }
      `}</style>
    </footer>
  );
}
