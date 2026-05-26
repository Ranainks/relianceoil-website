import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaArrowRight, FaMapMarkerAlt, FaBed, FaBath, FaRuler,
  FaBuilding, FaChevronDown, FaChevronLeft, FaChevronRight,
  FaStar, FaQuoteLeft, FaCheckCircle, FaShieldAlt, FaUsers,
  FaHandshake, FaHome, FaSearch,
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import SEO from '../components/SEO';
import propertiesData from '../data/properties.json';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

const stats = [
  { value: 500, suffix: '+', label: 'Properties Listed' },
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 1200, suffix: '+', label: 'Happy Clients' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
];

const services = [
  { icon: FaHome, title: 'Residential Sales', desc: 'Premium homes, villas and apartments crafted for modern living — from starter homes to luxury estates.' },
  { icon: FaBuilding, title: 'Commercial Leasing', desc: 'Grade-A office floors, industrial warehouses and retail spaces in prime commercial corridors.' },
  { icon: FaMapMarkerAlt, title: 'Land Acquisition', desc: 'Fully titled serviced land plots in residential, industrial and mixed-use growth corridors.' },
  { icon: FaHandshake, title: 'Investment Advisory', desc: 'Expert ROI analysis, portfolio diversification strategies, and off-plan investment opportunities.' },
  { icon: FaShieldAlt, title: 'Property Management', desc: 'End-to-end management: tenant vetting, maintenance scheduling, rent collection, and legal compliance.' },
  { icon: FaUsers, title: 'Project Consultancy', desc: 'From foundation to furnishing — structural stage tracking, contractor coordination and handover management.' },
];

const testimonials = [
  { name: 'Kwame Asante', role: 'Property Investor, Accra', message: 'Dunamis Estates helped me identify and close on a luxury villa in East Legon within weeks. Their market intelligence and negotiation expertise saved me over $30,000.', rating: 5 },
  { name: 'Abena Mensah', role: 'CEO, Pinnacle Realty Ltd', message: 'The offline-capable platform is a game changer for our agents in field. They update inspection notes and contract details even in remote areas, syncing perfectly once back online.', rating: 5 },
  { name: 'Kofi Darko', role: 'MD, Western Properties Group', message: 'We leased our entire Tema industrial complex through Dunamis. The CRM lead tracking and booking system streamlined our entire sales pipeline effortlessly.', rating: 5 },
  { name: 'Akosua Boateng', role: 'First-Time Buyer', message: 'Finding my first home felt overwhelming until I used Dunamis Estates. The spatial map, virtual tours, and direct agent booking feature made the entire process a breeze.', rating: 5 },
];

const faqs = [
  { q: 'What property types does Dunamis Estates handle?', a: 'We list and manage Residential, Luxury, Industrial/Commercial properties and Land Plots across Ghana — spanning Buy, Rent, and Lease transaction types.' },
  { q: 'How does the virtual tour feature work?', a: 'Each property listing includes multi-angle photos, architectural cross-sections, and embedded 3D virtual tours. You can explore properties immersively from any device before scheduling a physical visit.' },
  { q: 'Can I book a site tour directly through the platform?', a: 'Yes. Our real-time booking matrix is linked to on-site project calendars. Select your preferred time slot and your visit is automatically confirmed and assigned to a Dunamis agent.' },
  { q: 'Does Dunamis Estates work in areas with poor internet?', a: 'Absolutely. Our platform is engineered with an offline-first architecture. Agents and buyers can browse cached listings, take notes, and submit bookings — all of which sync automatically once connectivity is restored.' },
  { q: 'How are construction stage updates communicated?', a: 'Every property in our inventory is tagged with a live construction stage: Planning, Foundation, Structural Framing, First-Fix, Outfitting, or Turnkey Handover. Agents update this in the CRM dashboard in real time.' },
];

function PropertyCard({ p }) {
  return (
    <Link to={`/dunamis/property/${p.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', border: '1px solid rgba(27,31,59,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.16)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'; }}>
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span style={{ backgroundColor: ORANGE, color: '#fff', fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '9999px' }}>{p.intent}</span>
          <span style={{ backgroundColor: NAVY, color: '#fff', fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px' }}>{p.type}</span>
        </div>
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', fontWeight: '600', padding: '4px 10px', borderRadius: '9999px' }}>{p.status}</div>
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '0.975rem', color: NAVY, marginBottom: '6px', lineHeight: 1.3 }}>{p.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '0.8rem', marginBottom: '14px' }}>
          <FaLocationDot size={11} style={{ color: ORANGE }} />
          {p.location}
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#666', marginBottom: '16px' }}>
          {p.bedrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed size={12} style={{ color: ORANGE }} />{p.bedrooms} Beds</span>}
          {p.bathrooms > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBath size={12} style={{ color: ORANGE }} />{p.bathrooms} Baths</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRuler size={11} style={{ color: ORANGE }} />{p.sqft.toLocaleString()} sqft</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: NAVY }}>{p.currency} {p.price.toLocaleString()}</span>
            {p.intent !== 'Buy' && <span style={{ fontSize: '0.75rem', color: '#aaa' }}> /mo</span>}
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: ORANGE, fontSize: '0.8rem', fontWeight: '600' }}>View <FaArrowRight size={10} /></span>
        </div>
      </div>
    </Link>
  );
}

export default function DunamisHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [searchIntent, setSearchIntent] = useState('Buy');
  const [searchType, setSearchType] = useState('');
  const statsRef = useRef(null);
  const countersRef = useRef([]);
  const animatedRef = useRef(false);
  const featuredProps = propertiesData.filter(p => p.featured);

  useEffect(() => {
    AOS.init({ offset: 80, duration: 800, once: true });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(prev => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animatedRef.current) {
        animatedRef.current = true;
        stats.forEach((stat, i) => {
          const el = countersRef.current[i];
          if (!el) return;
          const start = performance.now();
          const duration = 2200;
          const animate = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * stat.value) + stat.suffix;
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        });
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Dunamis Estates — Premium Properties in Ghana"
        description="Discover luxury residential, commercial, and industrial properties across Ghana. Buy, rent, or lease with Dunamis Estates — your trusted real estate partner."
        path="/dunamis"
        keywords="real estate Ghana, property for sale Accra, luxury homes Ghana, industrial property Ghana, land for sale Accra, Dunamis Estates"
      />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh', display: 'flex', alignItems: 'center', backgroundColor: NAVY }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(18,22,42,0.95) 0%, rgba(18,22,42,0.75) 50%, rgba(18,22,42,0.4) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', zIndex: 2 }} />

        <div className="rc" style={{ position: 'relative', zIndex: 10, paddingTop: '100px', paddingBottom: '140px', width: '100%' }}>
          <div style={{ maxWidth: '700px' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '9999px', marginBottom: '24px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: ORANGE, animation: 'pulse 2s infinite' }} />
                Premium Real Estate Platform
              </span>
              <h1 style={{ fontWeight: '900', fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)', color: '#ffffff', lineHeight: 1.08, marginBottom: '20px' }}>
                Find Your <span style={{ color: ORANGE }}>Perfect</span><br />Property Today
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '540px', marginBottom: '40px' }}>
                Discover premium residential, luxury, commercial, and industrial properties across Ghana. Real-time listings, immersive virtual tours, and seamless booking — built for serious buyers and investors.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '20px', marginBottom: '36px', maxWidth: '580px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                {['Buy', 'Rent', 'Lease'].map(intent => (
                  <button key={intent} onClick={() => setSearchIntent(intent)}
                    style={{ flex: 1, padding: '9px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s', backgroundColor: searchIntent === intent ? ORANGE : 'rgba(255,255,255,0.06)', color: searchIntent === intent ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                    {intent}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select value={searchType} onChange={e => setSearchType(e.target.value)}
                  style={{ flex: '1 1 160px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: searchType ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Property Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Land Plots">Land Plots</option>
                </select>
                <Link to={`/dunamis/properties?intent=${searchIntent}${searchType ? `&type=${encodeURIComponent(searchType)}` : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: ORANGE, color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EA6C0A'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ORANGE}>
                  <FaSearch size={13} /> Search Properties
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {[{ val: '500+', lbl: 'Listings' }, { val: '1,200+', lbl: 'Clients' }, { val: '12+', lbl: 'Yrs Exp.' }].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: ORANGE, fontWeight: '900', fontSize: '1.25rem', lineHeight: 1 }}>{s.val}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{s.lbl}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, animation: 'bounce 2s infinite' }}>
          <div style={{ width: '28px', height: '44px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '14px', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
            <div style={{ width: '4px', height: '8px', backgroundColor: ORANGE, borderRadius: '2px', animation: 'scrollDown 2s infinite' }} />
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
          @keyframes bounce { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(-8px); } }
          @keyframes scrollDown { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(12px); } }
        `}</style>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section style={{ backgroundColor: '#F8F9FF' }}>
        <div className="rc rs">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Featured Listings</span>
              <h2 style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: NAVY, lineHeight: 1.2 }}>Premium Properties</h2>
            </div>
            <Link to="/dunamis/properties"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: ORANGE, fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', border: '2px solid rgba(249,115,22,0.25)', padding: '10px 20px', borderRadius: '9999px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = ORANGE; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = ORANGE; }}>
              View All <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="prop-grid">
            {featuredProps.map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── WHY DUNAMIS ── */}
      <section style={{ backgroundColor: '#ffffff' }}>
        <div className="rc rs">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Why Choose Us</span>
              <h2 style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: NAVY, lineHeight: 1.2, marginBottom: '16px' }}>Ghana's Most Trusted Property Ecosystem</h2>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.75, marginBottom: '36px' }}>
                We don't just list properties — we engineer a complete digital real estate experience. From spatial map browsing and immersive 3D tours to offline-first field agent tools and real-time booking, Dunamis Estates redefines what modern property discovery looks like.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { icon: FaCheckCircle, title: 'Verified Listings Only', text: 'Every listing undergoes document verification, site visits, and legal checks before going live on the platform.' },
                  { icon: FaMapMarkerAlt, title: 'Spatial Map Intelligence', text: 'Browse properties on interactive geospatial maps with neighborhood analysis, transit nodes, and utility links.' },
                  { icon: FaShieldAlt, title: 'Offline-First Platform', text: 'Our platform works seamlessly in low/no-connectivity zones — perfect for field agents and buyers in remote areas.' },
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(249,115,22,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <feat.icon size={20} style={{ color: ORANGE }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '700', color: NAVY, fontSize: '0.95rem', marginBottom: '4px' }}>{feat.title}</h4>
                      <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65 }}>{feat.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dunamis/about"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: NAVY, color: '#fff', padding: '13px 28px', borderRadius: '9999px', fontWeight: '700', fontSize: '0.875rem', marginTop: '32px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#12162A'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = NAVY}>
                Learn More About Us <FaArrowRight size={12} />
              </Link>
            </div>

            <div data-aos="fade-left">
              <div style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', height: '500px', boxShadow: '0 32px 80px rgba(27,31,59,0.2)' }}>
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" alt="Dunamis Estates property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,22,42,0.7) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {[{ val: '500+', lbl: 'Properties' }, { val: '12+', lbl: 'Years' }, { val: '1,200+', lbl: 'Clients' }].map((s, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '900', fontSize: '1.35rem', color: NAVY }}>{s.val}</div>
                        <div style={{ color: '#999', fontSize: '0.75rem' }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)` }}>
        <div className="rc rs-sm">
          <div ref={statsRef} className="rg4">
            {stats.map((stat, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100}
                style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div ref={el => countersRef.current[i] = el}
                  style={{ fontWeight: '900', fontSize: 'clamp(2.5rem,5vw,3.5rem)', color: ORANGE, lineHeight: 1 }}>
                  0{stat.suffix}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginTop: '8px', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ backgroundColor: '#F8F9FF' }}>
        <div className="rc rs">
          <div style={{ textAlign: 'center', marginBottom: '56px' }} data-aos="fade-up">
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>What We Offer</span>
            <h2 style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: NAVY, lineHeight: 1.2, marginBottom: '16px' }}>Comprehensive Property Services</h2>
            <p style={{ color: '#666', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
              From discovery to handover, we provide end-to-end property services for buyers, investors, and developers.
            </p>
          </div>
          <div className="rg3">
            {services.map((svc, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(27,31,59,0.07)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(249,115,22,0.12)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(27,31,59,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '52px', height: '52px', backgroundColor: 'rgba(249,115,22,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svc.icon size={22} style={{ color: ORANGE }} />
                </div>
                <h3 style={{ fontWeight: '700', color: NAVY, fontSize: '1rem', marginBottom: '8px' }}>{svc.title}</h3>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65 }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ backgroundColor: NAVY }}>
        <div className="rc rs">
          <div style={{ textAlign: 'center', marginBottom: '56px' }} data-aos="fade-up">
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</span>
            <h2 style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#ffffff', lineHeight: 1.2 }}>What Our Clients Say</h2>
          </div>
          <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', minHeight: '220px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <FaQuoteLeft size={28} style={{ color: ORANGE, marginBottom: '20px', opacity: 0.7 }} />
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic' }}>
                  "{testimonials[activeTestimonial].message}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => <FaStar key={i} size={14} style={{ color: ORANGE }} />)}
                </div>
                <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '2px' }}>{testimonials[activeTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  style={{ width: i === activeTestimonial ? '28px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: i === activeTestimonial ? ORANGE : 'rgba(255,255,255,0.25)', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: '#ffffff' }}>
        <div className="rc rs">
          <div style={{ textAlign: 'center', marginBottom: '56px' }} data-aos="fade-up">
            <span style={{ display: 'inline-block', color: ORANGE, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</span>
            <h2 style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: NAVY, lineHeight: 1.2 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
                style={{ border: `1px solid ${openFaq === i ? 'rgba(249,115,22,0.35)' : 'rgba(27,31,59,0.1)'}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: openFaq === i ? 'rgba(249,115,22,0.04)' : '#ffffff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
                  <span style={{ fontWeight: '600', color: NAVY, fontSize: '0.95rem', lineHeight: 1.4 }}>{faq.q}</span>
                  <FaChevronDown size={14} style={{ color: ORANGE, flexShrink: 0, marginLeft: '12px', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <p style={{ padding: '0 20px 18px', color: '#666', fontSize: '0.9rem', lineHeight: 1.75 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #EA6C0A 100%)` }}>
        <div className="rc rs-sm" style={{ textAlign: 'center' }}>
          <h2 data-aos="fade-up" style={{ fontWeight: '900', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#ffffff', marginBottom: '16px', lineHeight: 1.2 }}>
            Ready to Find Your Ideal Property?
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: '32px', maxWidth: '520px', margin: '0 auto 32px' }}>
            Browse our curated listings, schedule a tour, or speak directly with a Dunamis agent today.
          </p>
          <div data-aos="fade-up" data-aos-delay="200" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dunamis/properties"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', color: ORANGE, padding: '14px 30px', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}>
              Browse Properties <FaArrowRight size={13} />
            </Link>
            <Link to="/dunamis/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ffffff', padding: '14px 30px', borderRadius: '9999px', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.6)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}>
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
