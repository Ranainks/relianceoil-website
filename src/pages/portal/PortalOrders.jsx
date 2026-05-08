import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePortalAuth } from '../../contexts/PortalAuth';
import PortalLayout from '../../components/PortalLayout';
import { FaGasPump, FaSearch } from 'react-icons/fa';

const statusColors = {
  pending:   { bg: '#FFF8E1', color: '#B45309', label: 'Pending' },
  confirmed: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Confirmed' },
  delivered: { bg: '#F0FFF4', color: '#16a34a', label: 'Delivered' },
  cancelled: { bg: '#FFF0F0', color: '#CC0000', label: 'Cancelled' },
};

const tabs = ['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'];

export default function PortalOrders() {
  const { user, loading: authLoading } = usePortalAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/portal');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase.from('fuel_orders').select('*').eq('customer_id', user.id).order('ordered_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [user]);

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase();
    const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.fuel_type?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <PortalLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', marginBottom: '4px' }}>My Orders</h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Track all your fuel orders and their status.</p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, backgroundColor: activeTab === t ? '#CC0000' : '#f5f5f5', color: activeTab === t ? '#fff' : '#555', transition: 'all 0.2s' }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <FaSearch size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '30px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', width: '180px' }} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>
            <FaGasPump size={36} style={{ color: '#e5e7eb', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, color: '#888', marginBottom: '6px' }}>No orders found</p>
            <p style={{ fontSize: '0.8rem' }}>Try a different filter or place a new order.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['Order #', 'Fuel Type', 'Quantity', 'Delivery', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const s = statusColors[o.status] || statusColors.pending;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: '#111' }}>{o.order_number}</td>
                      <td style={{ padding: '13px 16px', color: '#444', textTransform: 'capitalize' }}>{o.fuel_type}</td>
                      <td style={{ padding: '13px 16px', color: '#444' }}>{o.quantity} {o.unit}</td>
                      <td style={{ padding: '13px 16px', color: '#444', textTransform: 'capitalize' }}>{o.delivery_type}</td>
                      <td style={{ padding: '13px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                        {o.ordered_at ? new Date(o.ordered_at).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
