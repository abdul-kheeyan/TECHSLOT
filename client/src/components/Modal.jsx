import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const maxWidth = { sm: 420, md: 560, lg: 720, xl: 900 }[size] || 560;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,9,20,0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            pointerEvents: 'none',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth,
                maxHeight: 'calc(100dvh - 2rem)',
                overflowY: 'auto',
                background: 'var(--color-bg-card)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                pointerEvents: 'auto',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(56,189,248,0.1)',
              position: 'sticky',
              top: 0,
              background: 'var(--color-bg-card)',
              zIndex: 1,
            }}>
              <h2 id="modal-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  background: 'rgba(56,189,248,0.06)',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
