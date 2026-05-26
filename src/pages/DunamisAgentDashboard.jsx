import { useState } from 'react';
import { FaArrowUp, FaBars, FaBell, FaBuilding, FaCalendarAlt, FaChartBar, FaCog, FaHome, FaTimes, FaUsers } from 'react-icons/fa';

const ORANGE = '#F97316';
const NAVY = '#1B1F3B';
const PAGE_BG = '#0F1020';

export default function DunamisAgentDashboard() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', icon: FaHome },
    { label: 'Leads', icon: FaUsers },
    { label: 'Properties', icon: FaBuilding },
    { label: 'Bookings', icon: FaCalendarAlt },
    { label: 'Analytics', icon: FaChartBar },
    { label: 'Settings', icon: FaCog },
  ];

  const stats = [
    { label: 'Active Leads', value: '47', trend: '+12%', icon: FaUsers },
    { label: 'Properties Listed', value: '38', trend: '+5%', icon: FaBuilding },
    { label: 'Tours This Week', value: '14', trend: '+8%', icon: FaCalendarAlt },
    { label: 'Conversion Rate', value: '23%', trend: '+3%', icon: FaChartBar },
  ];

  const leads = [
    { name: 'Ama Boateng', property: 'Airport City Duplex', intent: 'Buy', status: 'Hot', date: '20 May 2026' },
    { name: 'Kwesi Mensah', property: 'East Legon Apartment', intent: 'Rent', status: 'New', date: '19 May 2026' },
    { name: 'Nana Osei', property: 'Tema Industrial Warehouse', intent: 'Lease', status: 'Warm', date: '18 May 2026' },
    { name: 'Efua Addo', property: 'Cantonments Villa', intent: 'Buy', status: 'Hot', date: '17 May 2026' },
    { name: 'Kojo Darko', property: 'Spintex Retail Space', intent: 'Lease', status: 'New', date: '16 May 2026' },
  ];

  const stages = [
    { title: 'Planning', cards: [{ name: 'Lakeside Courts', price: '$185,000' }, { name: 'Adenta Grove', price: '$220,000' }] },
    { title: 'Foundation', cards: [{ name: 'Tema Enclave', price: '$310,000' }] },
    { title: 'Structural Framing', cards: [{ name: 'Ridge Heights', price: '$450,000' }, { name: 'Osu Terraces', price: '$390,000' }] },
    { title: 'First-Fix', cards: [{ name: 'Airport Lofts', price: '$275,000' }] },
    { title: 'Outfitting', cards: [{ name: 'Cantonments Pearl', price: '$620,000' }, { name: 'Labone Suites', price: '$335,000' }] },
    { title: 'Turnkey', cards: [{ name: 'East Legon Villa', price: '$720,000' }] },
  ];

  const bookings = [
    { property: 'Airport City Duplex', client: 'Ama Boateng', date: '21 May 2026, 10:00 AM', type: 'Physical', status: 'Confirmed' },
    { property: 'Cantonments Pearl', client: 'Efua Addo', date: '22 May 2026, 2:30 PM', type: 'Virtual', status: 'Pending' },
    { property: 'Tema Enclave', client: 'Nana Osei', date: '23 May 2026, 11:15 AM', type: 'Physical', status: 'Confirmed' },
  ];

  const badgeStyle = (value) => {
    const map = {
      Buy: ['rgba(34,197,94,0.16)', '#22C55E'],
      Rent: ['rgba(59,130,246,0.16)', '#60A5FA'],
      Lease: ['rgba(168,85,247,0.16)', '#C084FC'],
      New: ['rgba(59,130,246,0.16)', '#60A5FA'],
      Hot: ['rgba(239,68,68,0.16)', '#F87171'],
      Warm: ['rgba(249,115,22,0.16)', ORANGE],
      Pending: ['rgba(245,158,11,0.16)', '#FBBF24'],
      Confirmed: ['rgba(34,197,94,0.16)', '#22C55E'],
    };
    const [bg, color] = map[value] || ['rgba(255,255,255,0.12)', '#fff'];
    return { backgroundColor: bg, color, padding: '6px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex' };
  };

  const Sidebar = ({ mobile = false }) => (
    <aside style={{ position: mobile ? 'fixed' : 'fixed', top: 0, left: 0, bottom: 0, width: '240px', backgroundColor: NAVY, zIndex: 20, padding: '26px 18px', boxSizing: 'border-box', transform: mobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 0.25s ease', boxShadow: mobile ? '20px 0 50px rgba(0,0,0,0.35)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '34px' }}>
        <div style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 900 }}>Dunamis CRM</div>
        {mobile && <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><FaTimes size={20} /></button>}
      </div>
      <nav style={{ display: 'grid', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeNav === item.label;
          return (
            <button key={item.label} onClick={() => { setActiveNav(item.label); setMobileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', border: 'none', borderRadius: '14px', padding: '13px 14px', cursor: 'pointer', backgroundColor: active ? 'rgba(249,115,22,0.16)' : 'transparent', color: active ? ORANGE : 'rgba(255,255,255,0.72)', fontWeight: 800, textAlign: 'left' }}>
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const cardStyle = { backgroundColor: NAVY, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: PAGE_BG, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'none' }} className="desktop-sidebar"><Sidebar /></div>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 15 }} />}
      <Sidebar mobile />
      <style>{`@media (min-width: 769px){.desktop-sidebar{display:block!important}.dashboard-content{margin-left:240px!important}.mobile-menu-button{display:none!important}} @media (max-width: 768px){.dashboard-content{margin-left:0!important}.desktop-only-table{min-width:760px}.dashboard-header{padding-left:68px!important}}`}</style>

      <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} style={{ position: 'fixed', top: '18px', left: '18px', zIndex: 12, width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.10)', backgroundColor: NAVY, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><FaBars /></button>

      <section className="dashboard-content" style={{ marginLeft: 0, transition: 'margin 0.25s ease' }}>
        <header className="dashboard-header" style={{ backgroundColor: NAVY, padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900 }}>Agent Dashboard</h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.58)' }}>Manage leads, properties, bookings, and pipeline activity.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: ORANGE }}><FaBell /></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900 }}>John Agyei</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>Senior Agent</div>
            </div>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: `linear-gradient(135deg, ${ORANGE}, #FB923C)`, display: 'grid', placeItems: 'center', fontWeight: 900 }}>JA</div>
          </div>
        </header>

        <div style={{ padding: '28px', display: 'grid', gap: '28px' }}>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{ ...cardStyle, padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(249,115,22,0.14)', color: ORANGE, display: 'grid', placeItems: 'center' }}><Icon size={20} /></div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.13)', padding: '6px 9px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 900 }}><FaArrowUp size={10} /> {stat.trend}</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.58)', marginTop: '8px', fontWeight: 700 }}>{stat.label}</div>
                </div>
              );
            })}
          </section>

          <section style={{ ...cardStyle, padding: '24px', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '1.35rem', fontWeight: 900 }}>Recent Leads</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="desktop-only-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Lead Name', 'Property Interest', 'Intent', 'Status', 'Date'].map((head) => <th key={head} style={{ textAlign: 'left', color: 'rgba(255,255,255,0.52)', padding: '0 16px 14px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{head}</th>)}</tr></thead>
                <tbody>{leads.map((lead) => <tr key={lead.name} style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}><td style={{ padding: '16px 16px 16px 0', fontWeight: 900 }}>{lead.name}</td><td style={{ padding: '16px 16px 16px 0', color: 'rgba(255,255,255,0.72)' }}>{lead.property}</td><td style={{ padding: '16px 16px 16px 0' }}><span style={badgeStyle(lead.intent)}>{lead.intent}</span></td><td style={{ padding: '16px 16px 16px 0' }}><span style={badgeStyle(lead.status)}>{lead.status}</span></td><td style={{ padding: '16px 0', color: 'rgba(255,255,255,0.58)' }}>{lead.date}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section style={{ ...cardStyle, padding: '24px' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '1.35rem', fontWeight: 900 }}>Construction Stage Pipeline</h2>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {stages.map((stage) => (
                <div key={stage.title} style={{ minWidth: '240px', backgroundColor: 'rgba(15,16,32,0.72)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '16px' }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '0.98rem', fontWeight: 900, color: ORANGE }}>{stage.title}</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>{stage.cards.map((card) => <div key={card.name} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}><div style={{ fontWeight: 900, marginBottom: '6px' }}>{card.name}</div><div style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.88rem' }}>{card.price}</div></div>)}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...cardStyle, padding: '24px' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '1.35rem', fontWeight: 900 }}>Recent Bookings</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {bookings.map((booking) => <div key={`${booking.property}-${booking.client}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: '16px', backgroundColor: 'rgba(15,16,32,0.72)', border: '1px solid rgba(255,255,255,0.07)' }}><div><div style={{ fontWeight: 900 }}>{booking.property}</div><div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.86rem', marginTop: '4px' }}>{booking.client}</div></div><div style={{ color: 'rgba(255,255,255,0.68)' }}>{booking.date}</div><div style={{ color: ORANGE, fontWeight: 800 }}>{booking.type}</div><div><span style={badgeStyle(booking.status)}>{booking.status}</span></div></div>)}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
