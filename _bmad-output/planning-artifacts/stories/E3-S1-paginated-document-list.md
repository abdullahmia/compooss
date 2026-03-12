---
id: E3-S1
epic: "Epic 3: Document Viewing, Filtering & CRUD"
title: "Paginated document list"
status: "done"
---

# Story E3-S1 – Paginated document list

**Goal:** Paginated view for documents in a collection.

## Acceptance Criteria

- List view defaults to page 1 with a page size (e.g. 25) and enforces a maximum (e.g. 50).
- The list shows `_id` and key fields in a readable table or list.
- Pagination controls (next/previous) update the list without a full-page reload experience.

## Dev Agent Record

- Enhanced the `DocumentsTab` to compute page state on the client, defaulting to page 1 with a page size of 25 and constraining navigation within valid bounds.
- Updated the toolbar to display the current slice (`start–end of total`) and wired the previous/next buttons to update page state without triggering a full-page reload.
- Applied pagination consistently across list, JSON, and table views so they all show only the current page’s documents while still rendering `_id` and other key fields in a readable layout.

## File List

- `src/components/collection-tabs/documents-tab.tsx`

