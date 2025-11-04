import React, { useEffect, useMemo, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  selectedId,
  onSelect,
  onDelete,
  onSearchChange,
  searchQuery,
  sortBy,
  onSortByChange
}) {
  /** Sidebar list of notes with search, sort, and keyboard navigation. */

  const listRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  useEffect(() => {
    // Keep focus index in sync with selected
    const idx = notes.findIndex(n => n.id === selectedId);
    setFocusIndex(idx);
  }, [selectedId, notes]);

  function handleKeyDown(e) {
    if (!notes.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min((focusIndex < 0 ? 0 : focusIndex + 1), notes.length - 1);
      setFocusIndex(next);
      const id = notes[next]?.id;
      if (id) onSelect(id);
      scrollItemIntoView(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max((focusIndex < 0 ? 0 : focusIndex - 1), 0);
      setFocusIndex(prev);
      const id = notes[prev]?.id;
      if (id) onSelect(id);
      scrollItemIntoView(prev);
    } else if (e.key === 'Delete') {
      if (selectedId) onDelete(selectedId);
    } else if (e.key === 'Enter') {
      if (focusIndex >= 0) {
        const id = notes[focusIndex]?.id;
        if (id) onSelect(id);
      }
    }
  }

  function scrollItemIntoView(idx) {
    const container = listRef.current;
    if (!container) return;
    const item = container.querySelector(`[data-idx="${idx}"]`);
    if (item && item.scrollIntoView) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  const sorted = useMemo(() => {
    const clone = [...notes];
    if (sortBy === 'updated') {
      clone.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    } else if (sortBy === 'created') {
      clone.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } else if (sortBy === 'title') {
      clone.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return clone;
  }, [notes, sortBy]);

  return (
    <aside className="sidebar" aria-label="Notes list and search">
      <div className="sidebar-section">
        <div className="searchbar">
          <input
            className="input"
            aria-label="Search notes"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn ghost" onClick={() => onSearchChange('')} aria-label="Clear search">
            Clear
          </button>
        </div>
        <div className="sort-row">
          <span>Sort by</span>
          <select
            className="select"
            aria-label="Sort notes"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="updated">Updated</option>
            <option value="created">Created</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      <div
        className="notes-list"
        ref={listRef}
        role="listbox"
        aria-label="Notes"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {sorted.map((n, idx) => (
          <div
            key={n.id}
            role="option"
            aria-selected={n.id === selectedId}
            className={`note-list-item ${n.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
            data-idx={idx}
            tabIndex={-1}
          >
            <div>
              <div className="title" title={n.title}>{n.title || 'Untitled'}</div>
              <div className="meta">
                {new Date(n.updatedAt || n.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
            <div>
              <button
                className="btn ghost"
                aria-label={`Delete ${n.title || 'Untitled'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {!sorted.length && (
          <div className="note-list-item" aria-disabled="true">
            <div className="meta">No notes yet</div>
          </div>
        )}
      </div>
    </aside>
  );
}
