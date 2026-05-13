'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionLabel from '@/components/SectionLabel';
import NeonButton from '@/components/NeonButton';
import MetricCard from '@/components/MetricCard';
import AnalysisItem from '@/components/AnalysisItem';
import OutputBox from '@/components/OutputBox';
import Toast from '@/components/Toast';
import { analyzePrompt } from '@/lib/analyzePrompt';
import { copyToClipboard } from '@/lib/clipboard';

function AnalyzerInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzePrompt> | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const tmpl = searchParams.get('template') || sessionStorage.getItem('analyzerTemplate');
    if (tmpl) { setInput(tmpl); sessionStorage.removeItem('analyzerTemplate'); }
  }, [searchParams]);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setResult(analyzePrompt(input));
  };

  const handleCopy = useCallback(() => {
    if (result) copyToClipboard(result.optimized, () => setToast(true));
  }, [result]);

  return (
    <div>
      <Toast visible={toast} onHide={() => setToast(false)} />

      <SectionLabel>Neural Prompt Diagnostic</SectionLabel>

      <div style={{ background: 'rgba(255,230,0,0.05)', border: '1px solid rgba(255,230,0,0.3)', padding: '12px 16px', marginBottom: '20px' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(255,230,0,0.7)' }}>
          ⚠ PASTE AN EXISTING PROMPT BELOW — THE SYSTEM WILL ANALYZE ITS STRUCTURE, IDENTIFY WEAKNESSES, AND SUGGEST NEURAL UPGRADES.
        </span>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={7}
        placeholder="Paste your prompt here..."
        style={{ marginBottom: '16px' }}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <NeonButton onClick={handleAnalyze}>◈ Run Diagnostic</NeonButton>
        <NeonButton variant="secondary" onClick={() => { setInput(''); setResult(null); }}>↺ Clear</NeonButton>
      </div>

      {result && (
        <>
          <SectionLabel>Diagnostic Scores</SectionLabel>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <MetricCard label="Clarity" value={result.scores.clarity} color="var(--cyan)" />
            <MetricCard label="Structure" value={result.scores.structure} color="var(--magenta)" />
            <MetricCard label="Specificity" value={result.scores.specificity} color="var(--green)" />
            <MetricCard label="Technique" value={result.scores.technique} color="var(--yellow)" />
            <MetricCard label="Overall" value={result.scores.overall} color="var(--orange)" />
          </div>

          <SectionLabel>Diagnostic Report</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {!result.flags.hasRole && <AnalysisItem severity="warn" icon="⚠" title="No Role Assignment" description="Add persona anchoring — start with 'You are a [specific expert]...'" />}
            {!result.flags.hasCtx && <AnalysisItem severity="warn" icon="⚠" title="Missing Context" description="Add background information to help the AI understand the situation." />}
            {!result.flags.hasFmt && <AnalysisItem severity="warn" icon="⚠" title="No Format Specification" description="Define the desired output format (bullet points, JSON, table, etc.)." />}
            {!result.flags.hasConstraint && <AnalysisItem severity="info" icon="◈" title="No Constraints Defined" description="Add limits or exclusions (word count, topics to avoid, etc.)." />}
            {!result.flags.hasExample && <AnalysisItem severity="info" icon="◈" title="No Examples Provided" description="Add few-shot examples to calibrate format and style." />}
            {!result.flags.hasCOT && <AnalysisItem severity="info" icon="◈" title="No Chain-of-Thought" description="Add step-by-step instruction to improve reasoning quality." />}
            {result.flags.words < 10 && <AnalysisItem severity="error" icon="✗" title="Prompt Too Short" description="Add more detail — vague prompts yield vague outputs." />}
            {result.flags.words > 500 && <AnalysisItem severity="info" icon="◈" title="Prompt Might Be Too Long" description="Consider trimming for focus and clarity." />}
            {result.flags.hasRole && result.flags.hasCtx && result.flags.hasFmt && result.flags.words >= 10 && (
              <AnalysisItem severity="ok" icon="✓" title="Well-Structured Prompt" description="All key components are present." />
            )}
          </div>

          <SectionLabel>Optimized Version</SectionLabel>
          <OutputBox value={result.optimized} />
          <div style={{ marginTop: '12px' }}>
            <NeonButton variant="secondary" onClick={handleCopy}>⎘ Copy Optimized</NeonButton>
          </div>
        </>
      )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--dim)', fontFamily: "'Share Tech Mono', monospace", padding: '20px' }}>Loading...</div>}>
      <AnalyzerInner />
    </Suspense>
  );
}
