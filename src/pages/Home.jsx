import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaGasPump,
  FaTruck,
  FaWrench,
  FaFire,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaQuoteLeft,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from 'react-icons/fa';
import SectionLabel from '../components/SectionLabel';
import blogsData from '../data/blogs.json';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const whoWeAreStats = [
  { value: 34, suffix: '+', label: 'Stations Nationwide' },
  { value: 5, suffix: '+', label: 'Years Licensed' },
  { value: 6, suffix: '', label: 'Regions Covered' },
  { value: 24, suffix: '/7', label: 'Service Available' },
];

const services = [
  { icon: FaGasPump, title: 'Petroleum Products', desc: 'High-quality petrol and diesel supply meeting NPA and GSA quality standards nationwide.' },
  { icon: FaMapMarkerAlt, title: 'Retail Fuel Stations', desc: 'Strategically located stations operating 24/7 in key areas for maximum convenience.' },
  { icon: FaFire, title: 'LPG Services', desc: 'Safe and efficient LPG refilling for households and businesses following GNFS standards.' },
  { icon: FaWrench, title: 'Lubricants & Oils', desc: 'Premium engine oils and lubricants for all vehicle types and industrial applications.' },
  { icon: FaShieldAlt, title: 'Car Wash', desc: 'Professional car wash services available at select Reliance Oil stations.' },
  { icon: FaStar, title: 'Fleet Management', desc: 'Comprehensive fleet fueling solutions with smart tracking and bulk supply contracts.' },
];

const testimonials = [
  { name: 'Kwame Asante', role: 'Fleet Manager, Accra Logistics Ltd', text: 'Reliance Oil has been our go-to fuel supplier for 5 years. Their consistent quality and nationwide coverage makes fleet management seamless across all our routes.', stars: 5 },
  { name: 'Abena Mensah', role: 'Small Business Owner, Kumasi', text: 'The fuel service at my local Reliance station is outstanding. The staff are always helpful and the prices are very competitive. Highly recommended!', stars: 5 },
  { name: 'Kofi Darko', role: 'Operations Director, Western Cement Co.', text: 'We rely on Reliance Oil for all our bulk fuel needs. Their delivery is always on time and their quality checks give us complete confidence.', stars: 5 },
  { name: 'Akosua Boateng', role: 'Transport Manager, GhanaLink Bus', text: 'Having Reliance Oil stations across Ghana means our buses are never stranded. Their 24/7 service is a game-changer for our operations.', stars: 5 },
];

const faqs = [
  { q: 'What types of fuel do Reliance Oil stations offer?', a: 'We offer Premium Petrol, Diesel, LPG, and a comprehensive range of automotive lubricants and oils at our stations across Ghana.' },
  { q: 'How do I find my nearest Reliance Oil station?', a: "Use our interactive station locator on the 'Find a Station' page. You can search by region, filter by available services, and get directions directly." },
  { q: 'Does Reliance Oil offer fleet fuel management solutions?', a: 'Yes! We provide comprehensive fleet management solutions including bulk supply contracts, fuel tracking, and dedicated account management for businesses.' },
  { q: 'Are Reliance Oil products GSA certified?', a: 'Absolutely. All our petroleum products are certified by the Ghana Standards Authority and undergo rigorous quality testing at every stage of supply.' },
  { q: 'Which Reliance Oil stations are open 24 hours?', a: 'Many of our stations across Greater Accra, Ashanti, and Western regions operate 24/7. Check the Find a Station page for specific hours at each location.' },
];

const fallbackSlides = [
  {
    img: 'https://images.unsplash.com/photo-1562757219-2ffc897f99e3?w=1600&q=85',
    headline: "Fuelling Ghana's Growth",
    sub: 'Delivering quality petroleum products and exceptional service across 34+ stations in 6 regions throughout Ghana.',
  },
];

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('');
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideAutoPlay, setSlideAutoPlay] = useState(true);
  const [heroSlides, setHeroSlides] = useState(fallbackSlides);

  useEffect(() => {
    supabase.from('hero_slides').select('*').eq('active', true).order('order_index').then(({ data }) => {
      if (data && data.length > 0) setHeroSlides(data);
    });
  }, []);

  const statsRef = useRef(null);
  const countersRef = useRef([]);
  const animatedRef = useRef(false);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!slideAutoPlay) return;
    const timer = setInterval(() => {
      setActiveSlide(s => (s + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideAutoPlay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          whoWeAreStats.forEach((stat, i) => {
            const el = countersRef.current[i];
            if (!el) return;
            const start = performance.now();
            const duration = 2000;
            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * stat.value) + stat.suffix;
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const recentBlogs = blogsData.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Quality Petroleum Products Across Ghana"
        description="Reliance Oil Limited — NPA licensed petroleum company with 33+ filling stations across Ghana. Quality petrol, diesel, LPG, lubricants and fleet management services."
        path="/"
      />
      <section
        style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh', paddingTop: '72px', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => setSlideAutoPlay(false)}
        onMouseLeave={() => setSlideAutoPlay(true)}
      >
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === activeSlide ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.65) 55%, rgba(5,5,5,0.3) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', zIndex: 2 }} />

        <div className="rc" style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '120px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <SectionLabel text="NPA Licensed Since 2020" light={false} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5 }}
              >
                <h1 style={{ fontWeight: 900, fontSize: 'clamp(2.6rem,6vw,4.5rem)', color: '#ffffff', lineHeight: 1.1, marginBottom: '20px' }}>
                  {heroSlides[activeSlide].headline}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '520px', marginBottom: '36px' }}>
                  {heroSlides[activeSlide].sub}
                </p>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/find-station"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFD700', color: '#111111', padding: '14px 28px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFE033'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Find a Station <FaArrowRight size={13} />
              </Link>
              <Link
                to="/about"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.3)', color: '#ffffff', padding: '14px 28px', borderRadius: '9999px', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                About Us
              </Link>
            </div>
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  { bg: 'linear-gradient(135deg,#CC0000,#FF4444)', ml: '0' },
                  { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', ml: '-8px' },
                  { bg: 'linear-gradient(135deg,#333,#555)', ml: '-8px' },
                ].map((av, i) => (
                  <div key={i} style={{ width: '36px', height: '36px', borderRadius: '9999px', border: '2px solid rgba(0,0,0,0.5)', background: av.bg, marginLeft: av.ml, flexShrink: 0 }} />
                ))}
              </div>
              <div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem' }}>34+ Stations Across Ghana</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>Serving thousands daily</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
          style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        >
          <FaChevronLeft size={16} />
        </button>
        <button
          onClick={() => setActiveSlide(s => (s + 1) % heroSlides.length)}
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        >
          <FaChevronRight size={16} />
        </button>

        <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{ width: i === activeSlide ? '28px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === activeSlide ? '#FFD700' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'width 0.35s ease, background-color 0.3s ease', padding: 0 }}
            />
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 20, color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
          {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      <section style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc rs">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <div
                style={{
                  height: '480px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1723021939081-31f4ab31456a?w=1200&q=85"
                  alt="Reliance Oil Filling Station at Night"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  {[
                    { val: '34+', lbl: 'Stations' },
                    { val: '5+', lbl: 'Years' },
                    { val: '24/7', lbl: 'Service' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#CC0000' }}>{s.val}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div data-aos="fade-left">
              <SectionLabel text="Cost-Effective Solutions" light={true} />
              <h2
                style={{
                  fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                  fontWeight: 800,
                  color: '#0D0D0D',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                }}
              >
                Your Trusted Partner in Quality Fuel
              </h2>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                We deliver premium petroleum products and services that meet the highest standards, ensuring your vehicles and businesses always run smoothly.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {[
                  { icon: FaShieldAlt, title: 'Eco-Friendly & Certified', text: 'All our fuels meet Ghana Standards Authority specifications for quality and safety.' },
                  { icon: FaUsers, title: 'Expert Team & Quality Service', text: 'Our trained staff across all 30+ stations ensure exceptional customer experience.' },
                  { icon: FaStar, title: 'Smart & Efficient Fuel Solutions', text: 'We offer the best market prices, loyalty programs, and fleet management solutions.' },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#FFF0F0',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} style={{ color: '#CC0000' }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '4px' }}>{feat.title}</h4>
                        <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{feat.text}</p>
                        <Link
                          to="/services"
                          style={{
                            color: '#CC0000',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '8px',
                            textDecoration: 'none',
                            transition: 'gap 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.gap = '8px'; }}
                          onMouseLeave={e => { e.currentTarget.style.gap = '4px'; }}
                        >
                          Read More <FaArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#111111' }}>
        <div className="rc rs">
          <div className="rg2 center">
            <div data-aos="fade-right">
              <SectionLabel text="Who We Are" light={false} />
              <h2
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                  lineHeight: 1.2,
                  marginBottom: '20px',
                }}
              >
                Leading Ghana's Petroleum Retail Industry
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '32px' }}>
                Established in January 2020 and licensed by the National Petroleum Authority (NPA), Reliance Oil Limited operates in Ghana's downstream petroleum sector. We supply fuel products through a rapidly expanding network of stations, driven by excellence, safety, and a strong commitment to national development.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { num: '01', title: 'Our Mission', text: 'To become a leading supplier of petroleum products in Ghana while contributing to economic growth and transformation.' },
                  { num: '02', title: 'Our Vision', text: 'To be the leading Oil Marketing Company in Ghana and a centre of excellence in petroleum retailing.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: '2.5rem',
                        color: 'rgba(255,215,0,0.2)',
                        lineHeight: 1,
                        minWidth: '50px',
                      }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontWeight: 700,
                          color: '#FFD700',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          marginBottom: '4px',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFD700',
                  color: '#111111',
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  marginTop: '32px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFE033'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFD700'; }}
              >
                About Us <FaArrowRight size={12} />
              </Link>
            </div>

            <div data-aos="fade-left">
              <div
                style={{
                  height: '460px',
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg,#1a0000 0%,#CC0000 60%,#FF4444 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '5rem', color: '#ffffff', lineHeight: 1 }}>5+</div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    marginTop: '4px',
                  }}
                >
                  Years Licensed
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {[
                    { val: '34+', lbl: 'Stations' },
                    { val: '6', lbl: 'Regions' },
                    { val: '24/7', lbl: 'Service' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#FFD700', fontSize: '1.3rem' }}>{s.val}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={statsRef}
            className="rg4"
            style={{
              marginTop: '64px',
              paddingTop: '64px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
            }}
          >
              {whoWeAreStats.map((stat, i) => (
                <div key={i}>
                  <div
                    ref={el => (countersRef.current[i] = el)}
                    style={{
                      fontSize: 'clamp(2rem,5vw,3rem)',
                      fontWeight: 900,
                      color: '#FFD700',
                      marginBottom: '4px',
                    }}
                  >
                    0{stat.suffix}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff' }}>
        <div className="rc rs">
          <div style={{ textAlign: 'center', marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SectionLabel text="Our Services" light={true} />
            </div>
            <h2
              style={{
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                color: '#0D0D0D',
                marginBottom: '16px',
              }}
            >
              Comprehensive Energy Solutions for Ghana
            </h2>
            <p
              style={{
                textAlign: 'center',
                color: '#888',
                maxWidth: '520px',
                margin: '0 auto',
                marginBottom: '64px',
              }}
            >
              From fuel retail to fleet management, we provide end-to-end petroleum solutions.
            </p>
          </div>
          <div className="rg3" style={{ marginTop: '48px' }}>
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #F0F0F0',
                    borderRadius: '16px',
                    padding: '32px',
                    transition: 'all 0.3s',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#FFF0F0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <Icon size={22} style={{ color: '#CC0000' }} />
                  </div>
                  <h4 style={{ fontWeight: 700, color: '#111', fontSize: '1.05rem', marginBottom: '12px' }}>{svc.title}</h4>
                  <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>{svc.desc}</p>
                  <hr style={{ borderColor: '#F5F5F5', marginBottom: '20px' }} />
                  <div
                    style={{
                      color: '#CC0000',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Read More <FaArrowRight size={10} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/services"
              style={{
                backgroundColor: '#0D0D0D',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#CC0000'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0D0D0D'; }}
            >
              View All Services <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#111111' }}>
        <div className="rc rs">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SectionLabel text="Testimonials" light={false} />
          </div>
          <h2
            style={{
              textAlign: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem,4vw,2.4rem)',
              marginBottom: '64px',
            }}
          >
            Real Experiences, Real Trust
          </h2>
          <div style={{ maxWidth: '768px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <FaQuoteLeft
                  style={{
                    fontSize: '2.5rem',
                    color: 'rgba(204,0,0,0.3)',
                    display: 'block',
                    margin: '0 auto 24px',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                  {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => (
                    <FaStar key={i} style={{ color: '#FFD700', fontSize: '0.9rem' }} />
                  ))}
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 'clamp(1rem,2.5vw,1.2rem)',
                    lineHeight: 1.75,
                    fontStyle: 'italic',
                    marginBottom: '32px',
                  }}
                >
                  {testimonials[activeTestimonial].text}
                </p>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg,#CC0000,#FF4444)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>
                    {getInitials(testimonials[activeTestimonial].name)}
                  </span>
                </div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem' }}>
                  {testimonials[activeTestimonial].name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                  {testimonials[activeTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: activeTestimonial === i ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '9999px',
                    backgroundColor: activeTestimonial === i ? '#FFD700' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    padding: 0,
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ backgroundColor: '#0D0D0D', position: 'relative', overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 20% 50%,rgba(204,0,0,0.05),transparent 60%)',
            zIndex: 0,
          }}
        />
        <div className="rc rs" style={{ position: 'relative', zIndex: 10 }}>
          <div className="rg2">
            <div data-aos="fade-right">
              <SectionLabel text="FAQs" light={false} />
              <h2
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                  marginBottom: '24px',
                }}
              >
                Questions We Often Get Asked
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '32px' }}>
                Can't find what you're looking for? Contact our team and we'll be happy to help.
              </p>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255,215,0,0.4)',
                  color: '#FFD700',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,215,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Get In Touch <FaArrowRight size={12} />
              </Link>
            </div>

            <div data-aos="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: openFaq === i ? '1px solid rgba(204,0,0,0.3)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        color: openFaq === i ? '#FFD700' : 'rgba(255,255,255,0.8)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      {faq.q}
                    </span>
                    <FaChevronDown
                      size={12}
                      style={{
                        color: 'rgba(255,255,255,0.4)',
                        transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          style={{
                            padding: '0 20px 16px',
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '0.875rem',
                            lineHeight: 1.7,
                          }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ backgroundColor: '#111111', position: 'relative', overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg,rgba(204,0,0,0.12) 0%,transparent 60%)',
            zIndex: 0,
          }}
        />
        <div
          className="rc rs"
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 'clamp(2rem,5vw,3rem)',
              marginBottom: '16px',
            }}
          >
            Ready to Experience Premium Fuel Service?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.125rem', marginBottom: '40px' }}>
            Visit your nearest Reliance Oil station or contact us for bulk supply and fleet management solutions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/find-station"
              style={{
                backgroundColor: '#FFD700',
                color: '#111111',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Find a Station <FaArrowRight size={13} />
            </Link>
            <Link
              to="/contact"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Contact Us
            </Link>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[
                { bg: 'linear-gradient(135deg,#CC0000,#FF4444)', ml: '0' },
                { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', ml: '-8px' },
                { bg: 'linear-gradient(135deg,#333,#555)', ml: '-8px' },
              ].map((av, i) => (
                <div
                  key={i}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    border: '2px solid #111111',
                    background: av.bg,
                    marginLeft: av.ml,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.875rem' }}>
                Trusted by thousands of Ghanaians
              </span>
              <FaStar style={{ color: '#FFD700' }} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#F8F8F8' }}>
        <div className="rc rs">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SectionLabel text="Latest Blog Post" light={true} />
          </div>
          <h2
            style={{
              textAlign: 'center',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem,4vw,2.4rem)',
              color: '#0D0D0D',
              marginBottom: '64px',
            }}
          >
            Stay Updated on Industry News
          </h2>
          <div className="rg3" style={{ marginTop: '48px' }}>
            {recentBlogs.map((blog, i) => (
              <div
                key={blog.id}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    height: '208px',
                    background: 'linear-gradient(135deg,#CC0000,#990000)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: '#FFD700',
                      color: '#000000',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {blog.category}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#ffffff',
                      fontSize: '10px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {blog.date}
                  </span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div
                    style={{
                      color: '#CC0000',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '8px',
                    }}
                  >
                    {blog.category}
                  </div>
                  <h4
                    style={{
                      color: '#111',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      lineHeight: 1.4,
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#CC0000'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#111'; }}
                  >
                    {blog.title}
                  </h4>
                  <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '20px' }}>
                    {blog.excerpt.length > 100 ? blog.excerpt.slice(0, 100) + '…' : blog.excerpt}
                  </p>
                  <hr style={{ borderColor: '#F5F5F5', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/news/${blog.slug}`}
                      style={{
                        color: '#CC0000',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        transition: 'gap 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.gap = '10px'; }}
                      onMouseLeave={e => { e.currentTarget.style.gap = '6px'; }}
                    >
                      Read More <FaArrowRight size={10} />
                    </Link>
                    <span style={{ color: '#bbbbbb', fontSize: '0.75rem' }}>{blog.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/news"
              style={{
                border: '1px solid #E5E5E5',
                backgroundColor: '#ffffff',
                color: '#111111',
                padding: '14px 32px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#CC0000';
                e.currentTarget.style.color = '#CC0000';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E5E5E5';
                e.currentTarget.style.color = '#111111';
              }}
            >
              View All Articles <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
