import { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

import './styles/globals.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import Hero         from './sections/Hero';
import MarketStats  from './sections/MarketStats';
import HowItWorks   from './sections/HowItWorks';
import Services     from './sections/Services';
import Subsidy      from './sections/Subsidy';
import Calculator   from './sections/Calculator';
import Testimonials from './sections/Testimonials';
import FAQ          from './sections/FAQ';
import Contact      from './sections/Contact';

import AuthPage       from './pages/AuthPage';
import UserPortal     from './pages/UserPortal';
import AdminDashboard from './pages/AdminDashboard';

function AppInner() {
  const { user } = useAuth();
  const [showAuth,   setShowAuth]   = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showAdmin,  setShowAdmin]  = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const handleAuthClose = (loggedInUser) => {
    setShowAuth(false);
    if (loggedInUser) {
      // After login, stay on page so they can fill the form as logged-in user
      // Only auto-open portal/admin if they clicked account btn, not the form sign-in nudge
    }
  };

  const handleAccountClick = () => {
    if (!user) { setShowAuth(true); return; }
    if (user.role === 'admin') setShowAdmin(true);
    else setShowPortal(true);
  };

  return (
    <>
      <motion.div
        style={{
          scaleX, transformOrigin: '0%',
          position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 9999,
          background: 'linear-gradient(90deg, var(--amber) 0%, var(--teal) 100%)',
        }}
      />

      <Navbar onAccountClick={handleAccountClick} />

      <main>
        <Hero />
        <MarketStats />
        <HowItWorks />
        <Services />
        <Subsidy />
        <Calculator />
        <Testimonials />
        <FAQ />
        {/* Pass sign-in handler so the form can prompt guests to log in */}
        <Contact onSignInClick={() => setShowAuth(true)} />
      </main>

      <Footer />

      <AnimatePresence>
        {showAuth   && <AuthPage       key="auth"   onClose={handleAuthClose} />}
      </AnimatePresence>
      <AnimatePresence>
        {showPortal && <UserPortal     key="portal" onClose={() => setShowPortal(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAdmin  && <AdminDashboard key="admin"  onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
