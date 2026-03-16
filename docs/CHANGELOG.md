# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- (Nothing yet.)

## [1.7.0] - 2026-03-16

### Added

- **Multiple Connections** – Dedicated connection page and connection management:
  - Full-screen connection page at `/connect` with a connection form and saved connections list.
  - Save, edit, and delete connection profiles stored in IndexedDB (persisted across sessions).
  - Favorite connections; filter favorites-only; sort by name, recent, or created date.
  - Search connections by name or label in real time.
  - Color-coded connections (8 colors) with color dot in sidebar and top bar.
  - Custom labels (e.g. "dev", "staging") displayed as badges in the connection list and top bar.
  - Authentication: default, password (SCRAM-SHA-1/256), X.509, LDAP, and Kerberos with per-mechanism configuration.
  - TLS/SSL: CA file, certificate, key, allow invalid certificates/hostnames.
  - Advanced options: replica set, read preference, connection/server-selection timeouts, direct connection, max pool size.
  - Test connection before saving with inline pass/fail result and server info.
  - Connect from the form or saved list; disconnect from the top bar.
  - Top bar shows active connection name, color, label, and masked URI; links back to connection manager.
  - Connection context provider auto-restores the last active connection on reload.
  - Sidebar footer displays active connection color and database count.
- New API routes: `POST /connection/connect`, `POST /connection/disconnect`, `GET /connection/status`, `POST /connection/test`.
- `ConnectionManager` singleton on the server for connect, disconnect, test, and status.
- `ConnectionProvider` React context with `useConnection` hook.
- `connectionDB` IndexedDB wrapper for CRUD, favorites, recent, and search operations.
- Connection types (`SavedConnection`, `ConnectionStatus`, `ConnectionTestResult`, `AuthConfig`, `TlsConfig`, `AdvancedConfig`, `AuthType`, `ReadPreference`, `ConnectionColor`) in `@compooss/types`.

## [1.6.0] - 2026-03-16

### Added

- **MongoDB Shell** – Embedded interactive CLI panel toggled from the top bar:
  - Execute MongoDB commands (`db.runCommand()`, `db.adminCommand()`, `db.serverStatus()`, etc.) and JavaScript expressions directly in the browser.
  - Full CRUD support: `find`, `findOne`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `replaceOne`, `deleteOne`, `deleteMany`, `findOneAndUpdate`, `findOneAndReplace`, `findOneAndDelete`.
  - Run aggregation pipelines via `db.collection.aggregate([...])`.
  - Collection management: `drop()`, `renameCollection()`, `stats()`, `db.createCollection()`, `db.getCollectionNames()`.
  - Index management: `createIndex()`, `createIndexes()`, `dropIndex()`, `dropIndexes()`, `getIndexes()`.
  - Database administration: `db.dropDatabase()`, `db.stats()`, `db.serverStatus()`, `db.hostInfo()`, `db.currentOp()`, `db.killOp()`, `db.listCommands()`.
  - Shell helpers: `show dbs`, `show collections`, `show users`, `show roles`, `show profile`, `show logs`, `help`.
  - `use dbName` to switch active database; `db` to inspect current context.
  - Bulk operations via `db.collection.bulkWrite()`.
  - Monaco-powered autocomplete for commands, database methods, collection names, and collection methods.
  - Command history navigation with Up/Down arrow keys; history persists via localStorage.
  - Multi-line editing with Shift+Enter; Enter to execute.
  - JavaScript syntax highlighting via Monaco editor.
  - Pretty-printed JSON output with execution time.
  - Error display with MongoDB-specific error message parsing.
  - Copy result to clipboard and clear output (`cls`/`clear`) from toolbar.
  - Session persistence: database context, history, and output restored on reload.

## [1.5.0] - 2026-03-16

### Added

- **Aggregation Pipelines** – Visual pipeline builder for MongoDB aggregations:
  - Add, remove, duplicate, and reorder stages with drag-and-drop.
  - Curated stage templates grouped by category (match, group, sort, lookup, etc.).
  - Per-stage previews: run the pipeline up to any stage and see sample documents.
  - Builder and text modes: switch between visual builder and raw JSON editing.
  - Save pipelines locally; mark favorites; load and delete per collection namespace.
  - Export and sharing: copy pipeline JSON, copy `db.collection.aggregate([...])` code, or download as JSON.
  - Create MongoDB views directly from a pipeline.

## [1.4.0] - 2026-03-16

### Added

- **Validation Rules** – New Validation tab per collection:
  - View current collection validation rules (validator, validation level, validation action).
  - Create or edit validation rules using MongoDB's `$jsonSchema` in a Monaco-powered JSON editor.
  - Set validation level: strict (all inserts and updates), moderate (existing valid documents only), or off.
  - Set validation action: error (reject invalid documents) or warn (allow but log a warning).
  - Apply validation rules to the collection via the `collMod` command.
  - Validate existing documents against the current rules with configurable sample size (100, 500, 1000, 5000).
  - Detect violations: view total/valid/invalid document counts; expand invalid documents to see `_id` and error details.
  - Read-only mode enforced for system databases.
- New API routes: `GET/PUT/POST /databases/[dbName]/collections/[colName]/validation`.
- `ValidationRepository` with `getValidation`, `updateValidation`, and `checkDocuments` methods.
- React Query hooks: `useGetValidation`, `useUpdateValidation`, `useCheckValidation`.
- Validation types (`CollectionValidation`, `ValidationCheckResult`, `ValidationLevel`, `ValidationAction`, `UpdateValidationInput`, `CheckValidationInput`) in `@compooss/types`.

## [1.3.0] - 2026-03-16

### Added

- **Schema Analysis** – New Schema tab per collection:
  - Analyze collection schema from sampled documents (configurable sample size: 100, 500, 1000, 5000).
  - View detected fields in a card-based layout with type bars and frequency.
  - See field data types distribution (String, Number, Boolean, Date, ObjectId, Object, Array, Null).
  - View field frequency and occurrence; "undefined" indicator when a field is missing in some documents.
  - Visualize schema structure; expand nested objects and view "Document with N nested fields".
  - View array field structures with element types and array length stats (min, average, max).
  - Value distributions: value chips for high-cardinality strings; segmented bar for enum-like fields.
  - Identify missing or inconsistent fields; "mixed" badge for multi-type fields.
  - ObjectId fields show first/last timestamps; refresh or rerun analysis on demand.
- New API: `POST /databases/[dbName]/collections/[colName]/schema` with optional `sampleSize` in body.
- Schema types and repository: `SchemaAnalysisResult`, `SchemaField`, `ArrayStats`, `ObjectIdDates`, value samples.

## [1.2.0] - 2026-03-16

### Added

- Full index management for collections (Compass-style):
  - View existing indexes in a table with name, type, fields, usage stats, and property badges.
  - Create indexes: standard, compound, unique, text, geospatial (2dsphere, 2d), hashed, TTL, partial, sparse, and hidden.
  - Drop indexes with confirmation dialog (default `_id_` index protected).
  - Hide / unhide indexes via the `collMod` command.
  - View index usage statistics from `$indexStats` aggregation.
  - Inspect index properties (fields, type, options) inline.
- New API routes: `GET/POST /indexes`, `DELETE/PATCH /indexes/[indexName]`.
- `IndexRepository` with `getIndexes`, `getIndexStats`, `createIndex`, `dropIndex`, `hideIndex`.
- React Query hooks: `useGetIndexes`, `useCreateIndex`, `useDropIndex`, `useHideIndex`.
- Create Index modal with dynamic field rows, direction/type select, and options (unique, sparse, hidden, TTL, partial filter expression).
- Zod validation schema for the create-index form.
- Index-related types (`IndexDefinition`, `IndexUsageStats`, `CreateIndexInput`, `DropIndexInput`, `HideIndexInput`) in `@compooss/types`.

## [1.1.0] - 2025-03-16

### Added

- Loading skeletons and improved loading states for database and collection views.
- Better error handling and user feedback for database connections in UI components.

### Changed

- Enhanced database page and API routes with improved error handling.

## [1.0.0] - 2025-03-15

### Added

- MongoDB connection via `MONGO_URI` or `MONGODB_URI`; health check on load.
- Workspace layout with sidebar and top bar; connection string display (password masked).
- Database list, create, and delete.
- Collection list, create, and delete; sidebar expand/collapse and “Collapse all” button.
- Collection view with dynamic summary (doc count, total size, index count, avg doc size).
- Documents tab: query/filter/sort, list/JSON/table view, add/edit/delete documents.
- Read-only protection for system databases (`admin`, `local`, `config`).
- Docker image (standalone Next.js) and run instructions; support for `host.docker.internal` when connecting to MongoDB on the host.
- Initial project setup: README, MIT License, Husky + Commitlint, documentation (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, DEVELOPMENT).
- [docs/FEATURES.md](FEATURES.md) for MVP vs planned features.
