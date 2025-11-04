import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ onNew }) {
  /** Header with brand and New Note button. */
  return (
    <header className="header" role="banner">
      <div className="brand" aria-label="Notes App Brand">
        <div className="brand-logo" aria-hidden="true" />
        <div className="brand-title">Ocean Notes</div>
        <span className="badge" style={{ marginLeft: 8 }}>Personal</span>
      </div>
      <div>
        <button className="btn" onClick={onNew} aria-label="Create a new note">
          + New note
        </button>
      </div>
    </header>
  );
}
