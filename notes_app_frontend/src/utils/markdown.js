/**
 * Extremely lightweight markdown renderer for basic preview (no external deps).
 * Supports headings (#-###), bold **text**, italics *text*, code `inline`.
 * This is intentionally minimal and safe-ish by escaping HTML.
 */

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatInline(s) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

// PUBLIC_INTERFACE
export function renderMarkdown(md) {
  /** Renders minimal markdown to HTML string. */
  if (!md) return '<p></p>';
  const lines = md.split(/\r?\n/);
  const result = [];
  for (const line of lines) {
    if (/^###\s+/.test(line)) {
      result.push(`<h3>${formatInline(line.replace(/^###\s+/, ''))}</h3>`);
    } else if (/^##\s+/.test(line)) {
      result.push(`<h2>${formatInline(line.replace(/^##\s+/, ''))}</h2>`);
    } else if (/^#\s+/.test(line)) {
      result.push(`<h1>${formatInline(line.replace(/^#\s+/, ''))}</h1>`);
    } else if (line.trim() === '') {
      result.push('<p></p>');
    } else {
      result.push(`<p>${formatInline(line)}</p>`);
    }
  }
  return result.join('\n');
}
