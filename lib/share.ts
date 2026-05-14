import type { BuildConfig } from './buildPrompt';

export function encodeConfig(cfg: BuildConfig): string {
  return btoa(encodeURIComponent(JSON.stringify(cfg)));
}

export function decodeConfig(encoded: string): BuildConfig | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function buildShareUrl(cfg: BuildConfig): string {
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return `${base}?share=${encodeConfig(cfg)}`;
}
