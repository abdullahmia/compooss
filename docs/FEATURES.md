# Compooss features

Current release: **v1.5.0**.

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

## Shipped in v1.3.0

### Schema Analysis

- **Analyze collection schema** – Run schema analysis on any collection from the Schema tab.
- **Sample documents** – Choose sample size (100, 500, 1000, 5000); analysis uses `$sample` aggregation.
- **View detected fields** – See all top-level and nested fields in a card-based layout.
- **Field data types distribution** – Per-field type bars (String, Number, Boolean, Date, ObjectId, Object, Array, Null, etc.) with percentages.
- **Field frequency / occurrence** – See how often each field appears in the sample; "undefined" indicator when a field is missing in some documents.
- **Visualize schema structure** – Card per field with type bars, sample values, and type-specific visualizations.
- **Inspect nested fields and objects** – Expand documents to see nested fields; "Document with N nested fields" summary.
- **View array field structures** – Array fields show element types and array length stats (min, average, max).
- **Value distributions** – For string fields: value chips for high cardinality; segmented distribution bar for enum-like (low cardinality) fields.
- **Identify missing or inconsistent fields** – Frequency bars and undefined indicators highlight fields not present in all documents; "mixed" badge for multi-type fields.
- **Drill down** – Expand nested objects; view ObjectId first/last timestamps, array stats, and value samples inline.
- **Refresh or rerun** – Re-run schema analysis with the same or different sample size via Analyze and Refresh.

## Shipped in v1.4.0

### Validation Rules

- **View validation rules** – See the current collection validator, validation level, and validation action from the Validation tab.
- **Create or edit rules** – Write validation rules using MongoDB's JSON Schema (`$jsonSchema`) in a Monaco-powered JSON editor.
- **Set validation level** – Choose between strict (all inserts and updates), moderate (existing valid documents only), or off.
- **Set validation action** – Choose error (reject invalid documents) or warn (allow but log a warning).
- **Apply rules** – Save validation rules to the collection via the `collMod` command.
- **Validate existing documents** – Run a validation check against the current rules with configurable sample size (100, 500, 1000, 5000).
- **Detect violations** – See total/valid/invalid document counts; expand invalid documents to view their `_id` and error details.
- **Read-only protection** – Validation rules are read-only for system databases (`admin`, `local`, `config`).

## Shipped in v1.5.0

### Aggregation Pipelines

- **Visual pipeline builder** – Add, remove, duplicate, and reorder stages in a drag-and-drop builder with stage cards.
- **Stage templates & categories** – Quickly start from curated stage templates grouped by category (match, group, sort, lookup, etc.).
- **Per-stage previews** – Run the pipeline up to any stage and see sample documents for that stage.
- **Builder & text modes** – Switch between visual builder and raw JSON text mode for full control over the pipeline.
- **Saved pipelines** – Save pipelines locally, mark favorites, load and delete them per collection namespace.
- **Export & sharing** – Copy pipeline JSON, copy ready-to-use backend `db.collection.aggregate([...])` code, or download pipelines as JSON files.
- **Create views from pipelines** – Turn a pipeline into a MongoDB view directly from the UI.

---

## Planned for future releases

- **Improved UX** – Pagination and query builder improvements, plus additional quality-of-life enhancements.
- **Optional auth** – Authentication support for shared development environments.
- **MongoDB Shell** – Built-in MongoDB shell panel for running commands and scripts without leaving the browser.
- **Multiple connections** – Support for multiple saved connection profiles and quick switching between them.
- **Theming support** – System, dark, and light themes with automatic system theme syncing.
