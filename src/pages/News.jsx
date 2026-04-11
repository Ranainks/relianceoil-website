import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import SectionLabel from '../components/SectionLabel';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const categories = ['All', 'Company News', 'CSR', 'Industry', 'Safety'];

const categoryColors = {
  'Company News': 'linear-gradient(135deg,#CC0000,#990000)',
  'CSR': 'linear-gradient(135deg,#16a34a,#166534)',
  'Industry': 'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'Safety': 'linear-gradient(135deg,#d97706,#92400e)',
};

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [blogsData, setblogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  useEffect(() => {
    supabase.from('posts').select('*').eq('published', true).order('date', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setblogsData(data);
      setLoading(false);
    });
  }, []);

  const featuredBlog = blogsData.find((b) => b.featured) || blogsData[0];

  const baseFiltered =
    activeCategory === 'All' ? blogsData : blogsData.filter((b) => b.category === activeCategory);
  const filteredBlogs = baseFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < baseFiltered.length;

  return (
    <div>
      <PageHero
        title="News & Updates"
        subtitle="Stay informed about Reliance Oil's latest developments, industry insights, and community initiatives."
        breadcrumb={[{ label: 'News', path: '/news' }]}
        bgImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=85"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Loading news...</div>
      ) : (
        <>
      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
            <SectionLabel text="Featured Story" light={true} />
            <h2
              style={{
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                textAlign: 'center',
              }}
            >
              Top Story
            </h2>
          </div>

          <div
            style={{
              maxWidth: '64rem',
              margin: '0 auto',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              border: '1px solid #f3f4f6',
            }}
          >
            <div className="rg2">
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.5rem',
                  minHeight: '18rem',
                  background: categoryColors[featuredBlog.category] || categoryColors['Company News'],
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    fontSize: '0.625rem',
                    fontWeight: 900,
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: '#FFD700',
                    color: '#111',
                  }}
                >
                  FEATURED
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '0.375rem 0.75rem',
                    borderRadius: '9999px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {featuredBlog.category}
                </span>
              </div>

              <div
                style={{
                  padding: '2rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                  {featuredBlog.date} &middot; {featuredBlog.author}
                </p>
                <h2
                  style={{
                    fontWeight: 800,
                    color: '#0D0D0D',
                    fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                    lineHeight: 1.3,
                    marginBottom: '1rem',
                  }}
                >
                  {featuredBlog.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {featuredBlog.excerpt}
                </p>
                <Link
                  to={`/news/${featuredBlog.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'white',
                    backgroundColor: '#CC0000',
                    transition: 'background-color 0.2s',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#990000')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CC0000')}
                >
                  Read Full Story
                  <FaArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc">
          <div className="rf-center" style={{ marginBottom: '48px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(6);
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  ...(activeCategory === cat
                    ? { backgroundColor: '#0D0D0D', color: 'white', border: 'none' }
                    : { backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#666' }),
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = '#CC0000';
                    e.currentTarget.style.color = '#CC0000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#666';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="rg3">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog.id}
                data-aos="fade-up"
                data-aos-delay={index * 60}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  border: '1px solid transparent',
                }}
                className="card-hover"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div
                  style={{
                    height: '13rem',
                    position: 'relative',
                    background: categoryColors[blog.category] || categoryColors['Company News'],
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      fontSize: '0.625rem',
                      fontWeight: 900,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backgroundColor: '#FFD700',
                      color: '#111',
                    }}
                  >
                    {blog.category}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      fontSize: '0.625rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {blog.date}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#CC0000', marginBottom: '0.5rem' }}>
                    {blog.category}
                  </p>
                  <p
                    style={{ fontWeight: 700, color: '#111', lineHeight: 1.4, marginBottom: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#CC0000')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#111')}
                  >
                    {blog.title}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                    {blog.excerpt.slice(0, 110)}...
                  </p>
                  <div style={{ borderTop: '1px solid #f3f4f6', marginBottom: '1rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      to={`/news/${blog.slug}`}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: '#CC0000',
                        transition: 'gap 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.gap = '8px')}
                      onMouseLeave={(e) => (e.currentTarget.style.gap = '4px')}
                    >
                      Read More
                      <FaArrowRight size={9} />
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{blog.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setVisibleCount((p) => p + 3)}
                style={{
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#4b5563',
                  padding: '0.875rem 2rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CC0000';
                  e.currentTarget.style.color = '#CC0000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#4b5563';
                }}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
        </>
      )}
    </div>
  );
}
