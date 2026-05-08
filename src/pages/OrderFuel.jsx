import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  FaGasPump, FaTruck, FaFire, FaOilCan, FaMapMarkerAlt,
  FaCalendarAlt, FaUser, FaCheckCircle, FaArrowRight, FaArrowLeft,
  FaPhone, FaEnvelope, FaBuilding, FaClipboardList,
} from 'react-icons/fa';

const fuelTypes = [
  { id: 'petrol', label: 'Premium Petrol', icon: FaGasPump, color: '#CC0000', desc: 'High-quality petrol for all vehicles' },
  { id: 'diesel', label: 'Standard Diesel', icon: FaTruck, color: '#1e293b', desc: 'Clean diesel for cars & commercial fleets' },
  { id: 'lpg', label: 'LPG Gas', icon: FaFire, color: '#f97316', desc: 'Liquefied petroleum gas for home & business' },
  { id: 'lubricants', label: 'Lubricants & Oils', icon: FaOilCan, color: '#16a34a', desc: 'Engine oils and industrial lubricants' },
];

const ghanaRegions = [
  'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Northern',
  'Upper East', 'Upper West', 'Volta', 'Bono', 'Bono East', 'Ahafo',
  'Western North', 'North East', 'Savannah', 'Oti',
];

const timeSlots = [
  'Morning (8am – 12pm)',
  'Afternoon (12pm – 5pm)',
  'Evening (5pm – 8pm)',
];

const inputStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#fff',
  color: '#111',
};

function generateOrderNumber() {
  const d = new Date();
  const ds = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `ROL-${ds}-${rand}`;
}

const steps = ['Fuel & Quantity', 'Delivery Details', 'Your Details'];

export default function OrderFuel() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const recaptchaRef = useRef(null);

  const [form, setForm] = useState({
    fuel_type: '',
    quantity: '',
    unit: 'litres',
    purpose: 'personal',
    delivery_type: 'delivery',
    delivery_region: '',
    delivery_city: '',
    delivery_address: '',
    station: '',
    preferred_date: '',
    preferred_time: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: false }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.fuel_type) e.fuel_type = true;
      if (!form.quantity || Number(form.quantity) <= 0) e.quantity = true;
    }
    if (s === 2) {
      if (form.delivery_type === 'delivery') {
        if (!form.delivery_region) e.delivery_region = true;
        if (!form.delivery_address) e.delivery_address = true;
      } else {
        if (!form.station) e.station = true;
      }
      if (!form.preferred_date) e.preferred_date = true;
    }
    if (s === 3) {
      if (!form.name.trim()) e.name = true;
      if (!form.email.trim()) e.email = true;
      if (!form.phone.trim()) e.phone = true;
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e3 = validateStep(3);
    if (Object.keys(e3).length > 0) { setErrors(e3); return; }
    const token = recaptchaRef.current?.getValue();
    if (!token) { setStatus('captcha'); return; }

    setSubmitting(true);
    setStatus('idle');
    const num = generateOrderNumber();

    try {
      const { error: dbErr } = await supabase.from('fuel_orders').insert({
        order_number: num,
        fuel_type: form.fuel_type,
        quantity: Number(form.quantity),
        unit: form.unit,
        purpose: form.purpose,
        delivery_type: form.delivery_type,
        station: form.delivery_type === 'pickup' ? form.station : null,
        delivery_region: form.delivery_type === 'delivery' ? form.delivery_region : null,
        delivery_city: form.delivery_type === 'delivery' ? form.delivery_city : null,
        delivery_address: form.delivery_type === 'delivery' ? form.delivery_address : null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company || null,
        notes: form.notes || null,
        status: 'pending',
      });
      if (dbErr) throw dbErr;

      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          reply_to: form.email,
          to_name: 'Reliance Oil',
          to_email: 'relianceoil2018@gmail.com',
          subject: `New Fuel Order ${num} — ${form.fuel_type} (${form.quantity} ${form.unit})`,
          message: `ORDER NUMBER: ${num}\n\nFUEL: ${form.fuel_type}\nQUANTITY: ${form.quantity} ${form.unit}\nPURPOSE: ${form.purpose}\n\nDELIVERY TYPE: ${form.delivery_type}\n${form.delivery_type === 'delivery' ? `REGION: ${form.delivery_region}\nCITY: ${form.delivery_city}\nADDRESS: ${form.delivery_address}` : `STATION: ${form.station}`}\n\nPREFERRED DATE: ${form.preferred_date}\nPREFERRED TIME: ${form.preferred_time}\n\nCUSTOMER: ${form.name}\nPHONE: ${form.phone}\nEMAIL: ${form.email}\nCOMPANY: ${form.company || 'N/A'}\n\nNOTES: ${form.notes || 'None'}`,
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      ).catch(() => {});

      setOrderNumber(num);
      setStatus('success');
    } catch (err) {
      console.error('Order error:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        <SEO title="Fuel Order Placed" description="Your fuel order has been placed with Reliance Oil Limited." path="/order-fuel" />
        <div style={{ maxWidth: '540px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <FaCheckCircle size={36} style={{ color: '#16a34a' }} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: '#111', marginBottom: '12px' }}>Order Placed!</h1>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '24px' }}>
            Thank you for your order. Our team will contact you within <strong>2 hours</strong> to confirm availability and arrange delivery.
          </p>
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Order Number</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#CC0000', letterSpacing: '0.05em' }}>{orderNumber}</p>
            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '6px' }}>Save this for reference</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ backgroundColor: '#CC0000', color: '#fff', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              Back to Home
            </Link>
            <Link to="/contact" style={{ backgroundColor: '#fff', color: '#111', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', border: '1px solid #e5e7eb' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedFuel = fuelTypes.find(f => f.id === form.fuel_type);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <SEO
        title="Order Fuel Online — Fast & Easy Fuel Delivery Ghana"
        description="Order petrol, diesel, LPG or lubricants online from Reliance Oil Limited. Fast delivery across Ghana or pickup at our stations."
        path="/order-fuel"
        keywords="order fuel online Ghana, diesel delivery Ghana, petrol order Ghana, online fuel order Ghana"
      />

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg,#0D0D0D,#1a0000)', padding: '48px 24px 56px' }}>
        <div className="rc">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '20px' }}>
            <FaArrowLeft size={10} /> Home
          </Link>
          <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Online Ordering</span>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem,4vw,2.4rem)', color: '#fff', lineHeight: 1.15, marginBottom: '12px' }}>
            Order Fuel Online
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>
            Place your fuel order in 3 easy steps. We deliver across Ghana or you can pick up at any of our stations.
          </p>
        </div>
      </div>

      {/* ── PROGRESS STEPS ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div className="rc" style={{ padding: '20px clamp(16px,4vw,48px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', maxWidth: '500px' }}>
            {steps.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: done ? '#16a34a' : active ? '#CC0000' : '#e5e7eb', color: done || active ? '#fff' : '#888', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.3s' }}>
                      {done ? <FaCheckCircle size={14} /> : num}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: active ? 700 : 500, color: active ? '#CC0000' : done ? '#16a34a' : '#888', whiteSpace: 'nowrap' }}>{label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: '2px', backgroundColor: done ? '#16a34a' : '#e5e7eb', margin: '0 8px', marginTop: '-16px', transition: 'background-color 0.3s' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rc" style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* ── STEP 1: Fuel & Quantity ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111', marginBottom: '8px' }}>Select Fuel Type</h2>
              <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '24px' }}>Choose the type of fuel you need.</p>
              {errors.fuel_type && <p style={{ color: '#CC0000', fontSize: '0.8rem', marginBottom: '12px' }}>Please select a fuel type.</p>}
              <div className="rg2" style={{ marginBottom: '32px' }}>
                {fuelTypes.map(f => {
                  const Icon = f.icon;
                  const sel = form.fuel_type === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => set('fuel_type', f.id)}
                      style={{ cursor: 'pointer', backgroundColor: '#fff', border: `2px solid ${sel ? f.color : '#e5e7eb'}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: sel ? `0 0 0 3px ${f.color}22` : 'none' }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: sel ? f.color : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.2s' }}>
                        <Icon size={20} style={{ color: sel ? '#fff' : f.color }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '4px' }}>{f.label}</p>
                        <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.5 }}>{f.desc}</p>
                      </div>
                      {sel && <FaCheckCircle size={18} style={{ color: f.color, marginLeft: 'auto', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>

              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111', marginBottom: '20px' }}>Quantity & Purpose</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={form.quantity}
                    onChange={e => set('quantity', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.quantity ? '#CC0000' : '#e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Unit</label>
                  <select value={form.unit} onChange={e => set('unit', e.target.value)} style={{ ...inputStyle }}>
                    <option value="litres">Litres</option>
                    <option value="metric tonnes">Metric Tonnes</option>
                    <option value="kilograms">Kilograms</option>
                    <option value="cylinders">Cylinders (LPG)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Purpose</label>
                <select value={form.purpose} onChange={e => set('purpose', e.target.value)} style={{ ...inputStyle }}>
                  <option value="personal">Personal Use</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="fleet">Fleet Management</option>
                  <option value="generator">Generator Fuel</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={next} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#CC0000', color: '#fff', padding: '13px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
                  Next Step <FaArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Delivery Details ── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111', marginBottom: '8px' }}>Delivery or Pickup?</h2>
              <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '24px' }}>Choose how you want to receive your fuel.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                {[
                  { id: 'delivery', label: 'Deliver to Me', sub: 'We bring it to your location', icon: FaMapMarkerAlt },
                  { id: 'pickup', label: 'Station Pickup', sub: 'Collect at any ROL station', icon: FaGasPump },
                ].map(opt => {
                  const Icon = opt.icon;
                  const sel = form.delivery_type === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => set('delivery_type', opt.id)}
                      style={{ cursor: 'pointer', backgroundColor: '#fff', border: `2px solid ${sel ? '#CC0000' : '#e5e7eb'}`, borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'border-color 0.2s', boxShadow: sel ? '0 0 0 3px rgba(204,0,0,0.1)' : 'none' }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: sel ? '#CC0000' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', transition: 'background-color 0.2s' }}>
                        <Icon size={20} style={{ color: sel ? '#fff' : '#888' }} />
                      </div>
                      <p style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: '4px' }}>{opt.label}</p>
                      <p style={{ color: '#888', fontSize: '0.78rem' }}>{opt.sub}</p>
                    </div>
                  );
                })}
              </div>

              {form.delivery_type === 'delivery' ? (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Region *</label>
                    <select value={form.delivery_region} onChange={e => set('delivery_region', e.target.value)} style={{ ...inputStyle, borderColor: errors.delivery_region ? '#CC0000' : '#e5e7eb' }}>
                      <option value="">Select region</option>
                      {ghanaRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>City / Town</label>
                    <input type="text" placeholder="e.g. Kumasi" value={form.delivery_city} onChange={e => set('delivery_city', e.target.value)} style={{ ...inputStyle }} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Delivery Address *</label>
                    <input type="text" placeholder="Street / landmark / GPS address" value={form.delivery_address} onChange={e => set('delivery_address', e.target.value)} style={{ ...inputStyle, borderColor: errors.delivery_address ? '#CC0000' : '#e5e7eb' }} />
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Preferred Station *</label>
                  <input type="text" placeholder="e.g. Bortianor Station, Accra" value={form.station} onChange={e => set('station', e.target.value)} style={{ ...inputStyle, borderColor: errors.station ? '#CC0000' : '#e5e7eb' }} />
                  <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '6px' }}>Enter your nearest Reliance Oil station or <Link to="/find-station" style={{ color: '#CC0000' }}>find a station</Link></p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Preferred Date *</label>
                  <input
                    type="date"
                    value={form.preferred_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('preferred_date', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.preferred_date ? '#CC0000' : '#e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Preferred Time</label>
                  <select value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)} style={{ ...inputStyle }}>
                    <option value="">Any time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#555', padding: '13px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <FaArrowLeft size={13} /> Back
                </button>
                <button onClick={next} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#CC0000', color: '#fff', padding: '13px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
                  Next Step <FaArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Your Details ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              {/* Order summary */}
              {selectedFuel && (
                <div style={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: selectedFuel.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <selectedFuel.icon size={18} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{selectedFuel.label}</p>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>{form.quantity} {form.unit} · {form.delivery_type === 'delivery' ? `Delivery to ${form.delivery_region}` : `Pickup at ${form.station}`}</p>
                  </div>
                  <button type="button" onClick={() => setStep(1)} style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#CC0000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                </div>
              )}

              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111', marginBottom: '20px' }}>Your Contact Details</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Full Name *</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} style={{ ...inputStyle, borderColor: errors.name ? '#CC0000' : '#e5e7eb', marginBottom: '16px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Phone Number *</label>
                  <input type="tel" placeholder="+233 xx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ ...inputStyle, borderColor: errors.phone ? '#CC0000' : '#e5e7eb', marginBottom: '16px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Email Address *</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={{ ...inputStyle, borderColor: errors.email ? '#CC0000' : '#e5e7eb', marginBottom: '16px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Company / Organisation <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="Your company name" value={form.company} onChange={e => set('company', e.target.value)} style={{ ...inputStyle, marginBottom: '16px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#444', marginBottom: '6px' }}>Additional Notes <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  rows={3}
                  placeholder="Any special instructions or requirements..."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', marginBottom: 0 }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
                {status === 'captcha' && <p style={{ color: '#CC0000', fontSize: '0.8rem', marginTop: '8px' }}>Please complete the CAPTCHA.</p>}
                {status === 'error' && <p style={{ color: '#CC0000', fontSize: '0.8rem', marginTop: '8px' }}>Something went wrong. Please try again.</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button type="button" onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#555', padding: '13px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <FaArrowLeft size={13} /> Back
                </button>
                <button type="submit" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: submitting ? '#999' : '#CC0000', color: '#fff', padding: '13px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Placing Order…' : <><FaClipboardList size={14} /> Place Order</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <div style={{ backgroundColor: '#0D0D0D', padding: '40px 24px' }}>
        <div className="rc">
          <div className="rg3">
            {[
              { icon: FaPhone, title: 'Call to Order', info: '+233 20 989 0002', sub: 'Mon–Sat, 8am–6pm' },
              { icon: FaCheckCircle, title: 'Fast Confirmation', info: 'Within 2 Hours', sub: 'We confirm every order personally' },
              { icon: FaMapMarkerAlt, title: 'Delivery Coverage', info: 'All 16 Regions', sub: 'Nationwide delivery available' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(204,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: '#CC0000' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '2px' }}>{item.title}</p>
                    <p style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>{item.info}</p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
