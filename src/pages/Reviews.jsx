import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { FaStar, FaQuoteLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function getInitials(name) {
  return (name || 'A').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', fontSize: '1.6rem', color: n <= (hovered || value) ? '#FFD700' : '#ddd', transition: 'color 0.15s' }}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }) {
  const avatarColors = [
    'linear-gradient(135deg,#CC0000,#FF4444)',
    'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    'linear-gradient(135deg,#16a34a,#4ade80)',
    'linear-gradient(135deg,#d97706,#fbbf24)',
    'linear-gradient(135deg,#7c3aed,#a78bfa)',
    'linear-gradient(135deg,#0891b2,#22d3ee)',
  ];
  const color = avatarColors[index % avatarColors.length];
  const date = review.created_at ? new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 60}
      style={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <FaQuoteLeft style={{ color: 'rgba(204,0,0,0.15)', fontSize: '1.8rem', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1,2,3,4,5].map(n => (
            <FaStar key={n} style={{ fontSize: '0.8rem', color: n <= review.rating ? '#FFD700' : '#e5e7eb' }} />
          ))}
        </div>
      </div>
      <p style={{ color: '#444', fontSize: '0.9rem', lineHeight: 1.75, fontStyle: 'italic', flex: 1, margin: 0 }}>
        "{review.message}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{getInitials(review.name)}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.name}</div>
          {review.role && <div style={{ color: '#888', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.role}</div>}
        </div>
        {date && <div style={{ marginLeft: 'auto', color: '#bbb', fontSize: '0.72rem', flexShrink: 0 }}>{date}</div>}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: '10px',
  border: '1.5px solid #e5e7eb',
  fontSize: '0.9rem',
  color: '#111',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  backgroundColor: '#fff',
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '', rating: 0, message: '' });
  const [status, setStatus] = useState('idle');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    AOS.init({ offset: 80, duration: 700, once: true });
    window.scrollTo(0, 0);
    supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).then(({ data }) => {
      setReviews(data || []);
      setLoading(false);
    });
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCounts = [5,4,3,2,1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0,
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || form.rating === 0) return;
    setStatus('submitting');
    const { error } = await supabase.from('reviews').insert({
      name: form.name.trim(),
      role: form.role.trim() || null,
      rating: form.rating,
      message: form.message.trim(),
    });
    if (error) { setStatus('error'); return; }
    setStatus('success');
    setForm({ name: '', role: '', rating: 0, message: '' });
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <SEO title="Customer Reviews" description="Read what Reliance Oil customers say about our fuel, service, and stations across Ghana. Share your own experience." path="/reviews" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#CC0000,#7f0000)', padding: '60px 24px 72px' }}>
        <div className="rc">
          <div style={{ maxWidth: '600px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFD700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block', marginBottom: '16px' }}>
              Customer Feedback
            </span>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', lineHeight: 1.15, marginBottom: '14px' }}>
              Real Experiences, Real Trust
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              See what our customers across Ghana say about Reliance Oil — and share your own experience.
            </p>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      {reviews.length > 0 && (
        <div style={{ backgroundColor: '#111', padding: '32px 24px' }}>
          <div className="rc" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>{avgRating}</div>
              <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '6px 0' }}>
                {[1,2,3,4,5].map(n => <FaStar key={n} style={{ fontSize: '0.9rem', color: n <= Math.round(avgRating) ? '#FFD700' : '#444' }} />)}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ratingCounts.map(({ n, count, pct }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', width: '14px', textAlign: 'right' }}>{n}</span>
                  <FaStar style={{ color: '#FFD700', fontSize: '0.72rem', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#FFD700', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', width: '24px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS GRID */}
      <section className="rs" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="rc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: '#111' }}>
              {reviews.length > 0 ? `${reviews.length} Customer Review${reviews.length !== 1 ? 's' : ''}` : 'Customer Reviews'}
            </h2>
            <a href="#write" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#CC0000', color: '#fff', padding: '11px 22px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
              Write a Review <FaArrowRight size={11} />
            </a>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <FaQuoteLeft style={{ fontSize: '2.5rem', color: '#ddd', marginBottom: '16px' }} />
              <p style={{ color: '#888', fontSize: '1rem' }}>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="rg3">
              {reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* SUBMISSION FORM */}
      <section id="write" className="rs" style={{ backgroundColor: '#fff' }}>
        <div className="rc" style={{ maxWidth: '680px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Share Your Experience</span>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#111', marginTop: '8px' }}>Write a Review</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px', lineHeight: 1.6 }}>
              Your review will appear after approval. We value every honest experience.
            </p>
          </div>

          {status === 'success' ? (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <FaCheckCircle style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '16px' }} />
              <h3 style={{ fontWeight: 800, color: '#111', fontSize: '1.2rem', marginBottom: '8px' }}>Thank you for your review!</h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>Your feedback has been submitted and will appear here once approved by our team.</p>
              <button
                onClick={() => setStatus('idle')}
                style={{ marginTop: '24px', backgroundColor: '#CC0000', color: '#fff', padding: '11px 24px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
              >
                Write Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="rg2" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>Full Name <span style={{ color: '#CC0000' }}>*</span></label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    placeholder="e.g. Kwame Asante"
                    required
                    style={{ ...inputStyle, borderColor: focusedField === 'name' ? '#CC0000' : '#e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>Role / Company <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    onFocus={() => setFocusedField('role')}
                    onBlur={() => setFocusedField('')}
                    placeholder="e.g. Fleet Manager, Accra Logistics"
                    style={{ ...inputStyle, borderColor: focusedField === 'role' ? '#CC0000' : '#e5e7eb' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '10px' }}>Your Rating <span style={{ color: '#CC0000' }}>*</span></label>
                <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                {form.rating > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '6px', display: 'block' }}>
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>Your Review <span style={{ color: '#CC0000' }}>*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Tell us about your experience with Reliance Oil..."
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', borderColor: focusedField === 'message' ? '#CC0000' : '#e5e7eb' }}
                />
              </div>

              {status === 'error' && (
                <p style={{ color: '#CC0000', fontSize: '0.85rem', margin: 0 }}>Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting' || !form.name.trim() || !form.message.trim() || form.rating === 0}
                style={{ backgroundColor: status === 'submitting' ? '#999' : '#CC0000', color: '#fff', padding: '14px 32px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', transition: 'background-color 0.2s' }}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '48px 24px', textAlign: 'center' }}>
        <div className="rc">
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '20px' }}>Have a question or complaint? Contact us directly.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#111', color: '#fff', padding: '13px 28px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
            Contact Us <FaArrowRight size={11} />
          </Link>
        </div>
      </section>
    </div>
  );
}
