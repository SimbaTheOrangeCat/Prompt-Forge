export default function RadioGroup({
  options, value, onChange,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px', padding: '6px 14px',
            border: `1px solid ${value === opt ? 'var(--cyan)' : 'var(--border)'}`,
            background: value === opt ? 'rgba(0,245,255,0.1)' : 'transparent',
            color: value === opt ? 'var(--cyan)' : 'var(--dim)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
