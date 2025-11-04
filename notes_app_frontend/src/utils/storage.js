/**
 * Storage utilities for Notes app with migration-friendly structure.
 * Uses environment variables to decide backend usage; defaults to localStorage when not configured.
 */

const LS_KEY = 'notes.app.v1';
const META_KEY = 'notes.app.meta';

function getEnvConfig() {
  const base = process.env.REACT_APP_API_BASE || '';
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
  const ws = process.env.REACT_APP_WS_URL || '';
  return {
    apiBase: base.trim(),
    backendUrl: backendUrl.trim(),
    wsUrl: ws.trim(),
    useBackend: Boolean(base || backendUrl || ws),
  };
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function nowISO() {
  return new Date().toISOString();
}

function generateId() {
  // Simple random ID
  return 'note_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function readAll() {
  const raw = localStorage.getItem(LS_KEY);
  const data = safeParse(raw, { notes: [] });
  if (!Array.isArray(data.notes)) {
    data.notes = [];
  }
  return data;
}

function writeAll(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: nowISO(), version: 1 }));
}

// PUBLIC_INTERFACE
export function listNotes() {
  /** Returns array of notes sorted by updatedAt desc. */
  const data = readAll();
  return [...data.notes].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

// PUBLIC_INTERFACE
export function getNote(id) {
  /** Returns a single note by id or null. */
  const data = readAll();
  return data.notes.find(n => n.id === id) || null;
}

// PUBLIC_INTERFACE
export function createNote({ title = '', body = '' } = {}) {
  /** Creates a note and persists it. */
  const ts = nowISO();
  const note = {
    id: generateId(),
    title: title || 'Untitled',
    body: body || '',
    createdAt: ts,
    updatedAt: ts,
  };
  const data = readAll();
  data.notes.push(note);
  writeAll(data);
  return note;
}

// PUBLIC_INTERFACE
export function updateNote(id, partial) {
  /** Updates an existing note with partial fields and persists it. */
  const data = readAll();
  const idx = data.notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const updated = { ...data.notes[idx], ...partial, updatedAt: nowISO() };
  data.notes[idx] = updated;
  writeAll(data);
  return updated;
}

// PUBLIC_INTERFACE
export function deleteNote(id) {
  /** Deletes a note by id and persists. */
  const data = readAll();
  const before = data.notes.length;
  data.notes = data.notes.filter(n => n.id !== id);
  writeAll(data);
  return data.notes.length < before;
}

// PUBLIC_INTERFACE
export function searchNotes(query, notes) {
  /** Case-insensitive search across title and body. */
  const q = (query || '').trim().toLowerCase();
  if (!q) return notes;
  return notes.filter(n => (n.title || '').toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q));
}

// PUBLIC_INTERFACE
export function getEnv() {
  /** Returns environment configuration used by the app. */
  return getEnvConfig();
}
