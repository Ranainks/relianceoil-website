export default function SectionLabel({ text, light = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <span style={{ display: 'block', width: '28px', height: '2px', backgroundColor: light ? '#CC0000' : '#FFD700', borderRadius: '2px', flexShrink: 0 }} />
      <span style={{ color: light ? '#CC0000' : '#FFD700', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2.5px' }}>
        {text}
      </span>
    </div>
  );
}
