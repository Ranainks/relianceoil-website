import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePortalAuth } from '../../contexts/PortalAuth';
import PortalLayout from '../../components/PortalLayout';
import { FaCheckCircle } from 'react-icons/fa';

const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px',
  padding: '11px 14px', fontSize: '0.875rem', outline: 'none',
  backgroundColor: '#fff', color: '#111', transition: 'border-color 0.2s',
};

export default function PortalAccount() {
  const { user, profile, setProfile, loading: authLoading } = usePortalAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', phone: '', address: '' });
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/portal');
  }, [user, authLoading]);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name || '', company: profile.company || '', phone: profile.phone || '', address: profile.address || '' });
    }
  }, [profile]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setPwField = (k, v) => setPw(p => ({ ...p, [k]: v }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setProfileMsg(null);
    const { data, error } = await supabase.from('customer_profiles')
      .update({ name: form.name, company: form.company, phone: form.phone, address: form.address })
      .eq('id', user.id).select().single();
    setSaving(false);
    if (error) { setProfileMsg({ type: 'error', text: error.message }); return; }
    setProfile(data);
    setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (pw.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setSavingPw(true); setPwMsg(null);
    const { error } = await supabase.auth.updateUser({ password: pw.newPw });
    setSavingPw(false);
    if (error) { setPwMsg({ type: 'error', text: error.message }); return; }
    setPw({ current: '', newPw: '', confirm: '' });
    setPwMsg({ type: 'success', text: 'Password changed successfully.' });
  };

  return (
    <PortalLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111', marginBottom: '4px' }}>My Account</h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Manage your profile and account settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Profile Information</h2>
            <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '3px' }}>Account: <span style={{ color: '#CC0000', fontWeight: 700 }}>{profile?.account_number || '—'}</span></p>
          </div>
          <form onSubmit={handleSaveProfile} style={{ padding: '20px' }}>
            {profileMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', backgroundColor: profileMsg.type === 'success' ? '#F0FFF4' : '#FFF0F0', border: `1px solid ${profileMsg.type === 'success' ? '#BBF7D0' : '#FFD5D5'}`, color: profileMsg.type === 'success' ? '#16a34a' : '#CC0000', fontSize: '0.8rem' }}>
                {profileMsg.type === 'success' && <FaCheckCircle size={13} />} {profileMsg.text}
              </div>
            )}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} style={{ ...inputStyle }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Company / Organisation</label>
              <input type="text" value={form.company} onChange={e => set('company', e.target.value)} style={{ ...inputStyle }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ ...inputStyle }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Email</label>
                <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, backgroundColor: '#f9f9f9', color: '#aaa' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Delivery Address</label>
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Default delivery address" style={{ ...inputStyle }} />
            </div>
            <button type="submit" disabled={saving} style={{ width: '100%', padding: '11px', backgroundColor: saving ? '#999' : '#CC0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} style={{ padding: '20px' }}>
            {pwMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', backgroundColor: pwMsg.type === 'success' ? '#F0FFF4' : '#FFF0F0', border: `1px solid ${pwMsg.type === 'success' ? '#BBF7D0' : '#FFD5D5'}`, color: pwMsg.type === 'success' ? '#16a34a' : '#CC0000', fontSize: '0.8rem' }}>
                {pwMsg.type === 'success' && <FaCheckCircle size={13} />} {pwMsg.text}
              </div>
            )}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>New Password</label>
              <input type="password" value={pw.newPw} onChange={e => setPwField('newPw', e.target.value)} placeholder="Min 6 characters" style={{ ...inputStyle }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Confirm New Password</label>
              <input type="password" value={pw.confirm} onChange={e => setPwField('confirm', e.target.value)} placeholder="Repeat new password" style={{ ...inputStyle }} />
            </div>
            <button type="submit" disabled={savingPw} style={{ width: '100%', padding: '11px', backgroundColor: savingPw ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: savingPw ? 'not-allowed' : 'pointer' }}>
              {savingPw ? 'Updating…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
