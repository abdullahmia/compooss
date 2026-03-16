# Compooss features

Current release: **v1.7.0**.

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

## Shipped in v1.6.0

### MongoDB Shell

- **Embedded MongoDB Shell** – Interactive CLI panel inside Compass, toggled from the top bar; runs entirely in the browser without external tools.
- **Execute MongoDB commands** – Run any MongoDB command (`db.runCommand()`, `db.adminCommand()`, `db.serverStatus()`, etc.) directly from the shell.
- **Execute JavaScript queries** – Evaluate JavaScript expressions with a controlled context containing `db`, `ObjectId`, `ISODate`, `NumberLong`, `NumberDecimal`, and `UUID` helpers.
- **Auto-complete for commands and collections** – Monaco-powered autocomplete suggests shell helpers, database methods, collection names, and collection methods as you type.
- **Command history navigation** – Navigate through previous commands with Up/Down arrow keys; history persists across sessions via localStorage.
- **Multi-line command support** – Press Shift+Enter for new lines; Enter executes the full command.
- **Syntax highlighting** – Full JavaScript syntax highlighting via Monaco editor.
- **Query result viewer (JSON output)** – Results displayed as pretty-printed JSON with execution time.
- **Pretty print results** – All results serialized and formatted with 2-space indentation for readability.
- **Error display and debug output** – Errors shown in red with MongoDB-specific error messages parsed from the driver.
- **Access current database context** – The shell tracks the active database; type `db` to see it.
- **Switch database (`use dbName`)** – Change the active database with the `use` command; the prompt updates immediately.
- **Run CRUD operations** – Full support for `find`, `findOne`, `insertOne`, `insertMany`, `updateOne`, `updateMany`, `replaceOne`, `deleteOne`, `deleteMany`, `findOneAndUpdate`, `findOneAndReplace`, `findOneAndDelete`.
- **Run aggregation pipelines** – Execute `db.collection.aggregate([...])` with full pipeline support.
- **Collection management commands** – `db.collection.drop()`, `db.collection.renameCollection()`, `db.collection.stats()`, `db.createCollection()`, `db.getCollectionNames()`.
- **Index management commands** – `db.collection.createIndex()`, `db.collection.createIndexes()`, `db.collection.dropIndex()`, `db.collection.dropIndexes()`, `db.collection.getIndexes()`.
- **Database administration commands** – `db.dropDatabase()`, `db.stats()`, `db.serverStatus()`, `db.hostInfo()`, `db.currentOp()`, `db.killOp()`, `db.listCommands()`.
- **Access MongoDB helper functions** – `show dbs`, `show collections`, `show users`, `show roles`, `show profile`, `show logs`, `help`.
- **Run server status commands** – `db.serverStatus()`, `db.hostInfo()`, `db.currentOp()` for server monitoring.
- **Script execution support** – Evaluate multi-line JavaScript blocks with `db` proxy for arbitrary scripting.
- **Copy command results** – One-click copy of the last result to clipboard from the toolbar.
- **Clear shell output** – Clear button in toolbar or type `cls`/`clear` to reset the output.
- **Shell session persistence** – Database context, command history, and output entries saved to localStorage and restored on reload.
- **Run advanced MongoDB expressions** – `db.runCommand()` and `db.adminCommand()` for arbitrary server commands.
- **Execute bulk operations** – `db.collection.bulkWrite()` for batched insert/update/delete operations.
- **Access MongoDB system collections** – Query `system.profile`, `system.users`, and other system collections directly.

## Shipped in v1.7.0

### Multiple Connections

- **Dedicated connection page** – Full-screen connection manager at `/connect` with a form on the left and saved connections list on the right.
- **Save, edit, and delete profiles** – Connection profiles stored locally in IndexedDB with all settings persisted across sessions.
- **Favorite and pin connections** – Mark connections as favorites; filter favorites-only; sort by name, recent, or created date.
- **Search connections** – Filter saved connections by name or label in real time.
- **Color-coded connections** – Assign a color (red, orange, yellow, green, blue, purple, pink, slate) to each connection for quick identification; color dot shown in the sidebar and top bar.
- **Custom labels** – Tag connections with labels (e.g. "dev", "staging") displayed as badges throughout the UI.
- **Authentication options** – Choose from default, password (SCRAM-SHA-1/SCRAM-SHA-256), X.509, LDAP, or Kerberos authentication; configure username, password, auth source, and mechanism-specific fields.
- **TLS/SSL configuration** – Enable TLS with CA file, certificate, key, and options for allowing invalid certificates or hostnames.
- **Advanced options** – Configure replica set, read preference (primary, primaryPreferred, secondary, secondaryPreferred, nearest), connection timeout, server selection timeout, direct connection, and max pool size.
- **Test connection before saving** – One-click test with pass/fail result and server info (version, host) displayed inline.
- **Connect and disconnect** – Connect from the connection page or saved list; disconnect from the top bar and return to the connection page.
- **Top bar connection display** – Active connection name, color dot, label badge, and masked URI shown in the top bar; click to navigate back to the connection manager.
- **Connection context provider** – React context tracks active connection, loading state, and connection status; auto-restores the last active connection on reload.
- **Sidebar integration** – Sidebar footer shows the active connection color indicator and connected database count.
- **Connection manager (server)** – Singleton `ConnectionManager` handles connect, disconnect, test, and status; safely tears down the previous connection before establishing a new one.
- **API routes** – `POST /connection/connect`, `POST /connection/disconnect`, `GET /connection/status`, `POST /connection/test`.
- **Connection types** – `SavedConnection`, `ConnectionStatus`, `ConnectionTestResult`, `AuthConfig`, `TlsConfig`, `AdvancedConfig`, `AuthType`, `ReadPreference`, `ConnectionColor` in `@compooss/types`.

---

## Planned for future releases

- **Improved UX** – Pagination and query builder improvements, plus additional quality-of-life enhancements.
- **Optional auth** – Authentication support for shared development environments.
- **Theming support** – System, dark, and light themes with automatic system theme syncing.
