export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px', color: 'var(--magenta)',
        letterSpacing: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        // {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,0,170,0.3), transparent)' }} />
    </div>
  );
}
