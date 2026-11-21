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
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-kicker">Capabilities / 01</span>
          <h2 className="section-title">Built for the work<br />that comes next.</h2>
          <p className="section-subtitle">
            From landing pages to full-stack SaaS platforms — every service is engineered for performance, scalability, and results.
          </p>
        </motion.div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="service-editorial-list">
            {services.map((service, i) => (
              <motion.div
                key={service._id}
                className="service-editorial-row"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <span className="service-row-number">{String(i + 1).padStart(2, '0')}</span>
                <div className="service-row-icon">{getServiceIcon(service.icon, 22)}</div>
                <div className="service-row-copy">
                  <h3>{service.title}</h3>
                  <p>{truncate(service.description, 150)}</p>
                </div>
                <div className="service-row-tech">
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
