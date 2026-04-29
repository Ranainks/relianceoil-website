import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  FaSignOutAlt, FaEye, FaUsers, FaClock,
  FaCheck, FaTimes, FaSearch, FaDownload,
  FaEnvelope, FaPhone, FaSync,
} from 'react-icons/fa';

const STATUS = {
  pending:  { bg: '#FFF3CD', color: '#856404',  label: 'Pending'  },
  reviewed: { bg: '#D1ECF1', color: '#0C5460',  label: 'Reviewed' },
  accepted: { bg: '#D4EDDA', color: '#155724',  label: 'Accepted' },
  rejected: { bg: '#F8D7DA', color: '#721C24',  label: 'Rejected' },
};

export default function AdminDashboard() {
  const [session, setSession]       = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginData, setLoginData]   = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy]   = useState(false);

  const [apps, setApps]             = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) fetchApps(); }, [session]);

  async function fetchApps() {
    setDataLoading(true);
    const { data } = await supabase.from('applications').select('*').order('applied_at', { ascending: false });
    if (data) setApps(data);
    setDataLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('applications').update({ status }).eq('id', id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(p => ({ ...p, status }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword(loginData);
    if (error) setLoginError(error.message);
    setLoginBusy(false);
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (!session) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#CC0000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>ROL</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', marginBottom: 4 }}>Admin Portal</h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>Sign in to review job applications</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" placeholder="Admin email" value={loginData.email}
            onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
            style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem', outline: 'none' }} />
          <input type="password" placeholder="Password" value={loginData.password}
            onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
            style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem', outline: 'none' }} />
          {loginError && <p style={{ color: '#CC0000', fontSize: '0.8rem', margin: 0 }}>{loginError}</p>}
          <button type="submit" disabled={loginBusy}
            style={{ backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: 13, fontWeight: 700, fontSize: '0.9rem', cursor: loginBusy ? 'not-allowed' : 'pointer', opacity: loginBusy ? 0.7 : 1 }}>
            {loginBusy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/" style={{ color: '#aaa', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  );

  const counts = {
    total:    apps.length,
    pending:  apps.filter(a => (a.status || 'pending') === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  const stats = [
    { label: 'Total',    value: counts.total,    color: '#CC0000', Icon: FaUsers  },
    { label: 'Pending',  value: counts.pending,  color: '#d97706', Icon: FaClock  },
    { label: 'Accepted', value: counts.accepted, color: '#16a34a', Icon: FaCheck  },
    { label: 'Rejected', value: counts.rejected, color: '#dc2626', Icon: FaTimes  },
  ];

  const visible = apps
    .filter(a => filter === 'all' || (a.status || 'pending') === filter)
    .filter(a => !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.position?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ backgroundColor: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#CC0000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.8rem' }}>ROL</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700 }}>Admin — Applications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={fetchApps} title="Refresh"
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <FaSync size={12} />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{session.user.email}</span>
          <button onClick={() => supabase.auth.signOut()}
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaSignOutAlt size={11} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map(({ label, value, color, Icon }) => (
            <div key={label} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filter === f ? '#CC0000' : '#f3f4f6', color: filter === f ? '#fff' : '#555', transition: 'all 0.15s' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && <span style={{ marginLeft: 5, opacity: 0.75 }}>({apps.filter(a => (a.status || 'pending') === f).length})</span>}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <FaSearch size={11} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input placeholder="Search name, email or position…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px 8px 28px', fontSize: '0.8rem', outline: 'none', width: 240 }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {dataLoading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading applications…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#aaa' }}>No applications found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                    {['Applicant', 'Position', 'Date Applied', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((app, i) => {
                    const st = app.status || 'pending';
                    const sc = STATUS[st] || STATUS.pending;
                    return (
                      <tr key={app.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>{app.name}</div>
                          <div style={{ fontSize: '0.76rem', color: '#9ca3af', marginTop: 2 }}>{app.email}</div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: '#444' }}>{app.position}</td>
                        <td style={{ padding: '13px 16px', fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{sc.label}</span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button onClick={() => setSelected(app)}
                              style={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#333' }}>
                              <FaEye size={10} /> View
                            </button>
                            <select value={st} onChange={e => updateStatus(app.id, e.target.value)}
                              style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 8px', fontSize: '0.76rem', cursor: 'pointer', outline: 'none', color: '#444' }}>
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '22px 26px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, position: 'sticky', top: 0, backgroundColor: '#fff', borderRadius: '16px 16px 0 0', zIndex: 1 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', margin: 0 }}>{selected.name}</h2>
                <p style={{ color: '#888', fontSize: '0.82rem', margin: '4px 0 0' }}>
                  Applied for: <strong style={{ color: '#CC0000' }}>{selected.position}</strong>
                </p>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: '1.2rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>

            <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Email</div>
                  <a href={`mailto:${selected.email}`} style={{ color: '#CC0000', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FaEnvelope size={11} /> {selected.email}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Phone</div>
                  <a href={`tel:${selected.phone}`} style={{ color: '#333', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FaPhone size={11} /> {selected.phone}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Date Applied</div>
                  <div style={{ fontSize: '0.85rem', color: '#333' }}>
                    {selected.applied_at ? new Date(selected.applied_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Update Status</div>
                  <select value={selected.status || 'pending'} onChange={e => updateStatus(selected.id, e.target.value)}
                    style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', width: '100%' }}>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Cover Letter</div>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: 10, padding: '16px 18px', fontSize: '0.85rem', color: '#333', lineHeight: 1.75, whiteSpace: 'pre-wrap', maxHeight: 280, overflowY: 'auto' }}>
                  {selected.cover_letter || 'No cover letter provided.'}
                </div>
              </div>

              {selected.cv_url && (
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>CV / Resume</div>
                  <a href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cvs/${selected.cv_url}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#CC0000', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                    <FaDownload size={12} /> Download CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
