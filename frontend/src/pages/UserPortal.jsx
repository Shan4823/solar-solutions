import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, LogOut, Plus, X, CheckCircle, Clock, XCircle,
  FileText, ArrowLeft, User, Settings, Shield, Bell,
  Eye, EyeOff, Edit3, Save, AlertTriangle,
  Phone, Mail, Calendar, Award, Zap, Trash2,
  Home, Building2, MapPin, CreditCard, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AvatarUploader from '../components/AvatarUploader';
import styles from './UserPortal.module.css';

const STATUS_MAP = {
  pending:  { color: '#92400E', bg: '#FFFBEB', dot: '#F59E0B', label: 'Pending Review',  icon: Clock },
  approved: { color: '#064E3B', bg: '#ECFDF5', dot: '#10B981', label: 'Approved',         icon: CheckCircle },
  rejected: { color: '#7F1D1D', bg: '#FEF2F2', dot: '#EF4444', label: 'Rejected',         icon: XCircle },
};

/* ─────────────────────────────────────────────────────────── */
/*  ROOT                                                       */
/* ─────────────────────────────────────────────────────────── */
export default function UserPortal({ onClose }) {
  const { user, logout, updateUser, avatar } = useAuth();
  const [view, setView]             = useState('applications');
  const [apps, setApps]             = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [showForm, setShowForm]     = useState(false);

  const fetchApps = useCallback(() => {
    setAppsLoading(true);
    api.myApplications().then(setApps).catch(() => {}).finally(() => setAppsLoading(false));
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleLogout = () => { logout(); onClose(); };

  const stats = {
    total:    apps.length,
    approved: apps.filter(a => a.status === 'approved').length,
    pending:  apps.filter(a => a.status === 'pending').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  const NAV = [
    { id: 'applications', icon: FileText, label: 'My Applications', badge: stats.pending || null },
    { id: 'profile',      icon: User,     label: 'Profile' },
    { id: 'settings',     icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div className={styles.shell} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>

          {/* Logo — click reloads page */}
          <button className={styles.logoRow} onClick={() => { onClose(); window.location.reload(); }}>
            <div className={styles.logoIcon}><Sun size={15} strokeWidth={2.5} /></div>
            <div>
              <div className={styles.logoText}>Solar Solutions</div>
              <div className={styles.logoSub}>My Account</div>
            </div>
          </button>

          {/* Avatar card — shows uploaded photo or initial */}
          <div className={styles.profileCard}>
            <div className={styles.bigAvatar}>
              {avatar
                ? <img src={avatar} alt={user?.full_name} className={styles.bigAvatarImg} />
                : <span>{user?.full_name?.[0]?.toUpperCase() || 'U'}</span>
              }
              <div className={styles.avatarRing} />
            </div>
            <div className={styles.profileName}>{user?.full_name}</div>
            <div className={styles.profileEmail}>{user?.email}</div>
            <div className={styles.rolePill}>
              <span className={styles.roleDot} />
              {user?.role === 'admin' ? 'Administrator' : 'Account Member'}
            </div>
          </div>

          {/* Quick stats */}
          <div className={styles.quickStats}>
            {[
              { label: 'Total',    value: stats.total,    color: 'var(--amber)' },
              { label: 'Approved', value: stats.approved, color: '#10B981' },
              { label: 'Pending',  value: stats.pending,  color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className={styles.qStat}>
                <div className={styles.qStatNum} style={{ color: s.color }}>{s.value}</div>
                <div className={styles.qStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Nav */}
          <nav className={styles.nav}>
            {NAV.map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                className={`${styles.navBtn} ${view === id ? styles.navBtnActive : ''}`}
                onClick={() => setView(id)}
              >
                <Icon size={15} />
                <span className={styles.navBtnLabel}>{label}</span>
                {badge > 0 && <span className={styles.navBadge}>{badge}</span>}
                {view === id && <motion.div layoutId="up-indicator" className={styles.navIndicator} />}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.footerBtn} onClick={() => onClose()}>
            <ArrowLeft size={14} /> Back to Site
          </button>
          <button className={`${styles.footerBtn} ${styles.footerBtnLogout}`} onClick={handleLogout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {view === 'applications' && (
            <ApplicationsView key="apps" apps={apps} loading={appsLoading} onNewApp={() => setShowForm(true)} />
          )}
          {view === 'profile' && (
            <ProfileView key="profile" onProfileUpdate={updateUser} />
          )}
          {view === 'settings' && (
            <SettingsView key="settings" user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showForm && <ApplicationFormModal onClose={() => { setShowForm(false); fetchApps(); }} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  APPLICATIONS VIEW                                          */
/* ─────────────────────────────────────────────────────────── */
function ApplicationsView({ apps, loading, onNewApp }) {
  const counts = {
    total:    apps.length,
    approved: apps.filter(a => a.status === 'approved').length,
    pending:  apps.filter(a => a.status === 'pending').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  return (
    <PageView
      title="My Applications"
      sub="Track all your solar installation requests"
      action={<button className={styles.primaryBtn} onClick={onNewApp}><Plus size={15} /> New Application</button>}
    >
      {/* Summary strip */}
      {apps.length > 0 && (
        <div className={styles.summaryStrip}>
          {[
            { label: 'Total',    value: counts.total,    color: '#6366F1', bg: '#EEF2FF' },
            { label: 'Approved', value: counts.approved, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Pending',  value: counts.pending,  color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Rejected', value: counts.rejected, color: '#EF4444', bg: '#FEF2F2' },
          ].map(s => (
            <div key={s.label} className={styles.summaryItem} style={{ background: s.bg }}>
              <div className={styles.summaryNum} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.summaryLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? <Spinner /> : apps.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><Zap size={32} strokeWidth={1.5} /></div>
          <h3>No applications yet</h3>
          <p>Submit your first solar installation request and track it right here.</p>
          <button className={styles.primaryBtn} onClick={onNewApp}><Plus size={15} /> Apply Now</button>
        </div>
      ) : (
        <div className={styles.appGrid}>
          {apps.map((app, i) => {
            const s = STATUS_MAP[app.status] || STATUS_MAP.pending;
            const StatusIcon = s.icon;
            return (
              <motion.div
                key={app.id} className={styles.appCard}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {/* Coloured top stripe */}
                <div className={styles.appCardStripe} style={{ background: s.dot }} />

                <div className={styles.appCardInner}>
                  <div className={styles.appCardTop}>
                    <div className={styles.appCardLeft}>
                      <div className={styles.appTypeIcon}>
                        {app.app_type === 'commercial' ? <Building2 size={16} /> : <Home size={16} />}
                      </div>
                      <div>
                        <div className={styles.refNo}>{app.reference_no}</div>
                        <div className={styles.appTypeLabel}>
                          {app.app_type === 'commercial' ? 'Commercial' : 'Residential'}
                        </div>
                      </div>
                    </div>
                    <span className={styles.statusBadge} style={{ background: s.bg, color: s.color }}>
                      <StatusIcon size={11} />
                      {s.label}
                    </span>
                  </div>

                  <div className={styles.appCardBody}>
                    {app.city          && <AppRow icon={MapPin}     label="Location"    value={app.city} />}
                    {app.company_name  && <AppRow icon={Building2}  label="Company"     value={app.company_name} />}
                    {app.system_size   && <AppRow icon={Zap}        label="System Size" value={app.system_size} />}
                    {app.subsidy_amount && <AppRow icon={CreditCard} label="Est. Subsidy" value={app.subsidy_amount} />}
                    <AppRow icon={Calendar} label="Applied"
                      value={new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                  </div>

                  {app.admin_note && app.status === 'rejected' && (
                    <div className={styles.adminNote}>
                      <AlertTriangle size={12} />
                      <span>{app.admin_note}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageView>
  );
}

function AppRow({ icon: Icon, label, value }) {
  return (
    <div className={styles.appRow}>
      <div className={styles.appRowLeft}>
        <Icon size={12} className={styles.appRowIcon} />
        <span className={styles.appRowLabel}>{label}</span>
      </div>
      <span className={styles.appRowValue}>{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PROFILE VIEW                                               */
/* ─────────────────────────────────────────────────────────── */
function ProfileView({ onProfileUpdate }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.me().then(data => {
      setProfile(data);
      // keep context in sync too
      onProfileUpdate({ full_name: data.full_name, email: data.email, phone: data.phone });
    }).catch(() => {});
  }, []);

  const startEdit = () => {
    setForm({ full_name: profile?.full_name || '', email: profile?.email || '', phone: profile?.phone || '' });
    setMsg(null);
    setEditing(true);
  };

  const save = async () => {
    if (!form.full_name.trim()) return setMsg({ type: 'error', text: 'Name is required.' });
    if (!form.email.trim())     return setMsg({ type: 'error', text: 'Email is required.' });
    setSaving(true); setMsg(null);
    try {
      const res = await api.updateProfile(form);
      // 1. Update local profile state (identity card)
      setProfile(res.user);
      // 2. Push to AuthContext so sidebar avatar/name/email update instantly
      onProfileUpdate({ full_name: res.user.full_name, email: res.user.email, phone: res.user.phone });
      setEditing(false);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const displayProfile = profile || user;
  const memberSince = displayProfile?.created_at
    ? new Date(displayProfile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <PageView title="My Profile" sub="View and manage your personal information">
      <div className={styles.profileLayout}>

        {/* ── Left: identity card ── */}
        <div className={styles.identityCard}>
          {/* Header gradient with avatar uploader */}
          <div className={styles.identityHeader}>
            <div className={styles.identityHeaderBg} />
            <div className={styles.identityAvatarWrap}>
              <AvatarUploader size={88} />
            </div>
          </div>

          <div className={styles.identityBody}>
            <div className={styles.identityName}>{displayProfile?.full_name}</div>
            <div className={styles.identityRole}>
              {displayProfile?.role === 'admin' ? '⚙️ Administrator' : '👤 Account Member'}
            </div>

            <div className={styles.identityRows}>
              <IdentityRow icon={Mail}     label="Email"        value={displayProfile?.email} />
              <IdentityRow icon={Phone}    label="Phone"        value={displayProfile?.phone || 'Not set'} />
              <IdentityRow icon={Calendar} label="Member Since" value={memberSince} />
              <IdentityRow icon={Award}    label="Account ID"   value={`#${String(displayProfile?.id || '').padStart(4, '0')}`} />
            </div>

            {!editing && (
              <button className={styles.editProfileBtn} onClick={startEdit}>
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Right: edit form or success message ── */}
        <div className={styles.profileRight}>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="edit-form"
                className={styles.editCard}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}
              >
                <div className={styles.editCardHead}>
                  <div className={styles.editCardTitle}><Edit3 size={16} /> Edit Information</div>
                  <button className={styles.iconBtn} onClick={() => { setEditing(false); setMsg(null); }}>
                    <X size={16} />
                  </button>
                </div>

                <div className={styles.editFields}>
                  <PField
                    label="Full Name *" placeholder="Your full name"
                    value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))}
                  />
                  <PField
                    label="Email Address *" placeholder="your@email.com" type="email"
                    value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}
                  />
                  <PField
                    label="Phone Number" placeholder="98765 43210"
                    value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))}
                  />
                </div>

                <Feedback msg={msg} />

                <div className={styles.editActions}>
                  <button className={styles.cancelBtn} onClick={() => { setEditing(false); setMsg(null); }}>
                    Cancel
                  </button>
                  <button className={styles.saveBtn} onClick={save} disabled={saving}>
                    {saving ? <BtnSpinner /> : <Save size={14} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="profile-info"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              >
                {/* Success message after save */}
                {msg && <Feedback msg={msg} />}

                {/* Info panels */}
                <div className={styles.infoPanel}>
                  <div className={styles.infoPanelTitle}>Account Overview</div>
                  <div className={styles.infoPanelGrid}>
                    {[
                      { icon: User,     label: 'Full Name',    value: displayProfile?.full_name },
                      { icon: Mail,     label: 'Email',        value: displayProfile?.email },
                      { icon: Phone,    label: 'Phone',        value: displayProfile?.phone || 'Not set' },
                      { icon: Calendar, label: 'Member Since', value: memberSince },
                      { icon: Award,    label: 'Account ID',   value: `#${String(displayProfile?.id || '').padStart(4,'0')}` },
                      { icon: Shield,   label: 'Account Type', value: displayProfile?.role === 'admin' ? 'Administrator' : 'Standard User' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className={styles.infoItem}>
                        <div className={styles.infoItemIcon}><Icon size={14} /></div>
                        <div>
                          <div className={styles.infoItemLabel}>{label}</div>
                          <div className={styles.infoItemValue}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className={styles.editBtnFull} onClick={startEdit}>
                  <Edit3 size={15} /> Edit Profile Information
                  <ChevronRight size={15} className={styles.editBtnArrow} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageView>
  );
}

function IdentityRow({ icon: Icon, label, value }) {
  return (
    <div className={styles.identityRow}>
      <div className={styles.identityRowIcon}><Icon size={13} /></div>
      <div>
        <div className={styles.identityRowLabel}>{label}</div>
        <div className={styles.identityRowValue}>{value}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SETTINGS VIEW                                              */
/* ─────────────────────────────────────────────────────────── */
function SettingsView({ user, onLogout }) {
  return (
    <PageView title="Settings" sub="Manage your account preferences and security">
      <div className={styles.settingsStack}>
        <PasswordSection />
        <NotificationSection />
        <SecuritySection />
        {user?.role !== 'admin' && <DangerSection onLogout={onLogout} />}
      </div>
    </PageView>
  );
}

function PasswordSection() {
  const [form, setForm]     = useState({ current: '', next: '', confirm: '' });
  const [show, setShow]     = useState({ c: false, n: false, cf: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState(null);

  const save = async () => {
    setMsg(null);
    if (!form.current || !form.next || !form.confirm)
      return setMsg({ type: 'error', text: 'All fields are required.' });
    if (form.next !== form.confirm)
      return setMsg({ type: 'error', text: 'New passwords do not match.' });
    if (form.next.length < 6)
      return setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    setSaving(true);
    try {
      await api.changePassword({ current_password: form.current, new_password: form.next });
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setForm({ current: '', next: '', confirm: '' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingCard icon={Shield} title="Change Password" sub="Use a strong password with letters, numbers and symbols">
      <div className={styles.pwGrid}>
        <PwField label="Current Password"     value={form.current}  onChange={v => setForm(f => ({...f, current: v}))}  show={show.c}  onToggle={() => setShow(s => ({...s, c: !s.c}))} />
        <PwField label="New Password"         value={form.next}     onChange={v => setForm(f => ({...f, next: v}))}      show={show.n}  onToggle={() => setShow(s => ({...s, n: !s.n}))} />
        <PwField label="Confirm New Password" value={form.confirm}  onChange={v => setForm(f => ({...f, confirm: v}))}  show={show.cf} onToggle={() => setShow(s => ({...s, cf: !s.cf}))} />
      </div>
      <Feedback msg={msg} />
      <button className={styles.saveBtn} onClick={save} disabled={saving}>
        {saving ? <BtnSpinner /> : <Shield size={14} />}
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </SettingCard>
  );
}

function NotificationSection() {
  const [prefs, setPrefs] = useState({ statusUpdates: true, newsletter: false, sms: true });
  const [saved, setSaved] = useState(false);
  const toggle = k => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <SettingCard icon={Bell} title="Notification Preferences" sub="Choose how you want to be notified">
      <div className={styles.toggleList}>
        <ToggleRow label="Application status updates" sub="Get notified when your application is approved or rejected" checked={prefs.statusUpdates} onChange={() => toggle('statusUpdates')} />
        <ToggleRow label="SMS alerts"                 sub="Receive text messages for important updates"               checked={prefs.sms}           onChange={() => toggle('sms')} />
        <ToggleRow label="Newsletter & offers"        sub="Solar tips, scheme updates and promotions"                 checked={prefs.newsletter}    onChange={() => toggle('newsletter')} />
      </div>
      <button className={styles.saveBtn} onClick={save} style={{ marginTop: '1rem' }}>
        {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Preferences</>}
      </button>
    </SettingCard>
  );
}

function SecuritySection() {
  const sessions = [
    { device: 'Chrome on Windows', location: 'Bengaluru, IN', time: 'Active now', current: true },
    { device: 'Safari on iPhone',  location: 'Bengaluru, IN', time: '2 hours ago', current: false },
  ];
  return (
    <SettingCard icon={Shield} title="Active Sessions" sub="Devices currently signed in to your account">
      <div className={styles.sessionList}>
        {sessions.map((s, i) => (
          <div key={i} className={styles.sessionRow}>
            <div className={styles.sessionEmoji}>{i === 0 ? '🖥️' : '📱'}</div>
            <div>
              <div className={styles.sessionDevice}>
                {s.device}
                {s.current && <span className={styles.currentBadge}>Current</span>}
              </div>
              <div className={styles.sessionMeta}>{s.location} · {s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </SettingCard>
  );
}

function DangerSection({ onLogout }) {
  const { logout } = useAuth();
  const [confirm, setConfirm]   = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');

  const doDelete = async () => {
    if (!password) return setError('Enter your password to confirm.');
    setDeleting(true); setError('');
    try {
      await api.deleteAccount({ password });
      logout(); onLogout();
    } catch (e) {
      setError(e.message); setDeleting(false);
    }
  };

  return (
    <SettingCard icon={Trash2} title="Danger Zone" sub="Irreversible actions — proceed with caution" danger>
      <div className={styles.dangerRow}>
        <div>
          <div className={styles.dangerLabel}>Delete Account</div>
          <div className={styles.dangerSub}>Permanently removes your account and all applications. Cannot be undone.</div>
        </div>
        {!confirm && (
          <button className={styles.dangerBtn} onClick={() => setConfirm(true)}>Delete Account</button>
        )}
      </div>

      <AnimatePresence>
        {confirm && (
          <motion.div
            className={styles.dangerConfirm}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.dangerWarning}>
              <AlertTriangle size={14} />
              Enter your password to confirm permanent deletion:
            </div>
            <div className={styles.dangerInputRow}>
              <input
                type="password" placeholder="Your current password"
                value={password} onChange={e => setPassword(e.target.value)}
                className={styles.dangerInput}
              />
              <button className={styles.dangerConfirmBtn} onClick={doDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Confirm Delete'}
              </button>
              <button className={styles.cancelBtn} onClick={() => { setConfirm(false); setError(''); setPassword(''); }}>
                Cancel
              </button>
            </div>
            {error && <div className={styles.dangerError}>{error}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </SettingCard>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  APPLICATION FORM MODAL                                     */
/* ─────────────────────────────────────────────────────────── */
function ApplicationFormModal({ onClose }) {
  const [tab, setTab]         = useState('residential');
  const [form, setForm]       = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);
  const [refNo, setRefNo]     = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    if (tab === 'residential' && !form.city)         return setError('City is required.');
    if (tab === 'commercial'  && !form.company_name) return setError('Company name is required.');
    setLoading(true);
    try {
      const res = await api.submitApplication({
        app_type: tab, ...form,
        system_size:    tab === 'commercial' ? '10+ kW' : (form.monthly_bill?.includes('5,000') ? '5 kW' : '3 kW'),
        subsidy_amount: tab === 'commercial' ? 'N/A (40% depreciation)' : '₹78,000',
      });
      setRefNo(res.reference_no);
      setDone(true);
      setTimeout(onClose, 3200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
      >
        <div className={styles.modalTopBar}>
          <div className={styles.modalTitle}><Zap size={17} /> New Application</div>
          <button className={styles.iconBtn} onClick={onClose}><X size={17} /></button>
        </div>

        {done ? (
          <div className={styles.doneState}>
            <div className={styles.doneIcon}><CheckCircle size={36} color="var(--teal)" /></div>
            <h4>Application Submitted!</h4>
            <div className={styles.doneRef}>Reference: <strong>{refNo}</strong></div>
            <p>Our team will review it within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className={styles.modalTabs}>
              {['residential','commercial'].map(t => (
                <button key={t} className={`${styles.mTab} ${tab === t ? styles.mTabActive : ''}`}
                  onClick={() => { setTab(t); setForm({}); }}>
                  {t === 'residential' ? '🏠 Residential' : '🏭 Commercial'}
                </button>
              ))}
            </div>

            <div className={styles.modalBody}>
              {tab === 'residential' ? (
                <>
                  <div className={styles.fGrid2}>
                    <MF label="City *"   placeholder="Bengaluru" value={form.city||''} onChange={v=>set('city',v)} />
                    <MS label="State"    value={form.state||''}  onChange={v=>set('state',v)}>
                      <option value="">Select state</option>
                      {['Karnataka','Gujarat','Maharashtra','Rajasthan','Tamil Nadu','Other'].map(s=><option key={s}>{s}</option>)}
                    </MS>
                  </div>
                  <div className={styles.fGrid2}>
                    <MS label="Monthly Bill" value={form.monthly_bill||''} onChange={v=>set('monthly_bill',v)}>
                      <option value="">Select range</option>
                      {['Below ₹1,000','₹1,000–₹2,000','₹2,000–₹5,000','Above ₹5,000'].map(b=><option key={b}>{b}</option>)}
                    </MS>
                    <MS label="Roof Type" value={form.roof_type||''} onChange={v=>set('roof_type',v)}>
                      <option value="">Select type</option>
                      {['RCC Flat','Sloped Tin','Terraced'].map(r=><option key={r}>{r}</option>)}
                    </MS>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.fGrid2}>
                    <MF label="Company Name *"  placeholder="TechFab Pvt Ltd" value={form.company_name||''}   onChange={v=>set('company_name',v)} />
                    <MF label="Contact Person"  placeholder="Amit Sharma"     value={form.contact_person||''} onChange={v=>set('contact_person',v)} />
                  </div>
                  <div className={styles.fGrid2}>
                    <MS label="Business Type" value={form.business_type||''} onChange={v=>set('business_type',v)}>
                      <option value="">Select type</option>
                      {['Manufacturing','Retail / Mall','Hospitality','IT / Office','Education','Other'].map(b=><option key={b}>{b}</option>)}
                    </MS>
                    <MS label="Monthly Bill" value={form.monthly_bill||''} onChange={v=>set('monthly_bill',v)}>
                      <option value="">Select range</option>
                      {['₹10K–₹50K','₹50K–₹2L','₹2L–₹5L','Above ₹5L'].map(b=><option key={b}>{b}</option>)}
                    </MS>
                  </div>
                </>
              )}
              <textarea
                className={styles.mTextarea} rows={3}
                placeholder="Additional notes (optional)…"
                value={form.notes||''} onChange={e=>set('notes',e.target.value)}
              />
            </div>

            {error && <div className={styles.mError}><AlertTriangle size={13}/>{error}</div>}

            <button className={styles.mSubmitBtn} onClick={submit} disabled={loading}>
              {loading ? <BtnSpinner /> : null}
              {loading ? 'Submitting…' : 'Submit Application →'}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SHARED UI COMPONENTS                                       */
/* ─────────────────────────────────────────────────────────── */
function PageView({ title, sub, action, children }) {
  return (
    <motion.div
      className={styles.pageView}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.26 }}
    >
      <div className={styles.pageViewHead}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageSub}>{sub}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}

function SettingCard({ icon: Icon, title, sub, children, danger }) {
  return (
    <div className={`${styles.settingCard} ${danger ? styles.settingCardDanger : ''}`}>
      <div className={styles.settingCardHead}>
        <div className={styles.settingCardIcon} style={danger ? { background: '#FEF2F2', color: '#DC2626' } : {}}>
          <Icon size={16} />
        </div>
        <div>
          <div className={styles.settingCardTitle}>{title}</div>
          <div className={styles.settingCardSub}>{sub}</div>
        </div>
      </div>
      <div className={styles.settingCardBody}>{children}</div>
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleText}>
        <div className={styles.toggleLabel}>{label}</div>
        <div className={styles.toggleSub}>{sub}</div>
      </div>
      <button
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={onChange} role="switch" aria-checked={checked}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

function PField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className={styles.pField}>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function PwField({ label, value, onChange, show, onToggle }) {
  return (
    <div className={styles.pField}>
      <label>{label}</label>
      <div className={styles.pwWrap}>
        <input type={show ? 'text' : 'password'} placeholder="••••••••" value={value} onChange={e => onChange(e.target.value)} />
        <button className={styles.eyeBtn} type="button" onClick={onToggle}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function Feedback({ msg }) {
  if (!msg) return null;
  return (
    <motion.div
      className={`${styles.feedback} ${msg.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
    >
      {msg.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span>{msg.text}</span>
    </motion.div>
  );
}

function BtnSpinner() { return <span className={styles.btnSpinner} />; }
function Spinner()    { return <div className={styles.spinnerWrap}><div className={styles.spinner} /></div>; }

function MF({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className={styles.mField}>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function MS({ label, value, onChange, children }) {
  return (
    <div className={styles.mField}>
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>{children}</select>
    </div>
  );
}
