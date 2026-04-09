import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TAGLINE = 'Powering Ghana, One Station at a Time';

export default function LoadingScreen() {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(TAGLINE.slice(0, index));
      if (index >= TAGLINE.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ backgroundColor: '#CC0000' }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className="flex items-center justify-center rounded-full w-24 h-24"
          style={{ backgroundColor: '#FFD700' }}
        >
          <span className="text-3xl font-black text-white">ROL</span>
        </div>

        <p className="text-white text-xl font-bold tracking-widest uppercase">
          RELIANCE OIL LIMITED
        </p>

        <p className="text-white text-base min-h-[1.5rem] tracking-wide">
          {displayed}
        </p>

        <div className="w-64 h-1 rounded-full overflow-hidden bg-white/20">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #FFD700, #FFFFFF)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
