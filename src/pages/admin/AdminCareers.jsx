import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaEye, FaEnvelope, FaPhone, FaDownload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const EJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID
const EJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

async function sendStatusEmail(app, status) {
  const isAccepted = status === 'accepted'
  const statusMessage = isAccepted
    ? `We are pleased to inform you that your application has been reviewed and we would like to move forward with your candidacy. Our HR team will contact you shortly with further details regarding the next steps.`
    : `After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We truly appreciate your interest and encourage you to apply for future opportunities.`

  await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
    to_name:        app.name,
    to_email:       app.email,
    position:       app.position,
    status_word:    isAccepted ? 'Accepted' : 'Rejected',
    status_message: statusMessage,
    reply_to:       'relianceoil2018@gmail.com',
  }, EJS_KEY)
}

const TABS = [
  { key: 'jobs',         label: 'Job Listings' },
  { key: 'applications', label: 'Applications' },
]

export default function AdminCareers() {
  const [tab, setTab] = useState('jobs')
  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>Careers Management</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Manage job listings and review applications</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '2px solid #f0f0f0', paddingBottom: 0 }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === key ? 700 : 500, fontSize: '0.85rem', color: tab === key ? '#CC0000' : '#666', borderBottom: tab === key ? '2px solid #CC0000' : '2px solid transparent', marginBottom: -2, transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'jobs'         && <JobsTab />}
        {tab === 'applications' && <ApplicationsTab />}
      </div>
    </AdminLayout>
  )
}

function JobsTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const EMPTY = { title: '', department: '', location: '', type: 'Full-Time', description: '', status: 'active', order_index: 0 }

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('jobs').select('*').order('order_index')
    if (data) setRows(data)
    setLoading(false)
  }

  async function save() {
    setBusy(true)
    const payload = { ...editing }
    if (payload.id) { await supabase.from('jobs').update(payload).eq('id', payload.id) }
    else { await supabase.from('jobs').insert(payload) }
    setEditing(null)
    setBusy(false)
    fetch()
  }

  async function del(id) {
    if (!confirm('Delete this job listing?')) return
    await supabase.from('jobs').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const statusColor = { active: '#10b981', inactive: '#9ca3af', closed: '#ef4444' }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setEditing(EMPTY)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <FaPlus size={11} /> New Job
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <LoadingRow /> : rows.length === 0 ? <EmptyRow msg="No jobs yet" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                  {['Title', 'Department', 'Location', 'Type', 'Status', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#555' }}>{row.department}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#555' }}>{row.location}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#666' }}>{row.type}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999, backgroundColor: `${statusColor[row.status] || '#888'}20`, color: statusColor[row.status] || '#888' }}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditing(row)} style={editBtn}><FaEdit size={10} /> Edit</button>
                        <button onClick={() => del(row.id)} style={delBtn}><FaTrash size={10} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit Job' : 'New Job'} onClose={() => setEditing(null)}>
          <Field label="Job Title">
            <input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} style={inp} />
          </Field>
          <Row2>
            <Field label="Department">
              <input value={editing.department || ''} onChange={e => setEditing(p => ({ ...p, department: e.target.value }))} style={inp} />
            </Field>
            <Field label="Location">
              <input value={editing.location || ''} onChange={e => setEditing(p => ({ ...p, location: e.target.value }))} style={inp} />
            </Field>
          </Row2>
          <Row2>
            <Field label="Type">
              <select value={editing.type || 'Full-Time'} onChange={e => setEditing(p => ({ ...p, type: e.target.value }))} style={inp}>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={editing.status || 'active'} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))} style={inp}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
              </select>
            </Field>
          </Row2>
          <Field label="Description">
            <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={6} style={{ ...inp, resize: 'vertical' }} />
          </Field>
          <Field label="Order Index">
            <input type="number" value={editing.order_index || 0} onChange={e => setEditing(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} style={{ ...inp, width: 100 }} />
          </Field>
          <SaveBtn busy={busy} onSave={save} />
        </Modal>
      )}
    </>
  )
}

const APP_STATUS = {
  pending:  { bg: '#FFF3CD', color: '#856404' },
  reviewed: { bg: '#D1ECF1', color: '#0C5460' },
  accepted: { bg: '#D4EDDA', color: '#155724' },
  rejected: { bg: '#F8D7DA', color: '#721C24' },
}

function ApplicationsTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => { loadRows() }, [])

  async function loadRows() {
    setLoading(true)
    const { data } = await supabase.from('applications').select('*').order('applied_at', { ascending: false })
    if (data) setRows(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const app = rows.find(a => a.id === id)
    const { error } = await supabase.from('applications').update({ status }).eq('id', id)
    if (error) { showToast('Status update failed: ' + error.message, 'error'); return }
    setRows(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selected?.id === id) setSelected(p => ({ ...p, status }))
    if (status === 'accepted' || status === 'rejected') {
      try {
        await sendStatusEmail(app, status)
        showToast(`Email sent to ${app.email}`, 'success')
      } catch (e) {
        showToast('Status saved but email failed — check EmailJS config', 'warning')
      }
    }
  }

  const visible = rows
    .filter(a => filter === 'all' || (a.status || 'pending') === filter)
    .filter(a => !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.position?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()))

  function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: toast.type === 'success' ? '#dcfce7' : toast.type === 'error' ? '#fee2e2' : '#fef9c3', border: `1px solid ${toast.type === 'success' ? '#86efac' : toast.type === 'error' ? '#fca5a5' : '#fde047'}`, borderRadius: 10, padding: '12px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '0.84rem', fontWeight: 600, color: toast.type === 'success' ? '#15803d' : toast.type === 'error' ? '#b91c1c' : '#854d0e', maxWidth: 340 }}>
          {toast.type === 'success' ? <FaCheckCircle size={14} /> : <FaTimesCircle size={14} />}
          {toast.msg}
        </div>
      )}
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '5px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: filter === f ? '#CC0000' : '#f3f4f6', color: filter === f ? '#fff' : '#555', transition: 'all 0.15s' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span style={{ marginLeft: 4, opacity: 0.75 }}>({rows.filter(a => (a.status || 'pending') === f).length})</span>}
            </button>
          ))}
        </div>
        <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 12px', fontSize: '0.8rem', outline: 'none', width: 200 }} />
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <LoadingRow /> : visible.length === 0 ? <EmptyRow msg="No applications found" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                  {['Applicant', 'Position', 'Date', 'Status', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {visible.map((app, i) => {
                  const st = app.status || 'pending'
                  const sc = APP_STATUS[st] || APP_STATUS.pending
                  return (
                    <tr key={app.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{app.name}</div>
                        <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: 2 }}>{app.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.83rem', color: '#444' }}>{app.position}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.77rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(app.applied_at)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{st}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                          <button onClick={() => setSelected(app)} style={editBtn}><FaEye size={10} /> View</button>
                          <select value={st} onChange={e => updateStatus(app.id, e.target.value)}
                            style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 7px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none', color: '#444' }}>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
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

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, backgroundColor: '#fff', borderRadius: '16px 16px 0 0', zIndex: 1 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', margin: 0 }}>{selected.name}</h2>
                <p style={{ color: '#888', fontSize: '0.8rem', margin: '3px 0 0' }}>Applied for: <strong style={{ color: '#CC0000' }}>{selected.position}</strong></p>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: '1.1rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Email</div>
                  <a href={`mailto:${selected.email}`} style={{ color: '#CC0000', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}><FaEnvelope size={11} /> {selected.email}</a>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Phone</div>
                  <a href={`tel:${selected.phone}`} style={{ color: '#333', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}><FaPhone size={11} /> {selected.phone}</a>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Date Applied</div>
                  <div style={{ fontSize: '0.83rem', color: '#333' }}>{selected.applied_at ? new Date(selected.applied_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Update Status</div>
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
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Cover Letter</div>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: 10, padding: '14px 16px', fontSize: '0.83rem', color: '#333', lineHeight: 1.75, whiteSpace: 'pre-wrap', maxHeight: 240, overflowY: 'auto' }}>
                  {selected.cover_letter || 'No cover letter provided.'}
                </div>
              </div>
              {selected.cv_url && (
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>CV / Resume</div>
                  <a href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cvs/${selected.cv_url}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#CC0000', color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>
                    <FaDownload size={11} /> Download CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const inp = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }
const editBtn = { background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#333' }
const delBtn  = { background: '#fee2e2', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#dc2626' }

function Th({ children }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{children}</th>
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', borderRadius: '16px 16px 0 0', zIndex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ border: 'none', background: '#f3f4f6', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: '1.1rem', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

function Row2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>
}

function SaveBtn({ busy, onSave }) {
  return (
    <button onClick={onSave} disabled={busy}
      style={{ marginTop: 4, backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 700, fontSize: '0.875rem', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <FaCheck size={11} /> {busy ? 'Saving…' : 'Save'}
    </button>
  )
}

function LoadingRow() {
  return <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Loading…</div>
}

function EmptyRow({ msg }) {
  return <div style={{ padding: 40, textAlign: 'center', color: '#bbb', fontSize: '0.85rem' }}>{msg}</div>
}
