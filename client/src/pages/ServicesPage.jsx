import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { getServices } from '../services/api';
import { getServiceIcon } from '../utils/helpers';
import CtaSection from '../sections/CtaSection';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getServices()
      .then(({ data }) => {
        const list = data.data || [];
        setServices(list);
        if (list.length) setActiveId(list[0]._id);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const active = services.find((s) => s._id === activeId) || services[0];

  return (
    <>
      <SEO
        title="Services"
        description="Full-stack web development services — websites, MERN applications, React development, backend APIs, and custom web applications."
        path="/services"
      />

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">Services</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
              End-to-End <span className="text-gradient">Development Services</span>
            </h1>
            <p className="section-subtitle">
              Eight specialized service modules covering every stage of your digital product — from concept to production deployment.
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : (
            <>
              <div className="grid-4" style={{ marginBottom: '3rem' }}>
                {services.map((service, i) => (
                  <motion.button
                    key={service._id}
                    className="service-card"
                    style={{
                      cursor: 'pointer',
                      textAlign: 'left',
                      border: activeId === service._id ? '1px solid rgba(56,189,248,0.4)' : undefined,
                      boxShadow: activeId === service._id ? 'var(--shadow-blue-sm)' : undefined,
                    }}
                    onClick={() => setActiveId(service._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="service-icon">{getServiceIcon(service.icon, 22)}</div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{service.title}</h3>
                  </motion.button>
                ))}
              </div>

              {active && (
                <motion.div
                  key={active._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                  style={{ padding: '2.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div className="service-icon" style={{ width: 60, height: 60 }}>
                      {getServiceIcon(active.icon, 28)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{active.title}</h2>
                      <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, maxWidth: 640 }}>{active.description}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-blue-accent)', marginBottom: '1rem' }}>
                        Deliverables
                      </h3>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {active.features.map((f) => (
                          <li key={f} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            <Check size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-blue-accent)', marginBottom: '1rem' }}>
                        Tech Stack
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {active.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                      <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(56,189,248,0.06)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(56,189,248,0.15)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                          Ideal for startups, SMEs, and enterprises looking for a reliable technical partner.
                        </p>
                        <Link
                          to="/contact"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-blue-accent)', fontWeight: 600, fontSize: '0.875rem' }}
                        >
                          Inquire about this service <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
