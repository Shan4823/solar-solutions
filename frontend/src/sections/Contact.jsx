import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { CheckCircle, AlertCircle, LogIn, UserCheck } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import styles from './Contact.module.css';

const TABS = [{ id: 'residential', label: '🏠 Residential' }, { id: 'commercial', label: '🏭 Commercial' }];

export default function Contact({ onSignInClick }) {
  const { user }                  = useAuth();
  const { ref, inView }           = useInView(0.1);
  const [activeTab, setActiveTab] = useState('residential');
  const [status, setStatus]       = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg]   = useState('');
  const [refNo, setRefNo]         = useState('');
  const [isApp, setIsApp]         = useState(false); // true = saved as application
  const [form, setForm]           = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const switchTab = (tab) => {
    setActiveTab(tab);
    setForm({});
    setStatus('idle');
    setErrorMsg('');
  };

  const submit = async (type) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      if (user && user.role === 'user') {
        // ── Logged-in user → save as tracked application ──────
        const payload = {
          app_type:       type,
          city:           form.city    || null,
          state:          form.state   || null,
          monthly_bill:   form.bill    || null,
          roof_type:      form.roof    || null,
          notes:          form.notes   || null,
          company_name:   form.company || null,
          contact_person: form.contact || null,
          business_type:  form.biz     || null,
          system_size:    type === 'commercial'
            ? '10+ kW'
            : (form.bill?.includes('5,000') ? '5 kW' : '3 kW'),
          subsidy_amount: type === 'commercial' ? 'N/A (40% depreciation)' : '₹78,000',
        };
        const res = await api.submitApplication(payload);
        setRefNo(res.reference_no);
        setIsApp(true);
      } else {
        // ── Guest → save as public enquiry ────────────────────
        const payload = {
          enquiry_type:   type,
          name:           form.name    || null,
          phone:          form.phone   || null,
          email:          form.email   || null,
          city:           form.city    || null,
          notes:          form.notes   || null,
          state:          form.state   || null,
          monthly_bill:   form.bill    || null,
          roof_type:      form.roof    || null,
          company_name:   form.company || null,
          contact_person: form.contact || null,
          business_type:  form.biz     || null,
        };
        const res = await api.submitEnquiry(payload);
        setRefNo(res.reference_no);
        setIsApp(false);
      }
      setStatus('success');
      setForm({});
      setTimeout(() => setStatus('idle'), 10000);
    } catch (e) {
      setErrorMsg(e.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="request" className={styles.section}>
      <div className="container" ref={ref}>
        <div className={styles.layout}>

          {/* ── Left info panel ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label">Get Started</span>
            <h2 className="section-title">Request Your<br />Free Solar Quote</h2>
            <p className="section-sub">Our advisors respond within 24 hours with a tailored proposal for your energy needs.</p>

            <div className={styles.features}>
              {[
                'Free site survey included',
                'All subsidy paperwork handled',
                'No-obligation quote',
                'Professional installation in 2–3 days',
              ].map((f, i) => (
                <div key={i} className={styles.feature}>
                  <div className={styles.checkWrap}><CheckCircle size={13} color="var(--teal)" /></div>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Sign-in nudge for guests */}
            {!user && (
              <motion.div
                className={styles.signInNudge}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <div className={styles.nudgeIcon}><LogIn size={18} /></div>
                <div>
                  <div className={styles.nudgeTitle}>Have an account?</div>
                  <div className={styles.nudgeText}>
                    Sign in to submit a tracked application you can follow up on in your dashboard.
                  </div>
                </div>
                <button className={styles.nudgeBtn} onClick={onSignInClick}>Sign In</button>
              </motion.div>
            )}

            {/* Logged-in user badge */}
            {user && user.role === 'user' && (
              <div className={styles.loggedInBadge}>
                <UserCheck size={16} color="var(--teal)" />
                <span>Submitting as <strong>{user.full_name}</strong> — will be tracked in your account</span>
              </div>
            )}

            <div id="contact" className={styles.contactInfo}>
              {[
                ['📞', 'Phone / WhatsApp', '1800-180-3333'],
                ['✉️', 'Email', 'info@solarsolutions.in'],
              ].map(([icon, label, value], i) => (
                <div key={i} className={styles.contactItem}>
                  <div className={styles.contactIcon}>{icon}</div>
                  <div>
                    <div className={styles.contactLabel}>{label}</div>
                    <div className={styles.contactValue}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right form card ────────────────────────────── */}
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* User mode banner */}
            {user && user.role === 'user' && (
              <div className={styles.appModeBanner}>
                <CheckCircle size={14} />
                Submitting a tracked installation application
              </div>
            )}

            <div className={styles.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                  onClick={() => switchTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  className={styles.successBox}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.successIconWrap}>
                    <CheckCircle size={32} color="var(--teal)" />
                  </div>
                  <div className={styles.successTitle}>
                    {isApp ? 'Application Submitted!' : 'Enquiry Submitted!'}
                  </div>
                  <div className={styles.successRef}>Reference: <strong>{refNo}</strong></div>
                  <div className={styles.successText}>
                    {isApp
                      ? 'Your application is now tracked in your account. Our team will review it within 24 hours.'
                      : 'Our team will contact you within 24 hours with a customised solar proposal.'}
                  </div>
                  <button className={styles.successNewBtn} onClick={() => setStatus('idle')}>
                    Submit Another
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                >
                  {activeTab === 'residential'
                    ? <ResidentialForm
                        form={form} set={set}
                        onSubmit={() => submit('residential')}
                        loading={status === 'loading'}
                        user={user}
                      />
                    : <BusinessForm
                        form={form} set={set}
                        onSubmit={() => submit('commercial')}
                        loading={status === 'loading'}
                        user={user}
                      />
                  }

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        className={styles.errorBox}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Shared field helpers ─────────────────────────────────── */
function F({ label, placeholder, value, onChange, type = 'text', required, disabled }) {
  return (
    <div className={styles.field}>
      <label>{label}{required && <span className={styles.req}>*</span>}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={disabled ? styles.inputDisabled : ''}
      />
    </div>
  );
}

function S({ label, value, onChange, children, required }) {
  return (
    <div className={styles.field}>
      <label>{label}{required && <span className={styles.req}>*</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>{children}</select>
    </div>
  );
}

/* ── Residential form ─────────────────────────────────────── */
function ResidentialForm({ form, set, onSubmit, loading, user }) {
  const isLoggedIn = user && user.role === 'user';
  return (
    <div className={styles.form}>
      {/* Name & phone only shown for guests */}
      {!isLoggedIn && (
        <div className={styles.row2}>
          <F label="Full Name" required placeholder="Rajesh Kumar"  value={form.name  || ''} onChange={v => set('name',  v)} />
          <F label="Phone"     required placeholder="98765 43210"   value={form.phone || ''} onChange={v => set('phone', v)} />
        </div>
      )}
      {!isLoggedIn && (
        <F label="Email" placeholder="rajesh@example.com" value={form.email || ''} onChange={v => set('email', v)} type="email" />
      )}
      <div className={styles.row2}>
        <F label="City" required placeholder="Bengaluru" value={form.city || ''} onChange={v => set('city', v)} />
        <S label="State" value={form.state || ''} onChange={v => set('state', v)}>
          <option value="">Select state</option>
          {['Karnataka','Gujarat','Maharashtra','Uttar Pradesh','Rajasthan','Tamil Nadu','Other'].map(s => <option key={s}>{s}</option>)}
        </S>
      </div>
      <div className={styles.row2}>
        <S label="Monthly Electricity Bill" value={form.bill || ''} onChange={v => set('bill', v)}>
          <option value="">Select range</option>
          {['Below ₹1,000','₹1,000–₹2,000','₹2,000–₹5,000','Above ₹5,000'].map(b => <option key={b}>{b}</option>)}
        </S>
        <S label="Roof Type" value={form.roof || ''} onChange={v => set('roof', v)}>
          <option value="">Select type</option>
          {['RCC Flat','Sloped Tin','Terraced'].map(r => <option key={r}>{r}</option>)}
        </S>
      </div>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="Additional notes (optional)…"
        value={form.notes || ''}
        onChange={e => set('notes', e.target.value)}
      />
      <SubmitBtn label={isLoggedIn ? 'Submit Application' : 'Submit Request'} loading={loading} onClick={onSubmit} />
    </div>
  );
}

/* ── Commercial form ──────────────────────────────────────── */
function BusinessForm({ form, set, onSubmit, loading, user }) {
  const isLoggedIn = user && user.role === 'user';
  return (
    <div className={styles.form}>
      <div className={styles.row2}>
        <F label="Company Name"   required placeholder="TechFab Pvt Ltd" value={form.company || ''} onChange={v => set('company', v)} />
        <F label="Contact Person" required placeholder="Amit Sharma"     value={form.contact || ''} onChange={v => set('contact', v)} />
      </div>
      {!isLoggedIn && (
        <div className={styles.row2}>
          <F label="Phone"          required placeholder="98765 43210" value={form.phone || ''} onChange={v => set('phone', v)} />
          <F label="Business Email"           placeholder="amit@co.in" value={form.email || ''} onChange={v => set('email', v)} type="email" />
        </div>
      )}
      <div className={styles.row2}>
        <S label="Business Type" value={form.biz || ''} onChange={v => set('biz', v)}>
          <option value="">Select type</option>
          {['Manufacturing','Retail / Mall','Hospitality','IT / Office','Education','Other'].map(b => <option key={b}>{b}</option>)}
        </S>
        <S label="Monthly Bill" value={form.bill || ''} onChange={v => set('bill', v)}>
          <option value="">Select range</option>
          {['₹10K–₹50K','₹50K–₹2L','₹2L–₹5L','Above ₹5L'].map(b => <option key={b}>{b}</option>)}
        </S>
      </div>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="Facility details & energy requirements…"
        value={form.notes || ''}
        onChange={e => set('notes', e.target.value)}
      />
      <SubmitBtn label={isLoggedIn ? 'Submit Application' : 'Submit Commercial Enquiry'} loading={loading} onClick={onSubmit} />
    </div>
  );
}

function SubmitBtn({ label, loading, onClick }) {
  return (
    <button className={styles.submitBtn} onClick={onClick} disabled={loading}>
      {loading ? <><span className={styles.btnSpinner} /> Submitting…</> : <>{label} →</>}
    </button>
  );
}
