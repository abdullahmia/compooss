---
id: E2-S1
epic: "Epic 2: Database & Collection Navigation"
title: "List databases"
status: "done"
---

# Story E2-S1 – List databases

**Goal:** Show all accessible databases from Mongo.

## Acceptance Criteria

- On load, the sidebar lists all databases the current connection can see.
- An empty/no-database state is handled gracefully (e.g. “No databases found”).

## Dev Agent Record

- Implemented shared server-only helpers that connect to Mongo using `MONGO_URI`, call `listDatabases`, and return a formatted list of database names and sizes.
- Updated the playground route to use these helpers on the server and pass the resulting database list into the client shell instead of static mock data.
- Updated the sidebar component to show a friendly “No databases found” message when there are zero databases or when filtering results in an empty list.

## File List

- `src/app/(playground)/page.tsx`
- `src/app/(playground)/PlaygroundShell.tsx`
- `src/lib/server/mongo-queries.ts`
- `src/components/sidebar.tsx`

