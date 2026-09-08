import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getServices } from '../services/api';
import { getServiceIcon } from '../utils/helpers';
import { truncate } from '../utils/helpers';

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(({ data }) => setServices((data.data || []).slice(0, 6)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">What I Do</span>
          <h2 className="section-title">Services Built for <span className="text-gradient">Growth</span></h2>
          <p className="section-subtitle">
            From landing pages to full-stack SaaS platforms — every service is engineered for performance, scalability, and results.
          </p>
        </motion.div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="grid-3">
            {services.map((service, i) => (
              <motion.div
                key={service._id}
                className="service-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="service-icon">{getServiceIcon(service.icon, 24)}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{service.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1 }}>
                  {truncate(service.description, 140)}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--color-blue-accent)',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            View All Services <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
