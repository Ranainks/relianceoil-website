import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortalAuth } from '../contexts/PortalAuth';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import {
  FaTachometerAlt, FaClipboardList, FaFileInvoiceDollar,
  FaUser, FaSignOutAlt, FaBars, FaTimes, FaGasPump,
  FaSun, FaMoon,
} from 'react-icons/fa';

const navItems = [
  { label: 'Dashboard', path: '/portal/dashboard', icon: FaTachometerAlt },
  { label: 'My Orders',  path: '/portal/orders',    icon: FaClipboardList },
  { label: 'Invoices',   path: '/portal/invoices',  icon: FaFileInvoiceDollar },
  { label: 'My Account', path: '/portal/account',   icon: FaUser },
];

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
        border: 'none', borderRadius: 9999,
        padding: '6px 12px', cursor: 'pointer',
        fontSize: '0.75rem', fontWeight: 600,
        color: dark ? 'rgba(255,255,255,0.7)' : '#555',
        transition: 'all 0.2s',
      }}
    >
      {dark ? <FaSun size={13} style={{ color: '#FFD700' }} /> : <FaMoon size={13} style={{ color: '#555' }} />}
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}

function PortalLayoutInner({ children }) {
  const { profile, signOut } = usePortalAuth();
  const { dark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = {
    sideBg:    dark ? '#0a0a0a' : '#0D0D0D',
    mainBg:    dark ? '#141414' : '#f5f5f5',
    headerBg:  dark ? '#1a1a1a' : '#ffffff',
    headerBdr: dark ? '#2a2a2a' : '#f0f0f0',
    headerTxt: dark ? '#d1d5db' : '#111111',
    headerSub: dark ? '#9ca3af' : '#aaaaaa',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal');
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const Sidebar = ({ onNav }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaGasPump size={16} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', lineHeight: 1 }}>RELIANCE OIL</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', fontWeight: 500, marginTop: '2px' }}>Customer Portal</p>
          </div>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path} to={item.path} onClick={onNav}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '8px', marginBottom: '4px',
                textDecoration: 'none', transition: 'background 0.2s',
                backgroundColor: active ? 'rgba(204,0,0,0.18)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 700 : 500, fontSize: '0.875rem',
                borderLeft: active ? '3px solid #CC0000' : '3px solid transparent',
              }}
            >
              <Icon size={15} style={{ color: active ? '#CC0000' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>{initials}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.name || 'Customer'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.account_number || '—'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}
        >
          <FaSignOutAlt size={13} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: t.mainBg, transition: 'background 0.25s' }}>
      <aside style={{ width: '240px', backgroundColor: t.sideBg, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, display: 'none', transition: 'background 0.25s' }} className="portal-sidebar">
        <Sidebar />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBdr}`, padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, transition: 'background 0.25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: t.headerTxt }}>
              <FaBars size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaGasPump size={13} style={{ color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 800, color: t.headerTxt, fontSize: '0.875rem' }}>RELIANCE OIL</span>
              <span style={{ color: t.headerSub, fontSize: '0.75rem' }}>/ Customer Portal</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>{initials}</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: t.headerTxt }}>{profile?.name || 'Customer'}</span>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1 }}>
          <aside style={{ width: '240px', backgroundColor: t.sideBg, flexShrink: 0, display: 'none', transition: 'background 0.25s' }} className="portal-desktop-sidebar">
            <div style={{ height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
              <Sidebar />
            </div>
          </aside>
          <main style={{ flex: 1, padding: 'clamp(20px,4vw,36px)', minWidth: 0 }}>
            {children}
          </main>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
          <aside style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', backgroundColor: t.sideBg, zIndex: 201, overflowY: 'auto' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px' }}>
                <FaTimes size={16} />
              </button>
            </div>
            <Sidebar onNav={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .portal-desktop-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function PortalLayout({ children }) {
  return (
    <ThemeProvider storageKey="portal_theme">
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </ThemeProvider>
  );
}
