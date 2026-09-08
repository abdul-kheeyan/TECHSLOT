export default function Badge({ children, variant = 'accent', className = '' }) {
  const variants = {
    accent: 'badge-accent',
    blue: 'badge-blue',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  return (
    <span className={`badge ${variants[variant] || variants.accent} ${className}`}>
      {children}
    </span>
  );
}
