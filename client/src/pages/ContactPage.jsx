import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import Notification from '../components/Notification';
import Button from '../components/Button';
import { submitContact } from '../services/api';
import {
  BUDGET_OPTIONS, TIMELINE_OPTIONS, PROJECT_TYPE_OPTIONS,
} from '../utils/helpers';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
};

const EMAIL_ADDRESS = 'kheeyanport@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}`;

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.projectType) errs.projectType = 'Select a project type';
    if (!form.budget) errs.budget = 'Select a budget range';
    if (!form.timeline) errs.timeline = 'Select a timeline';
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await submitContact(form);
      setNotification({ message: 'Your inquiry has been submitted! I\'ll get back to you within 24 hours.', type: 'success', visible: true });
      setForm(initialForm);
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Failed to submit. Please try again.',
        type: 'error',
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Start your project with techslot.dev. Submit a project inquiry with budget, timeline, and service details."
        path="/contact"
      />

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">Contact</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Start Your <span className="text-gradient">Project</span>
            </h1>
            <p className="section-subtitle">
              Tell me about your project and I&apos;ll respond within 24 hours with a tailored plan and quote.
            </p>
          </motion.div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Get in Touch</h3>
                {[
                  { icon: Mail, label: EMAIL_ADDRESS, href: GMAIL_COMPOSE_URL },
                  { icon: MapPin, label: 'Remote — Worldwide', href: null },
                  { icon: Clock, label: 'Response within 24h', href: null },
                ].map(({ icon: Icon, label, href }) => (
                  <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="service-icon" style={{ width: 40, height: 40 }}><Icon size={18} /></div>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</a>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                All inquiries are reviewed personally. No automated responses — just a real conversation about your project.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="card"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              noValidate
            >
              {notification.visible && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <Notification
                    message={notification.message}
                    type={notification.type}
                    visible={notification.visible}
                    onClose={() => setNotification((n) => ({ ...n, visible: false }))}
                  />
                </div>
              )}

              <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span>*</span></label>
                  <input
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span>*</span></label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@company.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone (optional)</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Project Type <span>*</span></label>
                <div className="option-selector">
                  {PROJECT_TYPE_OPTIONS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`option-selector-item ${form.projectType === type ? 'selected' : ''}`}
                      onClick={() => setField('projectType', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.projectType && <span className="form-error">{errors.projectType}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Budget Range <span>*</span></label>
                <div className="option-selector">
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`option-selector-item ${form.budget === b ? 'selected' : ''}`}
                      onClick={() => setField('budget', b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {errors.budget && <span className="form-error">{errors.budget}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Timeline <span>*</span></label>
                <div className="option-selector">
                  {TIMELINE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`option-selector-item ${form.timeline === t ? 'selected' : ''}`}
                      onClick={() => setField('timeline', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.timeline && <span className="form-error">{errors.timeline}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Project Overview <span>*</span></label>
                <textarea
                  className={`form-control ${errors.message ? 'error' : ''}`}
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                  placeholder="Describe your project goals, features, and any specific requirements..."
                  rows={5}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <Button type="submit" loading={loading} icon={<Send size={16} />}>
                Submit Inquiry
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}