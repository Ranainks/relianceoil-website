import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaCheckCircle,
  FaArrowLeft, FaCalendarAlt, FaExpand, FaTimes, FaChevronLeft, FaChevronRight, FaShare
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import SEO from '../components/SEO';
import propertiesData from '../data/properties.json';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';

const statusColors = {
  'Planning': '#8B5CF6', 'Foundation': '#EF4444', 'Structural Framing': '#F59E0B',
  'First-Fix': '#3B82F6', 'Outfitting': '#10B981', 'Turnkey Handover': '#22C55E',
};

const stages = ['Planning', 'Foundation', 'Structural Framing', 'First-Fix', 'Outfitting', 'Turnkey Handover'];

export default function DunamisPropertyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = propertiesData.find(p => p.slug === slug);

  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingType, setBookingType] = useState('Virtual');
  const [bookingStatus, setBookingStatus] = useState('idle');

  if (!property) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <h2 style={{ color: NAVY, fontWeight: '800' }}>Property Not Found</h2>
      <Link to="/dunamis/properties" style={{ color: ORANGE, fontWeight: '600', textDecoration: 'none' }}>← Back to Listings</Link>
    </div>
  );

  const stageIndex = stages.indexOf(property.status);
  const handleBooking = () => {
    if (!bookingDate || !bookingName || !bookingPhone) { setBookingStatus('invalid'); return; }
    setBookingStatus('success');
  };

  return (
    <div style={{ backgroundColor: '#F8F9FF', minHeight: '100vh' }}>
      <SEO title={`${property.title} — Dunamis Estates`} description={property.description} path={`/dunamis/property/${property.slug}`} />

      {/* Breadcrumb */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #12162A 100%)`, padding: '24px 0' }}>
        <div className="rc" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = ORANGE} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
            <FaArrowLeft size={13} /> Back
          </button>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Properties</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>/</span>
          <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '600' }}>{property.title}</span>
        </div>
      </div>

      <div className="rc" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

          {/* Left: Media + Info */}
          <div>
            {/* Main Image Gallery */}
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '12px', height: 'clamp(280px, 45vw, 520px)', cursor: 'pointer' }} onClick={() => setLightboxOpen(true)}>
              <img src={property.images[activeImg]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
              <button style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                <FaExpand size={12} /> View Gallery
              </button>
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '6px' }}>
                <span style={{ backgroundColor: ORANGE, color: '#fff', fontSize: '0.72rem', fontWeight: '700', padding: '4px 12px', borderRadius: '9999px' }}>{property.intent}</span>
                <span style={{ backgroundColor: NAVY, color: '#fff', fontSize: '0.72rem', fontWeight: '600', padding: '4px 12px', borderRadius: '9999px' }}>{property.type}</span>
              </div>
              {property.images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + property.images.length) % property.images.length); }}
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <FaChevronLeft size={14} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % property.images.length); }}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <FaChevronRight size={14} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: '72px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: `2.5px solid ${activeImg === i ? ORANGE : 'transparent'}`, cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'border-color 0.2s' }}>
                    <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Property Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.08)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <h1 style={{ fontWeight: '900', fontSize: 'clamp(1.4rem,3vw,2rem)', color: NAVY, lineHeight: 1.2, maxWidth: '520px' }}>{property.title}</h1>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(249,115,22,0.08)', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: '9999px', padding: '8px 16px', color: ORANGE, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                  <FaShare size={12} /> Share
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '0.875rem', marginBottom: '20px' }}>
                <FaLocationDot size={13} style={{ color: ORANGE }} />{property.location}
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {property.bedrooms > 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: '#F8F9FF', borderRadius: '12px', minWidth: '72px' }}>
                  <FaBed size={18} style={{ color: ORANGE }} />
                  <span style={{ fontWeight: '700', color: NAVY, fontSize: '1rem' }}>{property.bedrooms}</span>
                  <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Bedrooms</span>
                </div>}
                {property.bathrooms > 0 && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: '#F8F9FF', borderRadius: '12px', minWidth: '72px' }}>
                  <FaBath size={18} style={{ color: ORANGE }} />
                  <span style={{ fontWeight: '700', color: NAVY, fontSize: '1rem' }}>{property.bathrooms}</span>
                  <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Bathrooms</span>
                </div>}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: '#F8F9FF', borderRadius: '12px', minWidth: '72px' }}>
                  <FaRuler size={18} style={{ color: ORANGE }} />
                  <span style={{ fontWeight: '700', color: NAVY, fontSize: '1rem' }}>{property.sqft.toLocaleString()}</span>
                  <span style={{ color: '#aaa', fontSize: '0.7rem' }}>Sq Ft</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(27,31,59,0.08)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Asking Price</div>
                  <div style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: '900', color: NAVY }}>
                    {property.currency} {property.price.toLocaleString()}
                    {property.intent !== 'Buy' && <span style={{ fontSize: '1rem', color: '#aaa', fontWeight: '400' }}>/mo</span>}
                  </div>
                </div>
                <span style={{ backgroundColor: statusColors[property.status] || '#888', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '6px 16px', borderRadius: '9999px' }}>{property.status}</span>
              </div>
            </div>

            {/* Description */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.08)', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: '800', color: NAVY, fontSize: '1.1rem', marginBottom: '14px' }}>Property Description</h2>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.8 }}>{property.description}</p>
            </div>

            {/* Amenities */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.08)', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: '800', color: NAVY, fontSize: '1.1rem', marginBottom: '20px' }}>Features & Amenities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {property.amenities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(249,115,22,0.05)', borderRadius: '10px', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <FaCheckCircle size={13} style={{ color: ORANGE, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: NAVY, fontWeight: '500' }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Construction Stage Progress */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(27,31,59,0.08)' }}>
              <h2 style={{ fontWeight: '800', color: NAVY, fontSize: '1.1rem', marginBottom: '20px' }}>Construction Stage Tracker</h2>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '2px', backgroundColor: 'rgba(27,31,59,0.1)', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px', height: '2px', width: `${(stageIndex / (stages.length - 1)) * 100}%`, backgroundColor: ORANGE, zIndex: 1, transition: 'width 1s ease', maxWidth: 'calc(100% - 32px)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  {stages.map((stage, i) => (
                    <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '64px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: i <= stageIndex ? ORANGE : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: i === stageIndex ? `3px solid ${NAVY}` : '3px solid transparent', transition: 'all 0.3s', boxShadow: i <= stageIndex ? '0 0 0 3px rgba(249,115,22,0.2)' : 'none' }}>
                        {i < stageIndex ? <FaCheckCircle size={14} style={{ color: '#fff' }} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i === stageIndex ? '#fff' : '#aaa' }} />}
                      </div>
                      <span style={{ fontSize: '0.6rem', color: i <= stageIndex ? NAVY : '#aaa', fontWeight: i === stageIndex ? '700' : '400', textAlign: 'center', lineHeight: 1.3 }}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking */}
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(27,31,59,0.12)', border: '1px solid rgba(27,31,59,0.1)', position: 'sticky', top: '88px' }}>
              <h2 style={{ fontWeight: '800', color: NAVY, fontSize: '1.1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt size={16} style={{ color: ORANGE }} /> Book a Site Tour
              </h2>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.6 }}>Schedule a virtual or in-person visit. Our agent will confirm within 2 hours.</p>

              {bookingStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <FaCheckCircle size={28} style={{ color: '#22C55E' }} />
                  </div>
                  <h3 style={{ fontWeight: '800', color: NAVY, marginBottom: '8px' }}>Tour Scheduled!</h3>
                  <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65 }}>Your {bookingType.toLowerCase()} tour for <strong>{property.title}</strong> on <strong>{bookingDate}</strong> has been submitted. An agent will contact you at {bookingPhone} shortly.</p>
                  <button onClick={() => setBookingStatus('idle')}
                    style={{ marginTop: '20px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '9999px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem' }}>
                    Book Another
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Virtual', 'Physical'].map(t => (
                      <button key={t} onClick={() => setBookingType(t)}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1.5px solid ${bookingType === t ? ORANGE : 'rgba(27,31,59,0.15)'}`, backgroundColor: bookingType === t ? 'rgba(249,115,22,0.08)' : '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', color: bookingType === t ? ORANGE : '#888', transition: 'all 0.2s' }}>
                        {t} Tour
                      </button>
                    ))}
                  </div>

                  {[
                    { label: 'Full Name', type: 'text', val: bookingName, set: setBookingName, ph: 'e.g. Kwame Mensah' },
                    { label: 'Phone Number', type: 'tel', val: bookingPhone, set: setBookingPhone, ph: '+233 24 000 0000' },
                  ].map(({ label, type, val, set, ph }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</label>
                      <input type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                        style={{ width: '100%', backgroundColor: '#F8F9FF', border: `1px solid ${bookingStatus === 'invalid' && !val ? '#EF4444' : 'rgba(27,31,59,0.15)'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '0.875rem', color: NAVY, outline: 'none' }}
                        onFocus={e => e.currentTarget.style.borderColor = ORANGE}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'} />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Preferred Date</label>
                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      style={{ width: '100%', backgroundColor: '#F8F9FF', border: `1px solid ${bookingStatus === 'invalid' && !bookingDate ? '#EF4444' : 'rgba(27,31,59,0.15)'}`, borderRadius: '10px', padding: '11px 14px', fontSize: '0.875rem', color: NAVY, outline: 'none' }}
                      onFocus={e => e.currentTarget.style.borderColor = ORANGE}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Preferred Time</label>
                    <select value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#F8F9FF', border: '1px solid rgba(27,31,59,0.15)', borderRadius: '10px', padding: '11px 14px', fontSize: '0.875rem', color: bookingTime ? NAVY : '#aaa', outline: 'none' }}
                      onFocus={e => e.currentTarget.style.borderColor = ORANGE}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,31,59,0.15)'}>
                      <option value="">Select a time slot</option>
                      {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {bookingStatus === 'invalid' && (
                    <p style={{ color: '#EF4444', fontSize: '0.8rem' }}>Please fill in your name, phone, and preferred date.</p>
                  )}

                  <button onClick={handleBooking}
                    style={{ backgroundColor: ORANGE, color: '#ffffff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EA6C0A'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ORANGE; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FaCalendarAlt size={14} /> Confirm Booking
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
                    <FaCheckCircle size={12} style={{ color: '#22C55E' }} />
                    <span style={{ color: '#888', fontSize: '0.75rem' }}>No commitment required · Free consultation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <button onClick={() => setLightboxOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' }}>
              <FaTimes />
            </button>
            <button onClick={() => setActiveImg(i => (i - 1 + property.images.length) % property.images.length)}
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <FaChevronLeft size={16} />
            </button>
            <img src={property.images[activeImg]} alt={property.title} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} />
            <button onClick={() => setActiveImg(i => (i + 1) % property.images.length)}
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <FaChevronRight size={16} />
            </button>
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
              {activeImg + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .rc > div { grid-template-columns: 1fr 380px !important; }
        }
      `}</style>
    </div>
  );
}
