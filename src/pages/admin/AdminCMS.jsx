import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaImage, FaNewspaper, FaGasPump, FaUpload } from 'react-icons/fa'

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
  const [saveError, setSaveError] = useState('')
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingVid, setUploadingVid] = useState(false)
  const imgRef = useRef()
  const vidRef = useRef()

  const EMPTY = { title: '', slug: '', category: '', excerpt: '', content: '', image_url: '', video_url: '', author: '', featured: false, published: false }

  useEffect(() => { loadRows() }, [])

  async function loadRows() {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('date', { ascending: false })
    if (data) setRows(data)
    setLoading(false)
  }

  function toSlug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

  async function uploadFile(file, type) {
    if (!file) return
    const isVid = type === 'video'
    if (isVid) setUploadingVid(true); else setUploadingImg(true)
    const ext = file.name.split('.').pop()
    const name = `${type}_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('posts-media').upload(name, file, { upsert: true })
    if (error) {
      alert('Upload failed: ' + error.message)
      if (isVid) setUploadingVid(false); else setUploadingImg(false)
      return
    }
    const { data } = supabase.storage.from('posts-media').getPublicUrl(name)
    if (isVid) { setEditing(p => ({ ...p, video_url: data.publicUrl })); setUploadingVid(false) }
    else { setEditing(p => ({ ...p, image_url: data.publicUrl })); setUploadingImg(false) }
  }

  async function save() {
    setSaveError('')
    setBusy(true)
    const { id, ...payload } = editing
    if (!payload.slug) payload.slug = toSlug(payload.title)
    if (!payload.date) payload.date = new Date().toISOString().slice(0, 10)
    let error
    if (id) {
      ({ error } = await supabase.from('posts').update(payload).eq('id', id))
    } else {
      ({ error } = await supabase.from('posts').insert(payload))
    }
    setBusy(false)
    if (error) { setSaveError(error.message); return }
    setEditing(null)
    loadRows()
  }

  async function del(id) {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) { alert('Delete failed: ' + error.message); return }
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function togglePublish(row) {
    const { error } = await supabase.from('posts').update({ published: !row.published }).eq('id', row.id)
    if (!error) setRows(prev => prev.map(r => r.id === row.id ? { ...r, published: !r.published } : r))
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
        <Modal title={editing.id ? 'Edit Post' : 'New Post'} onClose={() => { setEditing(null); setSaveError('') }}>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadFile(e.target.files[0], 'image')} />
          <input ref={vidRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => uploadFile(e.target.files[0], 'video')} />

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

          <Field label="Cover Image">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => imgRef.current.click()} disabled={uploadingImg}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: uploadingImg ? '#e5e7eb' : '#CC0000', color: uploadingImg ? '#aaa' : '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: uploadingImg ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                <FaUpload size={11} /> {uploadingImg ? 'Uploading…' : 'Upload Image'}
              </button>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>or paste URL below</span>
            </div>
            <input value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} style={{ ...inp, marginTop: 8 }} placeholder="https://..." />
            {editing.image_url && (
              <img src={editing.image_url} alt="preview" style={{ marginTop: 8, width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            )}
          </Field>

          <Field label="Video">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => vidRef.current.click()} disabled={uploadingVid}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: uploadingVid ? '#e5e7eb' : '#333', color: uploadingVid ? '#aaa' : '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: uploadingVid ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                <FaUpload size={11} /> {uploadingVid ? 'Uploading…' : 'Upload Video'}
              </button>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>or paste YouTube / video URL below</span>
            </div>
            <input value={editing.video_url || ''} onChange={e => setEditing(p => ({ ...p, video_url: e.target.value }))} style={{ ...inp, marginTop: 8 }} placeholder="https://youtube.com/... or video URL" />
            {editing.video_url && !editing.video_url.includes('youtube') && (
              <video src={editing.video_url} controls style={{ marginTop: 8, width: '100%', borderRadius: 8, maxHeight: 160 }} />
            )}
          </Field>

          <Row2>
            <CheckField label="Published" checked={editing.published} onChange={v => setEditing(p => ({ ...p, published: v }))} />
            <CheckField label="Featured" checked={editing.featured} onChange={v => setEditing(p => ({ ...p, featured: v }))} />
          </Row2>
          {saveError && <ErrorMsg msg={saveError} />}
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
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const EMPTY = { img: '', headline: '', sub: '', order_index: 0, active: true }

  async function uploadImage(file) {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const name = `slide_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('hero_slides').upload(name, file, { upsert: true })
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('hero_slides').getPublicUrl(name)
    setEditing(p => ({ ...p, img: data.publicUrl }))
    setUploading(false)
  }

  useEffect(() => { loadRows() }, [])

  async function loadRows() {
    setLoading(true)
    const { data } = await supabase.from('hero_slides').select('*').order('order_index')
    if (data) setRows(data)
    setLoading(false)
  }

  async function save() {
    setSaveError('')
    setBusy(true)
    const { id, ...payload } = editing
    let error
    if (id) { ({ error } = await supabase.from('hero_slides').update(payload).eq('id', id)) }
    else { ({ error } = await supabase.from('hero_slides').insert(payload)) }
    setBusy(false)
    if (error) { setSaveError(error.message); return }
    setEditing(null)
    loadRows()
  }

  async function del(id) {
    if (!confirm('Delete this slide?')) return
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)
    if (error) { alert('Delete failed: ' + error.message); return }
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function toggleActive(row) {
    const { error } = await supabase.from('hero_slides').update({ active: !row.active }).eq('id', row.id)
    if (!error) setRows(prev => prev.map(r => r.id === row.id ? { ...r, active: !r.active } : r))
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
        <Modal title={editing.id ? 'Edit Slide' : 'New Slide'} onClose={() => { setEditing(null); setSaveError('') }}>
          <Field label="Headline">
            <input value={editing.headline || ''} onChange={e => setEditing(p => ({ ...p, headline: e.target.value }))} style={inp} />
          </Field>
          <Field label="Sub-heading">
            <input value={editing.sub || ''} onChange={e => setEditing(p => ({ ...p, sub: e.target.value }))} style={inp} />
          </Field>
          <Field label="Slide Image">
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadImage(e.target.files[0])} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: uploading ? '#e5e7eb' : '#CC0000', color: uploading ? '#aaa' : '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                <FaUpload size={11} /> {uploading ? 'Uploading…' : 'Upload Image'}
              </button>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>or paste URL below</span>
            </div>
            <input value={editing.img || ''} onChange={e => setEditing(p => ({ ...p, img: e.target.value }))} style={{ ...inp, marginTop: 8 }} placeholder="https://..." />
            {editing.img && (
              <img src={editing.img} alt="preview" style={{ marginTop: 8, width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            )}
          </Field>
          <Field label="Order Index">
            <input type="number" value={editing.order_index || 0} onChange={e => setEditing(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} style={{ ...inp, width: 100 }} />
          </Field>
          <CheckField label="Active" checked={editing.active} onChange={v => setEditing(p => ({ ...p, active: v }))} />
          {saveError && <ErrorMsg msg={saveError} />}
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
  const [saveError, setSaveError] = useState('')

  const EMPTY = { fuel_type: '', price: '', unit: 'per litre', change_direction: 'stable', order_index: 0 }

  useEffect(() => { loadRows() }, [])

  async function loadRows() {
    setLoading(true)
    const { data } = await supabase.from('fuel_prices').select('*').order('order_index')
    if (data) setRows(data)
    setLoading(false)
  }

  async function save() {
    setSaveError('')
    setBusy(true)
    const { id, ...payload } = editing
    let error
    if (id) { ({ error } = await supabase.from('fuel_prices').update(payload).eq('id', id)) }
    else { ({ error } = await supabase.from('fuel_prices').insert(payload)) }
    setBusy(false)
    if (error) { setSaveError(error.message); return }
    setEditing(null)
    loadRows()
  }

  async function del(id) {
    if (!confirm('Delete this fuel price?')) return
    const { error } = await supabase.from('fuel_prices').delete().eq('id', id)
    if (error) { alert('Delete failed: ' + error.message); return }
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
        <Modal title={editing.id ? 'Edit Fuel Price' : 'New Fuel Price'} onClose={() => { setEditing(null); setSaveError('') }}>
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
          {saveError && <ErrorMsg msg={saveError} />}
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

function ErrorMsg({ msg }) {
  return (
    <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 600 }}>
      Save failed: {msg}
    </div>
  )
}
