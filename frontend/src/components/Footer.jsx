import { Sun } from 'lucide-react';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  Company:   ['About Us', 'Careers', 'Blog', 'Press Kit'],
  Services:  ['Residential', 'Commercial', 'Maintenance', 'Off-Grid'],
  Resources: ['Calculator', 'Subsidy Guide', 'FAQ', 'Contact'],
  Legal:     ['Privacy Policy', 'Terms of Use', 'Refund Policy'],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Sun size={16} strokeWidth={2.5} /></div>
            Solar Solutions
          </div>
          <p className={styles.brandText}>
            Making clean energy accessible to every Indian home and business. Government subsidy experts since 2018.
          </p>
          <div className={styles.certBadges}>
            {['MNRE Empanelled', 'ISO 9001:2015', 'PM Surya Ghar Partner'].map(c => (
              <span key={c} className={styles.cert}>{c}</span>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col} className={styles.col}>
            <h4>{col}</h4>
            {links.map(l => <a key={l} href="#">{l}</a>)}
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span>© {new Date().getFullYear()} Solar Solutions India Pvt. Ltd. All rights reserved.</span>
          <span>Made with <span className={styles.bottomAccent}>♥</span> for a greener India</span>
        </div>
      </div>
    </footer>
  );
}
