type DiffToken = { text: string; type: 'same' | 'added' | 'removed' };

function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

function computeDiff(original: string, optimized: string): DiffToken[] {
  const origTokens = tokenize(original);
  const optTokens = tokenize(optimized);
  const result: DiffToken[] = [];

  const origSet = new Set(origTokens);
  for (const tok of optTokens) {
    if (origSet.has(tok)) {
      result.push({ text: tok, type: 'same' });
    } else {
      result.push({ text: tok, type: 'added' });
    }
  }
  return result;
}

export default function DiffView({ original, optimized }: { original: string; optimized: string }) {
  const tokens = computeDiff(original, optimized);

  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--border)',
      padding: '16px', fontFamily: "'Share Tech Mono', monospace",
      fontSize: '12px', lineHeight: '1.8', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    }}>
      {tokens.map((tok, i) => (
        <span
          key={i}
          style={{
            background: tok.type === 'added' ? 'rgba(0,255,136,0.15)' : 'transparent',
            color: tok.type === 'added' ? 'var(--green)' : 'var(--text)',
            borderBottom: tok.type === 'added' ? '1px solid var(--green)' : 'none',
          }}
        >
          {tok.text}
        </span>
      ))}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
        <span style={{ fontSize: '10px', color: 'var(--green)' }}>
          ■ Added / Changed
        </span>
        <span style={{ fontSize: '10px', color: 'var(--dim)' }}>
          ■ Unchanged
        </span>
      </div>
    </div>
  );
}
