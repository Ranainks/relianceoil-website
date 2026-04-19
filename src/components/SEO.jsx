import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://relianceoilltd.com';
const DEFAULT_IMAGE = `${BASE_URL}/android-chrome-512x512.png`;

export default function SEO({ title, description, path = '', image }) {
  const fullTitle = title
    ? `${title} | Reliance Oil Limited Ghana`
    : 'Reliance Oil Limited Ghana — NPA Licensed Petroleum Products | ROL';
  const fullUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Reliance Oil Limited Ghana, ROL Ghana, fuel station Ghana, petroleum products Ghana, NPA licensed petroleum Ghana, filling station Accra, petrol diesel Ghana, LPG Ghana, fleet fuel management Ghana" />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_GH" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="geo.region" content="GH" />
      <meta name="geo.placename" content="Ghana" />
    </Helmet>
  );
}
