type Variant = 'primary' | 'secondary' | 'danger';

export default function NeonButton({
  children, onClick, variant = 'primary', disabled, style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const styles: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--cyan)', color: 'var(--darker)',
      border: '1px solid var(--cyan)',
      boxShadow: '0 0 12px rgba(0,245,255,0.3)',
    },
    secondary: {
      background: 'transparent', color: 'var(--cyan)',
      border: '1px solid var(--cyan)',
    },
    danger: {
      background: 'transparent', color: 'var(--magenta)',
      border: '1px solid var(--magenta)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 700, fontSize: '11px', letterSpacing: '1.5px',
        padding: '10px 20px', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s, box-shadow 0.2s',
        textTransform: 'uppercase',
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
