---
id: E3-S4
epic: "Epic 3: Document Viewing, Filtering & CRUD"
title: "Create document"
status: "done"
---

# Story E3-S4 – Create document

**Goal:** Add a new document to a collection.

## Acceptance Criteria

- A “New document” action opens a **JSON editor only** (no separate form UI for now), implemented with a **Monaco-based editor** configured for JSON.
- The editor is pre-populated with a template and instructions for pasting one or more JSON documents.
- Inputs are validated with Zod on the server (and optionally client-side hints), and invalid JSON or invalid document shapes return clear, inline errors without persisting data.
- On success, the new document (or documents) appear in the list view for the selected collection; on failure, validation errors are shown inline and nothing is written.

