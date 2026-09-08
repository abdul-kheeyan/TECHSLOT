import { motion } from 'framer-motion';
import { Zap, Shield, Code2, Clock, Layers, MessageSquare } from 'lucide-react';

const reasons = [
  { icon: Code2, title: 'Clean, Maintainable Code', description: 'Every line is written with scalability and readability in mind — your team can extend it without friction.' },
  { icon: Zap, title: 'Performance First', description: 'Lighthouse scores of 90+, optimized bundles, and fast API responses are standard, not optional.' },
  { icon: Shield, title: 'Security Built In', description: 'JWT auth, input validation, rate limiting, and secure headers from day one of every project.' },
  { icon: Clock, title: 'On-Time Delivery', description: 'Structured milestones, transparent progress updates, and a track record of meeting deadlines.' },
  { icon: Layers, title: 'Full-Stack Expertise', description: 'From React UI to MongoDB schemas to cloud deployment — one developer, complete ownership.' },
  { icon: MessageSquare, title: 'Clear Communication', description: 'Regular updates, no jargon overload, and a collaborative approach that keeps you in the loop.' },
];

export default function WhyChooseSection() {
  return (
    <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Why techslot.dev</span>
          <h2 className="section-title">Engineering You Can <span className="text-gradient">Trust</span></h2>
          <p className="section-subtitle">
            Not just a developer — a technical partner committed to building products that perform, scale, and impress.
          </p>
        </motion.div>

        <div className="why-grid">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              className="why-card"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className="why-icon"><item.icon size={22} /></div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
