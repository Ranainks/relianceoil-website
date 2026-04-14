export default function Logo({ height = 42 }) {
  return (
    <img
      src="/logo.png"
      alt="Reliance Oil Limited"
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
