import { motion } from 'framer-motion';
import DunamisLogo from './DunamisLogo';

const TAGLINE = 'Premium Real Estate. Engineered for Excellence.';

const rings = [
  { size: 500, tiltX: 70, duration: '14s', color: 'rgba(249,115,22,0.18)', bw: '1.5px', dir: 1 },
  { size: 350, tiltX: 66, duration: '9s',  color: 'rgba(255,255,255,0.10)', bw: '1.5px', dir: -1 },
  { size: 650, tiltX: 76, duration: '22s', color: 'rgba(249,115,22,0.07)', bw: '1px',   dir: 1 },
  { size: 210, tiltX: 60, duration: '6s',  color: 'rgba(255,255,255,0.08)', bw: '1px',   dir: -1 },
];

export default function DunamisLoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ backgroundColor: '#1B1F3B', overflow: 'hidden' }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}>
      <style>{`
        @keyframes ls-spin-cw  { from { transform: rotateX(var(--tx)) rotateZ(0deg); }   to { transform: rotateX(var(--tx)) rotateZ(360deg); } }
        @keyframes ls-spin-ccw { from { transform: rotateX(var(--tx)) rotateZ(0deg); }   to { transform: rotateX(var(--tx)) rotateZ(-360deg); } }
        @keyframes ls-dot      { from { transform: rotateX(70deg) rotateZ(0deg); }        to { transform: rotateX(70deg) rotateZ(360deg); } }
        @keyframes ls-dot2     { from { transform: rotateX(66deg) rotateZ(0deg); }        to { transform: rotateX(66deg) rotateZ(-360deg); } }
      `}</style>

      {rings.map((r, i) => (
        <div key={i} style={{
          position: 'absolute', width: r.size, height: r.size,
          top: '50%', left: '50%', marginTop: -r.size / 2, marginLeft: -r.size / 2,
          borderRadius: '50%', border: `${r.bw} solid ${r.color}`,
          '--tx': `${r.tiltX}deg`,
          animation: `${r.dir === 1 ? 'ls-spin-cw' : 'ls-spin-ccw'} ${r.duration} linear infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ position: 'absolute', width: 500, height: 500, top: '50%', left: '50%', marginTop: -250, marginLeft: -250, animation: 'ls-dot 14s linear infinite', pointerEvents: 'none' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#F97316', position: 'absolute', top: -4, left: '50%', marginLeft: -4, boxShadow: '0 0 8px 3px rgba(249,115,22,0.7)' }} />
      </div>
      <div style={{ position: 'absolute', width: 350, height: 350, top: '50%', left: '50%', marginTop: -175, marginLeft: -175, animation: 'ls-dot2 9s linear infinite', pointerEvents: 'none' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', position: 'absolute', top: -3, left: '50%', marginLeft: -3, boxShadow: '0 0 5px 2px rgba(255,255,255,0.5)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <DunamisLogo height={72} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', letterSpacing: '0.08em', textAlign: 'center', minHeight: '1.5rem' }}>
          {TAGLINE}
        </p>
        <div style={{ width: '220px', height: '3px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            style={{ height: '100%', borderRadius: '9999px', background: 'linear-gradient(to right, #F97316, #FFFFFF)' }}
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }} />
        </div>
      </div>
    </motion.div>
  );
}
