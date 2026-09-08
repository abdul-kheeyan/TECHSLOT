import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export default function Notification({ message, type = 'info', onClose, visible = true }) {
  const Icon = icons[type] || Info;

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`notification notification-${type}`}
          role="alert"
        >
          <Icon size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Dismiss"
              style={{ color: 'inherit', opacity: 0.7, display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
