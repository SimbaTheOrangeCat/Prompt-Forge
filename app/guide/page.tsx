import SectionLabel from '@/components/SectionLabel';

const principleColorVals = ['var(--cyan)', 'var(--magenta)', 'var(--green)', 'var(--yellow)', 'var(--orange)'];

const principles = [
  { title: 'Be Specific', description: 'Vague prompts yield vague outputs. Define exactly what you want, how you want it, and in what format.' },
  { title: 'Assign a Role', description: 'Persona anchoring significantly improves response quality. Start with "You are a [specific expert]..."' },
  { title: 'Use Examples', description: 'Few-shot prompting — providing 1-3 input/output examples — dramatically increases alignment with your expectations.' },
  { title: 'Chain Reasoning', description: 'Add "Think step by step" to activate chain-of-thought. Complex tasks benefit massively — accuracy can improve 30-50%.' },
  { title: 'Define Constraints', description: 'Negative constraints ("Do NOT include jargon") are as powerful as positive ones. Set word limits, exclude irrelevant topics.' },
];

const techniques = [
  { label: 'ZERO-SHOT', color: 'var(--cyan)', desc: 'Direct instruction, no examples. Best for simple, well-defined tasks.' },
  { label: 'FEW-SHOT', color: 'var(--magenta)', desc: '1-5 input→output examples before your actual request. Calibrates format and style.' },
  { label: 'CHAIN-OF-THOUGHT', color: 'var(--green)', desc: "Ask the model to reason out loud. Add \"Let's think step by step.\"" },
  { label: 'TREE-OF-THOUGHT', color: 'var(--yellow)', desc: 'Request multiple reasoning paths and evaluate the best one.' },
  { label: 'REACT PATTERN', color: 'var(--cyan)', desc: 'Reasoning + Acting interleaved. "Think, then act, observe, repeat."' },
  { label: 'SELF-CONSISTENCY', color: 'var(--magenta)', desc: 'Ask the same question multiple ways and synthesize the most consistent answer.' },
  { label: 'ROLE + CONTEXT + TASK', color: 'var(--green)', desc: 'The universal prompt structure: Who → Context → What → How.' },
];

const anatomy = [
  { key: 'ROLE', color: 'var(--cyan)', val: 'You are a {expert type} specializing in {domain}.' },
  { key: 'CONTEXT', color: 'var(--magenta)', val: '{Background info, constraints, audience}.' },
  { key: 'TASK', color: 'var(--green)', val: '{Specific action verb + exact objective}.' },
  { key: 'FORMAT', color: 'var(--yellow)', val: 'Output as {format} with {length/structure}.' },
  { key: 'EXAMPLES', color: 'var(--orange)', val: 'Input: {...} → Output: {...}' },
];

export default function GuidePage() {
  return (
    <div>
      <SectionLabel>Prompt Engineering Guide</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="two-col">
        {/* Left: Principles */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--dim)', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Core Principles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {principles.map((p, i) => (
              <div key={i} style={{
                background: 'var(--panel)', border: `1px solid ${principleColorVals[i]}33`,
                padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
              }}>
                <span style={{ color: principleColorVals[i], fontFamily: "'Share Tech Mono', monospace", fontSize: '16px' }}>▸</span>
                <div>
                  <div style={{ color: principleColorVals[i], fontFamily: "'Orbitron', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ color: 'var(--dim)', fontFamily: "'Rajdhani', sans-serif", fontSize: '14px' }}>{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Techniques + Anatomy */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--dim)', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>Techniques Reference</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {techniques.map((t, i) => (
              <div key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', padding: '10px 14px', background: 'var(--panel)', border: '1px solid var(--border)' }}>
                <span style={{ color: t.color }}>▸ {t.label}</span>
                <span style={{ color: 'var(--dim)' }}> — {t.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--dim)', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>Prompt Anatomy</div>
          <div className="panel-accent-top" style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '20px', position: 'relative' }}>
            {anatomy.map((a, i) => (
              <div key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', marginBottom: i < anatomy.length - 1 ? '10px' : 0 }}>
                <span style={{ color: a.color, display: 'inline-block', width: '90px' }}>[{a.key}]</span>
                <span style={{ color: 'var(--dim)' }}> → {a.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
