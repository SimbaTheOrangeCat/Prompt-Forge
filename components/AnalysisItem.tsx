const severityColors: Record<string, string> = {
  warn: 'var(--yellow)',
  error: 'var(--magenta)',
  info: 'var(--cyan)',
  ok: 'var(--green)',
};

export default function AnalysisItem({
  severity, icon, title, description,
}: {
  severity: string; icon: string; title: string; description: string;
}) {
  const c = severityColors[severity] || 'var(--cyan)';
  return (
    <div style={{
      background: 'var(--panel)', border: `1px solid ${c}33`,
      padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <span style={{ color: c, fontFamily: "'Share Tech Mono', monospace", fontSize: '16px', lineHeight: 1.2 }}>{icon}</span>
      <div>
        <div style={{ color: c, fontFamily: "'Orbitron', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>{title}</div>
        <div style={{ color: 'var(--dim)', fontFamily: "'Rajdhani', sans-serif", fontSize: '14px' }}>{description}</div>
      </div>
    </div>
  );
}
