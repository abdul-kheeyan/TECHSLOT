import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import logoImage from '../assets/TSlogo.png';

const footerLinks = {
  Navigation: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/contact' },
  ],
  Services: [
    { label: 'Website Development', to: '/services' },
    { label: 'Full Stack Development', to: '/services' },
    { label: 'React Development', to: '/services' },
    { label: 'MERN Stack Apps', to: '/services' },
    { label: 'Backend & API', to: '/services' },
  ],
};

const EMAIL_ADDRESS = 'kheeyanport@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}`;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid rgba(56,189,248,0.08)', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand col */}
          <div>
            <Link to="/" className="footer-brand" aria-label="techslot.dev Home">
              <img src={logoImage} alt="" className="footer-brand-image" />
              <span className="footer-brand-text">techslot<span>.dev</span></span>
            </Link>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '300px' }}>
              Professional websites and software solutions for businesses, startups and ambitious brands. Let's build something great together.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              {[
                { label: 'GitHub', href: 'https://github.com/abdul-kheeyan', icon: 'github-icon' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdul-kheeyan', icon: 'linkedin-icon' },
                { label: 'Email', href: GMAIL_COMPOSE_URL, icon: Mail },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(56,189,248,0.07)',
                    border: '1px solid rgba(56,189,248,0.15)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(56,189,248,0.15)';
                    e.currentTarget.style.color = 'var(--color-blue-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(56,189,248,0.07)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {social.label === 'Email' ? (
                    <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                      <use href={`/icons.svg#${social.icon}`} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                {title}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', transition: 'color 150ms ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-blue-accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(56,189,248,0.08)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            © {year} techslot.dev. All rights reserved.
          </p>
          <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', transition: 'color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-blue-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            {EMAIL_ADDRESS}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
