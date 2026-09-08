import { Link } from 'react-router-dom';

const LogoMark = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="logoGradA" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e3a5f"/>
        <stop offset="60%" stopColor="#2563eb"/>
      </linearGradient>
      <linearGradient id="logoGradB" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2563eb"/>
        <stop offset="100%" stopColor="#38bdf8"/>
      </linearGradient>
    </defs>
    {/* Left chevron ribbon - deep navy */}
    <path
      d="M6 50 L18 16 L30 30 L22 30 L14 50 Z"
      fill="url(#logoGradA)"
    />
    {/* Connecting diamond */}
    <path
      d="M22 30 L30 30 L38 20 L30 20 Z"
      fill="url(#logoGradA)"
    />
    {/* Upward arrow shaft - electric blue */}
    <path
      d="M30 44 L30 20 L44 20"
      stroke="url(#logoGradB)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Arrow head */}
    <path
      d="M36 8 L58 8 L58 30"
      stroke="url(#logoGradB)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M44 20 L58 8"
      stroke="url(#logoGradB)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <Link to="/" className={`navbar-logo ${className}`} aria-label="techslot.dev Home">
      <LogoMark size={size} />
      {showText && (
        <span style={{ fontSize: size < 30 ? '1.1rem' : '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
          <span style={{ color: '#ffffff' }}>techslot</span>
          <span style={{ background: 'linear-gradient(135deg, #2563eb, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>.dev</span>
        </span>
      )}
    </Link>
  );
}