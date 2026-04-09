const Logo = ({ height = 44 }) => (
  <svg
    viewBox="0 0 560 224"
    height={height}
    style={{ width: 'auto', display: 'block' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="172,68 18,52 18,70 166,82" fill="#CC0000" />
    <polygon points="164,92 2,87 2,105 164,108" fill="#CC0000" />
    <polygon points="172,120 18,136 18,154 166,130" fill="#CC0000" />

    <polygon points="388,68 542,52 542,70 394,82" fill="#CC0000" />
    <polygon points="396,92 558,87 558,105 396,108" fill="#CC0000" />
    <polygon points="388,120 542,136 542,154 394,130" fill="#CC0000" />

    <circle cx="280" cy="112" r="108" fill="#CC0000" />
    <circle cx="280" cy="112" r="86" fill="#FFD700" />

    <text
      x="280"
      y="162"
      textAnchor="middle"
      fontFamily="'Arial Black', 'Impact', Arial, sans-serif"
      fontSize="124"
      fontWeight="900"
      fill="#111111"
    >
      R
    </text>
  </svg>
);

export default Logo;
