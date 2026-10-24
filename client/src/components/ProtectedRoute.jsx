import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, sessionError, restoreSession, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p>Verifying session...</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <p role="alert">{sessionError}</p>
        <button className="admin-filter-btn" onClick={restoreSession} type="button">
          Retry session check
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}