'use client';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SectionLabel from '@/components/SectionLabel';
import NeonButton from '@/components/NeonButton';
import MetricCard from '@/components/MetricCard';
import AnalysisItem from '@/components/AnalysisItem';
import OutputBox from '@/components/OutputBox';
import DiffView from '@/components/DiffView';
import Toast from '@/components/Toast';
import { analyzePrompt } from '@/lib/analyzePrompt';
import { copyToClipboard } from '@/lib/clipboard';

type LocalResult = ReturnType<typeof analyzePrompt>;
type AIResult = {
  scores: { clarity: number; structure: number; specificity: number; technique: number; overall: number };
  issues: string[];
  suggestions: string[];
  optimized: string;
};

function AnalyzerInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<LocalResult | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [useAI, setUseAI] = useState(false);

  useEffect(() => {
    const tmpl = searchParams.get('template') || sessionStorage.getItem('analyzerTemplate');
    if (tmpl) { setInput(tmpl); sessionStorage.removeItem('analyzerTemplate'); }
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('anthropicApiKey') : null;
    if (savedKey) { setApiKey(savedKey); setUseAI(true); }
  }, [searchParams]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setAiResult(null); setAiError(''); setShowDiff(false);
    setResult(analyzePrompt(input));

    if (useAI && apiKey) {
      setAiLoading(true);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input, apiKey }),
        });
        const data = await res.json();
        if (data.error) setAiError(data.error);
        else setAiResult(data);
      } catch {
        setAiError('AI analysis unavailable. Running locally? Make sure npm run dev is active.');
      }
      setAiLoading(false);
    }
  };

  const activeResult = aiResult || result;
  const optimized = activeResult?.optimized ?? '';

  const handleCopy = useCallback(() => {
    if (optimized) copyToClipboard(optimized, () => { setToastMsg('Copied optimized prompt'); setToast(true); });
  }, [optimized]);

  return (
    <div>
      <Toast visible={toast} onHide={() => setToast(false)} message={toastMsg} />

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
        style={{ marginBottom: '12px' }}
      />

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: apiKey ? 'pointer' : 'default', fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: apiKey ? 'var(--cyan)' : 'var(--dim)' }}>
          <input
            type="checkbox"
            checked={useAI && !!apiKey}
            onChange={e => setUseAI(e.target.checked)}
            disabled={!apiKey}
            style={{ width: 'auto', accentColor: 'var(--cyan)' }}
          />
          {apiKey ? 'Use Claude AI analysis (more accurate)' : 'Set API key in Builder tab to enable AI analysis'}
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <NeonButton onClick={handleAnalyze} disabled={aiLoading}>
          {aiLoading ? '◈ Analyzing...' : '◈ Run Diagnostic'}
        </NeonButton>
        <NeonButton variant="secondary" onClick={() => { setInput(''); setResult(null); setAiResult(null); setAiError(''); setShowDiff(false); }}>↺ Clear</NeonButton>
      </div>

      {(result || aiResult) && (
        <>
          <SectionLabel>
            Diagnostic Scores{aiResult ? <span style={{ fontSize: '10px', color: 'var(--green)', marginLeft: '8px' }}>● AI-POWERED</span> : null}
          </SectionLabel>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {(() => {
              const s = activeResult!.scores;
              return <>
                <MetricCard label="Clarity" value={s.clarity} color="var(--cyan)" />
                <MetricCard label="Structure" value={s.structure} color="var(--magenta)" />
                <MetricCard label="Specificity" value={s.specificity} color="var(--green)" />
                <MetricCard label="Technique" value={s.technique} color="var(--yellow)" />
                <MetricCard label="Overall" value={s.overall} color="var(--orange)" />
              </>;
            })()}
          </div>

          <SectionLabel>Diagnostic Report</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {aiResult ? (
              <>
                {aiResult.issues.map((issue, i) => (
                  <AnalysisItem key={i} severity="warn" icon="⚠" title={issue} description="" />
                ))}
                {aiResult.suggestions.map((sug, i) => (
                  <AnalysisItem key={`s${i}`} severity="info" icon="◈" title="Suggestion" description={sug} />
                ))}
                {aiResult.issues.length === 0 && (
                  <AnalysisItem severity="ok" icon="✓" title="Well-Structured Prompt" description="Claude found no major issues." />
                )}
              </>
            ) : result ? (
              <>
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
              </>
            ) : null}
            {aiError && <AnalysisItem severity="warn" icon="⚠" title="AI Analysis Unavailable" description={aiError} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <SectionLabel>Optimized Version</SectionLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              <NeonButton variant="secondary" onClick={() => setShowDiff(v => !v)} style={{ fontSize: '10px', padding: '6px 14px' }}>
                {showDiff ? '◈ Hide Diff' : '◈ Show Diff'}
              </NeonButton>
              <NeonButton variant="secondary" onClick={handleCopy}>⎘ Copy Optimized</NeonButton>
            </div>
          </div>

          {showDiff ? (
            <DiffView original={input} optimized={optimized} />
          ) : (
            <OutputBox value={optimized} />
          )}
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
