import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FaGasPump, FaEye, FaEyeSlash } from 'react-icons/fa';

const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
  padding: '11px 14px', fontSize: '0.875rem', outline: 'none',
  backgroundColor: '#fff', color: '#111', transition: 'border-color 0.2s',
};

const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' };

const submitBtn = (loading) => ({
  width: '100%', padding: '12px', backgroundColor: loading ? '#999' : '#CC0000',
  color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700,
  fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
});

export default function PortalLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', password: '', confirm: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const [fpEmail, setFpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  function goStep(s) { setError(''); setSuccess(''); setOtp(''); setNewPw(''); setConfirmPw(''); setStep(s); }

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
      email: form.email, password: form.password, options: { data: { name: form.name } },
    });
    if (signUpErr) { setError(signUpErr.message); setLoading(false); return; }
    const accountNumber = 'ROL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    await supabase.from('customer_profiles').insert({
      id: data.user.id, name: form.name,
      company: form.company || null, phone: form.phone || null, account_number: accountNumber,
    });
    setLoading(false);
    setSuccess('Account created! Check your email to confirm, then sign in.');
    setTab('login');
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({ email: fpEmail, options: { shouldCreateUser: false } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep('otp-verify');
  };

  const verifyAndReset = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    const { error: vErr } = await supabase.auth.verifyOtp({ email: fpEmail, token: otp, type: 'email' });
    if (vErr) { setError(vErr.message); setLoading(false); return; }
    const { error: uErr } = await supabase.auth.updateUser({ password: newPw });
    if (uErr) { setError(uErr.message); setLoading(false); return; }
    await supabase.auth.signOut();
    setLoading(false);
    setStep('done');
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
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); goStep('login'); }}
                style={{ flex: 1, padding: '14px', border: 'none', background: tab === t ? '#fff' : '#fafafa', fontWeight: tab === t ? 700 : 500, fontSize: '0.875rem', color: tab === t ? '#CC0000' : '#888', cursor: 'pointer', borderBottom: tab === t ? '2px solid #CC0000' : '2px solid transparent', transition: 'all 0.2s' }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px' }}>
            {error && <div style={{ backgroundColor: '#FFF0F0', border: '1px solid #FFD5D5', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#CC0000', fontSize: '0.8rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#16a34a', fontSize: '0.8rem' }}>{success}</div>}

            {tab === 'login' && step === 'login' && (
              <form onSubmit={handleLogin}>
                <label style={lbl}>Email Address</label>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Password</label>
                  <button type="button" onClick={() => { setFpEmail(form.email); goStep('otp-email'); }}
                    style={{ background: 'none', border: 'none', color: '#CC0000', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                    {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                <button type="submit" disabled={loading} style={submitBtn(loading)}>
                  {loading ? 'Signing In…' : 'Sign In'}
                </button>
              </form>
            )}

            {tab === 'login' && step === 'otp-email' && (
              <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111', margin: '0 0 4px' }}>Reset Password</h3>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: '0 0 16px', lineHeight: 1.5 }}>Enter your email to receive a 6-digit verification code.</p>
                  <label style={lbl}>Email Address</label>
                  <input type="email" required placeholder="your@email.com" value={fpEmail} onChange={e => setFpEmail(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={submitBtn(loading)}>{loading ? 'Sending…' : 'Send OTP Code'}</button>
                <button type="button" onClick={() => goStep('login')} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center' }}>
                  ← Back to Sign In
                </button>
              </form>
            )}

            {tab === 'login' && step === 'otp-verify' && (
              <form onSubmit={verifyAndReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111', margin: '0 0 4px' }}>Enter Code & New Password</h3>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: '0 0 16px', lineHeight: 1.5 }}>
                    A 6-digit code was sent to <strong style={{ color: '#111' }}>{fpEmail}</strong>.
                  </p>
                  <label style={lbl}>6-Digit OTP Code</label>
                  <input
                    type="text" required maxLength={6} placeholder="000000" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{ ...inputStyle, letterSpacing: '0.4em', fontSize: '1.3rem', textAlign: 'center' }}
                  />
                </div>
                <div>
                  <label style={lbl}>New Password</label>
                  <input type="password" required placeholder="Min 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={lbl}>Confirm Password</label>
                  <input type="password" required placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={submitBtn(loading)}>{loading ? 'Resetting…' : 'Set New Password'}</button>
                <button type="button" onClick={() => { setOtp(''); setError(''); setStep('otp-email'); }}
                  style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center' }}>
                  ← Resend code
                </button>
              </form>
            )}

            {tab === 'login' && step === 'done' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '12px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#F0FFF4', border: '2px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#16a34a' }}>✓</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111', margin: 0 }}>Password Updated</h3>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Your password has been changed successfully.</p>
                <button onClick={() => goStep('login')} style={{ ...submitBtn(false), width: 'auto', padding: '11px 32px' }}>Sign In Now</button>
              </div>
            )}

            {tab === 'register' && (
              <form onSubmit={handleRegister}>
                <label style={lbl}>Full Name *</label>
                <input type="text" required placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={lbl}>Company</label>
                    <input type="text" placeholder="Optional" value={form.company} onChange={e => set('company', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={lbl}>Phone</label>
                    <input type="tel" placeholder="+233 xx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <label style={lbl}>Email Address *</label>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <label style={lbl}>Password *</label>
                <input type="password" required placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
                <label style={lbl}>Confirm Password *</label>
                <input type="password" required placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} />
                <button type="submit" disabled={loading} style={submitBtn(loading)}>
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
