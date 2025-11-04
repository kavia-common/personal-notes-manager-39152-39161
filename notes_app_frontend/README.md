# Ocean Notes – React Frontend

A modern single-page Notes application with an Ocean Professional theme. It includes a sidebar for the notes list and a main area for viewing and editing the selected note. Data is persisted to `localStorage` by default. If backend environment variables are configured, the app is ready for extension to use network APIs.

## Features

- Single-page layout with Sidebar + Editor
- Create, edit (autosave), delete notes
- Search/filter and sort (by updated, created, or title)
- Markdown editor with live Preview toggle (lightweight, no external deps)
- LocalStorage persistence as a baseline
- Ocean Professional theme (primary #2563EB, secondary #F59E0B, error #EF4444)
- Modern UI: rounded corners, subtle shadows, smooth transitions
- Responsive and accessible: keyboard navigation for list, aria labels
- Internal state routing (no URL routing required)

## Quickstart

In the container directory:

- `npm start` – run the app in development mode.
- `npm test` – run tests in watch mode.
- `npm run build` – build for production.

App runs on http://localhost:3000.

## Project Structure

- `src/components/Header.js` – App header with brand and New Note button
- `src/components/NotesList.js` – Sidebar with search, sorting, and keyboard navigation
- `src/components/NoteEditor.js` – Editor with title, markdown body, autosave, and preview
- `src/components/EmptyState.js` – When no note is selected/available
- `src/utils/storage.js` – LocalStorage CRUD and env detection (migration-friendly)
- `src/utils/markdown.js` – Minimal markdown renderer for preview
- `src/theme.css` – Ocean theme tokens and component styles
- `src/App.js` – App wiring and internal state routing

## Environment Variables

The app will use LocalStorage by default. You can set the following to enable/prepare backend connectivity. If empty, the app continues to use LocalStorage.

- `REACT_APP_API_BASE` – Base URL for API (optional)
- `REACT_APP_BACKEND_URL` – Alternative backend URL (optional)
- `REACT_APP_WS_URL` – WebSocket URL (optional)
- Other standard envs (optional): `REACT_APP_FRONTEND_URL`, `REACT_APP_NODE_ENV`, `REACT_APP_NEXT_TELEMETRY_DISABLED`, `REACT_APP_ENABLE_SOURCE_MAPS`, `REACT_APP_PORT`, `REACT_APP_TRUST_PROXY`, `REACT_APP_LOG_LEVEL`, `REACT_APP_HEALTHCHECK_PATH`, `REACT_APP_FEATURE_FLAGS`, `REACT_APP_EXPERIMENTS_ENABLED`

Note: Do not commit secrets. Provide a `.env` file via deployment tooling. Example `.env.example`:

```
REACT_APP_API_BASE=
REACT_APP_BACKEND_URL=
REACT_APP_WS_URL=
```

## Accessibility

- Notes list supports keyboard navigation: Up/Down to move, Enter to select, Delete to remove.
- Proper aria-labels for inputs and regions.
- Focus rings and contrast-aware palette.

## Styling

- Colors and component styles are defined in `src/theme.css`.
- Subtle shadows, rounded corners, and transitions to match the Ocean Professional theme.

## Extending to a Backend

- `src/utils/storage.js` exposes `getEnv()` to detect if backend is configured.
- Replace the CRUD calls with API requests when backend endpoints become available while keeping the same public interface.

