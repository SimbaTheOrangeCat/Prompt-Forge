export default function OutputBox({ value, placeholder }: { value: string; placeholder?: string }) {
  return (
    <div className="panel-accent-top" style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      minHeight: '180px',
      padding: '20px',
      position: 'relative',
    }}>
      {value ? (
        <pre style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '13px',
          color: 'var(--text)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.7,
        }}>{value}</pre>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '140px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '12px',
          color: 'var(--dim)',
          textAlign: 'center',
        }}>
          {placeholder || '[ AWAITING COMPILATION — CONFIGURE PARAMETERS AND FORGE ]'}
        </div>
      )}
    </div>
  );
}
