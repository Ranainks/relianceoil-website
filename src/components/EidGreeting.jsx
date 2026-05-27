import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function isEidAlAdha() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return m === 5 && d >= 27 && d <= 30;
}

function WalkingSheep() {
  return (
    <div style={{ position: 'absolute', bottom: 0, animation: 'eid-sheep-walk 7s linear infinite', willChange: 'transform' }}>
      <svg viewBox="0 0 160 100" width="148" height="92" style={{ overflow: 'visible', display: 'block' }}>
        {/* Wool body — overlapping circles */}
        <circle cx="52"  cy="52" r="19" fill="#f3f3f3" />
        <circle cx="68"  cy="43" r="21" fill="#f3f3f3" />
        <circle cx="86"  cy="42" r="21" fill="#f3f3f3" />
        <circle cx="103" cy="50" r="19" fill="#f3f3f3" />
        <circle cx="77"  cy="60" r="16" fill="#f3f3f3" />
        {/* Tail */}
        <circle cx="31"  cy="55" r="11" fill="#e8e8e8" />
        {/* Neck */}
        <ellipse cx="117" cy="54" rx="10" ry="12" fill="#484848" />
        {/* Head */}
        <ellipse cx="129" cy="51" rx="15" ry="13" fill="#484848" />
        {/* Ear */}
        <ellipse cx="126" cy="39" rx="6" ry="9" fill="#686868" transform="rotate(-15 126 39)" />
        {/* Eye */}
        <circle cx="135" cy="48" r="3.5" fill="white" />
        <circle cx="136" cy="48" r="2"   fill="#111" />
        <circle cx="136.5" cy="47.5" r="0.7" fill="white" />
        {/* Nostril */}
        <ellipse cx="140" cy="55" rx="4" ry="2.5" fill="#686868" />
        <circle cx="138.5" cy="54" r="1.2" fill="#444" />
        <circle cx="141.5" cy="54" r="1.2" fill="#444" />

        {/* front-left leg */}
        <g style={{ transformOrigin: '87.5px 67px', animation: 'eid-leg-a 0.45s ease-in-out infinite' }}>
          <rect x="83" y="67" width="9" height="26" rx="4.5" fill="#484848" />
          <rect x="81" y="90" width="13" height="6"  rx="3"   fill="#333" />
        </g>
        {/* front-right leg */}
        <g style={{ transformOrigin: '99.5px 67px', animation: 'eid-leg-b 0.45s ease-in-out infinite' }}>
          <rect x="95" y="67" width="9" height="26" rx="4.5" fill="#585858" />
          <rect x="93" y="90" width="13" height="6"  rx="3"   fill="#333" />
        </g>
        {/* back-left leg */}
        <g style={{ transformOrigin: '57.5px 67px', animation: 'eid-leg-b 0.45s ease-in-out infinite' }}>
          <rect x="53" y="67" width="9" height="26" rx="4.5" fill="#484848" />
          <rect x="51" y="90" width="13" height="6"  rx="3"   fill="#333" />
        </g>
        {/* back-right leg */}
        <g style={{ transformOrigin: '69.5px 67px', animation: 'eid-leg-a 0.45s ease-in-out infinite' }}>
          <rect x="65" y="67" width="9" height="26" rx="4.5" fill="#585858" />
          <rect x="63" y="90" width="13" height="6"  rx="3"   fill="#333" />
        </g>
      </svg>
    </div>
  );
}

const STARS = [
  { top: '14px', left: '28px',  delay: '0s' },
  { top: '18px', right: '22px', delay: '0.5s' },
  { top: '48px', left: '16px',  delay: '1s' },
  { top: '12px', right: '58px', delay: '0.25s' },
  { top: '44px', right: '14px', delay: '0.75s' },
];

export default function EidGreeting() {
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!isEidAlAdha()) return;
    if (sessionStorage.getItem('eid_adha_v2')) return;
    const t = setTimeout(() => {
      if (!fired.current) { fired.current = true; setVisible(true); }
    }, 3800);
    return () => clearTimeout(t);
  }, []);

  function close() {
    sessionStorage.setItem('eid_adha_v2', '1');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.68)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <style>{`
            @keyframes eid-leg-a       { 0%,100% { transform: rotate(-22deg); } 50% { transform: rotate(22deg);  } }
            @keyframes eid-leg-b       { 0%,100% { transform: rotate(22deg);  } 50% { transform: rotate(-22deg); } }
            @keyframes eid-sheep-walk  { 0% { transform: translateX(450px); } 100% { transform: translateX(-165px); } }
            @keyframes eid-star-twinkle{ 0%,100% { opacity:1; transform:scale(1);   } 50% { opacity:0.4; transform:scale(0.65); } }
          `}</style>

          <motion.div
            initial={{ scale: 0.45, opacity: 0, y: 24 }}
            animate={{ scale: [0.45, 1.05, 0.97, 1], opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '440px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 36px 80px rgba(0,0,0,0.55)' }}
          >
            {/* ── HEADER ── */}
            <div style={{ background: 'linear-gradient(135deg,#0b5e3c 0%,#0f7d52 55%,#1a6b40 100%)', padding: '36px 32px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position:'absolute', top:'-50px', left:'-50px', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:'-30px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', border:'1px solid rgba(255,215,0,0.1)', pointerEvents:'none' }} />

              {STARS.map((s, i) => (
                <span key={i} style={{ position:'absolute', fontSize:'13px', color:'#FFD700', animation:`eid-star-twinkle 2.2s ${s.delay} ease-in-out infinite`, pointerEvents:'none', ...s }}>★</span>
              ))}

              {/* Crescent */}
              <div style={{ display:'inline-block', marginBottom:'14px', position:'relative', zIndex:1 }}>
                <svg viewBox="0 0 64 64" width="64" height="64">
                  <circle cx="32" cy="32" r="28" fill="#FFD700" />
                  <circle cx="46" cy="23" r="23" fill="#0b5e3c" />
                  <circle cx="54" cy="28" r="4.5" fill="#FFD700" />
                </svg>
              </div>

              <div style={{ fontSize:'0.67rem', fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'8px', position:'relative', zIndex:1 }}>
                28 May 2026
              </div>
              <h2 style={{ fontWeight:900, fontSize:'1.85rem', color:'#FFD700', lineHeight:1.1, margin:'0 0 8px', textShadow:'0 2px 14px rgba(0,0,0,0.35)', position:'relative', zIndex:1 }}>
                Eid al-Adha Mubarak
              </h2>
              <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1.15rem', margin:0, fontFamily:'serif', letterSpacing:'0.06em', position:'relative', zIndex:1 }}>
                عيد الأضحى مبارك
              </p>
            </div>

            {/* ── SHEEP STRIP ── */}
            <div style={{ backgroundColor:'#eef7f2', height:'108px', position:'relative', overflow:'hidden', borderTop:'2px solid rgba(11,94,60,0.1)', borderBottom:'2px solid rgba(11,94,60,0.1)' }}>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'16px', background:'linear-gradient(to right,#c5e6d4,#a8d9be,#c5e6d4)', borderRadius:'60% 60% 0 0 / 100% 100% 0 0' }} />
              <WalkingSheep />
            </div>

            {/* ── BODY ── */}
            <div style={{ backgroundColor:'#fff', padding:'24px 32px 28px', textAlign:'center' }}>
              <p style={{ color:'#333', fontSize:'0.95rem', lineHeight:1.8, margin:'0 0 6px' }}>
                <strong style={{ color:'#0b5e3c' }}>Reliance Oil Limited</strong> wishes you and your family a blessed Eid filled with peace, joy, and togetherness.
              </p>
              <p style={{ color:'#777', fontSize:'0.85rem', lineHeight:1.7, margin:'0 0 22px' }}>
                May this sacred occasion bring happiness to every home across Ghana and beyond. 🌿
              </p>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'20px' }}>
                {['#0b5e3c','#FFD700','#0b5e3c'].map((c,i)=>(
                  <div key={i} style={{ width:i===1?'32px':'8px', height:'4px', borderRadius:'9999px', backgroundColor:c }} />
                ))}
              </div>

              <button
                onClick={close}
                style={{ backgroundColor:'#0b5e3c', color:'#fff', border:'none', borderRadius:'9999px', padding:'13px 36px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', width:'100%', letterSpacing:'0.03em', transition:'background-color 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.backgroundColor='#084b2f'; }}
                onMouseLeave={e=>{ e.currentTarget.style.backgroundColor='#0b5e3c'; }}
              >
                Eid Mubarak!
              </button>
              <button
                onClick={close}
                style={{ background:'none', border:'none', color:'#bbb', fontSize:'0.8rem', marginTop:'10px', cursor:'pointer', display:'block', width:'100%' }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
