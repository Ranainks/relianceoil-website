import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import SectionLabel from './SectionLabel';

export default function PageHero({ title, subtitle, breadcrumb, bgImage, bgOpacity = 0.22 }) {
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '60px', position: 'relative', overflow: 'hidden', backgroundColor: '#0D0D0D' }}>
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.75) 60%, rgba(5,5,5,0.55) 100%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', background: 'linear-gradient(to left, rgba(204,0,0,0.07), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 2, pointerEvents: 'none' }} />
      <div className="rc" style={{ position: 'relative', zIndex: 10, paddingTop: '32px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {breadcrumb && breadcrumb.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '24px', flexWrap: 'wrap' }}>
              <Link
                to="/"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <FaHome size={10} />
                Home
              </Link>
              {breadcrumb.map((crumb, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaChevronRight size={8} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  {i < breadcrumb.length - 1 ? (
                    <Link
                      to={crumb.path}
                      style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <SectionLabel text="Reliance Oil Limited" light={false} />
          <h1 style={{ color: '#ffffff', fontWeight: '800', fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.15, marginBottom: subtitle ? '12px' : '0' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: '560px', lineHeight: 1.65 }}>
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
