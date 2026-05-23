import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { FAQS } from '../data/constants';
import { Plus } from 'lucide-react';
import styles from './FAQ.module.css';

export default function FAQ() {
  const { ref, inView } = useInView(0.1);
  const [open, setOpen] = useState(null);
  return (
    <section className={styles.section}>
      <div className="container" ref={ref}>
        <motion.div className={styles.head}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Questions We Get<br />All the Time</h2>
        </motion.div>
        <div className={styles.list}>
          {FAQS.map((faq, i) => (
            <motion.div key={i} className={styles.item}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}>
              <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <motion.div className={styles.iconWrap} animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <Plus size={16} />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div key="ans" className={styles.answer}
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
