import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FaEnvelope, FaSearch, FaTrash, FaPaperPlane } from 'react-icons/fa'

export default function AdminContacts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [replyBody, setReplyBody] = useState('')
  const [replying, setReplying] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchData() }, [])

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*').order('sent_at', { ascending: false })
    if (data) setRows(data)
    setLoading(false)
  }

  async function del(id) {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function openReply(row) {
    setReplyTo(row)
    setReplyBody('')
    setSelected(null)
  }

  async function sendReply() {
    if (!replyBody.trim()) return
    setReplying(true)
    try {
      const res = await fetch('https://muutovkfdnabmeueqfiz.supabase.co/functions/v1/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_email: replyTo.email,
          to_name: replyTo.name,
          subject: `Re: ${replyTo.subject || 'Your Enquiry'}`,
          body: replyBody.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      showToast(`Reply sent to ${replyTo.email}`)
      setReplyTo(null)
      setReplyBody('')
    } catch (err) {
      showToast(err.message, false)
    }
    setReplying(false)
  }

  const visible = rows.filter(r =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.subject?.toLowerCase().includes(search.toLowerCase())
  )

  function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1000 }}>

        {toast && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, backgroundColor: toast.ok ? '#dcfce7' : '#fee2e2', color: toast.ok ? '#15803d' : '#b91c1c', border: `1px solid ${toast.ok ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: '12px 20px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
            {toast.msg}
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>Contact Messages</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>{rows.length} message{rows.length !== 1 ? 's' : ''} received</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch size={11} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px 8px 28px', fontSize: '0.8rem', outline: 'none', width: 220 }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: '0.85rem' }}>No messages found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                    {['Sender', 'Subject', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f5f5f5' : 'none', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px 16px' }} onClick={() => setSelected(row)}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.name}</div>
                        <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: 2 }}>{row.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.83rem', color: '#444' }} onClick={() => setSelected(row)}>
                        {row.subject || <span style={{ color: '#bbb' }}>(no subject)</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.77rem', color: '#9ca3af', whiteSpace: 'nowrap' }} onClick={() => setSelected(row)}>{fmtDate(row.sent_at)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openReply(row)}
                            style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#333' }}>
                            <FaEnvelope size={10} /> Reply
                          </button>
                          <button onClick={() => del(row.id)}
                            style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#dc2626' }}>
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, backgroundColor: '#fff', borderRadius: '16px 16px 0 0', zIndex: 1 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>{selected.subject || '(no subject)'}</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', margin: '4px 0 0' }}>From: <strong>{selected.name}</strong> · {selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: '1.1rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>
            <div style={{ padding: '22px 24px' }}>
              <div style={{ fontSize: '0.72rem', color: '#bbb', marginBottom: 14 }}>{fmtDate(selected.sent_at)}</div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: 10, padding: '16px 18px', fontSize: '0.85rem', color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selected.message || '(no message)'}
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button onClick={() => openReply(selected)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  <FaEnvelope size={11} /> Reply by Email
                </button>
                <button onClick={() => del(selected.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '9px 14px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer' }}>
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {replyTo && (
        <div onClick={() => setReplyTo(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', margin: 0 }}>Reply to {replyTo.name}</h2>
              <button onClick={() => setReplyTo(null)} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: '1.1rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>To</div>
                <div style={{ fontSize: '0.85rem', color: '#333', backgroundColor: '#f9fafb', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>{replyTo.name} &lt;{replyTo.email}&gt;</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Subject</div>
                <div style={{ fontSize: '0.85rem', color: '#333', backgroundColor: '#f9fafb', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}>Re: {replyTo.subject || 'Your Enquiry'}</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Message</div>
                <textarea
                  value={replyBody}
                  onChange={e => setReplyBody(e.target.value)}
                  placeholder="Type your reply here…"
                  rows={7}
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: '0.85rem', color: '#333', resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.7, boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setReplyTo(null)}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#555', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={sendReply} disabled={replying || !replyBody.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, backgroundColor: replying || !replyBody.trim() ? '#e5e7eb' : '#CC0000', color: replying || !replyBody.trim() ? '#aaa' : '#fff', border: 'none', padding: '9px 20px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, cursor: replying || !replyBody.trim() ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                  <FaPaperPlane size={11} /> {replying ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
