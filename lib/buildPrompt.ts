export interface BuildConfig {
  task: string;
  model: string;
  role: string;
  outputFormat: string;
  context: string;
  constraints: string;
  tone: string;
  boosters: string[];
  examples: string;
}

export function buildPrompt(cfg: BuildConfig): string {
  const lines: string[] = [];

  if (cfg.role) {
    lines.push(`You are ${cfg.role}. Approach this task with expertise, precision, and a ${cfg.tone} tone.`);
  } else {
    lines.push(`Approach this task with a ${cfg.tone} tone and expert-level attention to detail.`);
  }
  lines.push('');

  if (cfg.boosters.includes('Chain-of-Thought')) {
    lines.push('Before answering, reason through the problem carefully step by step.');
    lines.push('');
  }
  if (cfg.boosters.includes('Tree-of-Thought')) {
    lines.push('Consider multiple approaches to this problem. Evaluate each, then commit to the best path.');
    lines.push('');
  }
  if (cfg.boosters.includes('Self-Consistency')) {
    lines.push('Generate your answer, review it critically, then refine it for maximum accuracy and consistency.');
    lines.push('');
  }
  if (cfg.boosters.includes('ReAct Reasoning')) {
    lines.push('Use a Reason → Act → Observe pattern: reason about the task, determine the next action, and state your findings.');
    lines.push('');
  }

  if (cfg.context) {
    lines.push('## Context');
    lines.push(cfg.context);
    lines.push('');
  }

  lines.push('## Task');
  lines.push(cfg.task);
  lines.push('');

  if (cfg.constraints) {
    lines.push('## Constraints');
    lines.push(cfg.constraints);
    lines.push('');
  }

  if (cfg.boosters.includes('Negative Constraints')) {
    lines.push('Do NOT include irrelevant information, filler content, or unsupported claims.');
    lines.push('');
  }
  if (cfg.boosters.includes('Output Validation')) {
    lines.push('Before finalizing your response, verify it fully satisfies the task requirements.');
    lines.push('');
  }

  const formatMap: Record<string, string> = {
    'Paragraph': 'Respond in well-structured paragraphs.',
    'Bullet points': 'Format your response as a bullet point list.',
    'Numbered list': 'Format your response as a numbered list.',
    'JSON': 'Return your response as valid JSON only. No prose outside the JSON object.',
    'Markdown': 'Format your response using Markdown with appropriate headers, lists, and emphasis.',
    'Code': 'Return code only, wrapped in appropriate code blocks with language identifiers.',
    'Table': 'Format your response as a Markdown table with clear column headers.',
  };
  lines.push('## Output Format');
  lines.push(formatMap[cfg.outputFormat] || `Output format: ${cfg.outputFormat}`);
  lines.push('');

  if (cfg.boosters.includes('Role Anchoring') && cfg.role) {
    lines.push(`Remember: you are answering as ${cfg.role}. Stay in character throughout.`);
    lines.push('');
  }
  if (cfg.boosters.includes('Explicit Format')) {
    lines.push('Do not deviate from the specified output format. Structure is critical.');
    lines.push('');
  }

  if (cfg.examples) {
    lines.push('## Examples');
    lines.push(cfg.examples);
    lines.push('');
  }

  if (cfg.boosters.includes('Few-Shot Examples') && cfg.examples) {
    lines.push('Follow the style and structure demonstrated in the examples above.');
    lines.push('');
  }

  if (cfg.model === 'Claude') {
    lines.push('<note>Optimized for Claude — feel free to think at length before presenting your final answer.</note>');
  }

  return lines.join('\n').trim();
}
