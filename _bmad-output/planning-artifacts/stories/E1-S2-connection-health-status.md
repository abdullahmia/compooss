---
id: E1-S2
epic: "Epic 1: Compose-Integrated Mongo UI Core"
title: "Connection health & status"
status: "done"
---

# Story E1-S2 – Connection health & status

**Goal:** Show clear “connected / cannot connect” state.

## Acceptance Criteria

- When Mongo is reachable, the UI shows a clear connected state and lists available databases.
- When Mongo is not reachable (invalid URI, DB down, etc.), a clear error banner explains the issue in user-friendly language.
- No raw stack traces are shown to end users.

## Dev Agent Record

- Implemented server-side Mongo health checks using `MONGO_URI` and shared server helpers to verify Mongo reachability.
- Updated the playground route to evaluate connection health on the server and pass a clear connection state into the client shell, which drives the top bar copy.
- Added an in-app error banner that surfaces a friendly “cannot connect” message without exposing stack traces.

## File List

- `src/lib/server/mongo-queries.ts`
- `src/app/(playground)/page.tsx`
- `src/app/(playground)/PlaygroundShell.tsx`
- `src/components/top-bar.tsx`

