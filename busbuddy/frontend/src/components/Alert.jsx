import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: { bg: 'var(--success-bg)', color: '#15803D', border: '#BBF7D0', icon: CheckCircle2 },
    error: { bg: 'var(--danger-bg)', color: '#B91C1C', border: '#FECACA', icon: AlertCircle },
    warning: { bg: 'var(--warning-bg)', color: '#B45309', border: '#FDE68A', icon: AlertCircle },
    info: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', icon: Info },
  }[type] || { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', icon: Info };

  const Icon = styles.icon;

  return (
    <div style={{
      backgroundColor: styles.bg,
      color: styles.color,
      border: `1px solid ${styles.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      fontSize: '0.9rem',
      fontWeight: '500'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Icon size={18} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
