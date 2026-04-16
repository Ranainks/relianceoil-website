import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaPlayCircle, FaGasPump } from 'react-icons/fa';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
  return match ? match[1] : null;
}

const markdownComponents = {
  h2: ({ children }) => <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111', marginTop: '2.5rem', marginBottom: '0.75rem' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{children}</h3>,
  p: ({ children }) => <p style={{ marginBottom: '1.25rem', lineHeight: 1.9, color: '#444' }}>{children}</p>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#111' }}>{children}</strong>,
  ul: ({ children }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal' }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: '0.4rem', color: '#444', lineHeight: 1.7 }}>{children}</li>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#CC0000', fontWeight: 600, textDecoration: 'underline' }}>{children}</a>,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: '4px solid #CC0000', paddingLeft: '1.25rem', margin: '1.5rem 0', color: '#666', fontStyle: 'italic' }}>{children}</blockquote>,
  img: ({ src, alt }) => <img src={src} alt={alt} style={{ width: '100%', borderRadius: '10px', margin: '1.5rem 0', objectFit: 'cover' }} />,
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '2rem 0' }} />,
};

function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/services/${service.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.07)', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'box-shadow 0.25s, transform 0.25s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: '200px', background: service.image_url ? `url(${service.image_url}) center/cover no-repeat` : 'linear-gradient(135deg,#CC0000,#7f0000)', position: 'relative', overflow: 'hidden' }}>
        {!service.image_url && <FaGasPump style={{ position: 'absolute', bottom: '16px', right: '16px', fontSize: '48px', color: 'rgba(255,255,255,0.15)' }} />}
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>{service.title}</h3>
        <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65, margin: 0, flex: 1 }}>{service.description}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CC0000', fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
          Learn More <FaArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.from('services').select('*').eq('slug', slug).single().then(({ data, error }) => {
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setService(data);
      setLoading(false);
      supabase.from('services').select('id,title,description,slug,image_url').neq('slug', slug).order('order_index').limit(3).then(({ data: rest }) => {
        if (rest) setOthers(rest);
      });
    });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111' }}>Service not found</h2>
        <Link to="/services" style={{ color: '#CC0000', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <FaArrowLeft size={12} /> Back to Services
        </Link>
      </div>
    );
  }

  const youtubeId = getYouTubeId(service.video_url);
  const features = Array.isArray(service.features) ? service.features : [];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <SEO title={service.title} description={service.description} path={'/services/' + slug} image={service.image_url} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', minHeight: '420px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#CC0000,#7f0000)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="rc" style={{ position: 'relative', zIndex: 1, paddingBottom: '56px', paddingTop: '40px', width: '100%' }}>
          <button
            onClick={() => navigate('/services')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '24px', padding: 0, fontWeight: 500 }}
          >
            <FaArrowLeft size={11} /> All Services
          </button>
          <div style={{ maxWidth: '680px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFD700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block', marginBottom: '16px' }}>
              Our Services
            </span>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem,4.5vw,2.6rem)', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
              {service.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
              {service.description}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/contact"
                style={{ backgroundColor: '#CC0000', color: '#fff', padding: '13px 28px', borderRadius: '6px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Enquire Now <FaArrowRight size={12} />
              </Link>
              {service.video_url && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', alignSelf: 'center' }}>
                  <FaPlayCircle size={16} /> Watch Video
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES CARDS ── */}
      {features.length > 0 && (
        <section className="rs" style={{ backgroundColor: '#f9f9f9' }}>
          <div className="rc">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>What We Offer</span>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#111', marginTop: '8px', lineHeight: 1.2 }}>Key Features</h2>
            </div>
            <div className="rg3">
              {features.map((feat, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #F0F0F0', padding: '28px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <FaCheckCircle size={16} style={{ color: '#CC0000' }} />
                  </div>
                  <p style={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{feat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MEDIA ── */}
      {(youtubeId || (service.video_url && !youtubeId)) && (
        <section className="rs-sm" style={{ backgroundColor: '#fff' }}>
          <div className="rc" style={{ maxWidth: '900px' }}>
            {youtubeId ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '10px', overflow: 'hidden' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={service.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <video controls style={{ width: '100%', borderRadius: '10px' }}>
                <source src={service.video_url} />
              </video>
            )}
          </div>
        </section>
      )}

      {/* ── CONTENT ── */}
      {service.content && (
        <section className="rs" style={{ backgroundColor: '#fff' }}>
          <div className="rc" style={{ maxWidth: '820px' }}>
            <div style={{ fontSize: '1rem', lineHeight: 1.9 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {service.content}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* ── OTHER SERVICES ── */}
      {others.length > 0 && (
        <section className="rs" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="rc">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore More</span>
                <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.9rem)', color: '#111', marginTop: '6px' }}>Other Services</h2>
              </div>
              <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#CC0000', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                View All <FaArrowRight size={11} />
              </Link>
            </div>
            <div className="rg3">
              {others.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA STRIP ── */}
      <section style={{ backgroundColor: '#CC0000', padding: '56px 24px', textAlign: 'center' }}>
        <div className="rc">
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '12px' }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>Contact our team today for pricing, availability, and customised solutions.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ backgroundColor: '#FFD700', color: '#111', padding: '14px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Contact Us <FaArrowRight size={12} />
            </Link>
            <Link to="/services" style={{ backgroundColor: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FaArrowLeft size={12} /> All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
