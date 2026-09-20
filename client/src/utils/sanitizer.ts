export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  const protocolMatch = trimmed.match(/^([a-zA-Z0-9+.-]+):/);
  if (!protocolMatch) return trimmed;
  const protocol = protocolMatch[1].toLowerCase();
  if (['http', 'https', 'mailto'].includes(protocol)) {
    return trimmed;
  }
  return '#';
}
