import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaArrowLeft, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
  return match ? match[1] : null;
}

const markdownComponents = {
  h2: ({ children }) => <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111', marginTop: '2rem', marginBottom: '0.75rem' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{children}</h3>,
  p: ({ children }) => <p style={{ marginBottom: '1.25rem', lineHeight: 1.9, color: '#444' }}>{children}</p>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#111' }}>{children}</strong>,
  ul: ({ children }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'disc' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal' }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: '0.4rem', color: '#444', lineHeight: 1.7 }}>{children}</li>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#CC0000', fontWeight: 600, textDecoration: 'underline' }}>{children}</a>,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: '4px solid #CC0000', paddingLeft: '1rem', margin: '1.5rem 0', color: '#666', fontStyle: 'italic' }}>{children}</blockquote>,
  img: ({ src, alt }) => <img src={src} alt={alt} style={{ width: '100%', borderRadius: '12px', margin: '1.5rem 0', objectFit: 'cover' }} />,
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '2rem 0' }} />,
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.from('services').select('*').eq('slug', slug).single().then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setService(data);
      setLoading(false);
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
        <Link to="/services" style={{ color: '#CC0000', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaArrowLeft size={12} /> Back to Services
        </Link>
      </div>
    );
  }

  const youtubeId = getYouTubeId(service.video_url);
  const features = Array.isArray(service.features) ? service.features : [];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SEO title={service.title} description={service.description} path={'/services/' + slug} image={service.image_url} />

      <div style={{ background: 'linear-gradient(135deg,#CC0000,#7f0000)', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/services')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '24px', padding: 0 }}
          >
            <FaArrowLeft size={12} /> Back to Services
          </button>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFD700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Our Services
          </span>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#ffffff', lineHeight: 1.2, marginTop: '16px', marginBottom: '12px' }}>
            {service.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '640px' }}>
            {service.description}
          </p>
          {service.video_url && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '16px' }}>
              <FaPlayCircle size={14} /> Video included
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        {service.image_url && !youtubeId && !service.video_url && (
          <img
            src={service.image_url}
            alt={service.title}
            style={{ width: '100%', borderRadius: '16px', marginBottom: '40px', objectFit: 'cover', maxHeight: '440px' }}
          />
        )}

        {youtubeId && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={service.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        )}

        {service.video_url && !youtubeId && (
          <video
            controls
            style={{ width: '100%', borderRadius: '16px', marginBottom: '40px' }}
          >
            <source src={service.video_url} />
          </video>
        )}

        {features.length > 0 && (
          <div style={{ backgroundColor: '#FFF8F8', border: '1px solid #FFE5E5', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#111', marginBottom: '20px' }}>Key Features</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '12px' }}>
              {features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#333', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <FaCheckCircle size={14} style={{ color: '#CC0000', marginTop: '3px', flexShrink: 0 }} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.content && (
          <div style={{ fontSize: '1rem', lineHeight: 1.9 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {service.content}
            </ReactMarkdown>
          </div>
        )}

        {service.image_url && (youtubeId || service.video_url) && (
          <img
            src={service.image_url}
            alt={service.title}
            style={{ width: '100%', borderRadius: '16px', marginTop: '40px', objectFit: 'cover', maxHeight: '440px' }}
          />
        )}

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#CC0000', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
            <FaArrowLeft size={12} /> Back to Services
          </Link>
          <Link
            to="/contact"
            style={{ backgroundColor: '#CC0000', color: '#ffffff', padding: '12px 28px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </div>
  );
}
