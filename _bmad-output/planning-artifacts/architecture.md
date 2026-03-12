---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/project-context.md"
workflowType: 'architecture'
project_name: 'compooss'
user_name: 'Abdullah Mia'
date: '2026-03-11'
lastStep: 4
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

### 1\. Runtime & deployment

*   **A1 – Runtime model**:
    
    *   Single **Next.js app** (App Router) running in one container.
        
    *   No separate backend service; all server logic (APIs, DB access) lives inside Next.js server runtime.
        
*   **A2 – Deployment (MVP)**:
    
    *   Runs **only via docker compose up** as part of the project stack.
        
    *   One compose file defines at least:
        
        *   app service → compooss (Next.js)
            
        *   mongo service → single-node MongoDB for local dev.
            

### 2\. Data access / Mongo

*   **A3 – Mongo connection**:
    
    *   All DB access goes through a **shared Mongo client utility** (e.g. src/lib/db/mongo.ts).
        
    *   Connection string is read from **process.env.MONGO\_URI**; no credentials or URIs are ever stored in the browser.
        
*   **A4 – Topology (MVP)**:
    
    *   Target a **single Mongo instance** for v1 (local container or local process).
        
    *   The design must accept any valid Mongo URI so later we can point at **Atlas/replica sets** without refactoring.
        

### 3\. API surface

*   **A5 – API style**:
    
    *   For **external integration**, no public REST API is exposed in MVP.
    *   For **internal app flows**, use **server components and server actions**, not ad-hoc `/api/*` JSON endpoints.
        
*   **A6 – Trust boundaries**:
    
    *   All Mongo operations are executed **server-side** only; the browser never talks directly to Mongo.

### 4\. UI responsibilities

*   **A7 – UI responsibilities**:
    
    *   UI is responsible for:
        
        *   Rendering DB/collection/doc lists and JSON/tree views.
            
        *   Collecting filter criteria and CRUD inputs.
            
        *   Calling the /api/\* endpoints and surfacing success/error states.
            
    *   No business logic or DB logic lives in the client; it only orchestrates API calls.
        

### 5\. Evolution notes

*   **A8 – Future extension hooks**:
    
    *   Auth layer can be added later **in front of Next.js** (e.g. middleware) without changing DB access.
        
    *   Support for multiple environments (local, staging) is done by **different MONGO\_URI values and compose profiles**, not by changing code.
        
    *   Atlas/replica support will be introduced by changing **URIs + possibly readPreference options** in the shared client.

## Project Context Analysis

### Requirements Overview

**Functional Requirements (architectural implications):**
- **Connection & Environment (FR1–FR3)**: App must start in `docker compose up`, read `MONGO_URI` server-side, and expose clear connection health/errors to the UI.
- **DB/Collection Navigation (FR4–FR6)**: Requires server endpoints to enumerate databases/collections and a UI navigation model that keeps context (selected db/collection).
- **Document Viewing & Filtering (FR7–FR10)**: Requires a pagination strategy, a “readable JSON/tree” renderer, a constrained filter-builder UI (simple field/value conditions), and sorting/recency support.
- **CRUD (FR11–FR15)**: Requires safe write endpoints, input validation, and a consistent success/error feedback pattern.
- **Team Setup & Onboarding (FR16–FR18)**: Compose-first configuration; environment switching should be achieved via compose/env (not per-user settings stored in the browser).
- **Debugging & Investigation (FR19–FR21)**: Fast targeted filtering, copy/export of document JSON, and visibility into changes for small fixes.
- **Security/Privacy & Local-only (FR22–FR24)**: No auth by default in local dev; optional basic gate for shared env later; absolutely no telemetry.

**Non-Functional Requirements (drivers):**
- **Performance**: DB/collection lists < 1s; doc lists & simple filters < 3s (typical dev datasets, up to ~50 docs/page).
- **Security**: Mongo credentials never stored in the browser; all Mongo operations server-side; if exposed beyond localhost → HTTPS requirement; no external network calls by default.
- **Reliability/Dev-tool context**: 1–5 concurrent users; container auto-restart acceptable; compooss downtime tolerable; must never risk Mongo data integrity.
- **DX/Accessibility**: keyboard-friendly core flows; reasonable contrast/typography.

**Scale & Complexity:**
- Primary domain: Full-stack web dev tool (Next.js App Router + route handlers)
- Complexity level: Medium
- Estimated architectural components: ~8–12 (Next.js app shell, Mongo client util, route handlers layer, UI navigation shell, document list + pagination, filter builder, document viewer/editor, confirmation/safety system, error/status system, config/health checks)

### Technical Constraints & Dependencies

- Container-only deployment via Docker Compose.
- Single Next.js container; no separate backend service.
- MongoDB Node.js driver used server-side.
- Configuration via environment variables (not browser storage), especially `MONGO_URI`.
- No telemetry/analytics; no outbound calls by default.
- Tech stack constraints from project context:
  - Next.js ^16.1.6, React ^19, TS ^5.8.3 (non-strict), Tailwind ^4.1.0

### Cross-Cutting Concerns Identified

- **Safety & confirmation** for destructive operations (delete/drop) + “no silent mutation”.
- **BSON/JSON fidelity**: ObjectId/Date/Binary handling and edit rules.
- **API consistency**: error model, pagination mechanics, filter syntax constraints.
- **Environment exposure**: local vs shared usage boundaries (auth/HTTPS expectations).
- **Performance guardrails**: query limits, page sizes, timeouts, index assumptions.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Next.js App Router UI + Next.js route handlers as server API + MongoDB driver), designed to run in Docker Compose.

### Starter Options Considered

- **Next.js official `create-next-app` starter**: Best-maintained baseline for App Router + TypeScript + Tailwind + ESLint defaults.
- **MongoDB & Next.js template (Vercel)**: Useful reference for Mongo driver patterns and full-stack wiring; deployment assumptions differ from Compose-first.
- **Community Dockerized Next.js + Mongo examples**: Useful reference for Docker patterns; quality varies, not chosen as primary foundation.

### Selected Starter: Existing repository scaffold (Next.js baseline)

**Rationale for Selection:**
- The project already has a defined stack (Next.js/React/TS/Tailwind/Vitest/Storybook/Mongo driver).
- Aligns with the architecture goal of “single Next.js container with server-side DB access”.
- Avoids re-scaffolding churn; we can standardize structure and Docker wiring as the first implementation story.

**Reference Initialization Command (if re-scaffolding is ever needed):**

```bash
npx create-next-app@latest compooss --ts --tailwind --eslint --app --src-dir --yes
```

**Architectural Decisions Provided by Baseline:**
- **Language & Runtime**: TypeScript + Next.js App Router.
- **Styling**: Tailwind CSS.
- **Testing**: Vitest (planned; no tests yet).
- **Component Documentation**: Storybook.
- **DB Access**: MongoDB Node.js driver used server-side only via route handlers.
- **Containerization**: Compose-first deployment; initialization/wiring is part of the first implementation story.

## Core Architectural Decisions

### Data Architecture

- **API boundary validation**: Use **Zod** in Next.js route handlers to validate query params and request bodies. Validation failures return consistent, user-friendly errors.
- **Mongo document serialization (MVP)**: Use a simplified JSON representation:
  - `_id` serialized as string
  - `Date` serialized as ISO string
  - Unsupported BSON types are rendered read-only (or as placeholders) and are not editable in MVP to prevent accidental corruption.
- **Pagination (MVP)**: Use **offset/limit pagination** for document lists with guardrails (max page size, sensible defaults). Note: deep paging on very large collections may be slow; cursor-based pagination is a post-MVP optimization.

### Authentication & Security

- **Local dev (MVP)**: No authentication when running on a trusted local dev network, with a clear “local-only / do not expose publicly” warning banner in the UI.
- **Optional access gate for shared environments**: Support a simple **HTTP Basic Auth** layer in front of the Next.js app, configured via environment variables, to gate access in shared dev/staging deployments.
- **Read-only safety toggle**: Provide an environment-driven `READ_ONLY_MODE` (or equivalent) that, when enabled, disables write operations (POST/PUT/DELETE) on document APIs so shared/staging environments can be browsed safely.
- **Rate limiting**: Apply reasonable rate limiting to `/api/*` endpoints by default to mitigate abuse when compooss is exposed beyond localhost.
- **CORS & origin model**: Default to **same-origin only** for all APIs; no cross-origin access patterns are supported in MVP.

### API & Communication (Server Actions)

- **No public REST API**: Compooss does not expose a stable external `/api/*` surface for third-party integration in MVP. All database access is done through server components and server actions inside the Next.js App Router.
- **Reads via server components**: Listing databases, collections, and documents is handled in server components that call internal server-only helpers (for example, `getDatabases`, `getCollections`, `getDocuments`). These helpers live in server-only modules (for example, `src/lib/server/mongo-queries.ts`) and are never imported into client components.
- **Writes via server actions**: Create, update, and delete operations are implemented as server actions (for example, `createDocument`, `updateDocument`, `deleteDocument`) that client components invoke directly via forms or `useActionState`, not via `fetch` calls to HTTP endpoints.
- **Internal result contracts**: Server helpers and actions return a consistent internal shape (for example, `{ ok: boolean; data?: unknown; error?: { code: string; message: string; details?: unknown } }`) instead of defining a public JSON API contract. HTTP status codes and response envelopes remain an internal implementation detail.
- **Filtering and pagination parameters**: Filter and pagination settings are passed as typed arguments into server helpers/actions rather than encoded into query strings for public endpoints, aligning with the offset/limit pagination and simple filter model defined in Data Architecture.

### Frontend Architecture

- **Composition model**: Favour **server components** for data fetching and tree structure, with **client components** only where interactivity is required (filters UI, document editors, confirmation dialogs).
- **Layout & navigation shell**: Use a persistent app shell with:
  - Left-side navigation (databases and collections).
  - Main content area for document lists and editors.
  - Shared loading and error boundaries at sensible route segment levels so failures in one area do not blank the entire app.
- **State management (MVP)**: No global state library. Use local React state and server action results; server is the source of truth for data, and any optimistic updates are strictly scoped to individual views.
- **Loading & empty states**: Provide explicit loading indicators and “no data / no results” states for lists and document views to make query behaviour obvious to developers.
- **Performance considerations**: Rely primarily on pagination for large collections. Only introduce virtualization for document lists if profiling shows obvious bottlenecks in typical dev datasets.

### Infrastructure & Deployment

- **Containerization strategy**: Build compooss as a single Docker image using a **multi-stage build** (builder stage + minimal runtime stage) with `NODE_ENV=production` and only runtime dependencies included.
- **Docker Compose integration**: Standard `docker-compose.yml` includes at least:
  - `compooss` service (Next.js app) with ports exposed and environment variables such as `MONGO_URI`, `READ_ONLY_MODE`, and optional Basic Auth credentials.
  - `mongo` service for local development, with its connection string wired into `MONGO_URI`.
- **Configuration via env**: All environment-specific behaviour (Mongo URI, read-only mode, Basic Auth credentials, log level) is configured via environment variables and compose files, never from browser-stored settings.
- **Logging**: Use structured console logging for Mongo connection issues, failed queries, and write operations, so container logs provide enough context to debug without additional tooling.
- **Health and readiness**: Provide at least a lightweight health indicator (for example, a server-side check that can be surfaced in the UI or used by compose/ops tooling) so developers can quickly see if compooss is connected and ready.

### Source Control & Commit Conventions

- All completed implementation work for a story must be captured in one or more Git commits before the story is marked `done`.
- Commit messages MUST follow the repository’s `commitlint.config.mjs` (conventional commits with types such as `feat`, `fix`, `docs`, `refactor`, etc.), so that:
  - The type reflects the nature of the change (new feature, bug fix, refactor, docs, tests, chore, etc.).
  - Subjects remain within the configured length and casing rules.
- Agents should prefer:
  - `feat:` for new story-driven functionality.
  - `refactor:` when primarily aligning code with architecture decisions without changing behaviour.
  - `docs:` when only planning/architecture/story documents are updated.

### Implementation Patterns (for agents)

- **Mongo client**:
  - A single shared, **OOP-style** client module (`src/lib/driver/mongodb.driver.ts`) owns the lifecycle of the underlying `MongoClient`.
  - The driver exposes a `MongoDriver` singleton (exported as `mongoDriver`) with methods such as `ping()`, `getDb()`, `getAdmin()`, and `listDatabases()`.
  - Other code must not construct ad-hoc `MongoClient` instances; all DB access goes through this driver.
- **Server-side query helpers / services**:
  - All read/query logic lives in server-only helpers and services that call `mongoDriver` (for example, `src/lib/services/connection/connection.service.ts` and future `database` / `collection` services).
  - Accept typed parameters for database, collection, pagination, and filters.
  - Apply the agreed JSON serialization rules and offset/limit pagination.
  - Never leak raw driver objects to calling components.
- **Service layer per domain**: Each domain (connection, database, collection, document, etc.) has a dedicated service module under `src/lib/services/<domain>/<domain>.service.ts` that:
  - Encapsulates business logic and CRUD operations.
  - Calls `mongoDriver` and/or server helpers; does not know about React, forms, or UI concerns.
- **Server actions per domain**: Next.js server actions live under `src/lib/services/<domain>/<domain>.action.ts` and:
  - Are the only layer invoked from forms / client components.
  - Call the corresponding service layer, perform input validation, and return typed `{ ok, data?, error? }` results.
- **UI composition**: Route segments under the app shell follow a predictable structure (for example, `app/(shell)/[db]/[collection]/page.tsx` for document lists, with smaller reusable components in `src/components/`), so agents always know where to add or modify behaviours.
- **Error and logging pattern**: When server helpers or actions encounter errors, they log a structured message (including collection and operation type) and return a typed error object rather than throwing unstructured errors through the stack.

### Folder Structure Conventions

- **`src/app`**: Next.js App Router entrypoint and route tree.
  - Root `layout.tsx`, `globals.css`, `not-found.tsx`.
  - Route segments such as `new-connection/page.tsx` and a `(playground)` group for experimental flows and UI.
- **`src/components`**:
  - `components/ui/*`: Reusable, Storybook-backed UI primitives (`button`, `input`, `tabs`, `modal`, etc.), each with `*.tsx` and `*.stories.tsx`.
  - Higher-level domain components for compooss (`sidebar`, `top-bar`, `query-bar`, `collection-view`, `json-document`, settings components, collection tabs, etc.).
- **`src/hooks`**: Reusable React hooks (`use-mobile`, `use-toast`, and similar UI/UX utilities).
- **`src/data`**: Local mock data for development and playground usage only.
- **`src/lib/types`**: Shared TypeScript types for core domain concepts (`connection`, `database`, `collection`, `document`, `index`, `aggregation`, `schema`).
- **`src/lib/driver`**:
  - `mongodb.driver.ts`: Server-only MongoDB driver wrapper responsible for managing the underlying client and low-level connection concerns.
- **`src/lib/schemas`**:
  - Zod (or equivalent) schemas for domain objects (`connection.schema.ts`, `database.schema.ts`, `collection.schema.ts`, `document.schema.ts`, `index.schema.ts`, `aggregation.schema.ts`, `schema-validation.schema.ts`), used at server-action and helper boundaries.
- **`src/lib/services`**:
  - Subfolders per domain (`connection`, `database`, `collection`, `document`, `index`, `aggregation`, `schema`).
  - Each domain has a `*.service.ts` file for server-side business logic over Mongo, and a `*.action.ts` file that exposes server actions built on top of the service functions.
- **`src/lib/store`**:
  - Lightweight UI-oriented stores (`connection.store.ts`, `database.store.ts`, `collection.store.ts`, `ui.store.ts`) used where local React state is insufficient or overly repetitive. These stores remain focused on UI state; Mongo is still the source of truth for data.
- **`src/lib/utils.ts`**:
  - Cross-cutting helper functions that do not belong to a specific domain service or type module.

