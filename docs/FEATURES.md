# Compooss features

Current release: **v1.2.0**.

---

## Shipped in v1.0.0 (MVP)

- **Connection** – MongoDB connection via `MONGO_URI` or `MONGODB_URI`; health check on load.
- **Workspace** – Layout with sidebar and top bar; connection string display (password masked).
- **Databases** – List databases; create and delete databases.
- **Collections** – List collections per database; create and delete collections; expand/collapse in sidebar; "Collapse all" button.
- **Collection view** – Open a collection; header shows dynamic doc count, total size, index count, and average document size.
- **Documents tab** – Query, filter, and sort documents; list / JSON / table view; add, edit, and delete documents.
- **Safety** – Read-only protection for system databases (`admin`, `local`, `config`).
- **Deploy** – Docker image (standalone Next.js); run with `host.docker.internal` for local MongoDB.

## Shipped in v1.1.0

- **Loading states** – Loading skeletons and improved loading states for database and collection views.
- **Error handling** – Better error handling and user feedback for database connections.

## Shipped in v1.2.0

- **Index Management** – Full Compass-style index management for any collection:
  - View existing indexes in a table with name, type, fields, usage statistics, and property badges.
  - Create indexes with support for all index types: standard, compound, unique, text, geospatial (2dsphere, 2d), hashed, TTL, partial, sparse, and hidden indexes.
  - Drop indexes with a confirmation dialog (default `_id_` index is protected).
  - Hide / unhide indexes to test performance impact without dropping.
  - Inspect index properties: unique, sparse, TTL, partial filter expression, hidden status.
  - View index usage statistics (operation count from `$indexStats`).
  - Read-only mode enforced for system databases.

---

## Planned for future releases

- **Aggregations** – Aggregation pipeline builder and runner. (Stub: "Coming soon" in UI.)
- **Schema** – Schema analysis and exploration for collections. (Stub: "Coming soon" in UI.)
- **Validation** – Document validation rules and validation status. (Stub: "Coming soon" in UI.)

These tabs exist as stubs in the codebase and will be enabled in the UI when implemented.
