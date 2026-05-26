import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaFilter, FaTimes, FaList, FaMap, FaSearch } from 'react-icons/fa';
import { FaLocationDot, FaArrowRight } from 'react-icons/fa6';
import SEO from '../components/SEO';
import propertiesData from '../data/properties.json';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

const statusColors = {
  'Planning': '#8B5CF6',
  'Foundation': '#EF4444',
  'Structural Framing': '#F59E0B',
  'First-Fix': '#3B82F6',
  'Outfitting': '#10B981',
  'Turnkey Handover': '#22C55E',
};

function PropertyCard({ p }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Link to={`/dunamis/property/${p.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', transition: 'all 0.3s ease', border: '1px solid rgba(27,31,59,0.08)' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.14)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
        <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
          <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: ORANGE, color: '#fff', fontSize: '0.68rem', fontWeight: '700', padding: '3px 10px', borderRadius: '9999px' }}>{p.intent}</span>
            <span style={{ backgroundColor: NAVY, color: '#fff', fontSize: '0.68rem', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px' }}>{p.type}</span>
          </div>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: statusColors[p.status] || '#888', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '3px 9px', borderRadius: '9999px' }}>{p.status}</div>
        </div>
        <div style={{ padding: '16px 18px 18px' }}>
          <h3 style={{ fontWeight: '700', fontSize: '0.95rem', color: NAVY, marginBottom: '5px', lineHeight: 1.3 }}>{p.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#999', fontSize: '0.78rem', marginBottom: '12px' }}>
            <FaLocationDot size={10} style={{ color: ORANGE }} />{p.location}
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#777', marginBottom: '14px' }}>
            {p.bedrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed size={11} style={{ color: ORANGE }} />{p.bedrooms}</span>}
            {p.bathrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBath size={11} style={{ color: ORANGE }} />{p.bathrooms}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRuler size={10} style={{ color: ORANGE }} />{p.sqft.toLocaleString()} sqft</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: '900', color: NAVY }}>{p.currency} {p.price.toLocaleString()}</span>
              {p.intent !== 'Buy' && <span style={{ fontSize: '0.72rem', color: '#aaa' }}>/mo</span>}
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: ORANGE, fontSize: '0.78rem', fontWeight: '700' }}>View <FaArrowRight size={9} /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DunamisProperties() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    intent: searchParams.get('intent') || '',
    type: searchParams.get('type') || '',
    status: '',
    minPrice: '',
    maxPrice: '',
    minBeds: '',
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      intent: searchParams.get('intent') || '',
      type: searchParams.get('type') || '',
    }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return propertiesData.filter(p => {
      if (filters.intent && p.intent !== filters.intent) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.minBeds && p.bedrooms < parseInt(filters.minBeds)) return false;
      if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filters, search]);

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearFilters = () => { setFilters({ intent: '', type: '', status: '', minPrice: '', maxPrice: '', minBeds: '' }); setSearch(''); };
  const hasFilters = Object.values(filters).some(Boolean) || search;

  const inputStyle = { width: '100%', backgroundColor: '#F8F9FF', border: '1px solid rgba(27,31,59,0.15)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.875rem', color: NAVY, outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ backgroundColor: '#F8F9FF', minHeight: '100vh' }}>
      <SEO title="Properties — Dunamis Estates" description="Browse premium properties across Ghana. Filter by intent, type, location and more." path="/dunamis/properties" />

      {/* Page Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)`, padding: '64px 0 48px' }}>
        <div className="rc">
          <span style={{ color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Property Listings</span>
          <h1 style={{ fontWeight: '900', fontSize: 'clamp(2rem,4vw,3rem)', color: '#ffffff', lineHeight: 1.15, marginTop: '8px', marginBottom: '12px' }}>Explore All Properties</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>{propertiesData.length} properties available across Ghana</p>
        </div>
      </div>

      <div className="rc" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {/* Search + Controls Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <FaSearch size={13} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input type="text" placeholder="Search by title, location, or type…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px', width: '100%' }}
              onFocus={e => e.currentTarget.style.borderColor = ORANGE}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'} />
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: showFilters ? NAVY : '#ffffff', color: showFilters ? '#fff' : NAVY, border: `1.5px solid ${showFilters ? NAVY : 'rgba(27,31,59,0.2)'}`, borderRadius: '10px', padding: '10px 18px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <FaFilter size={13} /> Filters {hasFilters && <span style={{ backgroundColor: ORANGE, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>!</span>}
          </button>
          <div style={{ display: 'flex', border: '1.5px solid rgba(27,31,59,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
            {[{ mode: 'grid', Icon: FaList }, { mode: 'map', Icon: FaMap }].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ padding: '10px 14px', border: 'none', cursor: 'pointer', backgroundColor: viewMode === mode ? NAVY : '#ffffff', color: viewMode === mode ? '#fff' : '#888', transition: 'all 0.2s' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: 'auto' }}>
            <strong style={{ color: NAVY }}>{filtered.length}</strong> results
          </span>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '700', color: NAVY, fontSize: '0.95rem' }}>Filter Properties</h3>
                  {hasFilters && <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: ORANGE, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}><FaTimes size={12} /> Clear All</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
                  {[
                    { label: 'Intent', key: 'intent', opts: ['', 'Buy', 'Rent', 'Lease'], labels: ['All Intents', 'Buy', 'Rent', 'Lease'] },
                    { label: 'Property Type', key: 'type', opts: ['', 'Residential', 'Luxury', 'Industrial', 'Land Plots'], labels: ['All Types', 'Residential', 'Luxury', 'Industrial', 'Land Plots'] },
                    { label: 'Stage', key: 'status', opts: ['', 'Planning', 'Foundation', 'Structural Framing', 'First-Fix', 'Outfitting', 'Turnkey Handover'], labels: ['All Stages', 'Planning', 'Foundation', 'Structural Framing', 'First-Fix', 'Outfitting', 'Turnkey Handover'] },
                    { label: 'Min. Bedrooms', key: 'minBeds', opts: ['', '1', '2', '3', '4', '5'], labels: ['Any', '1+', '2+', '3+', '4+', '5+'] },
                  ].map(({ label, key, opts, labels }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</label>
                      <select value={filters[key]} onChange={e => updateFilter(key, e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = ORANGE}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'}>
                        {opts.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Min Price (USD)</label>
                    <input type="number" placeholder="e.g. 50000" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = ORANGE} onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Max Price (USD)</label>
                    <input type="number" placeholder="e.g. 500000" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = ORANGE} onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Placeholder */}
        {viewMode === 'map' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.1)', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
            <FaMapMarkerAlt size={40} style={{ color: ORANGE, marginBottom: '16px', position: 'relative' }} />
            <h3 style={{ fontWeight: '700', color: NAVY, fontSize: '1.1rem', marginBottom: '8px', position: 'relative' }}>Interactive Map View</h3>
            <p style={{ color: '#888', fontSize: '0.875rem', textAlign: 'center', maxWidth: '360px', position: 'relative' }}>
              PostGIS-powered spatial map with vector overlays, boundary tracing, and neighborhood analysis. Connect a Google Maps / Mapbox API key to activate.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
              {filtered.map(p => (
                <Link key={p.id} to={`/dunamis/property/${p.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: `1.5px solid ${ORANGE}`, borderRadius: '9999px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: '600', color: NAVY, textDecoration: 'none', boxShadow: '0 2px 8px rgba(249,115,22,0.15)' }}>
                  <FaMapMarkerAlt size={10} style={{ color: ORANGE }} />
                  {p.location.split(',')[0]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Grid Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <FaSearch size={40} style={{ color: '#ddd', marginBottom: '16px' }} />
            <h3 style={{ fontWeight: '700', color: NAVY, marginBottom: '8px' }}>No properties match your criteria</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} style={{ backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '9999px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem' }}>Clear Filters</button>
          </div>
        ) : (
          <div className="prop-grid">
            <AnimatePresence>
              {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
