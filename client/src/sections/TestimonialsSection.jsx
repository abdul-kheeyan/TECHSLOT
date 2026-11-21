import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getTestimonials } from '../services/api';
import { getInitials } from '../utils/helpers';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(({ data }) => setTestimonials((data.data || []).slice(0, 3)))
      .catch(() => setTestimonials([]))
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
          <span className="section-kicker">Client trust / 05</span>
          <h2 className="section-title">Built around a reliable process.</h2>
          <p className="section-subtitle">
            Real feedback from businesses and founders who trusted techslot_dev with their digital products.
          </p>
        </motion.div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : testimonials.length ? (
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                className="testimonial-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, flex: 1 }}>
                  &ldquo;{t.review}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {t.clientImage ? (
                    <img src={t.clientImage} alt={t.clientName} className="testimonial-avatar" />
                  ) : (
                    <div className="testimonial-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-elevated)', fontSize: '0.8rem', fontWeight: 700 }}>
                      {getInitials(t.clientName)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.clientName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.clientRole}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="trust-editorial">
            <div>
              <span className="trust-number">1</span>
              <h3>Clear scope</h3>
              <p>Deliverables, responsibilities, timeline, and cost are agreed before development begins.</p>
            </div>
            <div>
              <span className="trust-number">2</span>
              <h3>Direct collaboration</h3>
              <p>Work directly with the developer doing the design and engineering, without account-layer overhead.</p>
            </div>
            <div>
              <span className="trust-number">3</span>
              <h3>Production ownership</h3>
              <p>Code, documentation, deployment, and handoff are treated as part of the finished product.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
