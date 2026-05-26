import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const inp = {
  width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box',
}

const label = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
}

const btn = (disabled) => ({
  width: '100%', backgroundColor: disabled ? 'rgba(204,0,0,0.5)' : '#CC0000', color: '#fff',
  border: 'none', borderRadius: 8, padding: '13px', fontWeight: 700, fontSize: '0.9rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
})

export default function AdminLogin() {
  const navigate = useNavigate()
  const [view, setView] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [fpEmail, setFpEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  function reset(toView) {
    setError(''); setOtp(''); setNewPw(''); setConfirmPw('')
    setView(toView)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) { setError(err.message); return }
    navigate('/admin/overview')
  }

  async function sendOtp(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email: fpEmail,
      options: { shouldCreateUser: false },
    })
    setBusy(false)
    if (err) { setError(err.message); return }
    setView('otp-verify')
  }

  async function verifyAndReset(e) {
    e.preventDefault()
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return }
    setBusy(true); setError('')
    const { error: vErr } = await supabase.auth.verifyOtp({ email: fpEmail, token: otp, type: 'email' })
    if (vErr) { setError(vErr.message); setBusy(false); return }
    const { error: uErr } = await supabase.auth.updateUser({ password: newPw })
    if (uErr) { setError(uErr.message); setBusy(false); return }
    await supabase.auth.signOut()
    setBusy(false)
    setView('done')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#CC0000', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>ROL</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 6px' }}>Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>Reliance Oil Limited</p>
        </div>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: 16, padding: 36, border: '1px solid rgba(255,255,255,0.07)' }}>

          {view === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={label}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={label}>Password</span>
                  <button type="button" onClick={() => { setFpEmail(email); reset('otp-email') }}
                    style={{ background: 'none', border: 'none', color: '#CC0000', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp} />
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Signing in…' : 'Sign In'}</button>
            </form>
          )}

          {view === 'otp-email' && (
            <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px' }}>Reset Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 18px', lineHeight: 1.5 }}>
                  Enter your admin email. We'll send a 6-digit code to verify your identity.
                </p>
                <label style={label}>Email Address</label>
                <input type="email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Sending…' : 'Send OTP Code'}</button>
              <button type="button" onClick={() => reset('login')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer' }}>
                ← Back to Sign In
              </button>
            </form>
          )}

          {view === 'otp-verify' && (
            <form onSubmit={verifyAndReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px' }}>Enter Code & New Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 18px', lineHeight: 1.5 }}>
                  A 6-digit code was sent to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{fpEmail}</strong>. Enter it below along with your new password.
                </p>
                <label style={label}>6-Digit OTP Code</label>
                <input
                  type="text" value={otp} required maxLength={6} placeholder="000000"
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ ...inp, letterSpacing: '0.4em', fontSize: '1.3rem', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={label}>New Password</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required placeholder="Min 6 characters" style={inp} />
              </div>
              <div>
                <label style={label}>Confirm Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required placeholder="Repeat new password" style={inp} />
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Resetting…' : 'Set New Password'}</button>
              <button type="button" onClick={() => { setOtp(''); setError(''); setView('otp-email') }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer' }}>
                ← Resend code
              </button>
            </form>
          )}

          {view === 'done' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'rgba(22,163,74,0.15)', border: '2px solid rgba(22,163,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#4ade80' }}>
                ✓
              </div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Password Updated</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>Your password has been changed successfully.</p>
              <button onClick={() => reset('login')} style={{ ...btn(false), width: 'auto', padding: '12px 32px' }}>
                Sign In Now
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', textDecoration: 'none' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
