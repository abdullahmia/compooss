---
project_name: compooss
source_documents:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
workflowType: "epics-and-stories"
---

# Epics & Stories – compooss

Derived from the Product Requirements Document and Architecture Decision Document. Focused on MVP scope; growth features (indexes, aggregations, advanced tooling) are intentionally deferred.

## Requirements Inventory

### Functional Requirements (from PRD)

- **Connection & Environment (FR1–FR3)**: Start compooss via `docker compose up`; configure Mongo via env (`MONGO_URI`); show clear connection status on failure.
- **Database & Collection Navigation (FR4–FR6)**: List databases; list collections for a database; select a collection to view documents.
- **Document Viewing & Filtering (FR7–FR10)**: Paginated document list; readable JSON/tree view; simple filter UI without MQL; ability to see recent/new documents.
- **CRUD Operations (FR11–FR15)**: Create, edit, and delete documents with confirmation and clear success/error feedback.
- **Team Setup & Onboarding (FR16–FR18)**: Add compooss as a service to existing `docker-compose.yml`; enable new team members to use compooss without installing separate DB clients; point compooss at different environments via compose config.
- **Debugging & Investigation (FR19–FR21)**: Locate problematic documents quickly; copy/share JSON; safely adjust small sets of documents in dev/staging.
- **Security, Privacy & Local-Only Behaviour (FR22–FR24)**: No auth in trusted local dev; optional simple auth for shared environments; no telemetry or external analytics.

### Non-Functional Requirements (from PRD)

- **Performance**: DB/collection lists < 1s; document lists and simple filters < 3s for typical dev datasets and up to ~50 docs per page.
- **Security**: Credentials never stored in the browser; HTTPS when exposed beyond localhost; no external network calls by default.
- **Scalability & Reliability (Dev-tool context)**: Comfortably support 1–5 concurrent users; container auto-restart; compooss failure must not endanger Mongo data.
- **Accessibility & Developer Experience**: Keyboard-friendly core flows; reasonable contrast and typography; avoid obvious a11y blockers.

### Additional Requirements / Architectural Constraints

- **Deployment model**: Single Next.js App Router app in one container; compose-first deployment.
- **Data access**: All Mongo access via server-side code (shared driver + helpers); no direct browser-to-Mongo connections.
- **API model**: No public REST `/api` surface in MVP; server components and server actions form the internal “API”.

### FR Coverage Map (high level)

- **FR1–FR3 (Connection & Environment)** → Epic 1 (E1-S1, E1-S2, E1-S3) and Epic 4 (E4-S1, E4-S2).
- **FR4–FR6 (DB & Collection Navigation)** → Epic 2 (E2-S1, E2-S2, E2-S3) and Epic 5 (E5-S1).
- **FR7–FR10 (Viewing & Filtering)** → Epic 3 (E3-S1, E3-S2, E3-S3) and Epic 5 (E5-S1, E5-S3).
- **FR11–FR15 (CRUD)** → Epic 3 (E3-S4, E3-S5, E3-S6) and Epic 4 (E4-S1).
- **FR16–FR18 (Team Setup & Onboarding)** → Epic 1 (E1-S1, E1-S3) and Epic 5 (E5-S1, E5-S2).
- **FR19–FR21 (Debugging & Investigation)** → Epic 3 (all stories) and Epic 6 (E6-S1, E6-S2, E6-S3).
- **FR22–FR24 (Security, Privacy & Local-only)** → Epic 1 (E1-S3), Epic 4 (all stories), and Epic 6 (E6-S1, E6-S2).

## Epic 1: Compose-Integrated Mongo UI Core

**Goal:** compooss runs via `docker compose up` alongside MongoDB, with clear connection status and local-only assumptions.

### E1-S1 – Compose service wiring

**Goal:** compooss runs via `docker compose up` alongside Mongo.

**Acceptance Criteria:**
- A sample `docker-compose.yml` includes `compooss` and `mongo` services.
- `MONGO_URI` is configured via environment variables, not hardcoded in code.
- `docker compose up` brings the stack up and compooss is reachable at a documented URL.

### E1-S2 – Connection health & status

**Goal:** Show clear “connected / cannot connect” state.

**Acceptance Criteria:**
- When Mongo is reachable, the UI shows a clear connected state and lists available databases.
- When Mongo is not reachable (invalid URI, DB down, etc.), a clear error banner explains the issue in user-friendly language.
- No raw stack traces are shown to end users.

### E1-S3 – Local-only safety banner

**Goal:** Make the local-only assumption explicit.

**Acceptance Criteria:**
- In default local dev configuration, a visible banner warns “local-only / do not expose publicly”.
- When Basic Auth / HTTPS environment variables are configured for shared environments, the banner either disappears or clearly reflects the new, more protected mode.

## Epic 2: Database & Collection Navigation

**Goal:** Provide fast, intuitive navigation from databases to collections using the sidebar shell.

### E2-S1 – List databases

**Goal:** Show all accessible databases from Mongo.

**Acceptance Criteria:**
- On load, the sidebar lists all databases the current connection can see.
- An empty/no-database state is handled gracefully (e.g. “No databases found”).

### E2-S2 – List collections per database

**Goal:** Show collections for a selected database.

**Acceptance Criteria:**
- Clicking a database in the sidebar updates the view to show its collections.
- Selecting a collection routes to its documents view in the main pane.

### E2-S3 – App shell & navigation layout

**Goal:** Implement the persistent shell and routing.

**Acceptance Criteria:**
- Layout matches the architecture: sidebar (DBs/collections) + main pane (documents / other views).
- Navigation uses the Next.js App Router with appropriate server components.
- Not-found and error states use `not-found.tsx` and error boundaries rather than blank screens.

## Epic 3: Document Viewing, Filtering & CRUD

**Goal:** Allow developers to inspect and manipulate documents with simple, safe flows.

### E3-S1 – Paginated document list

**Goal:** Paginated view for documents in a collection.

**Acceptance Criteria:**
- List view defaults to page 1 with a page size (e.g. 25) and enforces a maximum (e.g. 50).
- The list shows `_id` and key fields in a readable table or list.
- Pagination controls (next/previous) update the list without a full-page reload experience.

### E3-S2 – JSON/tree document viewer

**Goal:** Readable JSON/tree view for a single document.

**Acceptance Criteria:**
- Clicking a row opens a detail view using a JSON/tree-style component.
- `_id` and `Date` fields are rendered as strings; unsupported BSON types are visible but read-only.
- The viewer handles large documents without freezing the UI.

### E3-S3 – Simple filtering

**Goal:** Allow simple filters without requiring MQL knowledge.

**Acceptance Criteria:**
- A query bar lets users add one or more simple conditions (field, operator, value).
- Filters apply to the paginated list, with a clear “no results” state when nothing matches.
- Filter input is validated; invalid filters show a friendly error message, not a crash.

### E3-S4 – Create document

**Goal:** Add a new document to a collection.

**Acceptance Criteria:**
- A “New document” action opens a form/editor (using schema where applicable).
- Inputs are validated with Zod on the server (and optionally client hints).
- On success, the new document appears in the list; on failure, validation errors are shown inline.

### E3-S5 – Edit document

**Goal:** Update an existing document safely.

**Acceptance Criteria:**
- A document can be edited via a JSON or form-based editor.
- `_id` and other read-only fields are not editable.
- Successful edits persist to Mongo and are reflected after reload.

### E3-S6 – Delete document with confirmation

**Goal:** Safe deletion with explicit confirmation.

**Acceptance Criteria:**
- A delete action shows a clear confirmation dialog including collection and document identifier.
- On confirm, the document is removed from Mongo and from the list.
- No delete occurs without an explicit confirmation action.

## Epic 4: Environment, Security & Modes

**Goal:** Make environment-specific behaviour (read-only, auth, safety) explicit and enforced.

### E4-S1 – Read-only mode toggle

**Goal:** Honour `READ_ONLY_MODE` (or equivalent).

**Acceptance Criteria:**
- When the env flag is enabled, all create/update/delete actions are disabled in the UI and enforced on the server.
- The UI clearly indicates “Read-only mode” and hides or disables destructive controls.

### E4-S2 – Basic Auth integration

**Goal:** Support a simple username/password gate for shared environments.

**Acceptance Criteria:**
- When Basic Auth environment variables are set, the app is protected by Basic Auth in front of Next.js.
- Behaviour is documented for compose-based deployments.

### E4-S3 – Rate limiting

**Goal:** Protect server actions in shared setups.

**Acceptance Criteria:**
- Reasonable defaults throttle repeated, rapid actions to prevent abuse.
- Throttling surfaces as a friendly error message, not a crash or hang.

## Epic 5: UX Shell, Settings & Playground

**Goal:** Reuse and extend the existing UX shell and component library.

### E5-S1 – Core shell components

**Goal:** Implement sidebar, top bar, query bar and welcome view.

**Acceptance Criteria:**
- `sidebar`, `top-bar`, `query-bar`, and `welcome-view` components exist and are wired into the app shell routes.
- The welcome view guides users to select a database/collection or create a connection.

### E5-S2 – Settings modal

**Goal:** Centralize user-visible settings.

**Acceptance Criteria:**
- A “Settings” entry opens a modal with at least appearance and general settings (even if minimal for MVP).
- Settings are stored in a way that matches architecture decisions (e.g. client-side only; no cross-user persistence yet).

### E5-S3 – UI component library

**Goal:** Establish reusable UI primitives.

**Acceptance Criteria:**
- Buttons, inputs, labels, toggles, modals, icon buttons, and badges exist under `components/ui/*`.
- Each has a Storybook story and is used in at least one real screen.

### E5-S4 – Playground route

**Goal:** Safe space to iterate on new UI ideas.

**Acceptance Criteria:**
- A `(playground)` route exists and is not part of the core flows.
- It can be removed or ignored for production without breaking main journeys.

## Epic 6: Observability & Developer Experience

**Goal:** Provide minimal but effective observability and DX helpers.

### E6-S1 – Structured logging

**Goal:** Minimal but useful logs.

**Acceptance Criteria:**
- Mongo connection errors, query failures, and write attempts log structured messages (operation, collection, error).
- Logs are visible via `docker compose logs` and are not mixed with noisy debug output in production.

### E6-S2 – Health indicator

**Goal:** Quick “is it working?” signal.

**Acceptance Criteria:**
- A small health indicator (or page/section) shows app status (app running / DB connected).
- The same status is also visible via container logs or a simple health endpoint.

### E6-S3 – Mock data & playground fixtures

**Goal:** Easy demo and testing.

**Acceptance Criteria:**
- `src/data/mock-data.ts` contains fixtures usable in the playground or tests.
- Developers can spin up compooss with sample data to explore the UI without manual data seeding.

