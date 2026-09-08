import { motion } from 'framer-motion';
import { Search, PenTool, Code, TestTube, Rocket, HeadphonesIcon } from 'lucide-react';

const steps = [
  { number: '01', title: 'Discovery', description: 'Understanding your goals, audience, and technical requirements through detailed consultation.', icon: Search },
  { number: '02', title: 'Planning', description: 'Architecture design, wireframes, tech stack selection, and project roadmap creation.', icon: PenTool },
  { number: '03', title: 'Development', description: 'Clean, modular code with regular progress updates and milestone deliveries.', icon: Code },
  { number: '04', title: 'Testing', description: 'Rigorous QA across devices, browsers, and performance benchmarks before launch.', icon: TestTube },
  { number: '05', title: 'Deployment', description: 'Production deployment with CI/CD, monitoring, and performance optimization.', icon: Rocket },
  { number: '06', title: 'Support', description: 'Post-launch maintenance, updates, and ongoing technical support when you need it.', icon: HeadphonesIcon },
];

export default function ProcessSection() {
  return (
    <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">How It Works</span>
          <h2 className="section-title">A Proven <span className="text-gradient">6-Step Process</span></h2>
          <p className="section-subtitle">
            Every project follows a structured workflow designed to deliver exceptional results on time and on budget.
          </p>
        </motion.div>

        <div className="process-grid">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="process-step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className="process-number">{step.number}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <step.icon size={18} color="var(--color-blue-accent)" />
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{step.title}</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
