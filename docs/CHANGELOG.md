# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- (Nothing yet.)

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
