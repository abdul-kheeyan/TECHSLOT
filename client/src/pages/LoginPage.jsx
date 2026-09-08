import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Sign in to the techslot.dev admin dashboard." />

      <section style={{ minHeight: 'calc(100vh - var(--navbar-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Logo size={36} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Admin Sign In</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Access the techslot.dev management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }} noValidate>
            {error && (
              <div style={{ marginBottom: '1rem' }}>
                <Notification message={error} type="error" visible={!!error} onClose={() => setError('')} />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 40 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techslot.dev"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: 40 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" loading={loading} style={{ width: '100%' }}>
              Sign In
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <Link to="/" style={{ color: 'var(--color-blue-accent)' }}>← Back to website</Link>
          </p>
        </motion.div>
      </section>
    </>
  );
}
