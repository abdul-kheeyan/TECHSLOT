import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Briefcase, MessageSquare, Mail, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/TSlogo.png';
import '../styles/admin.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'inquiries', label: 'Inquiries', icon: Mail },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="navbar-logo" aria-label="techslot.dev Home">
            <img className="navbar-brand-image" src={logoImage} alt="" />
            <span className="navbar-brand-text" aria-hidden="true">
              <span>techslot</span><span className="navbar-brand-dev">.dev</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
            Admin Dashboard
          </p>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className="admin-nav-item"
              onClick={() => {
                const el = document.getElementById(`admin-${id}`);
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(56,189,248,0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8, padding: '0 0.5rem' }}>
            {user?.email}
          </p>
          <button className="admin-nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
