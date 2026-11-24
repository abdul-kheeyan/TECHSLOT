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
      setNotification({ message: 'Your inquiry has been submitted. I’ll review the details and follow up directly.', type: 'success', visible: true });
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
        description="Start your project with techslot_dev. Submit a project inquiry with budget, timeline, and service details."
        path="/contact"
      />

      <section className="section contact-page" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-kicker">Project inquiry / Contact</span>
            <h1 className="section-title">Tell me what you want to build.</h1>
            <p className="section-subtitle">
              Share the goal, timeline, and useful context. A clear brief helps me understand the project and respond with the right next steps.
            </p>
          </motion.div>

          <div className="contact-grid">
            <motion.div
              className="contact-aside"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="contact-details">
                <span className="section-kicker">Direct contact</span>
                {[
                  { icon: Mail, label: 'Email', value: EMAIL_ADDRESS, href: GMAIL_COMPOSE_URL },
                  { icon: MapPin, label: 'Working location', value: 'Remote — worldwide', href: null },
                  { icon: Clock, label: 'Availability', value: 'Open to selected projects', href: null },
                ].map(({ icon: Icon, label, href }) => (
                  <div className="contact-detail" key={label}>
                    <Icon size={17} aria-hidden="true" />
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        <span>{label}</span>
                        {EMAIL_ADDRESS}
                      </a>
                    ) : (
                      <p>
                        <span>{label}</span>
                        {label === 'Working location' ? 'Remote — worldwide' : 'Open to selected projects'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="contact-aside-note">
                Every inquiry is reviewed personally. A short description is enough to begin; you do not need every technical detail defined.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="contact-form"
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
                  <label className="form-label" htmlFor="contact-name">Full Name <span>*</span></label>
                  <input
                    id="contact-name"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    value={form.name}
                    maxLength={100}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email <span>*</span></label>
                  <input
                    id="contact-email"
                    type="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    value={form.email}
                    maxLength={254}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@company.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="contact-phone">Phone (optional)</label>
                <input
                  id="contact-phone"
                  className="form-control"
                  value={form.phone}
                  maxLength={30}
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
                <label className="form-label">
                  Budget Range (USD) <span>*</span>
                </label>
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
                <label className="form-label" htmlFor="contact-message">Project Overview <span>*</span></label>
                <textarea
                  id="contact-message"
                  className={`form-control ${errors.message ? 'error' : ''}`}
                  value={form.message}
                  maxLength={5000}
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