import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" />
      <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--color-blue-accent)', lineHeight: 1 }}>404</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          Page not found.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            background: 'var(--gradient-primary)',
            borderRadius: '9999px',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
