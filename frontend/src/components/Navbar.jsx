import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, LogIn, LogOut, LayoutDashboard, User } from 'lucide-react';
import { NAV_LINKS } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ onAccountClick }) {
  const { user, avatar, logout } = useAuth();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleNav = (href) => {
    setMobileOpen(false);
    if (href.startsWith('#')) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleLogout = () => { setMobileOpen(false); logout(); };

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <a href="#hero" className={styles.logo} onClick={e => { e.preventDefault(); handleNav('#hero'); }}>
          <div className={styles.logoIcon}><Sun size={16} strokeWidth={2.5} /></div>
          <span>Solar Solutions</span>
        </a>

        <div className={styles.links}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className={styles.link}
              onClick={e => { e.preventDefault(); handleNav(link.href); }}>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <button className={styles.dashBtn} onClick={onAccountClick}>
                {/* Show avatar if available, else initial */}
                <div className={styles.navAvatar}>
                  {avatar
                    ? <img src={avatar} alt={user.full_name} className={styles.navAvatarImg} />
                    : <span>{user.full_name?.[0]?.toUpperCase() || 'U'}</span>
                  }
                </div>
                <span className={styles.navUserName}>{user.full_name?.split(' ')[0]}</span>
                {user.role === 'admin' && <span className={styles.adminChip}>Admin</span>}
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
                <LogOut size={15} /><span>Logout</span>
              </button>
            </>
          ) : (
            <button className={styles.signInBtn} onClick={onAccountClick}>
              <LogIn size={14} /> Sign In
            </button>
          )}
          <a href="#request" className={styles.cta}
            onClick={e => { e.preventDefault(); handleNav('#request'); }}>
            Get Free Quote
          </a>
        </div>

        <button className={styles.mobileBtn} onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className={styles.mobileLink}
                onClick={e => { e.preventDefault(); handleNav(link.href); }}>
                {link.label}
              </a>
            ))}
            <div className={styles.mobileDivider} />
            {user ? (
              <>
                <button className={styles.mobileLink} onClick={() => { onAccountClick(); setMobileOpen(false); }}>
                  {user.role === 'admin' ? '⚙️ Admin Dashboard' : '👤 My Account'}
                </button>
                <button className={`${styles.mobileLink} ${styles.mobileLinkLogout}`} onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <button className={styles.mobileLink} onClick={() => { onAccountClick(); setMobileOpen(false); }}>
                <LogIn size={14} /> Sign In
              </button>
            )}
            <a href="#request" className={styles.mobileCta}
              onClick={e => { e.preventDefault(); handleNav('#request'); setMobileOpen(false); }}>
              Get Free Quote →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
