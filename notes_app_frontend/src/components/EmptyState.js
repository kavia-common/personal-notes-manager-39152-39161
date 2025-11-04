import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ onNew }) {
  /** Empty state encouraging user to create their first note. */
  return (
    <div className="empty-state" role="region" aria-label="Empty state">
      <div className="empty-card">
        <h2>Welcome to Ocean Notes</h2>
        <p>Create your first note to get started.</p>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={onNew} aria-label="Create your first note">
            + New note
          </button>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: 'rgba(17,24,39,0.7)' }}>
          Tip: Use <kbd>↑</kbd> / <kbd>↓</kbd> to navigate the list.
        </p>
      </div>
    </div>
  );
}
