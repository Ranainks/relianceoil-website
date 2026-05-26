import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [view, setView] = useState('waiting'); // 'waiting' | 'form' | 'done' | 'error'
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('form');
      }
    });
    const timeout = setTimeout(() => {
      setView(v => v === 'waiting' ? 'error' : v);
    }, 8000);
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (err) { setError(err.message); return; }
    await supabase.auth.signOut();
    setView('done');
  }

  const inp = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
    padding: '12px 14px', fontSize: '0.9rem', outline: 'none', color: '#111',
    backgroundColor: '#fff', boxSizing: 'border-box',
  };
  const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#CC0000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>ROL</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', marginBottom: 4 }}>Set New Password</h1>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>Reliance Oil Limited</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: 32 }}>

          {view === 'waiting' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: '#888', fontSize: '0.9rem' }}>Verifying reset link…</p>
            </div>
          )}

          {view === 'form' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: '#555', fontSize: '0.875rem', margin: '0 0 4px', lineHeight: 1.6 }}>
                Enter and confirm your new password below.
              </p>
              <div>
                <label style={lbl}>New Password</label>
                <input type="password" required placeholder="Min 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Confirm Password</label>
                <input type="password" required placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={inp} />
              </div>
              {error && <p style={{ color: '#CC0000', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#999' : '#CC0000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Saving…' : 'Set New Password'}
              </button>
            </form>
          )}

          {view === 'done' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F0FFF4', border: '2px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#16a34a' }}>✓</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', margin: 0 }}>Password Updated!</h2>
              <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>Your password has been changed successfully. You can now sign in.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                <button onClick={() => navigate('/admin')}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                  Sign in to Admin
                </button>
                <button onClick={() => navigate('/portal')}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                  Sign in to Portal
                </button>
              </div>
            </div>
          )}

          {view === 'error' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#FFF0F0', border: '2px solid #FFD5D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#CC0000' }}>!</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', margin: 0 }}>Link Expired or Invalid</h2>
              <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>This reset link has expired or already been used. Please request a new one.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/admin" style={{ padding: '11px 24px', backgroundColor: '#111', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Admin Login</Link>
                <Link to="/portal" style={{ padding: '11px 24px', backgroundColor: '#CC0000', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Portal Login</Link>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: '#aaa' }}>
          <Link to="/" style={{ color: '#CC0000', textDecoration: 'none', fontWeight: 600 }}>← Back to main website</Link>
        </p>
      </div>
    </div>
  );
}
