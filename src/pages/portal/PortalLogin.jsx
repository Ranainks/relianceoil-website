import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FaGasPump, FaEye, FaEyeSlash } from 'react-icons/fa';

const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
  padding: '11px 14px', fontSize: '0.875rem', outline: 'none',
  backgroundColor: '#fff', color: '#111', transition: 'border-color 0.2s',
};

export default function PortalLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', password: '', confirm: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/portal/dashboard');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });
    if (signUpErr) { setError(signUpErr.message); setLoading(false); return; }

    const accountNumber = 'ROL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    await supabase.from('customer_profiles').insert({
      id: data.user.id,
      name: form.name,
      company: form.company || null,
      phone: form.phone || null,
      account_number: accountNumber,
    });

    setLoading(false);
    setSuccess('Account created! Check your email to confirm, then sign in.');
    setTab('login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/">
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FaGasPump size={24} style={{ color: '#fff' }} />
            </div>
          </Link>
          <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', marginBottom: '4px' }}>Customer Portal</h1>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>Reliance Oil Limited</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                style={{ flex: 1, padding: '14px', border: 'none', background: tab === t ? '#fff' : '#fafafa', fontWeight: tab === t ? 700 : 500, fontSize: '0.875rem', color: tab === t ? '#CC0000' : '#888', cursor: 'pointer', borderBottom: tab === t ? '2px solid #CC0000' : '2px solid transparent', transition: 'all 0.2s' }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px' }}>
            {error && <div style={{ backgroundColor: '#FFF0F0', border: '1px solid #FFD5D5', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#CC0000', fontSize: '0.8rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#16a34a', fontSize: '0.8rem' }}>{success}</div>}

            {tab === 'login' ? (
              <form onSubmit={handleLogin}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Email Address</label>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                    {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#999' : '#CC0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Signing In…' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" required placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Company</label>
                    <input type="text" placeholder="Optional" value={form.company} onChange={e => set('company', e.target.value)} style={{ ...inputStyle }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Phone</label>
                    <input type="tel" placeholder="+233 xx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ ...inputStyle }} />
                  </div>
                </div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Email Address *</label>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Password *</label>
                <input type="password" required placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Confirm Password *</label>
                <input type="password" required placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#999' : '#CC0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#aaa' }}>
          <Link to="/" style={{ color: '#CC0000', textDecoration: 'none', fontWeight: 600 }}>← Back to main website</Link>
        </p>
      </div>
    </div>
  );
}
