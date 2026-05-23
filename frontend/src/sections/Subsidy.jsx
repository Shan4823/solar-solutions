import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { STATES } from '../data/constants';
import { checkEligibilityResult } from '../utils/calculator';
import styles from './Subsidy.module.css';

const TIERS = [
  { capacity: 'Up to 1 kW System', amount: '₹30,000', desc: 'Central subsidy + up to 100 free units/month', color: '#92400E', bg: '#FFFBEB', border: 'rgba(217,119,6,0.3)', glow: '#F59E0B' },
  { capacity: 'Up to 2 kW System', amount: '₹60,000', desc: 'Central subsidy + up to 200 free units/month', color: '#064E3B', bg: '#ECFDF5', border: 'rgba(5,150,105,0.3)', glow: '#10B981' },
  { capacity: '3 kW and Above',    amount: '₹78,000', desc: 'Max subsidy + 300 free units/month + state top-up', color: '#1E3A5F', bg: '#EFF6FF', border: 'rgba(59,130,246,0.3)', glow: '#3B82F6' },
];

export default function Subsidy() {
  const { ref, inView } = useInView(0.1);
  const [propType, setPropType] = useState('');
  const [state, setState] = useState('');
  const [bill, setBill] = useState('');
  const [result, setResult] = useState(null);

  return (
    <section id="subsidy" className={styles.section}>
      <div className="container" ref={ref}>
        <motion.div className={styles.head}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="section-label">PM Surya Ghar Yojana</span>
          <h2 className="section-title">Government Subsidies<br />You're Entitled To</h2>
          <p className="section-sub">Central Financial Assistance makes solar affordable for every Indian household.</p>
        </motion.div>

        <div className={styles.grid}>
          {TIERS.map((t, i) => (
            <motion.div key={i} className={styles.card}
              style={{ background: t.bg, borderColor: t.border }}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.1, ease: [0.22,1,0.36,1] }}
            >
              <div className={styles.cardGlow} style={{ background: t.glow }} />
              <span className={styles.tierTag} style={{ color: t.color }}>Tier {i+1}</span>
              <div className={styles.amount} style={{ color: t.color }}>{t.amount}</div>
              <div className={styles.capacity} style={{ color: t.color }}>{t.capacity}</div>
              <div className={styles.desc}>{t.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div className={styles.checker}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }}>
          <h3 className={styles.checkerTitle}>Check Your Eligibility</h3>
          <p className={styles.checkerSub}>Fill in your details for an instant subsidy estimate.</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Property Type</label>
              <select value={propType} onChange={e => setPropType(e.target.value)}>
                <option value="">Select type</option>
                <option value="residential">Residential (Home / Apartment)</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>State</label>
              <select value={state} onChange={e => setState(e.target.value)}>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Monthly Electricity Bill (₹)</label>
              <input type="number" placeholder="e.g. 3000" value={bill} onChange={e => setBill(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Roof Area (sq. ft.) — optional</label>
              <input type="number" placeholder="e.g. 500" />
            </div>
          </div>
          <button className={styles.checkBtn} onClick={() => setResult(checkEligibilityResult(propType, state, parseFloat(bill)||0))}>
            Check Eligibility →
          </button>

          <AnimatePresence>
            {result && (
              <motion.div className={`${styles.result} ${result.type === 'warn' ? styles.warn : styles.ok}`}
                initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                <div className={styles.resultTitle}>{result.title}</div>
                <div className={styles.resultDetail}>{result.detail}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
