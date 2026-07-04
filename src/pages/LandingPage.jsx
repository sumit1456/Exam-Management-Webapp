import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, GraduationCap, Info, X, BookOpen, Users, Award, ChevronRight, CheckCircle } from 'lucide-react';


const FEATURES = [
  'Online exam applications',
  'Real-time result publishing',
  'Hall ticket generation',
  'Multi-region management',
];

const LandingPage = () => {
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={s.root}>
      {/* ── Left panel ── */}
      <div style={{ ...s.left, background: 'linear-gradient(145deg, #090d16 0%, #0d1629 50%, #15223e 100%)' }}>
        {/* Grid overlay */}
        <div style={s.grid} />

        {/* Content */}
        <div style={s.leftContent}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={s.logoRow}
          >
            <div style={s.logoIcon}>
              <BookOpen size={22} color="#fff" />
            </div>
            <span style={s.logoText}>UEMS · Exam Portal</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p style={s.eyebrow}>Maharashtra Rajya Pariksha Mandal</p>
            <h1 style={s.headline}>
              Unified <br />
              <span style={s.headlineAccent}>Examination</span><br />
              Management
            </h1>
            <p style={s.sub}>
              A centralised platform for conducting, managing, and publishing
              results for state-level Hindi examinations.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={s.featureList}
          >
            {FEATURES.map(f => (
              <li key={f} style={s.featureItem}>
                <CheckCircle size={14} style={{ color: '#93c5fd', flexShrink: 0 }} />
                <span>{f}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={s.right}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={s.rightInner}
        >
          <div style={s.rightHeader}>
            <h2 style={s.rightTitle}>Select Your Portal</h2>
            <p style={s.rightSub}>Choose how you'd like to access the system</p>
          </div>

          {/* ── Staff Card ── */}
          <div style={{ position: 'relative' }}>
            <motion.div
              whileHover={{ y: -3 }}
              onHoverStart={() => setHoveredCard('staff')}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => setShowAdminInfo(v => !v)}
              style={{
                ...s.portalCard,
                ...(hoveredCard === 'staff' ? s.portalCardHover : {}),
                ...(showAdminInfo ? s.portalCardActive : {}),
              }}
            >
              <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg,#3b5bdb,#4c84ff)' }}>
                <ShieldCheck size={28} color="#fff" />
              </div>
              <div style={s.portalText}>
                <p style={s.portalTitle}>Staff Portal</p>
                <p style={s.portalDesc}>For Admins &amp; Exam Officers — full management access</p>
              </div>
              <motion.div
                animate={{ rotate: showAdminInfo ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={18} style={{ color: '#94a3b8' }} />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {showAdminInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={s.infoPanel}>
                    <button
                      onClick={() => setShowAdminInfo(false)}
                      style={s.infoClose}
                    >
                      <X size={13} />
                    </button>
                    <div style={s.infoRow}>
                      <Info size={15} style={{ color: '#4361ee', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p style={s.infoTitle}>Admin &amp; Exam Officer use the same portal</p>
                        <p style={s.infoHint}>Select your role on the next screen to authenticate.</p>
                      </div>
                    </div>
                    <div style={s.credBox}>
                      <div style={s.credRow}><span style={s.credKey}>Admin</span><span style={s.credVal}>admin / admin123</span></div>
                      <div style={s.credRow}><span style={s.credKey}>Officer</span><span style={s.credVal}>exam_officer1 / officer123</span></div>
                    </div>
                    <Link to="/admin" style={s.infoBtn}>
                      Go to Staff Portal <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Student Card ── */}
          <div style={{ position: 'relative' }}>
            <motion.div
              whileHover={{ y: -3 }}
              onHoverStart={() => setHoveredCard('student')}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => setShowStudentInfo(v => !v)}
              style={{
                ...s.portalCard,
                ...(hoveredCard === 'student' ? s.portalCardHover : {}),
                ...(showStudentInfo ? s.portalCardActive : {}),
              }}
            >
              <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg,#3b5bdb,#4c84ff)' }}>
                <GraduationCap size={28} color="#fff" />
              </div>
              <div style={s.portalText}>
                <p style={s.portalTitle}>Student Portal</p>
                <p style={s.portalDesc}>View exams, apply, download hall tickets &amp; results</p>
              </div>
              <motion.div
                animate={{ rotate: showStudentInfo ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={18} style={{ color: '#94a3b8' }} />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {showStudentInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={s.infoPanel}>
                    <button
                      onClick={() => setShowStudentInfo(false)}
                      style={s.infoClose}
                    >
                      <X size={13} />
                    </button>
                    <div style={s.infoRow}>
                      <Info size={15} style={{ color: '#4361ee', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p style={s.infoTitle}>Login with your registered email and password</p>
                      </div>
                    </div>
                    <div style={s.credBox}>
                      <div style={s.credRow}><span style={s.credKey}>Email</span><span style={s.credVal}>rahuljoshi123@gmail.com</span></div>
                      <div style={s.credRow}><span style={s.credKey}>Password</span><span style={s.credVal}>student123</span></div>
                    </div>
                    <Link to="/student" style={s.infoBtn}>
                      Go to Student Portal <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer note */}
          <p style={s.footNote}>
            © 2026 Maharashtra Rajya Pariksha Mandal. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

/* ── Styles ── */
const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    overflow: 'hidden',
  },

  /* Left panel */
  left: {
    flex: '0 0 46%',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '56px 52px',
  },


  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  leftContent: { position: 'relative', zIndex: 1 },

  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em', textTransform: 'uppercase' },

  eyebrow: { fontSize: 11, fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 },
  headline: { fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.12, margin: '0 0 16px', letterSpacing: '-0.02em' },
  headlineAccent: { color: '#60a5fa' },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 340, margin: 0 },

  featureList: { listStyle: 'none', padding: 0, margin: '28px 0', display: 'flex', flexDirection: 'column', gap: 10 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 },

  statsRow: {
    display: 'flex', alignItems: 'stretch', gap: 0,
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: '18px 8px',
    marginTop: 8,
  },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' },
  statLabel: { fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'center' },
  statDivider: { width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch', margin: '0 4px' },

  /* Right panel */
  right: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    overflowY: 'auto',
  },
  rightInner: { width: '100%', maxWidth: 420 },
  rightHeader: { marginBottom: 32 },
  rightTitle: { fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' },
  rightSub: { fontSize: 13, color: '#64748b', margin: 0, fontWeight: 500 },

  /* Portal cards */
  portalCard: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '18px 20px',
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 14,
    cursor: 'pointer',
    marginBottom: 12,
    transition: 'border-color 0.18s, box-shadow 0.18s',
    userSelect: 'none',
  },
  portalCardHover: {
    borderColor: '#93c5fd',
    boxShadow: '0 4px 20px rgba(66,133,244,0.1)',
  },
  portalCardActive: {
    borderColor: '#4361ee',
    boxShadow: '0 4px 20px rgba(67,97,238,0.12)',
    marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    borderBottom: 'none',
  },

  portalIcon: {
    width: 52, height: 52, borderRadius: 12, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  portalText: { flex: 1 },
  portalTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' },
  portalDesc: { fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 },

  /* Info panel */
  infoPanel: {
    background: '#eef2ff', border: '1.5px solid #c7d2fe',
    borderTop: 'none',
    borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
    padding: '16px 20px 18px',
    marginBottom: 12,
    position: 'relative',
  },
  infoClose: {
    position: 'absolute', top: 10, right: 12,
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6366f1', padding: 2,
  },
  infoRow: { display: 'flex', gap: 10, marginBottom: 12 },
  infoTitle: { fontSize: 12, fontWeight: 700, color: '#312e81', margin: '0 0 2px' },
  infoHint: { fontSize: 11, color: '#4338ca', margin: 0 },
  credBox: {
    background: '#fff', border: '1px solid #e0e7ff',
    borderRadius: 8, padding: '10px 12px',
    marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6,
  },
  credRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  credKey: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4361ee' },
  credVal: { fontSize: 11, fontFamily: 'monospace', color: '#334155', fontWeight: 600 },
  infoBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    width: '100%', padding: '10px 0', borderRadius: 9,
    background: 'linear-gradient(135deg,#3b5bdb,#4c84ff)',
    color: '#fff', fontSize: 12, fontWeight: 800,
    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em',
    boxShadow: '0 4px 14px rgba(67,97,238,0.35)',
    boxSizing: 'border-box',
  },

  footNote: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 32, fontWeight: 500 },
};
