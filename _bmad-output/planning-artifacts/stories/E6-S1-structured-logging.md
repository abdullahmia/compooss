---
id: E6-S1
epic: "Epic 6: Observability & Developer Experience"
title: "Structured logging"
status: "todo"
---

# Story E6-S1 – Structured logging

**Goal:** Minimal but useful logs.

## Acceptance Criteria

- Mongo connection errors, query failures, and write attempts log structured messages (operation, collection, error).
- Logs are visible via `docker compose logs` and are not mixed with noisy debug output in production.

