export async function copyToClipboard(text: string, onSuccess: () => void): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess();
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch {
      window.prompt('Copy this text (Ctrl+C / Cmd+C):', text);
    }
    document.body.removeChild(ta);
  }
}
