export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsTxt(content: string) {
  downloadFile(content, 'prompt.txt', 'text/plain');
}

export function exportAsMd(content: string) {
  const md = `# Forged Prompt\n\n\`\`\`\n${content}\n\`\`\`\n`;
  downloadFile(md, 'prompt.md', 'text/markdown');
}
