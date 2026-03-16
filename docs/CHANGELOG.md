# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- (Nothing yet.)

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
