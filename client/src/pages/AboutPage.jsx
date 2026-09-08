import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Zap, Target, Award } from 'lucide-react';
import SEO from '../components/SEO';
import CtaSection from '../sections/CtaSection';

const skills = [
  'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript',
  'JWT Auth', 'REST APIs', 'Framer Motion', 'CSS3', 'Git', 'Vite',
  'Mongoose', 'Redis', 'AWS', 'Docker', 'Socket.io', 'GraphQL',
];

const values = [
  { icon: Code2, title: 'Code Quality', description: 'Clean architecture, meaningful naming, and patterns that scale with your product.' },
  { icon: Zap, title: 'Performance', description: 'Every millisecond matters. Optimized bundles, efficient queries, and fast UX.' },
  { icon: Target, title: 'Business Focus', description: 'Technology serves the business goal — not the other way around.' },
  { icon: Award, title: 'Excellence', description: 'Pixel-perfect UI, thorough testing, and pride in every deliverable.' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description="Learn about techslot.dev — a full-stack developer and UI engineer building premium digital products for businesses and startups."
        path="/about"
      />

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 720 }}
          >
            <span className="section-label">About Me</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Engineering Digital Products with <span className="text-gradient">Purpose & Precision</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              I&apos;m a full-stack developer and UI engineer behind techslot.dev — specializing in the MERN stack, modern React applications, and production-grade backend systems. I partner with businesses, startups, and ambitious brands to turn ideas into high-performing digital products.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              With 5+ years of experience across e-commerce, SaaS, healthcare, and enterprise platforms, I bring a unique blend of technical depth and design sensibility to every project. From architecture to deployment, I own the full stack so you get one accountable partner — not a fragmented team.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '20+', label: 'Clients Worldwide' },
              { value: '5+', label: 'Years in Development' },
              { value: '15+', label: 'Technologies Mastered' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-label">Philosophy</span>
            <h2 className="section-title">Core <span className="text-gradient">Values</span></h2>
          </div>
          <div className="why-grid">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                className="why-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="why-icon"><item.icon size={22} /></div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label">Tech Stack</span>
            <h2 className="section-title">Tools & <span className="text-gradient">Technologies</span></h2>
            <p className="section-subtitle">The modern stack I use to build fast, scalable, and maintainable applications.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 800, margin: '0 auto' }}>
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                className="tech-tag"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(56,189,248,0.4)' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-blue-accent)', fontWeight: 600 }}
            >
              Let&apos;s work together <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
