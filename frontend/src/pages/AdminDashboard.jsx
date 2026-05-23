import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, LogOut, Users, FileText, LayoutDashboard,
  Search, CheckCircle, XCircle, Clock, ArrowLeft,
  Trash2, UserCheck, UserX, AlertTriangle, UserPlus, Eye, EyeOff,
  TrendingUp, Award, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import styles from './AdminDashboard.module.css';

/* ─────────────────────────────────────────────────────────── */
/*  ROOT COMPONENT                                             */
/* ─────────────────────────────────────────────────────────── */
export default function AdminDashboard({ onClose }) {
  const { user, logout } = useAuth();
  const [view, setView]  = useState('overview');
  const [stats, setStats] = useState(null);

  const refreshStats = useCallback(() => {
    api.adminStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => { refreshStats(); }, [refreshStats]);

  const handleLogout = () => { logout(); onClose(); };

  const NAV = [
    { id: 'overview',     icon: LayoutDashboard, label: 'Overview' },
    { id: 'applications', icon: FileText,         label: 'Applications',
      badge: stats?.pending_apps > 0 ? stats.pending_apps : null },
    { id: 'enquiries',    icon: Activity,         label: 'Enquiries' },
    { id: 'users',        icon: Users,            label: 'Users' },
    { id: 'create-admin', icon: UserPlus,         label: 'Create Admin' },
  ];

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>

          {/* Logo */}
          <div className={styles.logoBlock}>
            <div className={styles.logoGlow} />
            <div className={styles.logoIcon}><Sun size={18} strokeWidth={2.5} /></div>
            <div>
              <div className={styles.logoText}>Solar Solutions</div>
              <div className={styles.logoSub}>Admin Console</div>
            </div>
          </div>

          {/* Admin pill */}
          <div className={styles.adminPill}>
            <span className={styles.adminPillDot} />
            <span>Administrator</span>
          </div>

          {/* Nav */}
          <nav className={styles.nav}>
            {NAV.map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                className={`${styles.navBtn} ${view === id ? styles.navBtnActive : ''}`}
                onClick={() => setView(id)}
              >
                <span className={styles.navBtnIcon}><Icon size={15} /></span>
                <span className={styles.navBtnLabel}>{label}</span>
                {badge && <span className={styles.navBadge}>{badge}</span>}
                {view === id && <motion.span layoutId="navIndicator" className={styles.navIndicator} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminCard}>
            <div className={styles.adminAvatar}>{user?.full_name?.[0] || 'A'}</div>
            <div className={styles.adminMeta}>
              <div className={styles.adminName}>{user?.full_name}</div>
              <div className={styles.adminEmail}>{user?.email}</div>
            </div>
          </div>
          <div className={styles.footerBtns}>
            <button className={styles.footerBtn} onClick={() => onClose()}>
              <ArrowLeft size={14} /> Back to Site
            </button>
            <button className={`${styles.footerBtn} ${styles.footerBtnLogout}`} onClick={handleLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {view === 'overview'     && <OverviewView     key="overview"   stats={stats} setView={setView} />}
          {view === 'applications' && <ApplicationsView key="apps"       onStatsRefresh={refreshStats} />}
          {view === 'enquiries'    && <EnquiriesView    key="enquiries" />}
          {view === 'users'        && <UsersView        key="users" />}
          {view === 'create-admin' && <CreateAdminView  key="create" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SHARED HELPERS                                             */
/* ─────────────────────────────────────────────────────────── */
function PageHeader({ title, sub, children }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageSub}>{sub}</p>
      </div>
      {children && <div className={styles.pageHeaderActions}>{children}</div>}
    </div>
  );
}

function Spinner() {
  return <div className={styles.loading}><div className={styles.spinner} /></div>;
}

/* ─────────────────────────────────────────────────────────── */
/*  OVERVIEW                                                   */
/* ─────────────────────────────────────────────────────────── */
function OverviewView({ stats, setView }) {
  const statCards = [
    { label: 'Total Users',    value: stats?.total_users   ?? '—', icon: Users,        accent: '#0D7B65', bg: '#E6F5F2' },
    { label: 'Total Requests', value: stats?.total_apps    ?? '—', icon: FileText,      accent: '#E8960C', bg: '#FEF7E0' },
    { label: 'Pending Review', value: stats?.pending_apps  ?? '—', icon: Clock,         accent: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Approved',       value: stats?.approved_apps ?? '—', icon: CheckCircle,   accent: '#10B981', bg: '#ECFDF5' },
    { label: 'Rejected',       value: stats?.rejected_apps ?? '—', icon: XCircle,       accent: '#EF4444', bg: '#FEF2F2' },
  ];

  const approvalRate = stats
    ? stats.total_apps > 0
      ? Math.round((stats.approved_apps / stats.total_apps) * 100)
      : 0
    : null;

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
    >
      <PageHeader title="Dashboard Overview" sub={`Good day, ${stats ? 'here's a live snapshot.' : 'loading data…'}`} />

      {/* Stat grid */}
      <div className={styles.statGrid}>
        {statCards.map(({ label, value, icon: Icon, accent, bg }, i) => (
          <motion.div
            key={label} className={styles.statCard}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <div className={styles.statCardTop}>
              <div className={styles.statIconWrap} style={{ background: bg, color: accent }}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <TrendingUp size={13} className={styles.statTrend} style={{ color: accent }} />
            </div>
            <div className={styles.statNum} style={{ color: accent }}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
          </motion.div>
        ))}

        {/* Approval-rate card */}
        <motion.div
          className={`${styles.statCard} ${styles.statCardAccent}`}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className={styles.statCardTop}>
            <div className={styles.statIconWrap} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              <Award size={18} strokeWidth={2} />
            </div>
          </div>
          <div className={styles.statNum} style={{ color: '#fff' }}>
            {approvalRate !== null ? `${approvalRate}%` : '—'}
          </div>
          <div className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.75)' }}>Approval Rate</div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <Activity size={15} />
          Quick Actions
        </div>
        <div className={styles.quickGrid}>
          {[
            { icon: FileText, label: 'Review Applications', sub: 'Applications awaiting decision', id: 'applications', accent: '#0D7B65' },
            { icon: Users,    label: 'Manage Users',        sub: 'View, activate or remove users', id: 'users',        accent: '#E8960C' },
            { icon: UserPlus, label: 'Add Administrator',   sub: 'Create a new admin account',     id: 'create-admin', accent: '#6366F1' },
          ].map(({ icon: Icon, label, sub, id, accent }) => (
            <button key={id} className={styles.quickCard} onClick={() => setView(id)}>
              <div className={styles.quickCardIcon} style={{ background: `${accent}12`, color: accent }}>
                <Icon size={20} />
              </div>
              <div className={styles.quickCardText}>
                <div className={styles.quickCardTitle}>{label}</div>
                <div className={styles.quickCardSub}>{sub}</div>
              </div>
              <div className={styles.quickCardArrow}>→</div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  APPLICATIONS                                               */
/* ─────────────────────────────────────────────────────────── */
const APP_STATUS = {
  pending:  { label: 'Pending',  bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  approved: { label: 'Approved', bg: '#ECFDF5', color: '#064E3B', dot: '#10B981' },
  rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#7F1D1D', dot: '#EF4444' },
};

function ApplicationsView({ onStatsRefresh }) {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (filter) qs.set('status', filter);
    if (search) qs.set('search', search);
    api.allApplications(qs.toString() ? `?${qs}` : '')
      .then(setApps).catch(() => {}).finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const doStatus = async (id, status, admin_note = '') => {
    await api.updateAppStatus(id, { status, admin_note });
    load(); onStatsRefresh(); setRejectTarget(null);
  };

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
    >
      <PageHeader title="Applications" sub="Review and manage solar installation requests" />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by name, ref or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.filterTabs}>
          {[['', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']].map(([val, lbl]) => (
            <button key={val} className={`${styles.filterTab} ${filter === val ? styles.filterTabActive : ''}`} onClick={() => setFilter(val)}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['Ref #', 'Applicant', 'Type', 'Location', 'System', 'Subsidy', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(app => {
                const s = APP_STATUS[app.status] || APP_STATUS.pending;
                return (
                  <tr key={app.id}>
                    <td><span className={styles.refBadge}>{app.reference_no}</span></td>
                    <td>
                      <div className={styles.personCell}>
                        <div className={styles.personAvatar}>{app.full_name?.[0]}</div>
                        <div>
                          <div className={styles.personName}>{app.full_name}</div>
                          <div className={styles.personSub}>{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.typePill}>{app.app_type === 'commercial' ? '🏭 Comm.' : '🏠 Resi.'}</span></td>
                    <td className={styles.mutedCell}>{app.city || app.company_name || '—'}</td>
                    <td className={styles.mutedCell}>{app.system_size || '—'}</td>
                    <td className={styles.mutedCell}>{app.subsidy_amount || '—'}</td>
                    <td>
                      <span className={styles.statusPill} style={{ background: s.bg, color: s.color }}>
                        <span className={styles.statusDot} style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                    <td className={styles.mutedCell}>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className={styles.rowActions}>
                        {app.status !== 'approved' && (
                          <button className={`${styles.rowBtn} ${styles.rowBtnGreen}`} title="Approve" onClick={() => doStatus(app.id, 'approved')}>
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button className={`${styles.rowBtn} ${styles.rowBtnRed}`} title="Reject" onClick={() => setRejectTarget(app)}>
                            <XCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {apps.length === 0 && <div className={styles.emptyTable}>No applications found.</div>}
        </div>
      )}

      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            app={rejectTarget}
            onConfirm={note => doStatus(rejectTarget.id, 'rejected', note)}
            onCancel={() => setRejectTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RejectModal({ app, onConfirm, onCancel }) {
  const [note, setNote] = useState('');
  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={styles.modal} initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
        <div className={styles.modalIconWrap} style={{ background: '#FEF2F2' }}>
          <AlertTriangle size={24} color="#DC2626" />
        </div>
        <h4 className={styles.modalTitle}>Reject Application</h4>
        <p className={styles.modalBody}>
          Rejecting <strong>{app.reference_no}</strong> submitted by <strong>{app.full_name}</strong>.
          Optionally provide a reason below.
        </p>
        <textarea className={styles.modalTextarea} rows={3} placeholder="Reason for rejection (optional)…" value={note} onChange={e => setNote(e.target.value)} />
        <div className={styles.modalBtns}>
          <button className={styles.modalCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.modalDanger} onClick={() => onConfirm(note)}>Confirm Rejection</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  USERS                                                      */
/* ─────────────────────────────────────────────────────────── */
function UsersView() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    api.adminUsers(qs).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const toggle = async u => {
    await (u.is_active ? api.deactivateUser(u.id) : api.activateUser(u.id));
    load();
  };

  const remove = async id => {
    await api.deleteUser(id);
    setDeleteTarget(null); load();
  };

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
    >
      <PageHeader title="User Management" sub="View, activate, deactivate or remove users" />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['User', 'Phone', 'Applications', 'Status', 'Joined', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.personCell}>
                      <div className={styles.personAvatar} style={{ background: 'linear-gradient(135deg,#E8960C,#B5720A)' }}>{u.full_name?.[0]}</div>
                      <div>
                        <div className={styles.personName}>{u.full_name}</div>
                        <div className={styles.personSub}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.mutedCell}>{u.phone || '—'}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--slate)' }}>{u.application_count}</td>
                  <td>
                    <span className={styles.statusPill}
                      style={u.is_active
                        ? { background: '#ECFDF5', color: '#064E3B' }
                        : { background: '#FEF2F2', color: '#7F1D1D' }}>
                      <span className={styles.statusDot} style={{ background: u.is_active ? '#10B981' : '#EF4444' }} />
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        className={`${styles.rowBtn} ${u.is_active ? styles.rowBtnAmber : styles.rowBtnGreen}`}
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                        onClick={() => toggle(u)}
                      >
                        {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button className={`${styles.rowBtn} ${styles.rowBtnRed}`} title="Delete user" onClick={() => setDeleteTarget(u)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className={styles.emptyTable}>No users found.</div>}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className={styles.modalIconWrap} style={{ background: '#FEF2F2' }}>
                <Trash2 size={24} color="#DC2626" />
              </div>
              <h4 className={styles.modalTitle}>Delete User</h4>
              <p className={styles.modalBody}>
                Permanently delete <strong>{deleteTarget.full_name}</strong>? All their applications will also be removed. This cannot be undone.
              </p>
              <div className={styles.modalBtns}>
                <button className={styles.modalCancel} onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className={styles.modalDanger} onClick={() => remove(deleteTarget.id)}>Delete User</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ENQUIRIES  (public website form submissions)               */
/* ─────────────────────────────────────────────────────────── */
const ENQ_STATUS = {
  new:       { label: 'New',       bg: '#EFF6FF', color: '#1E40AF', dot: '#3B82F6' },
  contacted: { label: 'Contacted', bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  converted: { label: 'Converted', bg: '#ECFDF5', color: '#064E3B', dot: '#10B981' },
  closed:    { label: 'Closed',    bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
};

function EnquiriesView() {
  const [enqs, setEnqs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (filter) qs.set('status', filter);
    if (search) qs.set('search', search);
    api.adminEnquiries(qs.toString() ? `?${qs}` : '')
      .then(setEnqs).catch(() => {}).finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await api.updateEnquiry(id, { status });
    load();
  };

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
    >
      <PageHeader title="Website Enquiries" sub="Leads submitted from the public contact form" />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search by name, phone or reference…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.filterTabs}>
          {[['', 'All'], ['new', 'New'], ['contacted', 'Contacted'], ['converted', 'Converted'], ['closed', 'Closed']].map(([val, lbl]) => (
            <button key={val} className={`${styles.filterTab} ${filter === val ? styles.filterTabActive : ''}`} onClick={() => setFilter(val)}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['Ref #', 'Contact', 'Type', 'Location', 'Bill Range', 'Status', 'Date', 'Update Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enqs.map(enq => {
                const s = ENQ_STATUS[enq.status] || ENQ_STATUS.new;
                const displayName = enq.enquiry_type === 'commercial' ? enq.company_name : enq.name;
                const displaySub  = enq.enquiry_type === 'commercial' ? enq.contact_person : enq.email;
                return (
                  <tr key={enq.id}>
                    <td><span className={styles.refBadge}>{enq.reference_no}</span></td>
                    <td>
                      <div className={styles.personCell}>
                        <div className={styles.personAvatar} style={{ background: 'linear-gradient(135deg,#6366F1,#4F46E5)' }}>
                          {(displayName || '?')[0]}
                        </div>
                        <div>
                          <div className={styles.personName}>{displayName || '—'}</div>
                          <div className={styles.personSub}>{enq.phone}{displaySub ? ` · ${displaySub}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles.typePill}>{enq.enquiry_type === 'commercial' ? '🏭 Comm.' : '🏠 Resi.'}</span></td>
                    <td className={styles.mutedCell}>{enq.city || '—'}</td>
                    <td className={styles.mutedCell}>{enq.monthly_bill || '—'}</td>
                    <td>
                      <span className={styles.statusPill} style={{ background: s.bg, color: s.color }}>
                        <span className={styles.statusDot} style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                    <td className={styles.mutedCell}>{new Date(enq.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={enq.status}
                        onChange={e => updateStatus(enq.id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {enqs.length === 0 && <div className={styles.emptyTable}>No enquiries yet. They'll appear here when visitors fill the contact form.</div>}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CREATE ADMIN                                               */
/* ─────────────────────────────────────────────────────────── */
function CreateAdminView() {
  const [form, setForm]       = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(''); setSuccess('');
    if (!form.full_name || !form.email || !form.password) return setError('Full name, email and password are required.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await api.createAdmin({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      setSuccess(`Admin account created for ${form.email}.`);
      setForm({ full_name: '', email: '', phone: '', password: '', confirm: '' });
    } catch (e) {
      setError(e.message || 'Failed to create admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
    >
      <PageHeader title="Create Admin Account" sub="Grant administrator access to a new team member" />

      <div className={styles.caWrap}>
        <div className={styles.caCard}>
          <div className={styles.caCardHead}>
            <div className={styles.caCardIconWrap}><UserPlus size={20} /></div>
            <div>
              <div className={styles.caCardTitle}>New Administrator</div>
              <div className={styles.caCardSub}>Full dashboard access will be granted immediately</div>
            </div>
          </div>

          <div className={styles.caGrid}>
            <CaField label="Full Name *"    value={form.full_name} onChange={v => set('full_name', v)} placeholder="Admin Name" />
            <CaField label="Phone"          value={form.phone}     onChange={v => set('phone', v)}     placeholder="98765 43210" />
            <div className={styles.caSpan2}>
              <CaField label="Email Address *" type="email" value={form.email} onChange={v => set('email', v)} placeholder="admin@solarsolutions.in" />
            </div>
            <div>
              <label className={styles.caLabel}>Password *</label>
              <div className={styles.pwRow}>
                <input
                  className={styles.caInput}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                />
                <button className={styles.eyeBtn} type="button" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <CaField label="Confirm Password *" type="password" value={form.confirm} onChange={v => set('confirm', v)} placeholder="Repeat password" />
          </div>

          {error   && <div className={styles.caAlert} data-type="error"><XCircle size={15} />{error}</div>}
          {success && <div className={styles.caAlert} data-type="success"><CheckCircle size={15} />{success}</div>}

          <button className={styles.caSubmit} onClick={submit} disabled={loading}>
            {loading ? <span className={styles.btnSpinner} /> : <UserPlus size={16} />}
            {loading ? 'Creating account…' : 'Create Admin Account'}
          </button>

          <p className={styles.caHint}>⚡ The new admin can log in immediately. Share credentials through a secure channel.</p>
        </div>
      </div>
    </motion.div>
  );
}

function CaField({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className={styles.caLabel}>{label}</label>
      <input className={styles.caInput} type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
