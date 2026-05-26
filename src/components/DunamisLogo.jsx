export default function DunamisLogo({ height = 48, dark = false }) {
  const orange = '#F97316';
  const white = dark ? '#1B1F3B' : '#FFFFFF';
  return (
    <svg height={height} viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dunamis Estates">
      <g>
        <rect x="2" y="8" width="28" height="44" rx="4" stroke={orange} strokeWidth="3.5" fill="none"/>
        <rect x="10" y="16" width="24" height="36" rx="3" stroke={orange} strokeWidth="3" fill="none"/>
        <path d="M2 8 Q30 8 30 30 Q30 52 2 52" stroke={orange} strokeWidth="3.5" fill="none"/>
        <path d="M10 16 Q34 16 34 34 Q34 52 10 52" stroke={orange} strokeWidth="3" fill="none"/>
      </g>
      <text x="46" y="36" fontFamily="'Inter',system-ui,sans-serif" fontWeight="900" fontSize="22" fill={white} letterSpacing="-0.5">Dunamis</text>
      <text x="47" y="52" fontFamily="'Inter',system-ui,sans-serif" fontWeight="400" fontSize="9.5" fill={orange} letterSpacing="3">ESTATES</text>
    </svg>
  );
}
