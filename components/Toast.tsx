'use client';
import { useEffect } from 'react';

export default function Toast({ visible, onHide, message }: { visible: boolean; onHide: () => void; message?: string }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: 'var(--green)', color: 'var(--darker)',
      padding: '12px 20px',
      fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '1.5px',
      animation: 'slide-up 0.2s ease',
      zIndex: 9999,
      boxShadow: '0 0 20px rgba(0,255,136,0.4)',
    }}>
      {message ? message.toUpperCase() : 'COPIED TO NEURAL BUFFER'}
    </div>
  );
}
