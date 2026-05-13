export interface AnalysisResult {
  scores: {
    clarity: number;
    structure: number;
    specificity: number;
    technique: number;
    overall: number;
  };
  flags: {
    hasRole: boolean;
    hasCtx: boolean;
    hasFmt: boolean;
    hasConstraint: boolean;
    hasExample: boolean;
    hasCOT: boolean;
    words: number;
  };
  optimized: string;
}

export function analyzePrompt(text: string): AnalysisResult {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const hasRole = /you are|act as|as a|as an/i.test(text);
  const hasCtx = /context|background|given that|based on/i.test(text);
  const hasFmt = /format|output|respond with|provide|list|bullet|json|table/i.test(text);
  const hasConstraint = /do not|don't|avoid|never|must|limit|max|minimum/i.test(text);
  const hasExample = /example|e\.g\.|for instance|such as|like:/i.test(text);
  const hasCOT = /step by step|think|reason|first|then|finally|chain/i.test(text);

  const clarity = Math.min(100, 40 + (words > 15 ? 20 : 0) + (sentences > 1 ? 15 : 0) + (words > 40 ? 15 : 0) + (words < 5 ? -20 : 0));
  const structure = Math.min(100, (hasRole ? 25 : 0) + (hasCtx ? 25 : 0) + (hasFmt ? 25 : 0) + (hasConstraint ? 15 : 0) + 10);
  const specificity = Math.min(100, 20 + (words > 20 ? 20 : 0) + (hasFmt ? 20 : 0) + (hasConstraint ? 20 : 0) + (words > 50 ? 20 : 0));
  const technique = Math.min(100, (hasRole ? 20 : 0) + (hasExample ? 25 : 0) + (hasCOT ? 30 : 0) + (hasCtx ? 15 : 0) + 10);
  const overall = Math.round((clarity + structure + specificity + technique) / 4);

  const optLines: string[] = [];
  if (!hasRole) optLines.push('You are an expert assistant. Approach this task with precision and expertise.\n');
  if (!hasCOT && words < 100) optLines.push('Think step by step before providing your answer.\n');
  optLines.push(text);
  if (!hasFmt) optLines.push('\nProvide a clear, well-structured response.');
  if (!hasConstraint) optLines.push('Do not include irrelevant information or filler content.');

  return {
    scores: { clarity, structure, specificity, technique, overall },
    flags: { hasRole, hasCtx, hasFmt, hasConstraint, hasExample, hasCOT, words },
    optimized: optLines.join('\n').trim(),
  };
}
