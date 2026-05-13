'use client';
import { useState, useCallback } from 'react';
import SectionLabel from '@/components/SectionLabel';
import NeonButton from '@/components/NeonButton';
import TagToggle from '@/components/TagToggle';
import RadioGroup from '@/components/RadioGroup';
import OutputBox from '@/components/OutputBox';
import Toast from '@/components/Toast';
import { buildPrompt } from '@/lib/buildPrompt';
import { copyToClipboard } from '@/lib/clipboard';

type BoosterColor = 'cyan' | 'magenta' | 'green' | 'yellow';

const boosters: { label: string; color: BoosterColor }[] = [
  { label: 'Chain-of-Thought', color: 'cyan' },
  { label: 'Few-Shot Examples', color: 'cyan' },
  { label: 'Step-by-Step', color: 'cyan' },
  { label: 'Self-Consistency', color: 'magenta' },
  { label: 'Tree-of-Thought', color: 'magenta' },
  { label: 'ReAct Reasoning', color: 'magenta' },
  { label: 'Explicit Format', color: 'green' },
  { label: 'Role Anchoring', color: 'green' },
  { label: 'Negative Constraints', color: 'yellow' },
  { label: 'Output Validation', color: 'yellow' },
];

const tones = ['Professional', 'Casual', 'Technical', 'Creative', 'Academic', 'Persuasive'];
const formats = ['Paragraph', 'Bullet points', 'Numbered list', 'JSON', 'Markdown', 'Code', 'Table'];
const models = ['Claude', 'GPT-4o', 'Gemini Pro', 'Llama 3', 'Mistral Large', 'Generic'];

const fieldStyle: React.CSSProperties = { marginBottom: '20px' };
const labelStyle: React.CSSProperties = {
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '10px', color: 'var(--magenta)',
  letterSpacing: '2px', textTransform: 'uppercase',
  display: 'block', marginBottom: '8px',
};

export default function BuilderPage() {
  const [task, setTask] = useState('');
  const [model, setModel] = useState('Claude');
  const [role, setRole] = useState('');
  const [outputFormat, setOutputFormat] = useState('Paragraph');
  const [context, setContext] = useState('');
  const [constraints, setConstraints] = useState('');
  const [tone, setTone] = useState('Professional');
  const [activeBoosters, setActiveBoosters] = useState<string[]>([]);
  const [examples, setExamples] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);

  const toggleBooster = (label: string) => {
    setActiveBoosters(prev => prev.includes(label) ? prev.filter(b => b !== label) : [...prev, label]);
  };

  const handleForge = () => {
    if (!task.trim()) {
      setError('[ ERROR: TASK FIELD IS REQUIRED — DEFINE YOUR OBJECTIVE ]');
      setResult('');
      return;
    }
    setError('');
    const prompt = buildPrompt({ task, model, role, outputFormat, context, constraints, tone, boosters: activeBoosters, examples });
    setResult(prompt);
  };

  const handleReset = () => {
    setTask(''); setModel('Claude'); setRole(''); setOutputFormat('Paragraph');
    setContext(''); setConstraints(''); setTone('Professional');
    setActiveBoosters([]); setExamples(''); setResult(''); setError('');
  };

  const handleCopy = useCallback(() => {
    if (result) copyToClipboard(result, () => setToast(true));
  }, [result]);

  return (
    <div>
      <Toast visible={toast} onHide={() => setToast(false)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="two-col">
        {/* Form */}
        <div>
          <SectionLabel>Configure Prompt Parameters</SectionLabel>

          <div style={fieldStyle}>
            <label style={labelStyle}>Task / Objective *</label>
            <input value={task} onChange={e => setTask(e.target.value)} placeholder="Describe what you want the AI to do..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldStyle }}>
            <div>
              <label style={labelStyle}>Target AI Model</label>
              <select value={model} onChange={e => setModel(e.target.value)}>
                {models.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Output Format</label>
              <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                {formats.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Role / Persona</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Expert data scientist" />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Context / Background</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3} placeholder="Provide relevant background information..." />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Constraints & Requirements</label>
            <textarea value={constraints} onChange={e => setConstraints(e.target.value)} rows={2} placeholder="Limits, exclusions, requirements..." />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tone</label>
            <RadioGroup options={tones} value={tone} onChange={setTone} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Technique Boosters</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {boosters.map(b => (
                <TagToggle key={b.label} label={b.label} color={b.color} active={activeBoosters.includes(b.label)} onToggle={() => toggleBooster(b.label)} />
              ))}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Example Input → Output</label>
            <textarea value={examples} onChange={e => setExamples(e.target.value)} rows={3} placeholder="Optional: provide examples to guide the AI..." />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <NeonButton onClick={handleForge}>⚡ Forge Prompt</NeonButton>
            <NeonButton variant="secondary" onClick={handleReset}>↺ Reset</NeonButton>
            <NeonButton variant="secondary" onClick={handleCopy} disabled={!result}>⎘ Copy Result</NeonButton>
          </div>
        </div>

        {/* Output */}
        <div>
          <SectionLabel>Compiled Output</SectionLabel>
          {error ? (
            <div className="panel-accent-top" style={{ background: 'var(--panel)', border: '1px solid var(--magenta)', padding: '20px', minHeight: '180px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: 'var(--magenta)' }}>{error}</span>
            </div>
          ) : (
            <OutputBox value={result} />
          )}

          {result && (
            <div style={{ marginTop: '12px', background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--dim)' }}>
                {result.split(/\s+/).length} WORDS · {result.length} CHARS
              </span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--green)' }}>● COMPILED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
