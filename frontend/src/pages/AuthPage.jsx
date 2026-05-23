import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function AuthPage({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode]     = useState('login'); // 'login' | 'register'
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    if (mode === 'register') {
      if (!form.full_name || !form.email || !form.password)
        return setError('Please fill in all required fields.');
      if (form.password !== form.confirm)
        return setError('Passwords do not match.');
      if (form.password.length < 6)
        return setError('Password must be at least 6 characters.');
    } else {
      if (!form.email || !form.password)
        return setError('Email and password are required.');
    }

    setLoading(true);
    try {
      const user = mode === 'login'
        ? await login(form.email, form.password)
        : await register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      onClose(user);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose(null)}
    >
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left panel */}
        <div className={styles.left}>
          <div className={styles.logoWrap}>
            <div className={styles.logoIcon}><Sun size={22} strokeWidth={2.5} /></div>
            <span className={styles.logoText}>Solar Solutions</span>
          </div>
          <div className={styles.leftBody}>
            <h2 className={styles.leftTitle}>Power Your Future<br />with Solar Energy</h2>
            <p className={styles.leftSub}>Join thousands of households and businesses saving on electricity costs with government-subsidised rooftop solar.</p>
            <div className={styles.leftStats}>
              {[['₹78K', 'Max subsidy'], ['300+', 'Districts'], ['25yr', 'Panel warranty']].map(([n, l]) => (
                <div key={l} className={styles.leftStat}>
                  <div className={styles.leftStatNum}>{n}</div>
                  <div className={styles.leftStatLbl}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.leftFooter}>PM Surya Ghar · Muft Bijli Yojana</div>
        </div>

        {/* Right panel */}
        <div className={styles.right}>
          <button className={styles.closeBtn} onClick={() => onClose(null)}>
            <ArrowLeft size={16} /> Back to site
          </button>

          <div className={styles.tabs}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                className={`${styles.tab} ${mode === m ? styles.tabActive : ''}`}
                onClick={() => { setMode(m); setError(''); }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              <h3 className={styles.formTitle}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h3>
              <p className={styles.formSub}>
                {mode === 'login'
                  ? 'Sign in to track your solar installation applications.'
                  : 'Register to apply for solar installation and track progress.'}
              </p>

              <div className={styles.fields}>
                {mode === 'register' && (
                  <Field label="Full Name *" placeholder="Rajesh Kumar" value={form.full_name} onChange={v => set('full_name', v)} />
                )}
                <Field label="Email Address *" type="email" placeholder="rajesh@example.com" value={form.email} onChange={v => set('email', v)} />
                {mode === 'register' && (
                  <Field label="Phone Number" placeholder="98765 43210" value={form.phone} onChange={v => set('phone', v)} />
                )}
                <div className={styles.fieldWrap}>
                  <label className={styles.label}>Password *</label>
                  <div className={styles.pwWrap}>
                    <input
                      className={styles.input}
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submit()}
                    />
                    <button className={styles.pwEye} type="button" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {mode === 'register' && (
                  <Field label="Confirm Password *" type="password" placeholder="••••••••" value={form.confirm} onChange={v => set('confirm', v)} />
                )}
              </div>

              {error && (
                <div className={styles.error}>
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <button className={styles.submitBtn} onClick={submit} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : null}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <p className={styles.switchText}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button className={styles.switchLink} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>

              {mode === 'login' && (
                <div className={styles.demoAccounts}>
                  <div className={styles.demoTitle}>Demo Accounts</div>
                  <div className={styles.demoRow}>
                    <span>User:</span>
                    <code>user@solarsolutions.in</code>
                    <span>/ <code>User@1234</code></span>
                  </div>
                  <div className={styles.demoRow}>
                    <span>Admin:</span>
                    <code>admin@solarsolutions.in</code>
                    <span>/ <code>Admin@1234</code></span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
