import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { calcSolarSavings, fmt } from '../utils/calculator';
import styles from './Calculator.module.css';

const CAPACITY_OPTIONS = [
  { value: 1, label: '1 kW — Small Home' },
  { value: 2, label: '2 kW — Medium Home' },
  { value: 3, label: '3 kW — Large Home' },
  { value: 5, label: '5 kW — Villa / Small Commercial' },
  { value: 10, label: '10 kW — Commercial / Industrial' },
];
const STATE_OPTS = [
  { value: 'gujarat', label: 'Gujarat' }, { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'up', label: 'Uttar Pradesh' }, { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'karnataka', label: 'Karnataka' }, { value: 'tn', label: 'Tamil Nadu' }, { value: 'other', label: 'Other State' },
];

export default function Calculator() {
  const { ref, inView } = useInView(0.1);
  const [capacity, setCapacity] = useState(3);
  const [bill, setBill] = useState(3000);
  const [state, setState] = useState('karnataka');
  const [results, setResults] = useState(null);

  useEffect(() => { setResults(calcSolarSavings(capacity, bill)); }, [capacity, bill]);

  const rows = results ? [
    { label: 'System Cost',         value: fmt(results.totalCost),       cls: '' },
    { label: 'Govt. Subsidy',       value: `− ${fmt(results.subsidy)}`,  cls: styles.green },
    { label: 'Net Cost to You',     value: fmt(results.netCost),         cls: styles.amberV },
    { label: 'Monthly Savings',     value: `${fmt(results.monthlySavings)}/mo`, cls: styles.green },
    { label: 'Annual Savings',      value: `${fmt(results.annualSavings)}/yr`,  cls: styles.green },
    { label: 'Payback Period',      value: `${results.payback.toFixed(1)} yrs`, cls: '' },
    { label: '25-Year Net Benefit', value: fmt(results.lifetime),         cls: styles.amberV },
  ] : [];

  return (
    <section id="calculator" className={styles.wrapper}>
      <div className="container">
        <motion.div className={styles.calc} ref={ref}
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}>
          <div className={styles.header}>
            <span className={styles.label}>Solar Savings Calculator</span>
            <h2 className={styles.title}>See Your Exact Savings</h2>
            <p className={styles.sub}>Enter your details for an instant cost-benefit analysis.</p>
          </div>
          <div className={styles.layout}>
            <div className={styles.inputs}>
              <div className={styles.inputGroup}>
                <label>System Capacity</label>
                <select value={capacity} onChange={e => setCapacity(Number(e.target.value))}>
                  {CAPACITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Monthly Electricity Bill (₹)</label>
                <input type="number" value={bill} min={500} max={50000} onChange={e => setBill(Number(e.target.value))} />
              </div>
              <div className={styles.inputGroup}>
                <label>State / UT</label>
                <select value={state} onChange={e => setState(e.target.value)}>
                  {STATE_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className={styles.note}>
                💡 Based on PM Surya Ghar subsidy + avg. 4 units/kW/day solar generation
              </div>
            </div>

            <div className={styles.results}>
              <AnimatePresence mode="wait">
                {rows.map((row, i) => (
                  <motion.div key={`${capacity}-${bill}-${i}`} className={styles.resultRow}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}>
                    <span className={styles.rlabel}>{row.label}</span>
                    <span className={`${styles.rvalue} ${row.cls}`}>{row.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button className={styles.ctaBtn} onClick={() => document.querySelector('#request')?.scrollIntoView({ behavior: 'smooth' })}>
                Get a Free Detailed Quote →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
