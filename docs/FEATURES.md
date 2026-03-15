# Compooss features

Current release: **v1.0.0** (MVP).

---

## Shipped in MVP (v1.0.0)

- **Connection** – MongoDB connection via `MONGO_URI` or `MONGODB_URI`; health check on load.
- **Workspace** – Layout with sidebar and top bar; connection string display (password masked).
- **Databases** – List databases; create and delete databases.
- **Collections** – List collections per database; create and delete collections; expand/collapse in sidebar; “Collapse all” button.
- **Collection view** – Open a collection; header shows dynamic doc count, total size, index count, and average document size.
- **Documents tab** – Query, filter, and sort documents; list / JSON / table view; add, edit, and delete documents.
- **Safety** – Read-only protection for system databases (`admin`, `local`, `config`).
- **Deploy** – Docker image (standalone Next.js); run with `host.docker.internal` for local MongoDB.

---

## Planned for future releases

- **Aggregations** – Aggregation pipeline builder and runner. (Stub: “Coming soon” in UI.)
- **Schema** – Schema analysis and exploration for collections. (Stub: “Coming soon” in UI.)
- **Indexes** – View and manage collection indexes. (Stub: “Coming soon” in UI.)
- **Validation** – Document validation rules and validation status. (Stub: “Coming soon” in UI.)

These tabs exist as stubs in the codebase and will be enabled in the UI when implemented.
