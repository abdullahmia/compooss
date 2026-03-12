---
id: E1-S1
epic: "Epic 1: Compose-Integrated Mongo UI Core"
title: "Compose service wiring"
status: "todo"
---

# Story E1-S1 – Compose service wiring

**Goal:** compooss runs via `docker compose up` alongside Mongo.

## Acceptance Criteria

- A sample `docker-compose.yml` includes `compooss` and `mongo` services.
- `MONGO_URI` is configured via environment variables, not hardcoded in code.
- `docker compose up` brings the stack up and compooss is reachable at a documented URL.

