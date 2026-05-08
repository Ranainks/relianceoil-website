import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { FaEye, FaUsers, FaEnvelope, FaGasPump, FaBriefcase, FaFileInvoiceDollar } from 'react-icons/fa'

const RED = '#CC0000'
const COLORS = ['#CC0000', '#f59e0b', '#10b981', '#6366f1', '#0ea5e9', '#8b5cf6']

function getLast30Days() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getLast7Days() {
  return getLast30Days().slice(-7)
}

function fmtDay(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function AdminAnalytics() {
  const [range, setRange] = useState(30)
  const [pageViewsData, setPageViewsData] = useState([])
  const [topPages, setTopPages] = useState([])
  const [activityData, setActivityData] = useState([])
  const [pieData, setPieData] = useState([])
  const [totals, setTotals] = useState({ views: 0, messages: 0, orders: 0, applications: 0, quotes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [range])

  async function load() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - range)
    const sinceISO = since.toISOString()

    const [pvRes, msgRes, ordRes, appRes, qRes] = await Promise.all([
      supabase.from('page_views').select('path, viewed_at').gte('viewed_at', sinceISO),
      supabase.from('messages').select('sent_at').gte('sent_at', sinceISO),
      supabase.from('fuel_orders').select('ordered_at').gte('ordered_at', sinceISO),
      supabase.from('applications').select('applied_at').gte('applied_at', sinceISO),
      supabase.from('quote_requests').select('created_at').gte('created_at', sinceISO),
    ])

    const pvRows = pvRes.data || []
    const msgRows = msgRes.data || []
    const ordRows = ordRes.data || []
    const appRows = appRes.data || []
    const qRows = qRes.data || []

    setTotals({
      views: pvRows.length,
      messages: msgRows.length,
      orders: ordRows.length,
      applications: appRows.length,
      quotes: qRows.length,
    })

    const days = range === 7 ? getLast7Days() : getLast30Days()

    const pvByDay = {}
    pvRows.forEach(r => { const d = r.viewed_at?.slice(0, 10); if (d) pvByDay[d] = (pvByDay[d] || 0) + 1 })

    const msgByDay = {}
    msgRows.forEach(r => { const d = r.sent_at?.slice(0, 10); if (d) msgByDay[d] = (msgByDay[d] || 0) + 1 })

    const ordByDay = {}
    ordRows.forEach(r => { const d = r.ordered_at?.slice(0, 10); if (d) ordByDay[d] = (ordByDay[d] || 0) + 1 })

    const appByDay = {}
    appRows.forEach(r => { const d = r.applied_at?.slice(0, 10); if (d) appByDay[d] = (appByDay[d] || 0) + 1 })

    setPageViewsData(days.map(d => ({ date: fmtDay(d), views: pvByDay[d] || 0 })))

    setActivityData(days.map(d => ({
      date: fmtDay(d),
      messages: msgByDay[d] || 0,
      orders: ordByDay[d] || 0,
      applications: appByDay[d] || 0,
    })))

    const pageCounts = {}
    pvRows.forEach(r => { if (r.path) pageCounts[r.path] = (pageCounts[r.path] || 0) + 1 })
    const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    setTopPages(sorted.map(([path, count]) => ({ page: path === '/' ? 'Home' : path.replace('/', '').replace(/-/g, ' '), count })))

    setPieData([
      { name: 'Page Views', value: pvRows.length },
      { name: 'Messages', value: msgRows.length },
      { name: 'Fuel Orders', value: ordRows.length },
      { name: 'Applications', value: appRows.length },
      { name: 'Quotes', value: qRows.length },
    ].filter(d => d.value > 0))

    setLoading(false)
  }

  const statCards = [
    { label: 'Page Views',    value: totals.views,        Icon: FaEye,              color: RED },
    { label: 'Messages',      value: totals.messages,     Icon: FaEnvelope,         color: '#10b981' },
    { label: 'Fuel Orders',   value: totals.orders,       Icon: FaGasPump,          color: '#f59e0b' },
    { label: 'Applications',  value: totals.applications, Icon: FaBriefcase,        color: '#6366f1' },
    { label: 'Quote Requests',value: totals.quotes,       Icon: FaFileInvoiceDollar,color: '#0ea5e9' },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111', margin: '0 0 4px' }}>Analytics</h1>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Website performance & activity</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[7, 30].map(r => (
              <button key={r} onClick={() => setRange(r)}
                style={{ padding: '7px 16px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: range === r ? RED : '#f3f4f6', color: range === r ? '#fff' : '#555', transition: 'all 0.15s' }}>
                Last {r} days
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14, marginBottom: 28 }}>
          {statCards.map(({ label, value, Icon, color }) => (
            <div key={label} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>
                  {loading ? <Skel w={40} h={22} /> : value}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#888', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 20 }}>
          <ChartCard title="Page Views" subtitle={`Last ${range} days`}>
            {loading ? <ChartSkel /> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={pageViewsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RED} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={RED} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#aaa' }} tickLine={false} axisLine={false} interval={range === 7 ? 0 : 4} />
                  <YAxis tick={{ fontSize: 11, fill: '#aaa' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke={RED} strokeWidth={2} fill="url(#pvGrad)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20, marginBottom: 20 }}>
          <ChartCard title="Activity" subtitle="Messages · Orders · Applications">
            {loading ? <ChartSkel /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#aaa' }} tickLine={false} axisLine={false} interval={range === 7 ? 0 : 4} />
                  <YAxis tick={{ fontSize: 11, fill: '#aaa' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="messages"     fill="#10b981" radius={[3,3,0,0]} name="Messages" />
                  <Bar dataKey="orders"       fill="#f59e0b" radius={[3,3,0,0]} name="Orders" />
                  <Bar dataKey="applications" fill="#6366f1" radius={[3,3,0,0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Traffic Breakdown" subtitle="Share of total activity">
            {loading ? <ChartSkel /> : pieData.length === 0 ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '0.85rem' }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="Top Pages" subtitle={`Most visited in last ${range} days`}>
          {loading ? <ChartSkel h={180} /> : topPages.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#bbb', fontSize: '0.85rem' }}>No page view data yet. Views will appear here as visitors browse the site.</div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, topPages.length * 36)}>
              <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#aaa' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="page" tick={{ fontSize: 12, fill: '#444' }} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Bar dataKey="count" fill={RED} radius={[0,4,4,0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div style={{ marginTop: 16, padding: '12px 16px', backgroundColor: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a', fontSize: '0.78rem', color: '#92400e' }}>
          Page views are tracked from the moment this update is deployed. Historical data before this update will not appear.
        </div>
      </div>
    </AdminLayout>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ color: '#aaa', fontSize: '0.75rem', margin: '3px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function ChartSkel({ h = 220 }) {
  return <div style={{ height: h, backgroundColor: '#f5f5f5', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
}

function Skel({ w, h }) {
  return <span style={{ display: 'inline-block', width: w, height: h, background: '#f0f0f0', borderRadius: 4 }} />
}
