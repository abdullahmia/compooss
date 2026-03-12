---
id: E2-S2
epic: "Epic 2: Database & Collection Navigation"
title: "List collections per database"
status: "done"
---

# Story E2-S2 – List collections per database

**Goal:** Show collections for a selected database.

## Acceptance Criteria

- Clicking a database in the sidebar updates the view to show its collections.
- Selecting a collection routes to its documents view in the main pane.

## Dev Agent Record

- Implemented a `database` service that uses the shared `mongoDriver` to list databases and, for each database, fetch its collections from Mongo.
- Updated the playground route to call the `database` service on the server and pass fully populated databases (with collections) into the client shell.
- The existing sidebar UI now renders the live collections from Mongo for the selected database; selecting one continues to show its documents view in the main pane.

## File List

- `src/lib/services/database/database.service.ts`
- `src/app/(playground)/page.tsx`
- `src/app/(playground)/PlaygroundShell.tsx`
- `src/components/sidebar.tsx`

