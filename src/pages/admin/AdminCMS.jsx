import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaImage, FaNewspaper, FaGasPump } from 'react-icons/fa'

const TABS = [
  { key: 'posts',       label: 'Blog Posts',    Icon: FaNewspaper },
  { key: 'hero_slides', label: 'Hero Slides',   Icon: FaImage },
  { key: 'fuel_prices', label: 'Fuel Prices',   Icon: FaGasPump },
]

export default function AdminCMS() {
  const [tab, setTab] = useState('posts')
  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>CMS Management</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Manage website content</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '2px solid #f0f0f0', paddingBottom: 0 }}>
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === key ? 700 : 500, fontSize: '0.85rem', color: tab === key ? '#CC0000' : '#666', borderBottom: tab === key ? '2px solid #CC0000' : '2px solid transparent', marginBottom: -2, transition: 'all 0.15s' }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        {tab === 'posts'       && <PostsTab />}
        {tab === 'hero_slides' && <HeroSlidesTab />}
        {tab === 'fuel_prices' && <FuelPricesTab />}
      </div>
    </AdminLayout>
  )
}

function PostsTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const EMPTY = { title: '', slug: '', category: '', excerpt: '', content: '', image_url: '', author: '', featured: false, published: false }

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('date', { ascending: false })
    if (data) setRows(data)
    setLoading(false)
  }

  function toSlug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

  async function save() {
    setBusy(true)
    const { id, ...payload } = editing
    if (!payload.slug) payload.slug = toSlug(payload.title)
    if (!payload.date) payload.date = new Date().toISOString().slice(0, 10)
    if (id) {
      await supabase.from('posts').update(payload).eq('id', id)
    } else {
      await supabase.from('posts').insert(payload)
    }
    setEditing(null)
    setBusy(false)
    fetch()
  }

  async function del(id) {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function togglePublish(row) {
    await supabase.from('posts').update({ published: !row.published }).eq('id', row.id)
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, published: !r.published } : r))
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setEditing(EMPTY)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <FaPlus size={11} /> New Post
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <LoadingRow /> : rows.length === 0 ? <EmptyRow msg="No posts yet" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                  {['Title', 'Category', 'Author', 'Published', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 2 }}>{row.slug}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#555' }}>{row.category || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#555' }}>{row.author || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => togglePublish(row)}
                        style={{ background: row.published ? '#10b98120' : '#f5f5f5', color: row.published ? '#10b981' : '#888', border: 'none', borderRadius: 9999, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                        {row.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <Td><ActionBtns onEdit={() => setEditing(row)} onDelete={() => del(row.id)} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit Post' : 'New Post'} onClose={() => setEditing(null)}>
          <Field label="Title">
            <input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} style={inp} />
          </Field>
          <Field label="Slug (auto-generated if blank)">
            <input value={editing.slug} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} style={inp} placeholder="leave-blank-to-auto" />
          </Field>
          <Row2>
            <Field label="Category">
              <input value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={inp} />
            </Field>
            <Field label="Author">
              <input value={editing.author || ''} onChange={e => setEditing(p => ({ ...p, author: e.target.value }))} style={inp} />
            </Field>
          </Row2>
          <Field label="Excerpt">
            <textarea value={editing.excerpt || ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} />
          </Field>
          <Field label="Content (Markdown)">
            <textarea value={editing.content || ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))} rows={8} style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </Field>
          <Field label="Image URL">
            <input value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} style={inp} placeholder="https://..." />
          </Field>
          <Row2>
            <CheckField label="Published" checked={editing.published} onChange={v => setEditing(p => ({ ...p, published: v }))} />
            <CheckField label="Featured" checked={editing.featured} onChange={v => setEditing(p => ({ ...p, featured: v }))} />
          </Row2>
          <SaveBtn busy={busy} onSave={save} />
        </Modal>
      )}
    </>
  )
}

function HeroSlidesTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const EMPTY = { img: '', headline: '', sub: '', order_index: 0, active: true }

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('hero_slides').select('*').order('order_index')
    if (data) setRows(data)
    setLoading(false)
  }

  async function save() {
    setBusy(true)
    const { id, ...payload } = editing
    if (id) { await supabase.from('hero_slides').update(payload).eq('id', id) }
    else { await supabase.from('hero_slides').insert(payload) }
    setEditing(null)
    setBusy(false)
    fetch()
  }

  async function del(id) {
    if (!confirm('Delete this slide?')) return
    await supabase.from('hero_slides').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function toggleActive(row) {
    await supabase.from('hero_slides').update({ active: !row.active }).eq('id', row.id)
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, active: !r.active } : r))
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setEditing(EMPTY)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <FaPlus size={11} /> Add Slide
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <LoadingRow /> : rows.length === 0 ? <EmptyRow msg="No slides" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                  {['#', 'Headline', 'Image', 'Active', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '10px 16px', fontSize: '0.82rem', color: '#888', width: 40 }}>{row.order_index}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.headline}</div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 2 }}>{row.sub}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {row.img ? (
                        <img src={row.img} alt="" style={{ width: 64, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                      ) : <span style={{ fontSize: '0.75rem', color: '#bbb' }}>No image</span>}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <button onClick={() => toggleActive(row)}
                        style={{ background: row.active ? '#10b98120' : '#f5f5f5', color: row.active ? '#10b981' : '#888', border: 'none', borderRadius: 9999, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                        {row.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <Td><ActionBtns onEdit={() => setEditing(row)} onDelete={() => del(row.id)} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit Slide' : 'New Slide'} onClose={() => setEditing(null)}>
          <Field label="Headline">
            <input value={editing.headline || ''} onChange={e => setEditing(p => ({ ...p, headline: e.target.value }))} style={inp} />
          </Field>
          <Field label="Sub-heading">
            <input value={editing.sub || ''} onChange={e => setEditing(p => ({ ...p, sub: e.target.value }))} style={inp} />
          </Field>
          <Field label="Image URL">
            <input value={editing.img || ''} onChange={e => setEditing(p => ({ ...p, img: e.target.value }))} style={inp} placeholder="https://..." />
          </Field>
          <Field label="Order Index">
            <input type="number" value={editing.order_index || 0} onChange={e => setEditing(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} style={{ ...inp, width: 100 }} />
          </Field>
          <CheckField label="Active" checked={editing.active} onChange={v => setEditing(p => ({ ...p, active: v }))} />
          <SaveBtn busy={busy} onSave={save} />
        </Modal>
      )}
    </>
  )
}

function FuelPricesTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const EMPTY = { fuel_type: '', price: '', unit: 'per litre', change_direction: 'stable', order_index: 0 }

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('fuel_prices').select('*').order('order_index')
    if (data) setRows(data)
    setLoading(false)
  }

  async function save() {
    setBusy(true)
    const { id, ...payload } = editing
    if (id) { await supabase.from('fuel_prices').update(payload).eq('id', id) }
    else { await supabase.from('fuel_prices').insert(payload) }
    setEditing(null)
    setBusy(false)
    fetch()
  }

  async function del(id) {
    if (!confirm('Delete this fuel price?')) return
    await supabase.from('fuel_prices').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const dirColor = { up: '#ef4444', down: '#10b981', stable: '#f59e0b' }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setEditing(EMPTY)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, backgroundColor: '#CC0000', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          <FaPlus size={11} /> Add Price
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <LoadingRow /> : rows.length === 0 ? <EmptyRow msg="No fuel prices" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                  {['Fuel Type', 'Price', 'Unit', 'Trend', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{row.fuel_type}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.95rem', color: '#CC0000' }}>GH₵ {row.price}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#555' }}>{row.unit}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: dirColor[row.change_direction] || '#888' }}>
                        {row.change_direction === 'up' ? '▲' : row.change_direction === 'down' ? '▼' : '—'} {row.change_direction}
                      </span>
                    </td>
                    <Td><ActionBtns onEdit={() => setEditing(row)} onDelete={() => del(row.id)} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit Fuel Price' : 'New Fuel Price'} onClose={() => setEditing(null)}>
          <Field label="Fuel Type">
            <input value={editing.fuel_type || ''} onChange={e => setEditing(p => ({ ...p, fuel_type: e.target.value }))} style={inp} placeholder="e.g. Petrol (RON 91)" />
          </Field>
          <Row2>
            <Field label="Price (GH₵)">
              <input type="number" step="0.01" value={editing.price || ''} onChange={e => setEditing(p => ({ ...p, price: e.target.value }))} style={inp} />
            </Field>
            <Field label="Unit">
              <input value={editing.unit || 'per litre'} onChange={e => setEditing(p => ({ ...p, unit: e.target.value }))} style={inp} />
            </Field>
          </Row2>
          <Field label="Trend">
            <select value={editing.change_direction || 'stable'} onChange={e => setEditing(p => ({ ...p, change_direction: e.target.value }))} style={inp}>
              <option value="up">Up ▲</option>
              <option value="down">Down ▼</option>
              <option value="stable">Stable —</option>
            </select>
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

const inp = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#111' }

function Th({ children }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{children}</th>
}

function Td({ children }) {
  return <td style={{ padding: '10px 16px' }}>{children}</td>
}

function ActionBtns({ onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={onEdit} style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#333' }}><FaEdit size={10} /> Edit</button>
      <button onClick={onDelete} style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 600, color: '#dc2626' }}><FaTrash size={10} /></button>
    </div>
  )
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

function CheckField({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
      {label}
    </label>
  )
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
