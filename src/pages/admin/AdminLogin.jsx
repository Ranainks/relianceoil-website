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

export default function AdminLogin() {
  const navigate = useNavigate()
  const [view, setView] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fpEmail, setFpEmail] = useState('')

  function reset(toView) { setError(''); setView(toView) }

  async function handleLogin(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) { setError(err.message); return }
    navigate('/admin/overview')
  }

  async function sendResetLink(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(fpEmail, {
      redirectTo: window.location.origin + '/reset-password',
    })
    setBusy(false)
    if (err) { setError(err.message); return }
    setView('link-sent')
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
                <label style={lbl}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={lbl}>Password</span>
                  <button type="button" onClick={() => { setFpEmail(email); reset('forgot') }}
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

          {view === 'forgot' && (
            <form onSubmit={sendResetLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 6px' }}>Reset Password</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: '0 0 18px', lineHeight: 1.5 }}>
                  Enter your admin email and we'll send a secure reset link.
                </p>
                <label style={lbl}>Email Address</label>
                <input type="email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} required placeholder="admin@relianceoil.com" style={inp} />
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={busy} style={btn(busy)}>{busy ? 'Sending…' : 'Send Reset Link'}</button>
              <button type="button" onClick={() => reset('login')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer' }}>
                ← Back to Sign In
              </button>
            </form>
          )}

          {view === 'link-sent' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                ✉
              </div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Check Your Email</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                A password reset link was sent to<br />
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{fpEmail}</strong>.<br />
                Click the link in the email to set your new password.
              </p>
              <button type="button" onClick={() => reset('login')}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>
                ← Back to Sign In
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
