---
id: E1-S3
epic: "Epic 1: Compose-Integrated Mongo UI Core"
title: "Local-only safety banner"
status: "done"
---

# Story E1-S3 – Local-only safety banner

**Goal:** Make the local-only assumption explicit.

## Acceptance Criteria

- In default local dev configuration, a visible banner warns “local-only / do not expose publicly”.
- When Basic Auth / HTTPS environment variables are configured for shared environments, the banner either disappears or clearly reflects the new, more protected mode.

## Dev Agent Record

- Added a global environment banner in the root layout that is always visible at the top of the app.
- When no Basic Auth or HTTPS env vars are set, the banner shows a clear local-only warning: “Local-only: compooss is intended for local development. Do not expose this container publicly.”
- When Basic Auth credentials (`BASIC_AUTH_USER`/`BASIC_AUTH_PASSWORD`) or `HTTPS_ENABLED="true"` are configured, the banner switches to a protected-mode message instead of the local-only warning.

## File List

- `src/app/layout.tsx`

