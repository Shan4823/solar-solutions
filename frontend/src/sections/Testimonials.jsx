import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { TESTIMONIALS } from '../data/constants';
import styles from './Testimonials.module.css';

const AVATAR_COLORS = ['#0D7B65', '#1D4ED8', '#E8960C'];

export default function Testimonials() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className={styles.section}>
      <div className="container" ref={ref}>
        <motion.div className={styles.head}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="section-label">Customer Stories</span>
          <h2 className="section-title">Real People.<br />Real Savings.</h2>
        </motion.div>
        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} className={styles.card}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.22,1,0.36,1] }}>
              <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
              <p className={styles.text}>"{t.text}"</p>
              <div className={styles.author}>
                <div className={styles.avatar} style={{ background: AVATAR_COLORS[i] }}>{t.initials}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.loc}>{t.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
