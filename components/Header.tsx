'use client';
import { useEffect, useState } from 'react';

export default function Header() {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClock(`CLK: ${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--darker)',
      position: 'relative',
      zIndex: 10,
    }}>
      <div className="content-wrapper" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--magenta)', letterSpacing: '3px', marginBottom: '4px', textTransform: 'uppercase' }}>
            Neural Prompt Architecture v2.4
          </div>
          <div className="logo-title" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: '28px', color: 'white', lineHeight: 1 }}>
            PROMPT<span style={{ color: 'var(--cyan)', textShadow: '0 0 18px rgba(0,245,255,0.5)' }}>//</span>FORGE
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'var(--dim)', marginTop: '4px' }}>
            AI prompt engineering system
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginBottom: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--green)',
              animation: 'pulse-dot 2s ease-in-out infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'var(--green)', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: 'var(--cyan)' }}>{clock}</div>
        </div>
      </div>
    </header>
  );
}
