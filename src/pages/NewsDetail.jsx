import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaPlayCircle } from 'react-icons/fa';

const categoryColors = {
  'Company News': 'linear-gradient(135deg,#CC0000,#990000)',
  'CSR': 'linear-gradient(135deg,#16a34a,#166534)',
  'Industry': 'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'Safety': 'linear-gradient(135deg,#d97706,#92400e)',
};

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

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.from('posts').select('*').eq('slug', slug).eq('published', true).single().then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setPost(data);
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
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111' }}>Article not found</h2>
        <Link to="/news" style={{ color: '#CC0000', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaArrowLeft size={12} /> Back to News
        </Link>
      </div>
    );
  }

  const youtubeId = getYouTubeId(post.video_url);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SEO title={post?.title} description={post?.excerpt} path={'/news/' + slug} />

      <div style={{ background: categoryColors[post.category] || categoryColors['Company News'], padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/news')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '24px', padding: 0 }}
          >
            <FaArrowLeft size={12} /> Back to News
          </button>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFD700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {post.category}
          </span>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#ffffff', lineHeight: 1.2, marginTop: '16px', marginBottom: '20px' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaCalendarAlt size={12} />{post.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaUser size={12} />{post.author}</span>
            {post.video_url && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaPlayCircle size={12} /> Video included</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        {post.image_url && !youtubeId && (
          <img
            src={post.image_url}
            alt={post.title}
            style={{ width: '100%', borderRadius: '16px', marginBottom: '40px', objectFit: 'cover', maxHeight: '420px' }}
          />
        )}

        {youtubeId && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        )}

        {post.video_url && !youtubeId && (
          <video
            controls
            style={{ width: '100%', borderRadius: '16px', marginBottom: '40px' }}
          >
            <source src={post.video_url} />
          </video>
        )}

        <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.8, fontWeight: 500, marginBottom: '32px', borderLeft: '4px solid #CC0000', paddingLeft: '20px' }}>
          {post.excerpt}
        </p>

        <div style={{ fontSize: '1rem', lineHeight: 1.9 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content || ''}
          </ReactMarkdown>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#CC0000', fontWeight: 600, fontSize: '0.875rem' }}>
            <FaArrowLeft size={12} /> Back to News
          </Link>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Published by {post.author}</span>
        </div>
      </div>
    </div>
  );
}
