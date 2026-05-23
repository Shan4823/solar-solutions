import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { HOW_IT_WORKS } from '../data/constants';
import styles from './HowItWorks.module.css';

const ICONS = ['📋', '🔍', '📜', '⚡'];

export default function HowItWorks() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container" ref={ref}>
        <motion.div className={styles.head}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="section-label">Simple Process</span>
          <h2 className="section-title">From Quote to Power<br />in 4 Steps</h2>
          <p className="section-sub">We manage everything — site survey, government paperwork, installation, and grid connection.</p>
        </motion.div>
        <div className={styles.grid}>
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={i} className={styles.card}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22,1,0.36,1] }}
            >
              <div className={styles.topLine} />
              <div className={styles.iconWrap}>{ICONS[i]}</div>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
