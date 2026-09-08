import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  loading = false,
  disabled = false,
  className = '',
  icon,
  iconRight,
  ...props
}) {
  const sizeMap = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem', iconSize: 14 },
    md: { padding: '0.7rem 1.5rem', fontSize: '0.9rem', gap: '0.5rem', iconSize: 16 },
    lg: { padding: '0.85rem 2rem', fontSize: '1rem', gap: '0.6rem', iconSize: 18 },
    xl: { padding: '1rem 2.5rem', fontSize: '1.1rem', gap: '0.7rem', iconSize: 20 },
  };

  const variantMap = {
    primary: {
      background: 'var(--gradient-primary)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-blue-accent)',
      border: '1px solid rgba(56,189,248,0.35)',
    },
    ghost: {
      background: 'rgba(56,189,248,0.06)',
      color: 'var(--color-text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  };

  const sz = sizeMap[size] || sizeMap.md;
  const vt = variantMap[variant] || variantMap.primary;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sz.gap,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: '9999px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.55 : 1,
    transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...vt,
  };

  const El = href ? 'a' : Tag;
  const elProps = href ? { href, ...props } : { ...props };

  return (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={{ display: 'inline-block' }}
      className={className}
    >
      <El style={style} disabled={disabled || loading} {...elProps}>
        {loading ? (
          <span style={{ width: sz.iconSize, height: sz.iconSize, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'block' }} />
        ) : icon ? (
          <span style={{ display: 'flex', alignItems: 'center', width: sz.iconSize, height: sz.iconSize }}>{icon}</span>
        ) : null}
        {children}
        {iconRight && !loading && (
          <span style={{ display: 'flex', alignItems: 'center', width: sz.iconSize, height: sz.iconSize }}>{iconRight}</span>
        )}
      </El>
    </motion.div>
  );
}
