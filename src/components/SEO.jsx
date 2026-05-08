import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://relianceoilltd.com';
const DEFAULT_IMAGE = `${BASE_URL}/android-chrome-512x512.png`;
const BASE_KEYWORDS = 'Reliance Oil Limited Ghana, ROL Ghana, fuel supplier Ghana, diesel supply Ghana, oil marketing company Ghana, petroleum products Ghana, NPA licensed petroleum Ghana, filling station Accra, petrol diesel Ghana, LPG Ghana, fleet fuel management Ghana, bulk fuel supply Ghana, petroleum company Ghana';

export default function SEO({ title, description, path = '', image, keywords, jsonLd }) {
  const fullTitle = title
    ? `${title} | Reliance Oil Limited Ghana`
    : 'Reliance Oil Limited — NPA Licensed Fuel Supplier in Ghana | ROL';
  const fullUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;
  const allKeywords = keywords ? `${BASE_KEYWORDS}, ${keywords}` : BASE_KEYWORDS;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Reliance Oil Limited" />
      <meta property="og:locale" content="en_GH" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="geo.region" content="GH" />
      <meta name="geo.placename" content="Ghana" />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
