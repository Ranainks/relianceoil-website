import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePortalAuth } from '../../contexts/PortalAuth';
import PortalLayout from '../../components/PortalLayout';
import {
  FaClipboardList, FaFileInvoiceDollar, FaCheckCircle,
  FaClock, FaArrowRight, FaGasPump,
} from 'react-icons/fa';

const statusColors = {
  pending: { bg: '#FFF8E1', color: '#B45309', label: 'Pending' },
  confirmed: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Confirmed' },
  delivered: { bg: '#F0FFF4', color: '#16a34a', label: 'Delivered' },
  cancelled: { bg: '#FFF0F0', color: '#CC0000', label: 'Cancelled' },
};

const invoiceColors = {
  unpaid: { bg: '#FFF0F0', color: '#CC0000', label: 'Unpaid' },
  paid: { bg: '#F0FFF4', color: '#16a34a', label: 'Paid' },
  overdue: { bg: '#FFF8E1', color: '#B45309', label: 'Overdue' },
};

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: `4px solid ${accent}` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '6px' }}>{sub}</p>}
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const { user, profile, loading: authLoading } = usePortalAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/portal');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('fuel_orders').select('*').eq('customer_id', user.id).order('ordered_at', { ascending: false }).limit(5),
      supabase.from('invoices').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }).limit(5),
    ]).then(([{ data: o }, { data: i }]) => {
      setOrders(o || []);
      setInvoices(i || []);
      setDataLoading(false);
    });
  }, [user]);

  if (authLoading || dataLoading) {
    return (
      <PortalLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        </div>
      </PortalLayout>
    );
  }

  const pending = orders.filter(o => o.status === 'pending').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').length;
  const totalSpent = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <PortalLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#111', marginBottom: '4px' }}>
          Welcome back, {profile?.name?.split(' ')[0] || 'Customer'}
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Account: <span style={{ color: '#CC0000', fontWeight: 700 }}>{profile?.account_number || '—'}</span>
          {profile?.company && <> &nbsp;·&nbsp; {profile.company}</>}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={FaClipboardList} label="Total Orders" value={orders.length} sub="All time" accent="#CC0000" />
        <StatCard icon={FaClock} label="Pending Orders" value={pending} sub="Awaiting confirmation" accent="#f97316" />
        <StatCard icon={FaFileInvoiceDollar} label="Unpaid Invoices" value={unpaidInvoices} sub="Action needed" accent="#B45309" />
        <StatCard icon={FaCheckCircle} label="Total Paid" value={`GH₵${totalSpent.toLocaleString()}`} sub="Lifetime" accent="#16a34a" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>Recent Orders</h2>
            <Link to="/portal/orders" style={{ fontSize: '0.75rem', color: '#CC0000', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <FaArrowRight size={9} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
              <FaGasPump size={28} style={{ color: '#e5e7eb', marginBottom: '10px' }} />
              <p>No orders yet</p>
              <Link to="/order-fuel" style={{ color: '#CC0000', fontWeight: 600, fontSize: '0.8rem' }}>Place your first order</Link>
            </div>
          ) : orders.map(o => {
            const s = statusColors[o.status] || statusColors.pending;
            return (
              <div key={o.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#111', fontSize: '0.85rem' }}>{o.order_number}</p>
                  <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '2px' }}>
                    {o.fuel_type} · {o.quantity} {o.unit}
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>Recent Invoices</h2>
            <Link to="/portal/invoices" style={{ fontSize: '0.75rem', color: '#CC0000', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <FaArrowRight size={9} />
            </Link>
          </div>
          {invoices.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
              <FaFileInvoiceDollar size={28} style={{ color: '#e5e7eb', marginBottom: '10px' }} />
              <p>No invoices yet</p>
            </div>
          ) : invoices.map(inv => {
            const s = invoiceColors[inv.status] || invoiceColors.unpaid;
            return (
              <div key={inv.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#111', fontSize: '0.85rem' }}>{inv.invoice_number}</p>
                  <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '2px' }}>
                    Due: {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB') : '—'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#111', fontSize: '0.875rem' }}>GH₵{Number(inv.amount).toLocaleString()}</p>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
