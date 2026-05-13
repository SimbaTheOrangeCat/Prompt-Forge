'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Builder', icon: '⬡', href: '/' },
  { label: 'Analyzer', icon: '◈', href: '/analyzer' },
  { label: 'Library', icon: '▣', href: '/library' },
  { label: 'Guide', icon: '◉', href: '/guide' },
];

export default function TabNav() {
  const path = usePathname();

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--darker)', position: 'relative', zIndex: 9 }}>
      <div className="content-wrapper" style={{ display: 'flex', padding: '0 20px' }}>
        {tabs.map(t => {
          const active = t.href === '/' ? path === '/' : path.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
              textDecoration: 'none',
              color: active ? 'var(--cyan)' : 'var(--dim)',
              background: active ? 'var(--panel2)' : 'transparent',
              border: active ? '1px solid var(--cyan)' : '1px solid transparent',
              borderBottom: active ? '1px solid var(--panel2)' : '1px solid transparent',
              marginBottom: active ? '-1px' : '0',
              boxShadow: active ? '0 -2px 0 var(--cyan) inset, 0 0 10px rgba(0,245,255,0.15)' : 'none',
              transition: 'color 0.2s',
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
