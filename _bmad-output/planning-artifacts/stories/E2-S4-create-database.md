---
id: E2-S4
epic: "Epic 2: Database & Collection Navigation"
title: "Create database"
status: "done"
---

# Story E2-S4 – Create database

**Goal:** Create a new database (with an initial collection) from the sidebar.

## Acceptance Criteria

- A “Create database” action opens a form with database name and initial collection name.
- Submitting the form creates the database and collection in Mongo (idempotent if they already exist) and refreshes the sidebar list.
- Invalid inputs (empty names, invalid characters, duplicates) show friendly validation errors and do not crash the app.
- The flow follows the service/action/types patterns (`database.service.ts`, `database.action.ts`, `database.types.ts`) and uses `mongoDriver`.

## Dev Agent Record

- Added a `database` schema and service/action layer that wraps `mongoDriver` to create databases by creating an initial collection if it does not already exist.
- Updated the playground shell to invoke a `createDatabaseAction` server action when the user submits the “Create Database” modal, then refresh the sidebar from server state.
- Refactored the create-database modal to use the shared `Input` component with a Zod-backed form schema so invalid inputs show inline validation errors instead of crashing.

## File List

- `src/lib/types/database.types.ts`
- `src/lib/schemas/database.schema.ts`
- `src/lib/services/database/database.service.ts`
- `src/lib/services/database/database.action.ts`
- `src/app/(playground)/page.tsx`
- `src/app/(playground)/playground-shell.tsx`
- `src/components/create-database-modal.tsx`