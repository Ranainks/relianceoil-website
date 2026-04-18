import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 1L9 7H1L5 1Z" fill="#22c55e" />
  </svg>
);

const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 9L1 3H9L5 9Z" fill="#ef4444" />
  </svg>
);

const ArrowSame = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 3H9M9 3L6 1M9 3L6 5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FUEL_ICONS = {
  'Petrol 91': '⛽',
  'Petrol 95': '⛽',
  'Petrol 98': '⛽',
  'Diesel': '🚛',
};

export default function FuelPriceTicker() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    supabase.from('fuel_prices').select('*').not('fuel_type', 'in', '("LPG","Kerosene","Lubricant","Lubricants")').order('order_index').then(({ data }) => {
      if (data && data.length > 0) setPrices(data);
    });
  }, []);

  if (prices.length === 0) return null;

  const items = [...prices, ...prices, ...prices];

  return (
    <div style={{
      backgroundColor: '#111111',
      borderBottom: '1px solid rgba(204,0,0,0.4)',
      overflow: 'hidden',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 49,
    }}>
      <div style={{
        backgroundColor: '#CC0000',
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: 800,
        letterSpacing: '0.08em',
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        textTransform: 'uppercase',
        zIndex: 2,
      }}>
        LIVE PRICES
      </div>

      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          animation: `ticker-scroll ${prices.length * 4}s linear infinite`,
          width: 'max-content',
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 28px',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: '0.75rem' }}>{FUEL_ICONS[item.fuel_type] || '⛽'}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#d1d5db' }}>
                {item.fuel_type}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFD700', letterSpacing: '0.02em' }}>
                GHS {Number(item.price).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>/{item.unit.replace('per ', '')}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {item.change_direction === 'up' && <ArrowUp />}
                {item.change_direction === 'down' && <ArrowDown />}
                {item.change_direction === 'same' && <ArrowSame />}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
