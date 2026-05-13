'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionLabel from '@/components/SectionLabel';
import { templates } from '@/lib/templates';

const cats = ['All Templates', 'Coding', 'Writing', 'Analysis', 'Creative', 'Business'];

export default function LibraryPage() {
  const [active, setActive] = useState('All Templates');
  const router = useRouter();

  const filtered = active === 'All Templates' ? templates : templates.filter(t => t.cat === active.toLowerCase());

  const handleClick = (text: string) => {
    sessionStorage.setItem('analyzerTemplate', text);
    router.push('/analyzer');
  };

  return (
    <div>
      <SectionLabel>Template Library</SectionLabel>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setActive(c)} style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '7px 16px',
            border: `1px solid ${active === c ? 'var(--cyan)' : 'var(--border)'}`,
            background: active === c ? 'rgba(0,245,255,0.1)' : 'transparent',
            color: active === c ? 'var(--cyan)' : 'var(--dim)',
            cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((t, i) => (
          <div
            key={i}
            onClick={() => handleClick(t.text)}
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              padding: '16px 16px 16px 20px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--cyan)';
              const bar = (e.currentTarget as HTMLDivElement).querySelector('.accent-bar') as HTMLDivElement;
              if (bar) bar.style.width = '5px';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 245, 255, 0.18)';
              const bar = (e.currentTarget as HTMLDivElement).querySelector('.accent-bar') as HTMLDivElement;
              if (bar) bar.style.width = '3px';
            }}
          >
            <div className="accent-bar" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--cyan)', transition: 'width 0.15s' }} />
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: 'var(--magenta)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{t.cat}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '15px', color: 'white', marginBottom: '8px' }}>{t.title}</div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'var(--dim)',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
            }}>{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
