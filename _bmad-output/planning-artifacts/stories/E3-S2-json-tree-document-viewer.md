---
id: E3-S2
epic: "Epic 3: Document Viewing, Filtering & CRUD"
title: "JSON/tree document viewer"
status: "done"
---

# Story E3-S2 – JSON/tree document viewer

**Goal:** Readable JSON/tree view for a single document.

## Acceptance Criteria

- Clicking a row opens a detail view using a JSON/tree-style component.
- `_id` and `Date` fields are rendered as strings; unsupported BSON types are visible but read-only.
- The viewer handles large documents without freezing the UI.

## Dev Agent Record

- Implemented a `JsonDocument` component that renders a single document in a collapsible JSON/tree structure, with nested objects and arrays expandable per field.
- The viewer renders `_id` as `ObjectId("<string>")` and `$date` values as `ISODate("<iso-string>")`, keeping them readable while treating other BSON-like wrappers as read-only values.
- Integrated `JsonDocument` into the `DocumentsTab` list view so clicking into the documents list shows a per-document JSON/tree-style card without full-page reloads.

## File List

- `src/components/json-document.tsx`
- `src/components/collection-tabs/documents-tab.tsx`

