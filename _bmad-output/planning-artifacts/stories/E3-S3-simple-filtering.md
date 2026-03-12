---
id: E3-S3
epic: "Epic 3: Document Viewing, Filtering & CRUD"
title: "Simple filtering"
status: "done"
---

# Story E3-S3 – Simple filtering

**Goal:** Allow simple filters without requiring MQL knowledge.

## Acceptance Criteria

- A query bar lets users add one or more simple conditions (field, operator, value).
- Filters apply to the paginated list, with a clear “no results” state when nothing matches.
- Filter input is validated; invalid filters show a friendly error message, not a crash.

## Dev Agent Record

- Extended the `QueryBar` + `DocumentsTab` integration so the query bar passes a filter expression string that is parsed into simple `field: value` conditions.
- Implemented client-side filtering that supports multiple conditions, nested field paths (dot notation), and basic type coercion (strings, numbers, booleans, null), applying filters before pagination.
- Added user-friendly validation for invalid filter syntax and a clear “No documents match the current filter.” message when the filtered result set is empty.

## File List

- `src/components/collection-tabs/documents-tab.tsx`

