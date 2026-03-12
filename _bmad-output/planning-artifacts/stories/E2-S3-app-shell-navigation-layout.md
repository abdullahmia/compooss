---
id: E2-S3
epic: "Epic 2: Database & Collection Navigation"
title: "App shell & navigation layout"
status: "done"
---

# Story E2-S3 – App shell & navigation layout

**Goal:** Implement the persistent shell and routing.

## Acceptance Criteria

- Layout matches the architecture: sidebar (DBs/collections) + main pane (documents / other views).
- Navigation uses the Next.js App Router with appropriate server components.
- Not-found and error states use `not-found.tsx` and error boundaries rather than blank screens.

## Dev Agent Record

- Confirmed the `(playground)` route uses a server component (`page.tsx`) that loads connection and database state and passes it into a client shell component.
- Ensured the shell layout matches the architecture: a persistent top bar, a left sidebar listing databases/collections, and a main pane that shows collection documents or a welcome view.
- Added a root-level error boundary (`src/app/error.tsx`) and verified there is a `not-found.tsx` so runtime and routing errors surface friendly UI instead of blank screens.

## File List

- `src/app/layout.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/(playground)/page.tsx`
- `src/app/(playground)/playground-shell.tsx`

