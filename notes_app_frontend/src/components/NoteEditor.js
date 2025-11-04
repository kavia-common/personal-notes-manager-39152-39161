import React, { useEffect, useMemo, useState } from 'react';
import { renderMarkdown } from '../utils/markdown';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete }) {
  /** Editor for a single note: title, markdown body, toggle preview, autosave status indicator. */

  const [local, setLocal] = useState({ title: note?.title || '', body: note?.body || '' });
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState('Saved');

  useEffect(() => {
    setLocal({ title: note?.title || '', body: note?.body || '' });
  }, [note?.id]);

  useEffect(() => {
    // Autosave debounce
    if (!note) return;
    setStatus('Editing…');
    const t = setTimeout(() => {
      onChange({ title: local.title, body: local.body });
      setStatus('Saved');
    }, 400);
    return () => clearTimeout(t);
  }, [local.title, local.body]); // eslint-disable-line react-hooks/exhaustive-deps

  const previewHtml = useMemo(() => renderMarkdown(local.body), [local.body]);

  if (!note) {
    return null;
  }

  return (
    <section className="editor" aria-label="Note editor">
      <div className="editor-inner">
        <input
          className="title-input"
          placeholder="Note title"
          aria-label="Note title"
          value={local.title}
          onChange={(e) => setLocal(s => ({ ...s, title: e.target.value }))}
        />
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button
              className={`btn ${preview ? 'ghost' : ''}`}
              onClick={() => setPreview(false)}
              aria-pressed={!preview}
              aria-label="Edit mode"
              title="Edit"
            >
              Edit
            </button>
            <button
              className={`btn ${preview ? '' : 'ghost'}`}
              onClick={() => setPreview(true)}
              aria-pressed={preview}
              aria-label="Preview mode"
              title="Preview"
            >
              Preview
            </button>
            <span className="status" aria-live="polite" style={{ marginLeft: 8 }}>
              {status}
            </span>
          </div>
          <div className="toolbar-right">
            <button
              className="btn secondary"
              onClick={() => {
                // create a soft copy to clipboard
                const text = `# ${local.title}\n\n${local.body}`;
                navigator.clipboard?.writeText(text);
              }}
              aria-label="Copy note as markdown"
              title="Copy as Markdown"
            >
              Copy MD
            </button>
            <button
              className="btn"
              style={{ background: 'var(--color-error)' }}
              onClick={() => onDelete(note.id)}
              aria-label="Delete note"
              title="Delete note"
            >
              Delete
            </button>
          </div>
        </div>

        {preview ? (
          <div
            className="preview"
            aria-label="Markdown preview"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            className="textarea"
            aria-label="Note body"
            placeholder="Write in Markdown…"
            value={local.body}
            onChange={(e) => setLocal(s => ({ ...s, body: e.target.value }))}
          />
        )}
      </div>
    </section>
  );
}
