import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_STATS } from '../data/constants';
import HouseIllustration from '../components/HouseIllustration';
import styles from './Hero.module.css';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease },
});

export default function Hero() {
  const nav = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.gridLines} />
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <div className={`${styles.inner} container`}>
        <div className={styles.left}>
          <motion.div className={styles.badge} {...fadeUp(0.05)}>
            <span className={styles.badgeDot} />
            PM Surya Ghar · Muft Bijli Yojana
          </motion.div>

          <motion.h1 className={styles.title} {...fadeUp(0.18)}>
            Power India with<br />
            <span className={styles.highlightWrap}>
              <span className={styles.highlight}>Clean Solar</span>
              <svg className={styles.underlineSvg} viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M2,8 Q50,2 100,6 Q150,10 198,4" />
              </svg>
            </span>
            <br />Energy
          </motion.h1>

          <motion.p className={styles.sub} {...fadeUp(0.3)}>
            End-to-end rooftop solar for homes & businesses. Government subsidies up to{' '}
            <strong>₹78,000</strong>. We handle everything — survey, paperwork, installation.
          </motion.p>

          <motion.div className={styles.actions} {...fadeUp(0.42)}>
            <a href="#calculator" className="btn-primary" onClick={(e) => { e.preventDefault(); nav('#calculator'); }}>
              Calculate Savings <ArrowRight size={16} />
            </a>
            <a href="#request" className="btn-secondary" onClick={(e) => { e.preventDefault(); nav('#request'); }}>
              Free Site Survey
            </a>
          </motion.div>

          <motion.div className={styles.stats} {...fadeUp(0.56)}>
            {HERO_STATS.map((s, i) => (
              <div key={i} className={styles.stat}>
                {i === 0 && <div className={styles.statAccent} />}
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLbl}>{s.lbl}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
        >
          <HouseIllustration />
        </motion.div>
      </div>
    </section>
  );
}
