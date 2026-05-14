'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionLabel from '@/components/SectionLabel';
import NeonButton from '@/components/NeonButton';
import TagToggle from '@/components/TagToggle';
import RadioGroup from '@/components/RadioGroup';
import OutputBox from '@/components/OutputBox';
import Toast from '@/components/Toast';
import { buildPrompt } from '@/lib/buildPrompt';
import { copyToClipboard } from '@/lib/clipboard';
import { exportAsTxt, exportAsMd } from '@/lib/export';
import { buildShareUrl, decodeConfig } from '@/lib/share';

type BoosterColor = 'cyan' | 'magenta' | 'green' | 'yellow';

const defaultBoosters: { label: string; color: BoosterColor }[] = [
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

function BuilderInner() {
  const searchParams = useSearchParams();
  const [task, setTask] = useState('');
  const [model, setModel] = useState('Claude');
  const [role, setRole] = useState('');
  const [outputFormat, setOutputFormat] = useState('Paragraph');
  const [context, setContext] = useState('');
  const [constraints, setConstraints] = useState('');
  const [tone, setTone] = useState('Professional');
  const [activeBoosters, setActiveBoosters] = useState<string[]>([]);
  const [customBoosters, setCustomBoosters] = useState<string[]>([]);
  const [newBooster, setNewBooster] = useState('');
  const [examples, setExamples] = useState('');
  const [result, setResult] = useState('');
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const share = searchParams.get('share');
    if (share) {
      const cfg = decodeConfig(share);
      if (cfg) {
        setTask(cfg.task); setModel(cfg.model); setRole(cfg.role);
        setOutputFormat(cfg.outputFormat); setContext(cfg.context);
        setConstraints(cfg.constraints); setTone(cfg.tone);
        setActiveBoosters(cfg.boosters); setExamples(cfg.examples);
      }
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('customBoosters') : null;
    if (saved) setCustomBoosters(JSON.parse(saved));
  }, [searchParams]);

  // Live preview
  useEffect(() => {
    if (!task.trim()) { setResult(''); return; }
    setResult(buildPrompt({ task, model, role, outputFormat, context, constraints, tone, boosters: activeBoosters, examples }));
  }, [task, model, role, outputFormat, context, constraints, tone, activeBoosters, examples]);

  const toggleBooster = (label: string) => {
    setActiveBoosters(prev => prev.includes(label) ? prev.filter(b => b !== label) : [...prev, label]);
  };

  const addCustomBooster = () => {
    const label = newBooster.trim();
    if (!label || customBoosters.includes(label)) return;
    const updated = [...customBoosters, label];
    setCustomBoosters(updated);
    localStorage.setItem('customBoosters', JSON.stringify(updated));
    setNewBooster('');
  };

  const removeCustomBooster = (label: string) => {
    const updated = customBoosters.filter(b => b !== label);
    setCustomBoosters(updated);
    localStorage.setItem('customBoosters', JSON.stringify(updated));
    setActiveBoosters(prev => prev.filter(b => b !== label));
  };

  const handleReset = () => {
    setTask(''); setModel('Claude'); setRole(''); setOutputFormat('Paragraph');
    setContext(''); setConstraints(''); setTone('Professional');
    setActiveBoosters([]); setExamples(''); setResult('');
  };

  const showToast = (msg: string) => { setToastMsg(msg); setToast(true); };

  const handleCopy = useCallback(() => {
    if (result) copyToClipboard(result, () => showToast('Copied to clipboard'));
  }, [result]);

  const handleShare = () => {
    const url = buildShareUrl({ task, model, role, outputFormat, context, constraints, tone, boosters: activeBoosters, examples });
    copyToClipboard(url, () => showToast('Share link copied'));
  };

  const allBoosters = [
    ...defaultBoosters,
    ...customBoosters.map(label => ({ label, color: 'cyan' as BoosterColor })),
  ];

  return (
    <div>
      <Toast visible={toast} onHide={() => setToast(false)} message={toastMsg} />

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
              {allBoosters.map(b => (
                <div key={b.label} style={{ position: 'relative' }}>
                  <TagToggle label={b.label} color={b.color} active={activeBoosters.includes(b.label)} onToggle={() => toggleBooster(b.label)} />
                  {customBoosters.includes(b.label) && (
                    <button
                      onClick={() => removeCustomBooster(b.label)}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--magenta)', border: 'none', color: 'white', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                value={newBooster}
                onChange={e => setNewBooster(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomBooster()}
                placeholder="Add custom booster..."
                style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
              />
              <NeonButton variant="secondary" onClick={addCustomBooster} style={{ padding: '6px 12px', fontSize: '10px' }}>+ Add</NeonButton>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Example Input → Output</label>
            <textarea value={examples} onChange={e => setExamples(e.target.value)} rows={3} placeholder="Optional: provide examples to guide the AI..." />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <NeonButton variant="secondary" onClick={handleReset}>↺ Reset</NeonButton>
            <NeonButton variant="secondary" onClick={handleCopy} disabled={!result}>⎘ Copy</NeonButton>
            <NeonButton variant="secondary" onClick={() => result && exportAsTxt(result)} disabled={!result}>↓ .txt</NeonButton>
            <NeonButton variant="secondary" onClick={() => result && exportAsMd(result)} disabled={!result}>↓ .md</NeonButton>
            <NeonButton variant="secondary" onClick={handleShare} disabled={!result}>⇗ Share</NeonButton>
          </div>
        </div>

        {/* Output */}
        <div>
          <SectionLabel>Live Output</SectionLabel>
          <OutputBox value={result} placeholder="Start typing your task to see the live preview..." />
          {result && (
            <div style={{ marginTop: '8px', background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--dim)' }}>
                {result.split(/\s+/).length} WORDS · {result.length} CHARS
              </span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'var(--green)' }}>● LIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--dim)', fontFamily: "'Share Tech Mono', monospace", padding: '20px' }}>Loading...</div>}>
      <BuilderInner />
    </Suspense>
  );
}
