import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { MARKET_STATS } from '../data/constants';
import styles from './MarketStats.module.css';

export default function MarketStats() {
  const { ref, inView } = useInView(0.2);
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <motion.div
          className={styles.banner} ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
        >
          <div className={styles.topBar}>
            <span className={styles.topLabel}>India Solar Market</span>
            <span className={styles.topTitle}>The opportunity is massive — and growing every year</span>
          </div>
          <div className={styles.inner}>
            {MARKET_STATS.map((stat, i) => (
              <motion.div key={i} className={styles.stat}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <span className={styles.big}>
                  <span className={styles.bigAccent}>{stat.big.split(' ')[0]}</span>
                  {stat.big.includes(' ') ? ' ' + stat.big.split(' ').slice(1).join(' ') : ''}
                </span>
                <span className={styles.small}>{stat.small}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
