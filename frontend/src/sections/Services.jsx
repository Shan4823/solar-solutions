import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { SERVICES } from '../data/constants';
import styles from './Services.module.css';

const BG_MAP = {
  '#FDF3E0': 'rgba(254,243,224,0.8)',
  '#D6F0E4': 'rgba(214,240,228,0.8)',
  '#DDE9F8': 'rgba(221,233,248,0.8)',
};

export default function Services() {
  const { ref, inView } = useInView(0.08);
  return (
    <section id="services" className={styles.section}>
      <div className="container" ref={ref}>
        <motion.div className={styles.head}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="section-label">Our Services</span>
          <h2 className="section-title">Everything Solar,<br />Under One Roof</h2>
          <p className="section-sub">From consultation to long-term maintenance — your complete solar partner across India.</p>
        </motion.div>
        <div className={styles.grid}>
          {SERVICES.map((s, i) => (
            <motion.div key={i} className={styles.card}
              style={{ '--cardBg': BG_MAP[s.bg] || s.bg }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: [0.22,1,0.36,1] }}
            >
              <div className={styles.icon} style={{ background: s.bg }}>{s.icon}</div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <span className={styles.arrow}>→</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
