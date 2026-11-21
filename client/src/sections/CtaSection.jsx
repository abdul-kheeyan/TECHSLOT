import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-glow" />
          <div className="cta-copy">
            <span className="section-kicker">Start a conversation</span>
            <h2>
              Have a product in mind?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Whether you need a landing page, a full-stack application, or a complete product rebuild — I&apos;m ready to turn your vision into reality.
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.9rem 2.25rem',
                background: 'var(--gradient-primary)',
                color: '#fff',
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
              }}
            >
              Start Your Project <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
