import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FaEye, FaSearch, FaEnvelope } from 'react-icons/fa'

const STATUS_COLORS = {
  new:        { bg: '#DBEAFE', color: '#1E40AF' },
  contacted:  { bg: '#D1ECF1', color: '#0C5460' },
  quoted:     { bg: '#FFF3CD', color: '#856404' },
  closed:     { bg: '#D4EDDA', color: '#155724' },
}

export default function AdminQuotes() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false })
    if (data) setRows(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('quote_requests').update({ status }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (selected?.id === id) setSelected(p => ({ ...p, status }))
  }

  const STATUSES = ['all', 'new', 'contacted', 'quoted', 'closed']

  const visible = rows
    .filter(r => filter === 'all' || (r.status || 'new') === filter)
    .filter(r => !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.company?.toLowerCase().includes(search.toLowerCase()) ||
      r.fuel_type?.toLowerCase().includes(search.toLowerCase())
    )

  function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>Quote Requests</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>{rows.length} request{rows.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {STATUSES.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '5px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filter === f ? '#CC0000' : '#f3f4f6', color: filter === f ? '#fff' : '#555', transition: 'all 0.15s' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && <span style={{ marginLeft: 4, opacity: 0.75 }}>({rows.filter(r => (r.status || 'new') === f).length})</span>}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <FaSearch size={11} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input placeholder="Search quotes…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 12px 7px 28px', fontSize: '0.8rem', outline: 'none', width: 200 }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: '0.85rem' }}>No quote requests yet. They appear here when submitted via the <strong>/quote</strong> page.</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: '0.85rem' }}>No results found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                    {['Name / Company', 'Fuel Type', 'Volume', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.67rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row, i) => {
                    const st = row.status || 'new'
                    const sc = STATUS_COLORS[st] || STATUS_COLORS.new
                    return (
                      <tr key={row.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.name}</div>
                          <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: 1 }}>{row.company || row.email}</div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '0.82rem', color: '#444' }}>{row.fuel_type || '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '0.82rem', color: '#444' }}>{row.volume || row.quantity || '—'}</td>
                        <td style={{ padding: '11px 14px', fontSize: '0.77rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(row.created_at)}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{st}</span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                            <button onClick={() => setSelected(row)}
                              style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.74rem', fontWeight: 600, color: '#333' }}>
                              <FaEye size={10} /> View
                            </button>
                            <select value={st} onChange={e => updateStatus(row.id, e.target.value)}
                              style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 7px', fontSize: '0.74rem', cursor: 'pointer', outline: 'none', color: '#444' }}>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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
                <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>Quote Request</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', margin: '3px 0 0' }}>{selected.name} · {fmtDate(selected.created_at)}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select value={selected.status || 'new'} onChange={e => updateStatus(selected.id, e.target.value)}
                  style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={() => setSelected(null)} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: '1.1rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
              </div>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
                {[
                  ['Name', selected.name],
                  ['Company', selected.company],
                  ['Email', selected.email],
                  ['Phone', selected.phone],
                  ['Fuel Type', selected.fuel_type],
                  ['Volume', selected.volume || selected.quantity],
                  ['Delivery Location', selected.delivery_location || selected.location],
                  ['Frequency', selected.frequency],
                ].map(([label, value]) => value ? (
                  <div key={label}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: '0.84rem', color: '#333' }}>{value}</div>
                  </div>
                ) : null)}
              </div>
              {(selected.message || selected.notes) && (
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Message</div>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: 8, padding: '12px 14px', fontSize: '0.84rem', color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {selected.message || selected.notes}
                  </div>
                </div>
              )}
              <a href={`mailto:${selected.email}?subject=Re: Your Fuel Quote Request`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none', alignSelf: 'flex-start' }}>
                <FaEnvelope size={11} /> Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
