import { motion } from 'framer-motion';
import styles from './HouseIllustration.module.css';

export default function HouseIllustration() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
          <rect width="360" height="280" fill="#F0F6FF" rx="12" />
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#EFF6FF" />
            </linearGradient>
          </defs>
          <rect width="360" height="200" fill="url(#skyGrad)" rx="12" />

          {/* Animated Sun */}
          <motion.circle cx="300" cy="52" r="38" fill="rgba(253,220,100,0.25)"
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX:'300px', originY:'52px' }} />
          <motion.circle cx="300" cy="52" r="26" fill="#FBBF24"
            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ originX:'300px', originY:'52px' }} />
          <circle cx="300" cy="52" r="18" fill="#F59E0B" />

          {/* Sun rays */}
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const r = angle * Math.PI / 180;
            const x1 = 300 + Math.cos(r) * 32; const y1 = 52 + Math.sin(r) * 32;
            const x2 = 300 + Math.cos(r) * 42; const y2 = 52 + Math.sin(r) * 42;
            return <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"
              animate={{ opacity: [0.7, 0.3, 0.7] }} transition={{ duration: 2, delay: i*0.12, repeat: Infinity }} />;
          })}

          {/* Clouds */}
          <motion.g opacity="0.7" animate={{ x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <ellipse cx="60" cy="40" rx="28" ry="14" fill="white" />
            <ellipse cx="80" cy="35" rx="20" ry="13" fill="white" />
            <ellipse cx="42" cy="44" rx="18" ry="10" fill="white" />
          </motion.g>
          <motion.g opacity="0.5" animate={{ x: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
            <ellipse cx="180" cy="30" rx="22" ry="11" fill="white" />
            <ellipse cx="196" cy="26" rx="16" ry="10" fill="white" />
          </motion.g>

          {/* Ground */}
          <rect x="0" y="228" width="360" height="52" fill="#D1FAE5" />
          <rect x="0" y="228" width="360" height="7" fill="#A7F3D0" />

          {/* House body */}
          <rect x="58" y="158" width="186" height="82" fill="white" stroke="#E2E8F0" strokeWidth="1.5" rx="1" />
          {/* Roof */}
          <polygon points="38,163 151,94 264,163" fill="#1E293B" />
          <polygon points="38,163 151,94 264,163" fill="url(#roofGrad)" />
          <defs>
            <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Solar panels on roof */}
          {[
            [78,124,32,21], [115,115,32,21], [152,108,32,21],
            [189,115,32,21], [226,124,32,21]
          ].map(([x,y,w,h], i) => (
            <g key={i}>
              <motion.rect x={x} y={y} width={w} height={h} rx="2"
                fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.8"
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }} />
              <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke="#60A5FA" strokeWidth="0.6" opacity="0.5" />
              <line x1={x} y1={y+h/2} x2={x+w} y2={y+h/2} stroke="#60A5FA" strokeWidth="0.6" opacity="0.5" />
            </g>
          ))}

          {/* Energy beam from sun to panels */}
          <motion.line x1="286" y1="68" x2="230" y2="122"
            stroke="#F59E0B" strokeWidth="2" strokeDasharray="6,4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          <motion.line x1="278" y1="72" x2="195" y2="118"
            stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5,5"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />

          {/* Door */}
          <rect x="128" y="197" width="34" height="43" rx="3" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.2" />
          <circle cx="157" cy="220" r="2.5" fill="#34D399" />

          {/* Windows */}
          {[[77,174,30,26],[193,174,30,26]].map(([x,y,w,h],i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.2" />
              <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke="#7DD3FC" strokeWidth="0.8" />
              <line x1={x} y1={y+h/2} x2={x+w} y2={y+h/2} stroke="#7DD3FC" strokeWidth="0.8" />
              <motion.rect x={x+2} y={y+2} width={w-4} height={h-4} rx="2"
                fill="rgba(186,230,253,0.5)"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, delay: i*1.5, repeat: Infinity }} />
            </g>
          ))}

          {/* Inverter box */}
          <rect x="262" y="168" width="64" height="52" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
          <text x="294" y="182" fontSize="7.5" fill="#64748B" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="600">INVERTER</text>
          <motion.rect x="270" y="188" width="48" height="13" rx="3" fill="#D1FAE5"
            animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
          <text x="294" y="199" fontSize="7" fill="#059669" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="700">● ONLINE</text>
          <rect x="268" y="206" width="52" height="9" rx="2" fill="#EFF6FF" />
          <text x="294" y="214" fontSize="6.5" fill="#3B82F6" textAnchor="middle" fontFamily="Outfit,sans-serif">↑ Exporting 2.1 kW</text>

          {/* Trees */}
          <ellipse cx="26" cy="222" rx="16" ry="18" fill="#6EE7B7" opacity="0.9" />
          <ellipse cx="33" cy="214" rx="13" ry="14" fill="#34D399" />
          <rect x="30" y="224" width="5" height="8" fill="#92400E" />
          <ellipse cx="337" cy="220" rx="14" ry="16" fill="#6EE7B7" opacity="0.85" />
          <rect x="335" y="222" width="4" height="9" fill="#92400E" />

          {/* Power line to grid */}
          <motion.path d="M 326 200 Q 346 190 346 210" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeDasharray="4,3"
            animate={{ strokeDashoffset: [0, -14] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </svg>
      </div>

      <motion.div className={styles.pillGreen}
        animate={{ y: [0, -7, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
        <span className={styles.pillAmount}>₹4,200</span>
        <span className={styles.pillLabel}>Avg. Monthly Savings</span>
      </motion.div>

      <motion.div className={styles.pillSun}
        animate={{ y: [0, 7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <span className={styles.pillAmount}>₹78,000</span>
        <span className={styles.pillLabel}>Govt. Subsidy Available</span>
      </motion.div>
    </div>
  );
}
