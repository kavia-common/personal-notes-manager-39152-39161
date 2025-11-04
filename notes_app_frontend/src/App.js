import React, { useEffect, useMemo, useState } from 'react';
import './theme.css';
import './index.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { createNote, deleteNote, getEnv, listNotes, searchNotes, updateNote } from './utils/storage';

/**
 * App entrypoint for Ocean Notes
 * - Single page layout
 * - Sidebar with search, sort
 * - Editor with autosave and markdown preview
 * - LocalStorage persistence baseline; backend if env configured (future-ready)
 */
// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState(() => listNotes());
  const [selectedId, setSelectedId] = useState(() => notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const env = getEnv();

  // Refresh notes list when CRUD occurs (local storage baseline)
  function refreshList() {
    setNotes(listNotes());
  }

  useEffect(() => {
    // If there are no notes at first load, keep selectedId null.
    if (notes.length && !selectedId) {
      setSelectedId(notes[0].id);
    } else if (!notes.length) {
      setSelectedId(null);
    } else if (!notes.find(n => n.id === selectedId)) {
      setSelectedId(notes[0]?.id || null);
    }
  }, [notes, selectedId]);

  const visibleNotes = useMemo(() => {
    const filtered = searchNotes(searchQuery, notes);
    // sorting is done in NotesList for UI; keep here as baseline order if used elsewhere
    return filtered;
  }, [notes, searchQuery]);

  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedId) || null;
  }, [notes, selectedId]);

  function handleNewNote() {
    const created = createNote({ title: 'Untitled', body: '' });
    refreshList();
    setSelectedId(created.id);
  }

  function handleUpdateSelected(partial) {
    if (!selectedId) return;
    updateNote(selectedId, partial);
    refreshList();
  }

  function handleDelete(id) {
    deleteNote(id);
    refreshList();
    if (id === selectedId) {
      const next = listNotes()[0]?.id || null;
      setSelectedId(next);
    }
  }

  return (
    <div className="app-shell">
      <Header onNew={handleNewNote} />
      <main className="main" role="main">
        <NotesList
          notes={visibleNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onChange={handleUpdateSelected}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState onNew={handleNewNote} />
        )}
      </main>
      <div style={{ padding: 8, textAlign: 'center', fontSize: 12, color: 'rgba(17,24,39,0.6)' }}>
        {env.useBackend ? (
          <span>Connected to backend at {env.apiBase || env.backendUrl}</span>
        ) : (
          <span>Using local storage — no backend configured</span>
        )}
      </div>
    </div>
  );
}

export default App;
