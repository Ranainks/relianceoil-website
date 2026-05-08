import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import {
  FaNewspaper, FaBriefcase, FaEnvelope, FaGasPump,
  FaFileInvoiceDollar, FaUsers, FaChartLine,
} from 'react-icons/fa'

const CARDS = [
  { key: 'posts',        label: 'Blog Posts',       table: 'posts',        color: '#6366f1', Icon: FaNewspaper,        link: '/admin/cms' },
  { key: 'jobs',         label: 'Active Jobs',      table: 'jobs',         color: '#0ea5e9', Icon: FaBriefcase,        link: '/admin/careers', filter: { column: 'status', value: 'active' } },
  { key: 'applications', label: 'Applications',     table: 'applications', color: '#f59e0b', Icon: FaUsers,            link: '/admin/careers' },
  { key: 'messages',     label: 'Messages',         table: 'messages',     color: '#10b981', Icon: FaEnvelope,         link: '/admin/contacts' },
  { key: 'orders',       label: 'Fuel Orders',      table: 'fuel_orders',  color: '#CC0000', Icon: FaGasPump,          link: '/admin/orders' },
  { key: 'quotes',       label: 'Quote Requests',   table: 'quote_requests', color: '#8b5cf6', Icon: FaFileInvoiceDollar, link: '/admin/quotes' },
]

function StatCard({ label, value, color, Icon, link, loading }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16, transition: 'box-shadow 0.15s', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>
            {loading ? <span style={{ display: 'inline-block', width: 40, height: 26, background: '#f0f0f0', borderRadius: 4 }} /> : value}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        </div>
      </div>
    </Link>
  )
}

export default function AdminOverview() {
  const [counts, setCounts] = useState({})
  const [recentApps, setRecentApps] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('fuel_orders').select('id', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
      ])
      const keys = ['posts', 'jobs', 'applications', 'messages', 'orders', 'quotes']
      const c = {}
      results.forEach((r, i) => { c[keys[i]] = r.status === 'fulfilled' ? (r.value.count ?? 0) : 0 })
      setCounts(c)

      const [appsRes, msgsRes, ordersRes] = await Promise.all([
        supabase.from('applications').select('id,name,position,status,applied_at').order('applied_at', { ascending: false }).limit(5),
        supabase.from('messages').select('id,name,subject,sent_at').order('sent_at', { ascending: false }).limit(5),
        supabase.from('fuel_orders').select('id,order_number,name,fuel_type,status,ordered_at').order('ordered_at', { ascending: false }).limit(5),
      ])
      if (appsRes.data) setRecentApps(appsRes.data)
      if (msgsRes.data) setRecentMessages(msgsRes.data)
      if (ordersRes.data) setRecentOrders(ordersRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const appStatus = { pending: '#f59e0b', reviewed: '#0ea5e9', accepted: '#10b981', rejected: '#ef4444' }
  const orderStatus = { pending: '#f59e0b', confirmed: '#0ea5e9', delivered: '#10b981', cancelled: '#ef4444' }

  function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>Overview</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Site-wide activity at a glance</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 36 }}>
          {CARDS.map(({ key, label, color, Icon, link }) => (
            <StatCard key={key} label={label} value={counts[key] ?? 0} color={color} Icon={Icon} link={link} loading={loading} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
          <RecentBlock title="Recent Applications" link="/admin/careers" loading={loading}>
            {recentApps.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{a.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{a.position}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, backgroundColor: `${appStatus[a.status || 'pending']}20`, color: appStatus[a.status || 'pending'] }}>
                    {a.status || 'pending'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#bbb' }}>{fmtDate(a.applied_at)}</span>
                </div>
              </div>
            ))}
            {!loading && recentApps.length === 0 && <Empty />}
          </RecentBlock>

          <RecentBlock title="Recent Messages" link="/admin/contacts" loading={loading}>
            {recentMessages.map(m => (
              <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>{m.name}</div>
                  <span style={{ fontSize: '0.7rem', color: '#bbb' }}>{fmtDate(m.sent_at)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>{m.subject || '(no subject)'}</div>
              </div>
            ))}
            {!loading && recentMessages.length === 0 && <Empty />}
          </RecentBlock>

          <RecentBlock title="Recent Fuel Orders" link="/admin/orders" loading={loading}>
            {recentOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111', fontFamily: 'monospace' }}>{o.order_number}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{o.name} · {o.fuel_type}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, backgroundColor: `${orderStatus[o.status || 'pending']}20`, color: orderStatus[o.status || 'pending'] }}>
                    {o.status || 'pending'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#bbb' }}>{fmtDate(o.ordered_at)}</span>
                </div>
              </div>
            ))}
            {!loading && recentOrders.length === 0 && <Empty />}
          </RecentBlock>
        </div>
      </div>
    </AdminLayout>
  )
}

function RecentBlock({ title, link, loading, children }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', margin: 0 }}>{title}</h2>
        <Link to={link} style={{ fontSize: '0.75rem', color: '#CC0000', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 36, background: '#f5f5f5', borderRadius: 6 }} />)}
        </div>
      ) : children}
    </div>
  )
}

function Empty() {
  return <div style={{ padding: '20px 0', textAlign: 'center', color: '#bbb', fontSize: '0.82rem' }}>No records yet</div>
}
