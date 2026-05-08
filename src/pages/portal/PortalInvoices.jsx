import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePortalAuth } from '../../contexts/PortalAuth';
import PortalLayout from '../../components/PortalLayout';
import { FaFileInvoiceDollar, FaDownload } from 'react-icons/fa';

const statusColors = {
  unpaid:   { bg: '#FFF0F0', color: '#CC0000', label: 'Unpaid' },
  paid:     { bg: '#F0FFF4', color: '#16a34a', label: 'Paid' },
  overdue:  { bg: '#FFF8E1', color: '#B45309', label: 'Overdue' },
  cancelled:{ bg: '#F5F5F5', color: '#888',    label: 'Cancelled' },
};

const tabs = ['All', 'Unpaid', 'Paid', 'Overdue'];

export default function PortalInvoices() {
  const { user, loading: authLoading } = usePortalAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!authLoading && !user) navigate('/portal');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase.from('invoices').select('*').eq('customer_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setInvoices(data || []); setLoading(false); });
  }, [user]);

  const filtered = invoices.filter(i => activeTab === 'All' || i.status === activeTab.toLowerCase());

  const totalUnpaid = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((s, i) => s + Number(i.amount), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <PortalLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', marginBottom: '4px' }}>Invoices</h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Track and manage your billing history.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: '4px solid #CC0000' }}>
          <p style={{ fontSize: '0.72rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Outstanding</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#CC0000' }}>GH₵{totalUnpaid.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', borderLeft: '4px solid #16a34a' }}>
          <p style={{ fontSize: '0.72rem', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Total Paid</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>GH₵{totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, backgroundColor: activeTab === t ? '#CC0000' : '#f5f5f5', color: activeTab === t ? '#fff' : '#555', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #CC0000', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>
            <FaFileInvoiceDollar size={36} style={{ color: '#e5e7eb', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, color: '#888' }}>No invoices found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['Invoice #', 'Amount', 'Issued', 'Due Date', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const s = statusColors[inv.status] || statusColors.unpaid;
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: '#111' }}>{inv.invoice_number}</td>
                      <td style={{ padding: '13px 16px', fontWeight: 700, color: '#111' }}>GH₵{Number(inv.amount).toLocaleString()}</td>
                      <td style={{ padding: '13px 16px', color: '#888', whiteSpace: 'nowrap' }}>
                        {inv.issued_date ? new Date(inv.issued_date).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', color: inv.status === 'overdue' ? '#B45309' : '#888', fontWeight: inv.status === 'overdue' ? 700 : 400, whiteSpace: 'nowrap' }}>
                        {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        {inv.pdf_url && (
                          <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#CC0000', fontWeight: 600, fontSize: '0.78rem', textDecoration: 'none' }}>
                            <FaDownload size={11} /> Download
                          </a>
                        )}
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
