import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrbitalHeroSection, { INNER_PLANETS } from '../components/OrbitalHeroSection';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Code2,
  Microscope,
  Star,
} from 'lucide-react';

const clientIcons = [BriefcaseBusiness, Code2, Building2, Microscope];

function useHeroViewport() {
  const [viewport, setViewport] = useState({ narrow: false, tablet: false });

  useEffect(() => {
    const narrowQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1100px)');
    const sync = () => setViewport({ narrow: narrowQuery.matches, tablet: tabletQuery.matches });
    sync();
    narrowQuery.addEventListener('change', sync);
    tabletQuery.addEventListener('change', sync);
    return () => {
      narrowQuery.removeEventListener('change', sync);
      tabletQuery.removeEventListener('change', sync);
    };
  }, []);

  return viewport;
}

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
  const { narrow, tablet } = useHeroViewport();

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 72px)',
        padding: 0,
        background: '#020409',
      }}
    >
      <OrbitalHeroSection
        className="hero-orbital-background"
        planets={INNER_PLANETS}
        yearSeconds={16}
        trailYears={narrow ? 6 : tablet ? 4.5 : 5}
        compress={0.5}
        maxTurns={narrow ? 3.2 : tablet ? 2.5 : 2.8}
        planeSpread={1.25}
        eccentricity={0.5}
        alignToCourse={1}
        driftSpeed={narrow ? 1.8 : tablet ? 1.4 : 1.5}
        apex={[272, 53]}
        tilt={narrow ? 45 : tablet ? 50 : 52}
        spin={252}
        roll={13.5}
        lead={narrow ? 0.08 : tablet ? 0.1 : 0.08}
        focus={narrow ? [0.62, 0.84] : tablet ? [0.7, 0.52] : [0.72, 0.5]}
        scrim={narrow ? 'none' : 'left'}
        scrimStrength={0.92}
        viewRadius={narrow ? 0.3 : tablet ? 2.7 : 1.3}
        starCount={narrow ? 650 : tablet ? 1100 : 1200}
        glow={narrow ? 0.45 : tablet ? 1 : 1.15}
        showOrbits={false}
        showSunTrack={true}
        interactive={true}
        paused={false}
        sunColor="#FFF2CC"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: narrow
            ? 'max(calc(100svh - 72px), 680px)'
            : tablet
              ? 'max(calc(100svh - 72px), 760px)'
              : 'max(calc(100svh - 72px), 680px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          overflow: 'hidden',
          background: '#020409',
        }}
      >
        <div
          className="hero-content-shell"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            minHeight: 'inherit',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 'clamp(3rem, 6vh, 4.5rem)',
            paddingBottom: 'clamp(5rem, 10vh, 7rem)',
          }}
        >
          <div
            className="container"
            style={{
              width: '100%',
              maxWidth: 'none',
              paddingLeft: narrow ? '1rem' : tablet ? '5vw' : 'clamp(2rem, 6vw, 7rem)',
              paddingRight: narrow ? '1rem' : tablet ? '5vw' : 'clamp(2rem, 6vw, 7rem)',
            }}
          >
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 0, alignItems: 'center' }}>
          {/* Left: Text */}
          <motion.div
            className="hero-copy"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '34rem', color: '#f8fafc' }}
          >
            <motion.div variants={itemVariants}>
              <span className="section-label">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-blue-accent)', display: 'inline-block' }} />
                Full-Stack Developer & UI Engineer
              </span>
            </motion.div>

            <motion.h1
              className="hero-title"
              variants={itemVariants}
              style={{ fontSize: 'clamp(2.7rem, 5.1vw, 4.25rem)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.045em', marginBottom: '1.75rem', color: '#f8fafc' }}
            >
              Building{' '}
              <span
                className="text-gradient"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 58%, #38bdf8 100%)',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Digital Experiences
              </span>
              {' '}That Drive Results.
            </motion.h1>

            <motion.p
              className="hero-description"
              variants={itemVariants}
              style={{ fontSize: 'clamp(0.98rem, 1.4vw, 1.08rem)', color: 'rgba(226,232,240,0.66)', lineHeight: 1.8, marginBottom: '2.25rem', maxWidth: 520 }}
            >
              I design and develop fast, scalable and modern websites and web applications for businesses, startups and ambitious brands. Every project is built with precision and purpose.
            </motion.p>

            <motion.div className="hero-btns" variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.25rem' }}>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  background: '#f8fafc',
                  color: '#050914',
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
                  transition: 'all 200ms ease',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.8)',
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
                  padding: '0.85rem 1.5rem',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 9999,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'all 200ms ease',
                  textDecoration: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                View My Work <ChevronRight size={16} />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div className="hero-proof" variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', paddingLeft: '0.15rem' }}>
              <div style={{ display: 'flex' }}>
                {clientIcons.map((ClientIcon, i) => (
                  <div key={ClientIcon.displayName || i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(2,4,9,0.85)', background: 'rgba(15,23,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7dd3fc', marginLeft: i > 0 ? -10 : 0 }}>
                    <ClientIcon size={14} strokeWidth={2.25} aria-hidden="true" />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.72)' }}>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>20+ clients</span> trust techslot_dev
              </p>
              <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }} aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill="currentColor" aria-hidden="true" />)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

        </div>
      </OrbitalHeroSection>
      <style>{`
        @media (min-width: 768px) and (max-width: 1100px) {
          .hero-section .hero-grid {
            grid-template-columns: minmax(0, 55fr) minmax(0, 45fr) !important;
            text-align: left !important;
          }
          .hero-section .hero-copy {
          width: 100%;
          max-width: 34rem !important;
          min-width: 0;
        }
        .hero-section .hero-title {
          font-size: clamp(2.25rem, 4.5vw, 3.25rem) !important;
        }
        .hero-section .hero-description {
          max-width: 100% !important;
          }
        .hero-section .hero-btns,
        .hero-section .hero-proof { justify-content: flex-start !important; }
        }
        @media (max-width: 767px) {
        .hero-section .hero-grid {
          grid-template-columns: minmax(0, 1fr) !important;
          text-align: left !important;
          min-width: 0;
        }
        .hero-section .hero-copy {
          width: 100%;
          max-width: 42rem !important;
          min-width: 0;
        }
        .hero-section .hero-title {
          font-size: clamp(2.35rem, 9vw, 3.5rem) !important;
        }
        .hero-section .hero-description {
          max-width: 100% !important;
        }
        .hero-section .section-label {
          max-width: 100%;
          white-space: normal;
          font-size: clamp(0.62rem, 2.4vw, 0.875rem);
          letter-spacing: 0.075em;
        }
        .hero-section .hero-btns > a {
          max-width: 100%;
        }
        .hero-section .hero-btns,
        .hero-section .hero-proof { justify-content: flex-start !important; }
        }
        @media (max-width: 640px) {
        .hero-section {
          min-height: max(calc(100svh - 72px), 680px) !important;
          }
          .hero-section .hero-content-shell {
            align-items: flex-start !important;
            padding-top: 2.75rem !important;
            padding-bottom: 3rem !important;
          }
          .hero-section .hero-grid { gap: 0 !important; }
          .hero-section .hero-title { margin-bottom: 1.5rem !important; }
          .hero-section .hero-description { margin-bottom: 2rem !important; }
          .hero-section .hero-btns { margin-bottom: 2rem !important; }
          .hero-section .hero-proof { row-gap: 0.65rem !important; }
        }
        @media (max-width: 380px) {
          .hero-section .hero-title {
            font-size: clamp(2.15rem, 10.5vw, 2.6rem) !important;
          }
          .hero-section .hero-content-shell {
            padding-top: 2rem !important;
            padding-bottom: 2.5rem !important;
          }
          .hero-section .section-label {
            padding: 0.4rem 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}
