export default function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--border)',
      padding: '16px 20px', flex: '1 1 140px',
      borderBottom: `2px solid ${color}`,
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: 'var(--dim)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '32px', color, textShadow: `0 0 12px ${color}55` }}>{value}</div>
    </div>
  );
}
