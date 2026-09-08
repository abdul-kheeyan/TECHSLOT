import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Code2,
  Microscope,
  Rocket,
  Star,
} from 'lucide-react';

const clientIcons = [BriefcaseBusiness, Code2, Building2, Microscope];

const TechOrb = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
    {/* Outer glow rings */}
    <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, transparent 70%)', animation: 'pulse 4s ease-in-out infinite' }} />
    
    {/* Code window card */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{
        background: 'rgba(13,21,39,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.1)',
      }}
    >
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(56,189,248,0.1)', background: 'rgba(5,9,20,0.5)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>techslot.dev/app.jsx</span>
      </div>
      
      {/* Code content */}
      <div style={{ padding: '1.5rem 1.75rem', fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '0.8rem', lineHeight: 1.85 }}>
        {[
          { indent: 0, text: 'const ', accent: false, word: 'buildProduct', after: ' = async () => {' },
          { indent: 1, text: 'const ', accent: false, word: 'stack', after: ' = [' },
          { indent: 2, items: ['"React"', '"Node.js"', '"MongoDB"'], colors: ['#38bdf8', '#10b981', '#f59e0b'] },
          { indent: 1, text: '];', accent: false },
          { indent: 1, text: '', accent: false, word: 'await ', after: 'deploy(stack);' },
          { indent: 1, text: 'return ', accent: false, word: '"Premium Software"', after: ';', color: '#10b981' },
          { indent: 0, text: '};', accent: false },
        ].map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span style={{ color: '#4a5568', fontSize: '0.65rem', minWidth: 20, textAlign: 'right', userSelect: 'none' }}>{i + 1}</span>
            <span style={{ paddingLeft: line.indent * 20 }}>
              {line.items ? (
                line.items.map((item, j) => (
                  <span key={j}>
                    <span style={{ color: line.colors[j] }}>{item}</span>
                    {j < line.items.length - 1 && <span style={{ color: 'var(--color-text-muted)' }}>, </span>}
                  </span>
                ))
              ) : (
                <>
                  <span style={{ color: '#7c3aed' }}>{line.text}</span>
                  <span style={{ color: line.color || '#60a5fa' }}>{line.word}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{line.after}</span>
                </>
              )}
            </span>
          </motion.div>
        ))}
        
        {/* Cursor */}
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--color-blue-accent)', marginLeft: 4, borderRadius: 1, verticalAlign: 'text-bottom' }}
        />
      </div>
    </motion.div>

    {/* Floating badge cards */}
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      style={{
        position: 'absolute',
        left: -24,
        top: '35%',
        background: 'rgba(13,21,39,0.95)',
        border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: 12,
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
        <Rocket size={18} aria-hidden="true" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Fast Delivery</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>On time, every time</div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      style={{
        position: 'absolute',
        right: -24,
        bottom: '20%',
        background: 'rgba(13,21,39,0.95)',
        border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: 12,
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
        <Check size={20} strokeWidth={3} aria-hidden="true" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Clean Code</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Production ready</div>
      </div>
    </motion.div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HeroSection() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '70%', background: 'radial-gradient(ellipse at 50% 20%, rgba(37,99,235,0.12) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '50%', background: 'radial-gradient(ellipse at 100% 100%, rgba(56,189,248,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
      
      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
      }} />

      <div className="container">
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="section-label">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-blue-accent)', display: 'inline-block' }} />
                Full-Stack Developer & UI Engineer
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}
            >
              Building{' '}
              <span className="text-gradient">Digital Experiences</span>
              {' '}That Drive Results.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 520 }}
            >
              I design and develop fast, scalable and modern websites and web applications for businesses, startups and ambitious brands. Every project is built with precision and purpose.
            </motion.p>

            <motion.div className="hero-btns" variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                  transition: 'all 200ms ease',
                  textDecoration: 'none',
                }}
              >
                Start a Project <ArrowRight size={16} />
              </Link>
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid rgba(56,189,248,0.3)',
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 200ms ease',
                  textDecoration: 'none',
                }}
              >
                View My Work <ChevronRight size={16} />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div className="hero-proof" variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {clientIcons.map((ClientIcon, i) => (
                  <div key={ClientIcon.displayName || i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--color-bg-primary)', background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-accent)', marginLeft: i > 0 ? -10 : 0 }}>
                    <ClientIcon size={14} strokeWidth={2.25} aria-hidden="true" />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>20+ clients</span> trust techslot.dev
              </p>
              <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }} aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill="currentColor" aria-hidden="true" />)}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-visual"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TechOrb />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
