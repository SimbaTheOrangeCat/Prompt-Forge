type TagColor = 'cyan' | 'magenta' | 'green' | 'yellow';

const colorMap: Record<TagColor, string> = {
  cyan: 'var(--cyan)',
  magenta: 'var(--magenta)',
  green: 'var(--green)',
  yellow: 'var(--yellow)',
};

export default function TagToggle({
  label, color, active, onToggle,
}: {
  label: string; color: TagColor; active: boolean; onToggle: () => void;
}) {
  const c = colorMap[color];
  return (
    <button
      onClick={onToggle}
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px', padding: '5px 12px',
        border: `1px solid ${c}`,
        background: active ? `${c}22` : 'transparent',
        color: active ? c : 'var(--dim)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        letterSpacing: '0.5px',
      }}
    >
      {label}
    </button>
  );
}
