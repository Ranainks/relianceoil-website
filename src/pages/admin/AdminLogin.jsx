import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const inp = {
  width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem', color: '#fff', outline: 'none', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
}
const btn = (disabled) => ({
  width: '100%', backgroundColor: disabled ? 'rgba(204,0,0,0.5)' : '#CC0000', color: '#fff',
  border: 'none', borderRadius: 8, padding: '13px', fontWeight: 700, fontSize: '0.9rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
})
const ghostBtn = {
  background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer',
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [view, setView] = useState('login')
  const [method, setMethod] = useState('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fpEmail, setFpEmail] = useState('')
  const [fpPhone, setFpPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  function go(v) { setError(''); setView(v) }

  async function handleLogin(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) { setError(err.message); return }
    navigate('/admin/overview')
  }

  async function sendEmailLink(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(fpEmail, {
      redirectTo: window.location.origin + '/reset-password',
    })
    setBusy(false)
    if (err) { setError(err.message); return }
    go('link-sent')
  }

  async function sendSmsOtp(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithOtp({ phone: fpPhone })
    setBusy(false)
    if (err) { setError(err.message); return }
    go('phone-otp')
  }

  async function verifyPhoneAndReset(e) {
    e.preventDefault()
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return }
    if (newPw.length < 6) { setError('Password must be at least 6 characters.'); return }
    setBusy(true); setError('')
    const { error: vErr } = await supabase.auth.verifyOtp({ phone: fpPhone, token: otp, type: 'sms' })
    if (vErr) { setError(vErr.message); setBusy(false); return }
    const { error: uErr } = await supabase.auth.updateUser({ password: newPw })
    if (uErr) { setError(uErr.message); setBusy(false); return }
    await supabase.auth.signOut()
    setBusy(false)
    go('done')
  }

  const methodTab = (m, label) => (
    <button type="button" onClick={() => { setMethod(m); setError('') }}
      style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
        backgroundColor: method === m ? '#CC0000' : 'rgba(255,255,255,0.06)',
        color: method === m ? '#fff' : 'rgba(255,255,255,0.45)',
      }}>
      {label}
    </button>
  )

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

          {/* ── SIGN IN ── */}
          {view === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={lbl}>Password</span>
                  <button type="button" onClick={() => { setFpEmail(email); go('reset') }}
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

          {/* ── RESET — choose method ── */}
          {view === 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px' }}>Reset Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 18px', lineHeight: 1.5 }}>
                  Choose how you'd like to reset your password.
                </p>
                <div style={{ display: 'flex', gap: 6, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 4, marginBottom: 20 }}>
                  {methodTab('email', '📧  Email')}
                  {methodTab('phone', '📱  Phone Number')}
                </div>
              </div>

              {method === 'email' && (
                <form onSubmit={sendEmailLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={lbl}>Email Address</label>
                    <input type="email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
                  </div>
                  {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
                  <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Sending…' : 'Send Reset Link'}</button>
                </form>
              )}

              {method === 'phone' && (
                <form onSubmit={sendSmsOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={lbl}>Phone Number</label>
                    <input type="tel" value={fpPhone} onChange={e => setFpPhone(e.target.value)} required placeholder="+233 XX XXX XXXX" style={inp} />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: '6px 0 0', lineHeight: 1.4 }}>Include country code, e.g. +233244123456</p>
                  </div>
                  {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
                  <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Sending…' : 'Send SMS Code'}</button>
                </form>
              )}

              <button type="button" onClick={() => go('login')} style={ghostBtn}>← Back to Sign In</button>
            </div>
          )}

          {/* ── EMAIL LINK SENT ── */}
          {view === 'link-sent' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>✉</div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Check Your Email</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                A password reset link was sent to<br />
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{fpEmail}</strong>.<br />
                Click the link in the email to set your new password.
              </p>
              <button type="button" onClick={() => go('login')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* ── PHONE OTP + NEW PASSWORD ── */}
          {view === 'phone-otp' && (
            <form onSubmit={verifyPhoneAndReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px' }}>Enter Code & New Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 18px', lineHeight: 1.5 }}>
                  A 6-digit SMS code was sent to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{fpPhone}</strong>.
                </p>
                <label style={lbl}>6-Digit SMS Code</label>
                <input type="text" required maxLength={6} placeholder="000000" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{ ...inp, letterSpacing: '0.4em', fontSize: '1.3rem', textAlign: 'center' }} />
              </div>
              <div>
                <label style={lbl}>New Password</label>
                <input type="password" required placeholder="Min 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Confirm Password</label>
                <input type="password" required placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={inp} />
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Resetting…' : 'Set New Password'}</button>
              <button type="button" onClick={() => { setOtp(''); setError(''); go('reset') }} style={ghostBtn}>← Resend code</button>
            </form>
          )}

          {/* ── DONE ── */}
          {view === 'done' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'rgba(22,163,74,0.15)', border: '2px solid rgba(22,163,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#4ade80' }}>✓</div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Password Updated</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>Your password has been changed successfully.</p>
              <button onClick={() => go('login')} style={{ ...btn(false), width: 'auto', padding: '12px 32px' }}>Sign In Now</button>
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
