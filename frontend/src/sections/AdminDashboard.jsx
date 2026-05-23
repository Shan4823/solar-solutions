import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdminDashboard.module.css';

const STATUS = {
  pending:  { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', label: 'Pending' },
  approved: { bg: '#ECFDF5', color: '#064E3B', dot: '#10B981', label: 'Approved' },
  rejected: { bg: '#FEF2F2', color: '#7F1D1D', dot: '#EF4444', label: 'Rejected' },
};

const STAT_ACCENTS = ['var(--slate-4)', 'var(--teal)', 'var(--amber)', 'var(--danger)'];

export default function AdminDashboard({ requests, onChangeStatus }) {
  const total = requests.length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const pending  = requests.filter(r => r.status === 'pending').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;

  const stats = [
    { label: 'Total Requests', value: total,    sub: 'All time' },
    { label: 'Approved',       value: approved, sub: '+2 this week' },
    { label: 'Pending Review', value: pending,  sub: 'Awaiting action' },
    { label: 'Rejected',       value: rejected, sub: 'This month' },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Admin Dashboard</h2>
            <p className={styles.sub}>Manage solar installation requests</p>
          </div>
          <div className={styles.adminBadge}><span className={styles.adminDot} /> Admin Mode</div>
        </div>

        <div className={styles.dashStats}>
          {stats.map((s, i) => (
            <motion.div key={i} className={styles.dashStat}
              style={{ '--accentColor': STAT_ACCENTS[i] }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <div className={styles.dsLabel}>{s.label}</div>
              <div className={styles.dsValue}>{s.value}</div>
              <div className={styles.dsSub}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>{['Request ID','Applicant','Location','System','Subsidy','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {requests.map(r => {
                  const s = STATUS[r.status];
                  return (
                    <motion.tr key={r.id}
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}>
                      <td className={styles.idCell}>{r.id}</td>
                      <td className={styles.nameCell}>{r.name}</td>
                      <td className={styles.mutedCell}>{r.loc}</td>
                      <td>{r.sys}</td>
                      <td>{r.sub}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ background: s.bg, color: s.color }}>
                          <span className={styles.statusDot} style={{ background: s.dot }} />
                          {s.label}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {r.status === 'pending' ? (
                            <>
                              <button className={`${styles.btn} ${styles.btnApprove}`} onClick={() => onChangeStatus(r.id, 'approved')}>Approve</button>
                              <button className={`${styles.btn} ${styles.btnReject}`}  onClick={() => onChangeStatus(r.id, 'rejected')}>Reject</button>
                            </>
                          ) : (
                            <button className={`${styles.btn} ${styles.btnReset}`} onClick={() => onChangeStatus(r.id, 'pending')}>Reset</button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
