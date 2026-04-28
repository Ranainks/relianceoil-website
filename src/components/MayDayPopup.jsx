import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BURST = [
  { angle: 0,   dist: 110, size: 11, color: '#FFD700', shape: 'circle', delay: 0 },
  { angle: 30,  dist: 95,  size: 8,  color: '#ffffff', shape: 'rect',   delay: 0.04 },
  { angle: 60,  dist: 120, size: 9,  color: '#FFD700', shape: 'circle', delay: 0.07 },
  { angle: 90,  dist: 100, size: 12, color: '#ffffff', shape: 'circle', delay: 0.02 },
  { angle: 120, dist: 115, size: 8,  color: '#FFD700', shape: 'rect',   delay: 0.09 },
  { angle: 150, dist: 90,  size: 10, color: '#ffffff', shape: 'circle', delay: 0.05 },
  { angle: 180, dist: 105, size: 9,  color: '#FFD700', shape: 'circle', delay: 0.01 },
  { angle: 210, dist: 95,  size: 11, color: '#ffffff', shape: 'rect',   delay: 0.06 },
  { angle: 240, dist: 118, size: 8,  color: '#FFD700', shape: 'circle', delay: 0.03 },
  { angle: 270, dist: 100, size: 10, color: '#ffffff', shape: 'circle', delay: 0.08 },
  { angle: 300, dist: 108, size: 9,  color: '#FFD700', shape: 'rect',   delay: 0.04 },
  { angle: 330, dist: 92,  size: 12, color: '#ffffff', shape: 'circle', delay: 0.06 },
  { angle: 15,  dist: 130, size: 7,  color: '#FFD700', shape: 'circle', delay: 0.10 },
  { angle: 75,  dist: 125, size: 7,  color: '#ffffff', shape: 'rect',   delay: 0.11 },
  { angle: 195, dist: 128, size: 6,  color: '#FFD700', shape: 'circle', delay: 0.10 },
  { angle: 255, dist: 122, size: 7,  color: '#ffffff', shape: 'circle', delay: 0.12 },
];

function toXY(angle, dist) {
  const rad = (angle * Math.PI) / 180;
  return { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist };
}

function isMayDay() {
  const now = new Date();
  return now.getMonth() === 4 && now.getDate() === 1;
}

export default function MayDayPopup() {
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!isMayDay()) return;
    if (sessionStorage.getItem('mayday_shown')) return;
    const t = setTimeout(() => {
      if (!fired.current) { fired.current = true; setVisible(true); }
    }, 3800);
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem('mayday_shown', '1');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.06, 0.97, 1], opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '440px', borderRadius: '20px', overflow: 'visible', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' }}
          >
            {BURST.map((p, i) => {
              const { x, y } = toXY(p.angle, p.dist);
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ x, y, opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
                  transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    width: p.size,
                    height: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    backgroundColor: p.color,
                    borderRadius: p.shape === 'circle' ? '50%' : '3px',
                    pointerEvents: 'none',
                    zIndex: 2,
                    transform: p.shape === 'rect' ? 'rotate(45deg)' : undefined,
                  }}
                />
              );
            })}

            <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff' }}>
              <div style={{ background: 'linear-gradient(135deg,#CC0000 0%,#8B0000 100%)', padding: '40px 32px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '-20px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', border: '1px solid rgba(255,215,0,0.15)', pointerEvents: 'none' }} />

                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#FFD700', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '2rem' }}>✊</span>
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                  1st May 2026
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#ffffff', lineHeight: 1.15, margin: 0, position: 'relative', zIndex: 1 }}>
                  Happy May Day!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600, letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}>
                  International Workers' Day
                </p>
              </div>

              <div style={{ padding: '28px 32px 32px', textAlign: 'center' }}>
                <p style={{ color: '#333', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 8px' }}>
                  On this Workers' Day, <strong style={{ color: '#CC0000' }}>Reliance Oil Limited</strong> celebrates and honours every hardworking individual across Ghana.
                </p>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 28px' }}>
                  Your dedication, resilience, and commitment power our nation forward. We are grateful for every worker who keeps Ghana moving.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                  {['#CC0000', '#FFD700', '#CC0000'].map((c, i) => (
                    <div key={i} style={{ width: i === 1 ? '32px' : '8px', height: '4px', borderRadius: '9999px', backgroundColor: c }} />
                  ))}
                </div>

                <button
                  onClick={close}
                  style={{ backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: '9999px', padding: '13px 36px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', width: '100%', letterSpacing: '0.03em' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#aa0000'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#CC0000'; }}
                >
                  Thank You, Reliance Oil!
                </button>
                <button
                  onClick={close}
                  style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.8rem', marginTop: '12px', cursor: 'pointer', display: 'block', width: '100%' }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
