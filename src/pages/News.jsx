import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlayCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const categories = ['All', 'Company News', 'CSR', 'Industry', 'Safety'];

const categoryColors = {
  'Company News': 'linear-gradient(135deg,#CC0000,#990000)',
  'CSR': 'linear-gradient(135deg,#16a34a,#166534)',
  'Industry': 'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'Safety': 'linear-gradient(135deg,#d97706,#92400e)',
};

const categoryBadgeColors = {
  'Company News': '#CC0000',
  'CSR': '#16a34a',
  'Industry': '#1d4ed8',
  'Safety': '#d97706',
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
  const baseFiltered = activeCategory === 'All' ? blogsData : blogsData.filter((b) => b.category === activeCategory);
  const filteredBlogs = baseFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < baseFiltered.length;

  return (
    <div>
      <SEO title="News & Updates" description="Stay informed with the latest news, company updates, industry insights and community initiatives from Reliance Oil Limited." path="/news" />
      <PageHero
        title="News & Updates"
        subtitle="Stay informed about Reliance Oil's latest developments, industry insights, and community initiatives."
        breadcrumb={[{ label: 'News', path: '/news' }]}
        bgImage="https://muutovkfdnabmeueqfiz.supabase.co/storage/v1/object/public/hero_slides/reliance_0061.JPG"
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        </div>
      ) : blogsData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: '#888' }}>
          <p style={{ fontSize: '1rem' }}>No news articles published yet.</p>
        </div>
      ) : (
        <>
          {/* ── FEATURED STORY ── */}
          {featuredBlog && (
            <section className="rs" style={{ backgroundColor: '#ffffff' }}>
              <div className="rc">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <SectionLabel text="Featured Story" light={true} />
                  <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: '#0D0D0D', textAlign: 'center' }}>
                    Top Story
                  </h2>
                </div>

                <Link
                  to={`/news/${featuredBlog.slug}`}
                  style={{ maxWidth: '64rem', margin: '0 auto', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: '1fr', textDecoration: 'none' }}
                  className="featured-news-grid"
                >
                  <div style={{ position: 'relative', minHeight: '20rem', overflow: 'hidden' }}>
                    {featuredBlog.image_url ? (
                      <img
                        src={featuredBlog.image_url}
                        alt={featuredBlog.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: categoryColors[featuredBlog.category] || categoryColors['Company News'] }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)' }} />
                    <span style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', fontSize: '0.625rem', fontWeight: 900, padding: '0.375rem 0.75rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#FFD700', color: '#111' }}>
                      FEATURED
                    </span>
                    <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.625rem', fontWeight: 700, padding: '0.375rem 0.75rem', borderRadius: '9999px', color: 'white', backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                      {featuredBlog.category}
                    </span>
                    {featuredBlog.video_url && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
                        <FaPlayCircle size={52} />
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                      {featuredBlog.date} &middot; {featuredBlog.author}
                    </p>
                    <h2 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: 'clamp(1.3rem,3vw,1.8rem)', lineHeight: 1.3, marginBottom: '1rem' }}>
                      {featuredBlog.title}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                      {featuredBlog.excerpt}
                    </p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, color: 'white', backgroundColor: '#CC0000', alignSelf: 'flex-start' }}>
                      Read Full Story <FaArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* ── ALL POSTS GRID ── */}
          <section className="rs" style={{ backgroundColor: '#F8F8F8' }}>
            <div className="rc">
              <div className="rf-center" style={{ marginBottom: '48px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
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
                    onMouseEnter={(e) => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = '#CC0000'; e.currentTarget.style.color = '#CC0000'; } }}
                    onMouseLeave={(e) => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#666'; } }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredBlogs.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>No posts in this category yet.</p>
              ) : (
                <div className="rg3">
                  {filteredBlogs.map((blog, index) => (
                    <Link
                      key={blog.id}
                      to={`/news/${blog.slug}`}
                      data-aos="fade-up"
                      data-aos-delay={index * 60}
                      style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #f3f4f6', textDecoration: 'none', transition: 'box-shadow 0.3s, transform 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {/* Thumbnail */}
                      <div style={{ height: '13rem', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                        {blog.image_url ? (
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: categoryColors[blog.category] || categoryColors['Company News'] }} />
                        )}
                        {blog.image_url && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />}
                        <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.6rem', fontWeight: 900, padding: '0.25rem 0.625rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: categoryBadgeColors[blog.category] || '#CC0000', color: '#fff' }}>
                          {blog.category}
                        </span>
                        {blog.video_url && (
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'rgba(255,255,255,0.92)', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
                            <FaPlayCircle size={38} />
                          </div>
                        )}
                        <span style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', fontSize: '0.6rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                          {blog.date}
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <p style={{ fontWeight: 700, color: '#111', lineHeight: 1.4, marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                          {blog.title}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.65, marginBottom: '1.25rem', flex: 1 }}>
                          {blog.excerpt.length > 110 ? blog.excerpt.slice(0, 110) + '…' : blog.excerpt}
                        </p>
                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#CC0000' }}>
                            Read More <FaArrowRight size={9} />
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{blog.author}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {hasMore && (
                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => setVisibleCount((p) => p + 3)}
                    style={{ border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', padding: '0.875rem 2rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#CC0000'; e.currentTarget.style.color = '#CC0000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .featured-news-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
