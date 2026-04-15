import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://relianceoilgh.com';
const DEFAULT_IMAGE = `${BASE_URL}/android-chrome-512x512.png`;

export default function SEO({ title, description, path = '', image }) {
  const fullTitle = title
    ? `${title} | Reliance Oil Limited`
    : 'Reliance Oil Limited — Quality Petroleum Products Across Ghana';
  const fullUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
