import { useEffect } from 'react';

export default function LiveChat() {
  const tawkId = import.meta.env.VITE_TAWKTO_ID;

  useEffect(() => {
    if (!tawkId) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    window.Tawk_API.customStyle = {
      visibility: {
        desktop: { position: 'br', xOffset: 20, yOffset: 20 },
        mobile: { position: 'br', xOffset: 10, yOffset: 90 },
      },
    };

    const s = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s.async = true;
    s.src = `https://embed.tawk.to/${tawkId}`;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s, s0);
  }, []);

  return null;
}
