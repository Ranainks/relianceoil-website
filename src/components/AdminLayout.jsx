import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuth'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import {
  FaTachometerAlt, FaNewspaper, FaBriefcase, FaEnvelope,
  FaGasPump, FaFileInvoiceDollar, FaBars, FaSignOutAlt, FaChartBar,
  FaSun, FaMoon,
} from 'react-icons/fa'

const NAV = [
  { to: '/admin/overview',   label: 'Overview',        Icon: FaTachometerAlt },
  { to: '/admin/analytics',  label: 'Analytics',       Icon: FaChartBar },
  { to: '/admin/cms',        label: 'CMS',             Icon: FaNewspaper },
  { to: '/admin/careers',    label: 'Careers',         Icon: FaBriefcase },
  { to: '/admin/contacts',   label: 'Contacts',        Icon: FaEnvelope },
  { to: '/admin/orders',     label: 'Fuel Orders',     Icon: FaGasPump },
  { to: '/admin/quotes',     label: 'Quote Requests',  Icon: FaFileInvoiceDollar },
]

function ThemeToggle() {
  const { dark, toggle } = useTheme()
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
  )
}

function AdminLayoutInner({ children }) {
  const { session, loading, signOut } = useAdminAuth()
  const { dark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const t = {
    sideBg:    dark ? '#0a0a0a' : '#111111',
    mainBg:    dark ? '#141414' : '#f8f9fa',
    headerBg:  dark ? '#1a1a1a' : '#ffffff',
    headerBdr: dark ? '#2a2a2a' : '#f0f0f0',
    headerTxt: dark ? '#d1d5db' : '#333333',
    contentBg: dark ? '#141414' : '#f8f9fa',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: t.mainBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  if (!session) return <Navigate to="/admin" replace />

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: t.mainBg, fontFamily: 'inherit', transition: 'background 0.25s' }}>
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: open ? 0 : -260, width: 240, height: '100vh',
        backgroundColor: t.sideBg, display: 'flex', flexDirection: 'column',
        zIndex: 50, transition: 'left 0.25s ease, background 0.25s',
        boxShadow: open ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
      }} className="admin-sidebar">
        <style>{`
          @media(min-width:768px){
            .admin-sidebar{left:0!important;box-shadow:none!important;}
            .admin-main{margin-left:240px!important;}
            .admin-menu-btn{display:none!important;}
          }
        `}</style>

        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, backgroundColor: '#CC0000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.75rem' }}>ROL</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>Admin Panel</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: 1 }}>Reliance Oil</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV.map(({ to, label, Icon }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: active ? 700 : 500,
                  backgroundColor: active ? 'rgba(204,0,0,0.18)' : 'transparent',
                  color: active ? '#ff6b6b' : 'rgba(255,255,255,0.65)',
                  borderLeft: active ? '3px solid #CC0000' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}>
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {session && (
            <div style={{ marginBottom: 10, padding: '0 4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Signed in as</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</div>
            </div>
          )}
          <button onClick={handleSignOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            <FaSignOutAlt size={13} /> Sign Out
          </button>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>← Back to website</Link>
          </div>
        </div>
      </aside>

      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 0, transition: 'margin-left 0.25s ease' }}>
        <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBdr}`, height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', position: 'sticky', top: 0, zIndex: 30, gap: 14, justifyContent: 'space-between', transition: 'background 0.25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="admin-menu-btn" onClick={() => setOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.headerTxt, padding: 4 }}>
              <FaBars size={18} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: t.headerTxt }}>
              {NAV.find(n => n.to === location.pathname)?.label || 'Admin'}
            </span>
          </div>
          <ThemeToggle />
        </header>

        <div style={{ flex: 1, padding: '28px 20px', overflowY: 'auto', backgroundColor: t.contentBg, transition: 'background 0.25s' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider storageKey="admin_theme">
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeProvider>
  )
}
